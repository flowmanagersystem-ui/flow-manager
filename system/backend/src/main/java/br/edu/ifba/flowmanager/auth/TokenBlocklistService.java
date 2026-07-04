package br.edu.ifba.flowmanager.auth;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class TokenBlocklistService {

    private final Set<String> tokensInvalidos = ConcurrentHashMap.newKeySet();

    public void invalidar(String token) {
        if (token != null && !token.isBlank()) {
            tokensInvalidos.add(token);
        }
    }

    public boolean tokenInvalidado(String token) {
        return tokensInvalidos.contains(token);
    }
}
