@echo off
call SetUserEnvironment.bat
echo PUSH %SOLUTIONNAME%/webapp:latest TO %CONTAINERREGISTRY_URL%/webapp:latest
pushd %~dp0
docker tag %SOLUTIONNAME%/webapp:latest %CONTAINERREGISTRY_URL%/webapp:latest
docker login %CONTAINERREGISTRY_URL% --username CONTAINERREGISTRY_USERNAME% --password %CONTAINERREGISTRY_PASSWORD%
docker push %CONTAINERREGISTRY_URL%/webapp:latest
popd
