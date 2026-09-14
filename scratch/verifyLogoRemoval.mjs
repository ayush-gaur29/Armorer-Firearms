import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.resolve('scratch/chrome-profile-verify');

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9229',
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
]);

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9229/json/version');
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch (e) {}
    await wait(200);
  }
  throw new Error('Chrome did not start');
}

async function run() {
  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };

    const send = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        callbacks.set(msgId, (res) => {
          if (res.error) reject(res.error);
          else resolve(res.result);
        });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    };

    await new Promise((resolve) => {
      if (ws.readyState === WebSocket.OPEN) resolve();
      else ws.onopen = resolve;
    });

    const targetRes = await send('Target.createTarget', { url: 'about:blank' });
    const pageWs = new WebSocket(`ws://127.0.0.1:9229/devtools/page/${targetRes.targetId}`);

    await new Promise((resolve) => {
      if (pageWs.readyState === WebSocket.OPEN) resolve();
      else pageWs.onopen = resolve;
    });

    let pageId = 1;
    const pageCallbacks = new Map();
    pageWs.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pageCallbacks.has(msg.id)) {
        pageCallbacks.get(msg.id)(msg);
        pageCallbacks.delete(msg.id);
      }
    };

    const sendPage = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const msgId = pageId++;
        pageCallbacks.set(msgId, (res) => {
          if (res.error) reject(res.error);
          else resolve(res.result);
        });
        pageWs.send(JSON.stringify({ id: msgId, method, params }));
      });
    };

    await sendPage('Page.enable');
    await sendPage('Runtime.enable');

    const viewports = [
      { name: 'desktop', width: 1440, height: 900, isMobile: false },
      { name: 'laptop', width: 1024, height: 768, isMobile: false },
      { name: 'tablet', width: 768, height: 1024, isMobile: false },
      { name: 'mobile', width: 390, height: 844, isMobile: true },
    ];

    console.log('=== VERIFYING DUPLICATE HERO LOGO REMOVAL ===');

    for (const vp of viewports) {
      await sendPage('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.isMobile,
      });

      await sendPage('Page.navigate', { url: 'http://localhost:8080/' });
      await wait(2200);

      const check = await sendPage('Runtime.evaluate', {
        expression: `(() => {
          const h1 = document.querySelector('h1');
          const heroSection = document.querySelector('section');
          const heroImages = Array.from(heroSection ? heroSection.querySelectorAll('img') : []);
          const navbarLogo = document.querySelector('header img, header svg, header [aria-label*="Armorer"]');
          
          return {
            h1HasImg: h1 ? !!h1.querySelector('img') : false,
            heroImages: heroImages.map(img => ({ src: img.src, className: img.className })),
            h1Text: h1 ? h1.innerText.replace(/\\s+/g, ' ').trim() : '',
            hasNavbarLogo: !!navbarLogo
          };
        })()`,
        returnByValue: true
      });

      console.log(`\nViewport [${vp.name} - ${vp.width}x${vp.height}]:`);
      console.log(' - H1 text:', check.result.value.h1Text);
      console.log(' - Logo in H1 (must be false):', check.result.value.h1HasImg);
      console.log(' - Hero images (only hero-poster fallback allowed):', check.result.value.heroImages);
      console.log(' - Navbar logo present (must be true):', check.result.value.hasNavbarLogo);

      // Force entrance animation to settled state so screenshot is crystal clear
      await sendPage('Runtime.evaluate', {
        expression: `(() => {
          document.querySelectorAll('.hero-enter-heading, .hero-enter-description, .hero-enter-cta, .hero-enter-stats').forEach(el => {
            el.style.animation = 'none';
            el.style.opacity = '1';
            el.style.transform = 'none';
          });
          const vid = document.querySelector('video');
          if (vid && vid.readyState >= 2) { vid.currentTime = 1.0; }
        })()`
      });

      await wait(500);

      const shot = await sendPage('Page.captureScreenshot', { format: 'png' });
      const destPath = `scratch/clean_hero_${vp.name}.png`;
      fs.writeFileSync(destPath, Buffer.from(shot.data, 'base64'));
      console.log(` - Saved screenshot: ${destPath}`);
    }

    pageWs.close();
    ws.close();
    chromeProc.kill();
  } catch (err) {
    console.error('Error:', err);
    chromeProc.kill();
  }
}

run();
