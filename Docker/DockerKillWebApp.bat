@echo off
call SetUserEnvironment.bat
echo Killing running docker container...
docker kill %SOLUTIONNAME%-webapp