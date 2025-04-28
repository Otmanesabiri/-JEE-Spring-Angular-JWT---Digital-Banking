package ma.digitbank.jeespringangularjwtdigitalbanking.security.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.dtos.ChangePasswordRequest;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.dtos.JwtResponse;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.dtos.LoginRequest;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.dtos.SignupRequest;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.entities.AppUser;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.jwt.JwtUtils;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.service.SecurityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@Tag(name = "Authentication")
@CrossOrigin("*")
public class AuthController {
    private AuthenticationManager authenticationManager;
    private JwtUtils jwtUtils;
    private SecurityService securityService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and generate JWT token")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), roles));
    }

    @PostMapping("/signup")
    @Operation(summary = "Register a new user")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        try {
            AppUser user = securityService.saveNewUser(
                signupRequest.getUsername(), 
                signupRequest.getPassword(),
                signupRequest.getConfirmedPassword()
            );
            
            // By default, add USER role to new users
            securityService.addRoleToUser(user.getUsername(), "USER");
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/changePassword")
    @Operation(summary = "Change user password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        boolean success = securityService.changePassword(username, request.getOldPassword(), request.getNewPassword());
        
        if (success) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Old password is incorrect");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
