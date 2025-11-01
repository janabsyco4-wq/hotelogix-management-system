@echo off
echo ========================================
echo  Hotelogix AI Model Retraining
echo ========================================
echo.

echo Step 1: Generating enhanced dataset...
echo ----------------------------------------
cd ai-model
node generate_dataset.js
if %errorlevel% neq 0 (
    echo ERROR: Dataset generation failed!
    pause
    exit /b 1
)
echo.

echo Step 2: Training AI model...
echo ----------------------------------------
node train_model.js
if %errorlevel% neq 0 (
    echo ERROR: Model training failed!
    pause
    exit /b 1
)
echo.

echo Step 3: Testing recommendations...
echo ----------------------------------------
node test_recommendations.js
if %errorlevel% neq 0 (
    echo ERROR: Testing failed!
    pause
    exit /b 1
)
echo.

cd ..
echo ========================================
echo  AI Model Retraining Complete!
echo ========================================
echo.
echo The model has been successfully retrained with enhanced data.
echo You can now restart the backend server to use the new model.
echo.
pause
