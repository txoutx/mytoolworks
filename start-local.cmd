@echo off
cd /d "%~dp0"
"C:\Program Files\nodejs\npm.cmd" run start -- --hostname 127.0.0.1 --port 3020
