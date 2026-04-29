# E-commerce Data Warehouse System - Stop Script

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "    E-Commerce Data Warehouse System" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$confirmation = Read-Host "Are you sure you want to stop all services? (y/N)"
if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
    Write-Host "Operation cancelled" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 0
}

Write-Host ""
Write-Host "Stopping all services..." -ForegroundColor Yellow
docker compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "    [SUCCESS] Services stopped!" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[ERROR] Error stopping services" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"
