@echo off
chcp 65001 >nul

REM -------------------------------------------------------------
REM Professeur/Auteur : Akram Nasr
REM Courriel : Akram.Nasr@cmontmorency.qc.ca
REM Cours : 420 4E6 MO - Analyse et conception de modèles
REM -------------------------------------------------------------

set PROJECT_ROOT=%USERPROFILE%\Desktop\URBANIA_APP
set SQL_FILE=%PROJECT_ROOT%\mydatabase.sql
set DATABASE_NAME=urbaniaDB

if not exist "%SQL_FILE%" (
    echo Error: SQL file "mydatabase.sql" not found in %PROJECT_ROOT%!
    exit /b 1
)

cd /d "C:\xampp\mysql\bin"

mysql -u root -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '%DATABASE_NAME%';" > db_check.log 2>&1

findstr /C:"%DATABASE_NAME%" db_check.log >nul
if %ERRORLEVEL%==0 (
    echo Database "%DATABASE_NAME%" already exists. Exiting...
    exit /b 0
)

echo Creating database "%DATABASE_NAME%"...
mysql -u root -e "CREATE DATABASE %DATABASE_NAME%;"

mysql -u root %DATABASE_NAME% < "%SQL_FILE%"

echo Database and tables created successfully!
pause
