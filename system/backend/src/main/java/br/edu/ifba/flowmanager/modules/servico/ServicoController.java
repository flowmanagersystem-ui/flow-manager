package br.edu.ifba.flowmanager.modules.servico;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
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

import br.edu.ifba.flowmanager.modules.servico.dto.ServicoRequestDTO;
import br.edu.ifba.flowmanager.modules.servico.dto.ServicoResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/servicos")
@RequiredArgsConstructor
public class ServicoController {

    private final ServicoService servicoService;

    @GetMapping
    public Page<ServicoResponseDTO> listAll(
        @RequestParam(required = false) String nome,
        @RequestParam(required = false) String categoria,
        @PageableDefault(size = 10, sort = "nome") Pageable pageable
    ) {
        return servicoService.listAll(nome, categoria, pageable);
    }

    @GetMapping("/{id}")
    public ServicoResponseDTO findById(@PathVariable Long id) {
        return servicoService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServicoResponseDTO create(@RequestBody @Valid ServicoRequestDTO dto) {
        return servicoService.create(dto);
    }

    @PatchMapping("/{id}")
    public ServicoResponseDTO update(@PathVariable Long id, @RequestBody @Valid ServicoRequestDTO dto) {
        return servicoService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        servicoService.delete(id);
    }

    @GetMapping("/verificar-duplicidade")
    public Map<String, Boolean> verificarDuplicidade(
        @RequestParam String campo,
        @RequestParam String valor,
        @RequestParam(required = false) Long excludeId
    ) {
        return Map.of("existe", servicoService.campoJaExiste(campo, valor, excludeId));
    }

    @GetMapping("/categorias")
    public List<String> getCategorias() {
        return servicoService.getCategorias();
    }
}
