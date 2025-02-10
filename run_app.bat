@echo off
chcp 65001 >nul

REM ---------------------------------------------------------------------
REM Professeur/Auteur : Akram Nasr
REM Courriel : Akram.Nasr@cmontmorency.qc.ca
REM Cours : 420 4E6 MO - Analyse et conception de modèles
REM ---------------------------------------------------------------------

set PROJECT_PATH=%USERPROFILE%\Desktop\URBANIA_APP\CafeUrbaniaV2

cd /d "%PROJECT_PATH%"

if not exist "%PROJECT_PATH%\venv" (
    echo Creating virtual environment, Please wait...
    python -m venv "%PROJECT_PATH%\venv"
) else (
    echo Virtual environment already exists.
)

call "%PROJECT_PATH%\venv\Scripts\activate"

if not exist "%PROJECT_PATH%\venv\Scripts\python.exe" (
    echo Error: Virtual environment activation failed!
    echo Python not found in venv. Exiting...
    exit /b 1
)

if exist "%PROJECT_PATH%\requirements.txt" (
    echo Installing dependencies, Please wait...
    pip install -r "%PROJECT_PATH%\requirements.txt"
) else (
    echo No requirements.txt found. Skipping dependency installation.
)

echo Starting the application...
python "%PROJECT_PATH%\app.py"

pause
