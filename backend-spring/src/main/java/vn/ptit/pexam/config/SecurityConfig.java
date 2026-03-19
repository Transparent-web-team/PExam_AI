package vn.ptit.pexam.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import vn.ptit.pexam.security.JwtAuthFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .cors(cors -> {})  // uses CorsConfig bean
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Admin only
                .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/exams").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/exams/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/exams/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/results").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/results/exam/**").hasRole("ADMIN")
                // Everything else authenticated
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
