@echo off
echo ========================================
echo    Goose Goose Duck 新手助手启动器
echo ========================================
echo.

echo 1. 启动开发服务器 (端口 5173)
echo 2. 打开完整角色数据库
echo 3. 打开原始助手界面
echo 4. 退出
echo.

set /p choice="请选择 (1-4): "

if "%choice%"=="1" (
  echo 正在启动开发服务器...
  npm run dev
) else if "%choice%"=="2" (
  echo 正在打开完整角色数据库...
  start index_complete.html
  echo 请在浏览器中打开: http://localhost:5173/
  pause
) else if "%choice%"=="3" (
  echo 正在打开原始助手界面...
  start index.html
  echo 请在浏览器中打开: http://localhost:5173/
  pause
) else (
  echo 退出...
  exit /b 0
)