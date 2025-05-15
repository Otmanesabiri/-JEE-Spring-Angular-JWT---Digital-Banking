# -JEE-Spring-Angular-JWT---Digital-Banking

# Digital Banking Backend

## Prerequisites

- Java 17 or higher
- Maven 3.6.3 or higher
- MySQL 8.0 or higher
- Git (optional)

## Setup and Configuration

1. **Database Configuration**:
   Make sure MySQL is running and verify the database settings in `src/main/resources/application.properties`.
   
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/digitalbanking?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=
   ```
   
   Update the username and password as needed.

2. **Network Configuration**:
   If you're behind a proxy, update the proxy settings in `settings.xml`:
   
   ```xml
   <proxy>
     <id>company-proxy</id>
     <active>true</active>
     <protocol>http</protocol>
     <host>proxy.company.com</host>
     <port>8080</port>
     <nonProxyHosts>localhost|127.0.0.1|*.company.com</nonProxyHosts>
   </proxy>
   ```

## Build and Run

### Using Maven Command Line

1. **Navigate to the backend directory**:
   ```bash
   cd /home/red/Documents/GitHub/-JEE-Spring-Angular-JWT---Digital-Banking/digitalbanking-backend
   ```

2. **Clean and build the project**:
   ```bash
   mvn clean install
   ```
   
   If you encounter MySQL connection errors during tests, you can skip tests:
   ```bash
   mvn clean install -DskipTests
   ```

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```
   
   If you need to run with a specific profile:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

### Using an IDE (IntelliJ IDEA, Eclipse, etc.)

1. **Import the project** as a Maven project
2. **Build the project** using the IDE's build function
3. **Run the main application class**: Find the main class with `@SpringBootApplication` annotation and run it

## Verify the Application

1. The application should be running at: `http://localhost:8080`
2. Access the Swagger UI documentation at: `http://localhost:8080/swagger-ui.html`

## Troubleshooting

- **Database Connection Issues**:
  - Ensure MySQL is running: `sudo systemctl status mysql`
  - Verify connection details in application.properties
  - Check for firewall issues: `sudo ufw status`
  - Start MySQL if it's not running: `sudo systemctl start mysql`
  - Check MySQL connection: `mysql -u root -p`

- **Test Failures Due to Database Connection**:
  - Create a test-specific application-test.properties file with H2 database configuration
  - Skip tests during build: `mvn clean install -DskipTests`
  - Configure your test classes with `@ActiveProfiles("test")` to use different database settings
  - Ensure MySQL server is accessible from your test environment

- **MySQL Connection Errors**:
  - Check if MySQL is listening on the expected port: `sudo netstat -tlnp | grep mysql`
  - Verify user permissions: `mysql -u root -p -e "SHOW GRANTS FOR 'root'@'localhost'"`
  - Try creating the database manually:
    ```bash
    mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS digitalbanking;"
    ```
  - Check MySQL error logs: `sudo tail -f /var/log/mysql/error.log`

- **Build Failures**:
  - Ensure proxy settings are correct if you're behind a corporate firewall
  - Check Maven repository settings in settings.xml
  - Run with verbose output: `mvn clean install -X`

- **Runtime Errors**:
  - Check the logs for detailed error information
  - Verify that all required environment variables are set
  - Ensure the application port is not in use by another process

## H2 Database Configuration

This application supports an H2 in-memory database, which is useful for development and testing without requiring a MySQL installation.

### Using H2 Database

1. **Default Configuration**:
   The application is configured to use H2 by default with these settings in `application.properties`:
   
   ```properties
   spring.datasource.url=jdbc:h2:mem:bankingdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
   spring.datasource.username=sa
   spring.datasource.password=
   spring.datasource.driver-class-name=org.h2.Driver
   spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
   spring.h2.console.enabled=true
   spring.h2.console.path=/h2-console
   ```

2. **Accessing H2 Console**:
   - The H2 console is available at: `http://localhost:8080/h2-console`
   - Use these connection settings:
     - JDBC URL: `jdbc:h2:mem:bankingdb`
     - Username: `sa`
     - Password: (leave empty)
   - Click "Connect" to access the database

3. **Benefits of Using H2**:
   - No need to install a separate database server
   - Automatic schema creation and seeding
   - Fast startup and testing
   - Database resets on application restart

4. **Limitations**:
   - Data is lost when the application stops
   - Not suitable for production use
   - Limited to basic SQL features

5. **Switching Between H2 and MySQL**:
   - To use MySQL instead of H2, update the `application.properties` file or use profiles:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```