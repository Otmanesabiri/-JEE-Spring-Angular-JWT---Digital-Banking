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

## Backend Phase Report

This section provides a summary of the backend development phase for the Digital Banking application.

### 1. Overview

The backend is a RESTful API service built using Java and the Spring Boot framework. It handles all business logic, data persistence, and security for the application. Key functionalities include customer management, bank account operations, transaction processing, and user authentication/authorization.

### 2. Technologies Used

*   **Java 17**: Core programming language.
*   **Spring Boot 3.x**: Framework for building robust and scalable applications.
    *   **Spring MVC**: For creating RESTful web services.
    *   **Spring Data JPA**: For data persistence and interaction with the database.
    *   **Spring Security**: For handling authentication and authorization.
*   **JSON Web Tokens (JWT)**: For securing API endpoints and managing user sessions.
*   **Hibernate**: JPA implementation for ORM.
*   **Maven**: Build automation and dependency management.
*   **Database**:
    *   **H2 Database**: In-memory database for development and testing.
    *   **MySQL**: Relational database for production-like environments.
*   **Lombok**: To reduce boilerplate code (e.g., getters, setters, constructors).
*   **Swagger/OpenAPI 3**: For API documentation and testing (accessible via `/swagger-ui.html`).

### 3. Core Functionalities Implemented

*   **Authentication & Authorization**:
    *   User registration (`/api/auth/signup`).
    *   User login with JWT generation (`/api/auth/login`).
    *   Password change functionality (`/api/auth/changePassword`).
    *   Role-based access control (RBAC) with "ADMIN" and "USER" roles.
    *   Secure API endpoints using Spring Security and JWT.
    *   User profile retrieval (`/api/auth/profile`).
*   **Customer Management (Admin)**:
    *   CRUD operations for customers (Create, Read, Update, Delete).
    *   Search functionality for customers.
    *   Endpoints: `/api/customers`.
*   **Bank Account Management**:
    *   Creation of Current and Saving accounts.
    *   Retrieval of account details and lists of accounts.
    *   Retrieval of accounts associated with a specific customer.
    *   Endpoints: `/api/accounts`.
*   **Account Operations**:
    *   Debit and Credit operations on bank accounts.
    *   Transfer of funds between accounts.
    *   Retrieval of account operation history with pagination.
    *   Endpoints: `/api/accounts/{accountId}/operations`, `/api/accounts/debit`, `/api/accounts/credit`, `/api/accounts/transfer`.
*   **User Management (Admin)**:
    *   Listing users.
    *   Assigning/removing roles to/from users.
    *   Endpoints: `/api/admin/users`, `/api/admin/roles`.

### 4. Architecture and Design

*   **Layered Architecture**:
    *   **Controller Layer**: Handles HTTP requests and responses (REST APIs).
    *   **Service Layer**: Contains business logic.
    *   **Repository Layer**: Interacts with the database using Spring Data JPA.
    *   **Entity Layer**: Defines data models (JPA entities).
    *   **DTO (Data Transfer Object) Layer**: Used for transferring data between layers, especially for API responses and requests.
    *   **Mapper Layer**: Converts between DTOs and Entities.
*   **Security**:
    *   `JwtAuthenticationFilter` for validating JWT tokens on each request.
    *   `UserDetailsService` implementation for loading user-specific data.
    *   `PasswordEncoder` (BCrypt) for securely storing passwords.
    *   Custom `AuthenticationEntryPoint` for handling unauthorized access.
*   **Error Handling**:
    *   Custom exceptions (e.g., `CustomerNotFoundException`, `BankAccountNotFoundException`, `BalanceNotSufficientException`).
    *   Global exception handling (though not explicitly shown in provided files, typically implemented with `@ControllerAdvice`).
*   **Auditing**:
    *   Basic auditing fields (`createdBy`, `lastModifiedBy`) are present in some entities, populated with the username of the authenticated user performing the action.

### 5. Database Schema

*   **`Customer`**: Stores customer information.
*   **`BankAccount`**: Abstract base class for bank accounts, using single-table inheritance (`CurrentAccount`, `SavingAccount`).
*   **`AccountOperation`**: Records all transactions (debit, credit).
*   **`AppUser`**: Stores user credentials and roles for application access.
*   **`AppRole`**: Defines user roles (e.g., ADMIN, USER).

### 6. Configuration

*   **`application.properties`**: Centralized configuration for server port, database connection (H2/MySQL), JWT secrets, and logging levels.
*   **CORS Configuration**: Enabled to allow requests from the frontend application (typically `http://localhost:4200`).
*   **Initial Data Seeding**: `CommandLineRunner` in the main application class to create default roles (ADMIN, USER) and users (admin, user) on startup.

### 7. Challenges and Solutions (Illustrative)

