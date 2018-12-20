@echo off
call SetUserEnvironment.bat

dos2unix init.sh
dos2unix sshd_config
dos2unix supervisord.conf

docker build -f Dockerfile -t %SOLUTIONNAME%/webapp:latest ..