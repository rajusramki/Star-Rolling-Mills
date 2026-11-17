param (
  [int]$Port = 8787
)

$cloudflared = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
if (-not (Test-Path $cloudflared)) {
  $cloudflared = "cloudflared"
}

Write-Host "`n=== Star Rolling Mills — Local Live with Cloudflare Tunnel ===" -ForegroundColor Cyan
Write-Host "1. Starting local Express server (port $Port)..." -ForegroundColor Gray

$server = Start-Process node -ArgumentList "server/index.mjs" -PassThru

Start-Sleep -Seconds 2

Write-Host "2. Connecting Cloudflare Tunnel to http://127.0.0.1:$Port..." -ForegroundColor Yellow
Write-Host "Look for the https://*.trycloudflare.com link below:`n" -ForegroundColor Green

try {
  & $cloudflared tunnel --url "http://127.0.0.1:$Port"
} finally {
  if ($server -and -not $server.HasExited) {
    Write-Host "`nStopping background local server..." -ForegroundColor Gray
    Stop-Process -Id $server.Id -Force
  }
}
