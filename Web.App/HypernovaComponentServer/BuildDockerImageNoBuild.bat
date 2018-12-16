:: Build the component server Docker image locally as "hypernovacomponentserver:1.0.0" and push it to the
@echo off
:: use && without spaces otherwise NODE_ENV is 'development '
if [%1]==[] set mode=production&& goto BUILD
if [%1]==[development] set mode=development&& goto BUILD
if [%1]==[production] set mode=production&& goto BUILD
echo Specify as parameter development or production, no parameters means development [exit]

:BUILD
echo BUILDING %mode% VERSION OF hypernovacomponentserver:1.0.0
pushd %~dp0
dos2unix init.sh
rem pushd ..\Web.App
rem set NODE_ENV=%mode%&&set SERVER_BUNDLE_RELATIVE_OUTPUT_FOLDER=../HypernovaComponentServer&&call npx webpack --config webpack.server-bundle.config.js
 :: back to HypernovaComponentServer folder
rem popd

:: write creationinfo.txt file
for /F "tokens=2" %%i in ('date /t') do set mydate=%%i
set mytime=%time%
echo Componentserver image created at %mydate%:%mytime% - %mode% build > creationinfo.txt

:: build and push docker image
docker build --file Dockerfile.%mode% --tag hypernovacomponentserver:1.0.0 .
popd

:DONE