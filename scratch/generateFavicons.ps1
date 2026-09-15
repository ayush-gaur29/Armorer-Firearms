Add-Type -AssemblyName System.Drawing

$rootDir = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $rootDir "src\assets\logo.png"
$publicDir = Join-Path $rootDir "public"

$src = [System.Drawing.Bitmap]::FromFile($sourcePath)
Write-Output "Loaded logo: $($src.Width) x $($src.Height)"
$src.Dispose()
