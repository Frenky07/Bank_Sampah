@echo off
set "MYSQL_BIN=C:\xampp\mysql\bin"
set "BACKUP_DIR=C:\BackupDB\banksampah"
set "DB_NAME=bank_sampah"
set "DB_USER=root"
set "DB_PASSWORD="

set "DATE=%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%"
set "FILENAME=%DB_NAME%_%DATE%.sql"

mkdir "%BACKUP_DIR%" >nul 2>&1

"%MYSQL_BIN%\mysqldump.exe" -u %DB_USER% --password=%DB_PASSWORD% %DB_NAME% > "%BACKUP_DIR%\%FILENAME%"

echo Backup berhasil disimpan ke %BACKUP_DIR%\%FILENAME%