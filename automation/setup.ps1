Write-Host "Setting up ChatCart backend dependencies..." -ForegroundColor Cyan
Push-Location "../backend"

if (-not (Test-Path "package.json")) {
  Write-Host "backend/package.json not found." -ForegroundColor Red
  Pop-Location
  exit 1
}

npm install
Pop-Location

Write-Host "Setup complete." -ForegroundColor Green