*   **JWT Signature Mismatch**: Ensured that the secret key used for signing and validating JWTs was identical and processed consistently (e.g., UTF-8 bytes vs. Base64 decoding). This was resolved by standardizing the key derivation in `JwtUtils.java` and `JWTService.java` and ensuring correct configuration in `application.properties`.
*   **Property File Parsing**: Corrected formatting of numeric properties with comments in `application.properties` to prevent `NumberFormatException`.
*   **Lazy Initialization Issues**: Addressed potential `LazyInitializationException` by using DTOs and ensuring necessary data is fetched within transactional service methods or by configuring appropriate fetch types. (The use of `@Lazy` on `UserDetailsService` in `JwtAuthenticationFilter` and `ApplicationConfig` is a common pattern to break circular dependencies).

### 8. Future Enhancements (Potential)

*   More granular permissions.
*   Two-factor authentication.
*   Advanced reporting and analytics.
*   Integration with external services (e.g., email notifications).
*   More comprehensive auditing.

This report summarizes the state and structure of the backend system as developed.

## Connecting Frontend with Backend

### Backend Configuration

1. **Enable CORS in Spring Boot**:
   Create a CORS configuration class in the backend:

   ```java
   // in package ma.digitbank.jeespringangularjwtdigitalbanking.config
   @Configuration
   public class CorsConfig implements WebMvcConfigurer {
       @Override
       public void addCorsMappings(CorsRegistry registry) {
           registry.addMapping("/**")
               .allowedOrigins("http://localhost:4200")
               .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
               .allowedHeaders("*")
               .allowCredentials(true)
               .maxAge(3600);
       }
   }
   ```

2. **Configure Security to Allow CORS**:
   Update the SecurityConfig class to permit CORS pre-flight requests:

   ```java
   @Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
       http
           .cors(Customizer.withDefaults()) // Enable CORS
           .csrf(AbstractHttpConfigurer::disable)
           // ...rest of your security configuration
   }
   ```

### Frontend Configuration

1. **Environment Configuration**:
   Create or update environment files to store API URL:

   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api'
   };
   ```

2. **HTTP Interceptor for Authentication**:
   Create a JWT interceptor to add the token to all requests:

   ```typescript
   // src/app/interceptors/auth.interceptor.ts
   import { Injectable } from '@angular/core';
   import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
   import { Observable } from 'rxjs';
   import { AuthService } from '../services/auth.service';

   @Injectable()
   export class AuthInterceptor implements HttpInterceptor {
     constructor(private authService: AuthService) {}

     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       const token = this.authService.getToken();

       if (token) {
         const cloned = req.clone({
           headers: req.headers.set('Authorization', `Bearer ${token}`)
         });
         return next.handle(cloned);
       }
       return next.handle(req);
     }
   }
   ```

3. **Register the Interceptor**:
   Update your app.config.ts:

   ```typescript
   // src/app/app.config.ts
   import { provideHttpClient, withInterceptors } from '@angular/common/http';
   import { authInterceptor } from './interceptors/auth.interceptor';

   export const appConfig: ApplicationConfig = {
     providers: [
       // ...other providers
       provideHttpClient(withInterceptors([authInterceptor])),
     ]
   };
   ```

4. **Update API Services**:
   Ensure all API service classes use the environment configuration:

   ```typescript
   // src/app/services/customer.service.ts
   import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   import { Observable } from 'rxjs';
   import { environment } from '../../environments/environment';
   import { Customer } from '../models/customer.model';

   @Injectable({
     providedIn: 'root'
   })
   export class CustomerService {
     private apiUrl = `${environment.apiUrl}/customers`;

     constructor(private http: HttpClient) {}

     getCustomers(): Observable<Customer[]> {
       return this.http.get<Customer[]>(this.apiUrl);
     }

     // ...other methods
   }
   ```

### Testing the Connection

1. **Start the Backend**:
   ```bash
   cd /home/red/Documents/GitHub/-JEE-Spring-Angular-JWT---Digital-Banking/digitalbanking-backend
   mvn spring-boot:run
   ```

2. **Start the Frontend**:
   ```bash
   cd /home/red/Documents/GitHub/-JEE-Spring-Angular-JWT---Digital-Banking/digitalbanking-frontend
   ng serve
   ```

3. **Verify API Access**:
   - Open the browser console to check for CORS or connection errors
   - Test the API endpoints through the UI
   - Verify authentication flow works correctly

### Troubleshooting Connection Issues

- **CORS Errors**:
  - Ensure the CORS configuration allows your frontend origin
  - Check for typos in the allowed origin URL
  - Verify all needed HTTP methods are allowed

- **Authentication Issues**:
  - Confirm the JWT token is properly stored after login
  - Verify the token is correctly included in request headers
  - Check token expiration and refresh logic

- **Network Errors**:
  - Verify both applications are running on the expected ports
  - Check for any proxy settings that might interfere
  - Ensure your firewall allows the connections