@echo off
set "MYSQL_BIN=C:\xampp\mysql\bin"
set "BACKUP_DIR=C:\BackupDB\banksampah"
set "DB_NAME=bank_sampah"
set "DB_USER=root"
set "DB_PASSWORD="

:: Ambil tanggal aman
for /f "tokens=2 delims==" %%I in ('"wmic os get localdatetime /value"') do set datetime=%%I
set "DATE=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%"
set "FILENAME=%DB_NAME%_%DATE%.sql"

:: Buat folder backup jika belum ada
mkdir "%BACKUP_DIR%" >nul 2>&1

echo Membackup database...

"%MYSQL_BIN%\mysqldump.exe" -u %DB_USER% --password=%DB_PASSWORD% %DB_NAME% --result-file="%BACKUP_DIR%\%FILENAME%" 2>> "%BACKUP_DIR%\backup_error.log"

echo Backup berhasil disimpan ke %BACKUP_DIR%\%FILENAME%
pause
