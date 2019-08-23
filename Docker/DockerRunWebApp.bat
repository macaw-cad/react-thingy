@echo off
call SetUserEnvironment.bat
set PORT=80
if not '%1'=='' set PORT=%1
docker kill %SOLUTIONNAME%-webapp
docker run --rm -i --name=%SOLUTIONNAME%-webapp -p %PORT%:80 -p 8080:8080 -p 5000:5000 %SOLUTIONNAME%/webapp:latest
: start /b docker run --rm -i --name=%SOLUTIONNAME%-webapp -p %PORT%:80 -p 8080:8080 -p 5000:5000 %SOLUTIONNAME%/webapp:latest
: timeout /T 10
: echo The website will become available on http://localhost:%PORT%
: start http://localhost:%PORT%
