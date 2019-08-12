@echo off
call SetUserEnvironment.bat

docker build -f Dockerfile -t %SOLUTIONNAME%/webapp:latest ..