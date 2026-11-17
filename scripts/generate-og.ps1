Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#111111'))

$accent = [System.Drawing.ColorTranslator]::FromHtml('#E7472E')
$white = [System.Drawing.Color]::White
$muted = [System.Drawing.ColorTranslator]::FromHtml('#B7B9BB')
$dim = [System.Drawing.ColorTranslator]::FromHtml('#6A6C6E')

$accentBrush = New-Object System.Drawing.SolidBrush($accent)
$whiteBrush = New-Object System.Drawing.SolidBrush($white)
$mutedBrush = New-Object System.Drawing.SolidBrush($muted)
$dimBrush = New-Object System.Drawing.SolidBrush($dim)
$dotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 255, 255, 255))
$linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(50, 255, 255, 255), 1)

# Dot grid on the dark field
for ($x = 0; $x -lt 940; $x += 24) {
  for ($y = 0; $y -lt $height; $y += 24) {
    $graphics.FillEllipse($dotBrush, $x, $y, 2, 2)
  }
}

# Orange contact / heritage panel
$graphics.FillRectangle($accentBrush, 940, 0, 260, 630)

# Micro-label
$graphics.FillRectangle($accentBrush, 64, 50, 10, 10)
$mono = New-Object System.Drawing.Font('Consolas', 14, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.DrawString('STAR ROLLING MILLS PVT. LTD.', $mono, $whiteBrush, 86, 46)
$graphics.DrawString('IRON & STEEL / EST. 1967', $mono, $mutedBrush, 64, 84)

# Headline
$headline = New-Object System.Drawing.Font('Bahnschrift', 83, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.DrawString('BUILT AROUND', $headline, $whiteBrush, 56, 145)
$graphics.DrawString('INDUSTRIAL', $headline, $whiteBrush, 56, 236)
$graphics.DrawString('STRENGTH.', $headline, $accentBrush, 56, 327)

# Supporting line
$body = New-Object System.Drawing.Font('Segoe UI', 19, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.DrawString('An established industrial presence in iron and steel, since 1967.', $body, $mutedBrush, 64, 456)

# Fine rule + footer line
$graphics.DrawLine($linePen, 64, 532, 868, 532)
$small = New-Object System.Drawing.Font('Consolas', 13, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.DrawString('LILUAH, HOWRAH - 711204, WEST BENGAL, INDIA', $small, $dimBrush, 64, 556)
$graphics.DrawString('CIN U29241WB1967PTC027031', $small, $dimBrush, 610, 556)

# Orange panel typography
$panelLabel = New-Object System.Drawing.Font('Consolas', 12, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.DrawString('COMPANY', $panelLabel, $whiteBrush, 976, 54)
$graphics.DrawString('HERITAGE', $panelLabel, $whiteBrush, 976, 76)

$yearFont = New-Object System.Drawing.Font('Bahnschrift', 74, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.DrawString('1967', $yearFont, $whiteBrush, 966, 136)

$panelPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 255, 255, 255), 1)
$graphics.DrawLine($panelPen, 976, 238, 1164, 238)

$panelBody = New-Object System.Drawing.Font('Segoe UI', 14, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.DrawString('Industrial strength,', $panelBody, $whiteBrush, 976, 262)
$graphics.DrawString('material expertise,', $panelBody, $whiteBrush, 976, 284)
$graphics.DrawString('business continuity.', $panelBody, $whiteBrush, 976, 306)

# Vertical label at the bottom of the orange panel
$state = $graphics.Save()
$graphics.TranslateTransform(1150, 600)
$graphics.RotateTransform(-90)
$graphics.DrawString('SINCE 1967 - IRON & STEEL', $panelLabel, $whiteBrush, 0, 0)
$graphics.Restore($state)

$graphics.Dispose()

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 92)

$outPath = Join-Path $PSScriptRoot '..\public\og-image.jpg'
$resolved = [System.IO.Path]::GetFullPath($outPath)
$bitmap.Save($resolved, $encoder, $params)
$bitmap.Dispose()

Write-Output "Wrote $resolved"
