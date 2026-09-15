Add-Type -AssemblyName System.Drawing

$rootDir = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $rootDir "src\assets\logo.png"
$publicDir = Join-Path $rootDir "public"

$src = [System.Drawing.Bitmap]::FromFile($sourcePath)

function Resize-Image {
    param(
        [System.Drawing.Bitmap]$source,
        [int]$targetWidth,
        [int]$targetHeight,
        [string]$outputPath
    )
    $dest = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $g.DrawImage($source, 0, 0, $targetWidth, $targetHeight)
    $g.Dispose()

    $dest.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
    Write-Output "Generated: $outputPath ($($targetWidth)x$($targetHeight))"
}

# Generate PNGs
Resize-Image $src 16 16 "$publicDir\favicon-16x16.png"
Resize-Image $src 32 32 "$publicDir\favicon-32x32.png"
Resize-Image $src 48 48 "$publicDir\favicon-48x48.png"
Resize-Image $src 180 180 "$publicDir\apple-touch-icon.png"
Resize-Image $src 192 192 "$publicDir\android-chrome-192x192.png"
Resize-Image $src 512 512 "$publicDir\android-chrome-512x512.png"

$src.Dispose()

# Now create multi-icon favicon.ico with 16, 32, 48 PNG frames
$sizes = @(16, 32, 48)
$pngBytesList = @()
foreach ($sz in $sizes) {
    $pngBytes = [System.IO.File]::ReadAllBytes("$publicDir\favicon-$sz`x$sz.png")
    $pngBytesList += ,$pngBytes
}

$numImages = $sizes.Count
$headerSize = 6 + ($numImages * 16)
$currentOffset = $headerSize

$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($ms)

# ICO Header
$bw.Write([uint16]0) # Reserved
$bw.Write([uint16]1) # Type: ICO
$bw.Write([uint16]$numImages) # Count

# Entries
for ($i = 0; $i -lt $numImages; $i++) {
    $sz = $sizes[$i]
    $data = $pngBytesList[$i]
    $widthByte = if ($sz -ge 256) { [byte]0 } else { [byte]$sz }
    $heightByte = if ($sz -ge 256) { [byte]0 } else { [byte]$sz }
    $bw.Write($widthByte)
    $bw.Write($heightByte)
    $bw.Write([byte]0) # Color count
    $bw.Write([byte]0) # Reserved
    $bw.Write([uint16]1) # Planes
    $bw.Write([uint16]32) # Bit count
    $bw.Write([uint32]$data.Length) # Bytes in resource
    $bw.Write([uint32]$currentOffset) # Image offset
    $currentOffset += $data.Length
}

# Image Data
for ($i = 0; $i -lt $numImages; $i++) {
    $data = $pngBytesList[$i]
    $bw.Write($data)
}

$bw.Flush()
[System.IO.File]::WriteAllBytes("$publicDir\favicon.ico", $ms.ToArray())
$bw.Dispose()
$ms.Dispose()

Write-Output "Generated: $publicDir\favicon.ico containing 16x16, 32x32, 48x48 PNG icons"
