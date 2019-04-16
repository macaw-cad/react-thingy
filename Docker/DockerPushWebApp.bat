@echo off
call SetUserEnvironment.bat
echo PUSH %SOLUTIONNAME%/webapp:latest TO %CONTAINERREGISTRY_URL%/webapp:latest
pushd %~dp0
docker tag %SOLUTIONNAME%/webapp:latest %CONTAINERREGISTRY_URL%/webapp:latest
echo %CONTAINERREGISTRY_PASSWORD% | docker login -u %CONTAINERREGISTRY_URL% --password-stdin %CONTAINERREGISTRY_USERNAME%
docker push %CONTAINERREGISTRY_URL%/webapp:latest
popd
