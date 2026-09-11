import fs from 'fs';

// Let's inspect the video asset or check the bottom-right corner of the video
const videoPath = 'src/assets/cover_video.mp4';
const stat = fs.statSync(videoPath);
console.log('Video size:', stat.size);
