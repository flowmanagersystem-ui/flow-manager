package br.edu.ifba.flowmanager.modules.cliente;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import br.edu.ifba.flowmanager.modules.cliente.dto.ClienteRequestDTO;
import br.edu.ifba.flowmanager.modules.cliente.dto.ClienteResponseDTO;
import br.edu.ifba.flowmanager.modules.cliente.dto.ClienteRequestUpdateDTO;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public Page<ClienteResponseDTO> listAll(
        @PageableDefault(size = 10, sort = "usuario.nome") Pageable pageable
    ) {
        return clienteService.listAll(pageable);
    }

    @GetMapping("/{id}")
    public ClienteResponseDTO findById(@PathVariable Long id) {
        return clienteService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClienteResponseDTO create(@RequestBody @Validated ClienteRequestDTO dto) {
        return clienteService.create(dto);
    }

    @PatchMapping("/{id}")
    public ClienteResponseDTO update(@PathVariable Long id, @RequestBody @Validated ClienteRequestUpdateDTO dto) {
        return clienteService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        clienteService.delete(id);
    }

    @GetMapping("/verificar-email")
    public Map<String, Boolean> verificarEmail(
        @RequestParam String email,
        @RequestParam(required = false) Long excludeId
    ) {
        return Map.of("existe", clienteService.emailExiste(email, excludeId));
    }
}