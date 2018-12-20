@echo off
cd %~dp0
echo Current working directory: %CD%
call ..\envSolution.bat
set personal_env_settings_file=..\env.%USERNAME%.bat
if not exist %personal_env_settings_file% (
	set errormessage=The personal environment settings file %personal_env_settings_file% does not exist, copy from template file env.user.template and fill with your personal settings
	goto ERROR
)
call %personal_env_settings_file%

:ERROR
echo %errormessage%
set ERRORLEVEL=-1
:DONE
