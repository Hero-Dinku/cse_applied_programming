Write-Host "=== Testing CSE 310 API on Port 5000 ===" -ForegroundColor Cyan

# Wait a moment for server to start
Start-Sleep -Seconds 2

try {
    Write-Host "Testing connection to http://localhost:5000..." -ForegroundColor Yellow
     = Invoke-RestMethod -Uri "http://localhost:5000/" -ErrorAction Stop
    Write-Host "✅ SUCCESS! Server is responding!" -ForegroundColor Green
    Write-Host "API: " -ForegroundColor Yellow
    Write-Host "Student: " -ForegroundColor Yellow
    Write-Host "Port: " -ForegroundColor Yellow
    
    # Test creating a task
    Write-Host "
Testing task creation..." -ForegroundColor Yellow
     = @{
        title = "Complete CSE 310 Module 1"
        description = "Submit API project with video"
    } | ConvertTo-Json
    
    {
    "description":  "Testing the working API",
    "title":  "Test API for CSE 310"
} = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method Post -Body  -ContentType "application/json"
    Write-Host "✅ Task created with ID: " -ForegroundColor Green
    
    # Test getting tasks
    Write-Host "
Getting all tasks..." -ForegroundColor Yellow
     = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks"
    Write-Host "✅ Found 0 tasks" -ForegroundColor Green
    
    # Test weather API
    Write-Host "
Testing external weather API..." -ForegroundColor Yellow
     = Invoke-RestMethod -Uri "http://localhost:5000/api/weather"
    Write-Host "✅ Weather:  in " -ForegroundColor Green
    
    Write-Host "
🎉 ALL TESTS PASSED! Ready for submission!" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ ERROR: " -ForegroundColor Red
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "1. Server not running on port 5000" -ForegroundColor Yellow
    Write-Host "2. Port 5000 might be blocked by firewall" -ForegroundColor Yellow
    Write-Host "3. Try a different port like 5001 or 8000" -ForegroundColor Yellow
}
