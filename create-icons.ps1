# Create Icons for PWA
Add-Type -AssemblyName System.Drawing

function Create-Icon {
    param([int]$size, [string]$filename)
    
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # Background - Purple gradient effect (solid purple)
    $purple = [System.Drawing.Color]::FromArgb(99, 102, 241)
    $g.Clear($purple)
    
    # White circle in center
    $margin = [int]($size * 0.2)
    $circleSize = $size - ($margin * 2)
    $g.FillEllipse([System.Drawing.Brushes]::White, $margin, $margin, $circleSize, $circleSize)
    
    # Green checkmark
    $green = [System.Drawing.Color]::FromArgb(16, 185, 129)
    $brush = New-Object System.Drawing.SolidBrush($green)
    $checkSize = [int]($size * 0.3)
    $checkX = [int]($size * 0.28)
    $checkY = [int]($size * 0.28)
    
    # Draw checkmark as lines
    $pen = New-Object System.Drawing.Pen($green, [int]($size * 0.08))
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    
    $g.DrawLine($pen, [int]($size * 0.32), [int]($size * 0.5), [int]($size * 0.45), [int]($size * 0.65))
    $g.DrawLine($pen, [int]($size * 0.45), [int]($size * 0.65), [int]($size * 0.7), [int]($size * 0.35))
    
    $bmp.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $pen.Dispose()
    $brush.Dispose()
    $g.Dispose()
    $bmp.Dispose()
}

Create-Icon -size 192 -filename "icon-192.png"
Create-Icon -size 512 -filename "icon-512.png"

Write-Host "Icons created successfully!"
