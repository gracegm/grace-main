@echo off
echo ========================================
echo    PeachieGlow Git Push Script
echo ========================================
echo.

REM Add all changes
echo Adding all changes...
git add .

REM Check if there are changes to commit
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo No changes to commit.
    pause
    exit /b 0
)

REM Prompt for commit message
set /p commit_message="Enter commit message: "

REM Use default message if none provided
if "%commit_message%"=="" (
    set commit_message=Update PeachieGlow project
)

REM Commit changes
echo.
echo Committing changes with message: "%commit_message%"
git commit -m "%commit_message%"

REM Check if commit was successful
if %errorlevel% neq 0 (
    echo Error: Failed to commit changes.
    pause
    exit /b 1
)

REM Push to origin main
echo.
echo Pushing to origin main...
git push origin main

REM Check if push was successful
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    Successfully pushed to repository!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo    Error: Failed to push to repository
    echo ========================================
)

echo.
pause
