package br.edu.ifba.flowmanager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import br.edu.ifba.flowmanager.auth.JwtAuthenticationFilter;
import br.edu.ifba.flowmanager.auth.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(401);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write("""
                        {"status":401,"erro":"Token ausente, inválido ou expirado."}
                    """);
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(403);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write("""
                        {"status":403,"erro":"Acesso negado para este perfil."}
                    """);
                })
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/api/auth/login", "/api/auth/refresh").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/clientes/**").hasRole("ADMIN")
                .requestMatchers("/api/clientes/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/profissionais/**").hasAnyRole("ADMIN", "PROFISSIONAL", "CLIENTE")
                .requestMatchers("/api/profissionais/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/servicos/**").hasAnyRole("ADMIN", "PROFISSIONAL", "CLIENTE")
                .requestMatchers("/api/servicos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/agendamentos/**").hasAnyRole("ADMIN", "PROFISSIONAL", "CLIENTE")
                .requestMatchers(HttpMethod.POST, "/api/agendamentos/**").hasAnyRole("ADMIN", "CLIENTE")
                .requestMatchers(HttpMethod.PATCH, "/api/agendamentos/*/status").hasAnyRole("ADMIN", "PROFISSIONAL")
                .requestMatchers("/api/agendamentos/**").hasRole("ADMIN")
                .requestMatchers("/api/agenda/**").hasAnyRole("ADMIN", "PROFISSIONAL", "CLIENTE")
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
