@echo off
cd ..
:run
git pull
node --trace-warnings .
goto run
