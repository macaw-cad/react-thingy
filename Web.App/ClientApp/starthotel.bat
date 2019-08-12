@ECHO OFF
:: check if administrator (https://stackoverflow.com/questions/15962307/how-to-check-if-a-user-is-an-administator)
OPENFILES >nul 2>nul
IF ERRORLEVEL 1 (
    GOTO NOTADMINISTRATOR
)

cd %~dp0
:: Kill process listening on ports 3000, 3001, 8080 and 5000, 9001
FOR /F "tokens=5 delims= " %%P IN ('netstat -a -n -o ^| findstr :3000') DO IF NOT %%P==0 (TaskKill.exe /PID %%P /F)
FOR /F "tokens=5 delims= " %%P IN ('netstat -a -n -o ^| findstr :3001') DO IF NOT %%P==0 (TaskKill.exe /PID %%P /F)
FOR /F "tokens=5 delims= " %%P IN ('netstat -a -n -o ^| findstr :8080') DO IF NOT %%P==0 (TaskKill.exe /PID %%P /F)
FOR /F "tokens=5 delims= " %%P IN ('netstat -a -n -o ^| findstr :5000') DO IF NOT %%P==0 (TaskKill.exe /PID %%P /F)
FOR /F "tokens=5 delims= " %%P IN ('netstat -a -n -o ^| findstr :9001') DO IF NOT %%P==0 (TaskKill.exe /PID %%P /F)

call hotel stop
call rmdir /s /q %userprofile%\.hotel
call hotel start
call hotel add "npm run start" --name "1. React client" --port 3000
call hotel add "npm run start:jsonserver" --name "2. JSonserver" --port 3001
call hotel add "npm run start:server-bundle" --name "3. React serverbundle" --port 8080
call hotel add "npm run start:hypernovacomponentserver" --name "4. HypernovaComponentServer" --port 8080
call hotel add "npm run start:dotnet-core" --name "5 .NET Core webserver" --port 5000
call hotel add "npm run start:storybook" --name "6. Storybook" --port 9001
cmd /c "start """""" """http://localhost:2000""""

GOTO DONE

:NOTADMINISTRATOR
@ECHO Run this script in a shell with administrator previleges

:DONE

