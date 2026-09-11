Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile("C:\Users\Uxdlab\Documents\GitHub\obsidian-archive\src\assets\logo.png")
Write-Output "Image size: $($src.Width) x $($src.Height)"

# Sample down or check bounds
$minX = $src.Width
$maxX = 0
$minY = $src.Height
$maxY = 0

# Fast check by stepping 16 pixels
for ($y = 0; $y -lt $src.Height; $y += 16) {
    for ($x = 0; $x -lt $src.Width; $x += 16) {
        $pixel = $src.GetPixel($x, $y)
        if ($pixel.A -gt 20) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Bounds: X: $minX to $maxX, Y: $minY to $maxY"
$src.Dispose()
