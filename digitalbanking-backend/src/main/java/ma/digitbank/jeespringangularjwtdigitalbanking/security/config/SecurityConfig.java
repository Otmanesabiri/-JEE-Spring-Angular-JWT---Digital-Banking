package ma.digitbank.jeespringangularjwtdigitalbanking.security.config;

import lombok.RequiredArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(req -> 
                req.requestMatchers(
                       "/api/auth/**", 
                       "/h2-console/**", 
                       "/swagger-ui/**", 
                       "/swagger-ui.html",
                       "/v3/api-docs/**",
                       "/api/customers/**", // Temporarily allowing access for testing
                       "/api/accounts/**"   // Temporarily allowing access for testing
                   )
                   .permitAll()
                   .anyRequest()
                   .authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .headers(headers -> headers.frameOptions().disable()); // For H2 console

        return http.build();
    }
}
