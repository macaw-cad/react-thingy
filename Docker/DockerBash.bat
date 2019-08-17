@echo off
call SetUserEnvironment.bat
docker exec -it %SOLUTIONNAME%-webapp bash