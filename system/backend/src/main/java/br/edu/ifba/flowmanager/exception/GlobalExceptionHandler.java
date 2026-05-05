package br.edu.ifba.flowmanager.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

// config/GlobalExceptionHandler.java
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ← erros de validação (@Valid, @NotBlank, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> erros = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .toList();

        return Map.of(
            "status", 400,
            "erro", "Dados inválidos",
            "mensagens", erros
        );
    }

    // ← ResponseStatusException (NOT_FOUND, CONFLICT, etc.)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatus(ResponseStatusException ex) {
        return ResponseEntity
            .status(ex.getStatusCode())
            .body(Map.of(
                "status", ex.getStatusCode().value(),
                "erro", ex.getReason()
            ));
    }

    // ← violações de constraint do banco (UNIQUE, NOT NULL, etc.)
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, Object> handleDataIntegrity(DataIntegrityViolationException ex) {
        return Map.of(
            "status", 409,
            "erro", "Operação não permitida. Verifique os dados enviados."
        );
    }

    // ← qualquer outro erro não tratado
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, Object> handleGeneric(Exception ex) {
        return Map.of(
            "status", 500,
            "erro", "Erro interno no servidor. Tente novamente mais tarde."
        );
    }
}