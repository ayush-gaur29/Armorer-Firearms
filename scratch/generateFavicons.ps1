Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\Uxdlab\Documents\GitHub\obsidian-archive\src\assets\logo.png"
$publicDir = "C:\Users\Uxdlab\Documents\GitHub\obsidian-archive\public"

$src = [System.Drawing.Bitmap]::FromFile($sourcePath)
Write-Output "Loaded logo: $($src.Width) x $($src.Height)"
$src.Dispose()
