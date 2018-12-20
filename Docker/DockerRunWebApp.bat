@echo off
call SetUserEnvironment.bat
docker run --rm -i -e "ASPNETCORE_ENVIRONMENT=Production" -e "ASPNETCORE_URLS=http://+:80" -p 80:80 -p 8080:8080 %SOLUTIONNAME%/webapp:latest
