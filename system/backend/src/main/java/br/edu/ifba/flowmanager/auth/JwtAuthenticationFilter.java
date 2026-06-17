package br.edu.ifba.flowmanager.auth;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import br.edu.ifba.flowmanager.modules.usuario.Usuario;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final TokenBlocklistService tokenBlocklistService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            autenticarToken(request, token);
        } catch (Exception ex) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private void autenticarToken(HttpServletRequest request, String token) {
        String email = jwtService.extrairEmail(token);

        if (email == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            return;
        }

        Usuario usuario = (Usuario) userDetailsService.loadUserByUsername(email);

        if (
            tokenBlocklistService.tokenInvalidado(token)
            || !"access".equals(jwtService.extrairTipo(token))
            || !jwtService.tokenValido(token, usuario)
        ) {
            return;
        }

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
            usuario,
            null,
            usuario.getAuthorities()
        );

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
