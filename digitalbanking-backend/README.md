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