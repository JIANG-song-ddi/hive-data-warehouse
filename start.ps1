# E-commerce Data Warehouse System - Startup Script

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "    E-Commerce Data Warehouse System" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Function to find Docker
function Find-Docker {
    $dockerPaths = @(
        "C:\Program Files\Docker\Docker\resources\bin\docker.exe",
        "C:\Program Files (x86)\Docker\Docker\resources\bin\docker.exe",
        "$env:LOCALAPPDATA\Docker\resources\bin\docker.exe"
    )
    
    foreach ($path in $dockerPaths) {
        if (Test-Path $path) {
            return $path
        }
    }
    
    return $null
}

# Check if Docker is available
Write-Host "[1/4] Checking Docker environment..." -ForegroundColor Yellow
$dockerPath = Find-Docker

if ($dockerPath) {
    Write-Host "[OK] Docker found at: $dockerPath" -ForegroundColor Green
    
    # Add Docker to PATH for this session
    $dockerDir = Split-Path -Parent $dockerPath
    $env:PATH = "$dockerDir;$env:PATH"
    Write-Host "[OK] Docker added to PATH" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Docker not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install and start Docker Desktop first:" -ForegroundColor Yellow
    Write-Host "1. Visit https://www.docker.com/products/docker-desktop/" -ForegroundColor White
    Write-Host "2. Download and install Docker Desktop for Windows" -ForegroundColor White
    Write-Host "3. Start Docker Desktop" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Docker Compose
Write-Host ""
Write-Host "[2/4] Checking Docker Compose..." -ForegroundColor Yellow
try {
    & docker compose version 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Docker Compose available (using 'docker compose')" -ForegroundColor Green
    } else {
        throw "Docker Compose not available"
    }
} catch {
    Write-Host "[ERROR] Docker Compose not available" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker is running
Write-Host ""
Write-Host "[3/4] Checking Docker daemon..." -ForegroundColor Yellow
try {
    & docker info 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Docker daemon is running" -ForegroundColor Green
    } else {
        throw "Docker daemon not running"
    }
} catch {
    Write-Host "[ERROR] Docker daemon not running, please start Docker Desktop" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Start services
Write-Host ""
Write-Host "[4/4] Starting all services..." -ForegroundColor Yellow
Write-Host ""
Write-Host "This may take 3-5 minutes, please wait..." -ForegroundColor Cyan
Write-Host ""

& docker compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "    [SUCCESS] Services started!" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Service URLs:" -ForegroundColor Cyan
    Write-Host "  Frontend:       http://localhost" -ForegroundColor White
    Write-Host "  Backend API:    http://localhost:8085" -ForegroundColor White
    Write-Host "  HDFS WebUI:    http://localhost:9870" -ForegroundColor White
    Write-Host "  YARN WebUI:    http://localhost:8088" -ForegroundColor White
    Write-Host "  Spark Master:  http://localhost:8080" -ForegroundColor White
    Write-Host ""
    Write-Host "Check status:    docker compose ps" -ForegroundColor Yellow
    Write-Host "View logs:       docker compose logs -f" -ForegroundColor Yellow
    Write-Host "Stop services:   docker compose down" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "[ERROR] Failed to start services, please check error messages" -ForegroundColor Red
    Write-Host ""
}

Read-Host "Press Enter to exit"
