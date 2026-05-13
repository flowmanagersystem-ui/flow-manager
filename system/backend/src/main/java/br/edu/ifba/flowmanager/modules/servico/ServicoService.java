package br.edu.ifba.flowmanager.modules.servico;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ifba.flowmanager.modules.servico.dto.ServicoRequestDTO;
import br.edu.ifba.flowmanager.modules.servico.dto.ServicoResponseDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicoService {

    private final ServicoRepository servicoRepository;

    public Page<ServicoResponseDTO> listAll(String nome, String categoria, Pageable pageable) {
        return servicoRepository.findWithFilters(nome, categoria, pageable)
                .map(this::toDTO);
    }

    public ServicoResponseDTO findById(Long id) {
        return toDTO(buscarOuLancar(id));
    }

    public List<String> getCategorias() {
        return servicoRepository.findCategorias();
    }

    @Transactional
    public ServicoResponseDTO create(ServicoRequestDTO dto) {
        if (servicoRepository.existsByNome(dto.nome())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Serviço já cadastrado.");
        }

        Servico servico = new Servico();
        preencher(servico, dto);

        return toDTO(servicoRepository.save(servico));
    }

    @Transactional
    public ServicoResponseDTO update(Long id, ServicoRequestDTO dto) {
        Servico servico = buscarOuLancar(id);

        if (servicoRepository.existsByNomeAndIdNot(dto.nome(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um serviço com esse nome.");
        }

        preencher(servico, dto);
        return toDTO(servicoRepository.save(servico));
    }

    @Transactional
    public void delete(Long id) {
        Servico servico = buscarOuLancar(id);
        try {
            servicoRepository.delete(servico);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Serviço não pode ser removido pois está vinculado a profissionais ou agendamentos.");
        }
    }

    private Servico buscarOuLancar(Long id) {
        return servicoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço não encontrado."));
    }

    public boolean campoJaExiste(String campo, String valor, Long excludeId) {
        return switch (campo) {
            case "nome"      -> excludeId != null
                ? servicoRepository.existsByNomeIgnoreCaseAndIdNot(valor, excludeId)
                : servicoRepository.existsByNomeIgnoreCase(valor);
            case "categoria" -> excludeId != null
                ? servicoRepository.existsByCategoriaIgnoreCaseAndIdNot(valor, excludeId)
                : servicoRepository.existsByCategoriaIgnoreCase(valor);
            default -> throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Campo inválido para verificação: " + campo);
        };
    }

    private void preencher(Servico servico, ServicoRequestDTO dto) {
        servico.setNome(dto.nome());
        servico.setDescricao(dto.descricao());
        servico.setCategoria(dto.categoria());
        servico.setDuracao(dto.duracao());
        servico.setValor(dto.valor());
    }

    private ServicoResponseDTO toDTO(Servico servico) {
        return new ServicoResponseDTO(
            servico.getId(),
            servico.getNome(),
            servico.getDescricao(),
            servico.getCategoria(),
            servico.getDuracao(),
            servico.getValor()
        );
    }
}