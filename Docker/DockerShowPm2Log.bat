@echo off
call SetUserEnvironment.bat
docker exec %SOLUTIONNAME%-webapp pm2 logs --nostream
echo Run DockerRunBash.bat for an interactive shell, then execute "pm2 --help" for available pm2 commands