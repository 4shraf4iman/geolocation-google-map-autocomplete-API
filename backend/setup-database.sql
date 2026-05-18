-- =============================================
-- SQL Server Setup Script for Interview Assignment
-- =============================================

-- 1. Enable Mixed Mode Authentication (SQL Server and Windows Authentication)
-- Note: This requires a manual restart of the SQL Server service after execution.
EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE', N'Software\Microsoft\MSSQLServer\MSSQLServer', N'LoginMode', REG_DWORD, 2;
GO

-- 2. Create the Database
IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'TESTDB') 
BEGIN
    CREATE DATABASE TESTDB;
END
GO

USE TESTDB;
GO

-- 3. Create the SQL Login for the application
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'springuser')
BEGIN
    CREATE LOGIN springuser WITH PASSWORD = 'Password123!', CHECK_POLICY = OFF;
END
GO

-- 4. Create the User in the database and grant permissions
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'springuser')
BEGIN
    CREATE USER springuser FOR LOGIN springuser;
    ALTER ROLE db_owner ADD MEMBER springuser;
END
GO

-- 5. Grant Sysadmin for initial table creation (optional but safer for Hibernate ddl-auto)
ALTER SERVER ROLE sysadmin ADD MEMBER springuser;
GO

PRINT 'Database setup completed successfully. Please restart the SQL Server Service to apply authentication changes.';
