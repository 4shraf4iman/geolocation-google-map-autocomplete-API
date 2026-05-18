URL DEMO : https://backend-production-7dfc.up.railway.app

# Full-Stack Interview Assignment - Backend

Java Spring Boot backend providing a RESTful API for location management, weather data integration, and paginated search history.

## Technology Stack
* **Java 21**
* **Spring Boot 3.4.x** (Web, Data JPA)
* **MSSQL Database** (Microsoft SQL Server)
* **Hibernate** (ORM)
* **Maven**

## Features Implemented
* **MVC Architecture**: Separated `controller`, `service`, `repository`, and `model` layers.
* **MSSQL Integration**: Integration with SQL Server Express via `mssql-jdbc`.
* **AOP Logging**: Aspect-Oriented Programming (`LoggingAspect`) for logging HTTP `REQUEST` and `RESPONSE` payloads to `logs/application.log`.
* **Nested 3rd Party API Call**: Integration with Open-Meteo Weather API for real-time weather data retrieval.
* **Pagination**: `GET /api/places` endpoint with 10 records per page default.
* **Transaction Management**: Implementation of `@Transactional` across database service operations.

## Setup & Execution Instructions

### 1. Database Configuration
The application connects to a local Microsoft SQL Server (`localhost\SQLEXPRESS`). Database and user setup must be completed prior to execution.

**Database Setup Procedure:**
1. Open **SQL Server Management Studio (SSMS)**.
2. Open and execute the [setup-database.sql](./setup-database.sql) file provided in this directory.
3. Restart the **SQL Server (SQLEXPRESS)** service in SQL Server Configuration Manager or Windows Services.
4. Ensure **TCP/IP** is enabled in SQL Server Network Configuration.
5. Ensure the **SQL Server Browser** service is running.

**Note:**
* Restart the SQL Server Service in SQL Server Configuration Manager after script execution.
* Ensure **TCP/IP is Enabled** for `SQLEXPRESS` and the **SQL Server Browser** service is running.

### 2. Application Execution
Execute the following command within the `backend` directory:

```bash
# Windows
.\mvnw spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
```

The service initializes on **http://localhost:8080**.

## API Testing
A Postman collection (`interview-assignment.postman_collection.json`) is available in the root directory for endpoint verification.
