package br.edu.ifba.flowmanager.modules.agendamento;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ifba.flowmanager.modules.agendamento.dto.AgendamentoRequestDTO;
import br.edu.ifba.flowmanager.modules.agendamento.dto.AgendamentoResponseDTO;
import br.edu.ifba.flowmanager.modules.agendamento.dto.AgendamentoServicoDTO;
import br.edu.ifba.flowmanager.modules.agendamento.dto.AgendamentoServicoResponseDTO;
import br.edu.ifba.flowmanager.modules.cliente.Cliente;
import br.edu.ifba.flowmanager.modules.cliente.ClienteRepository;
import br.edu.ifba.flowmanager.modules.profissional.Profissional;
import br.edu.ifba.flowmanager.modules.profissional.ProfissionalRepository;
import br.edu.ifba.flowmanager.modules.profissional.ProfissionalServicoId;
import br.edu.ifba.flowmanager.modules.profissional.ProfissionalServicoRepository;
import br.edu.ifba.flowmanager.modules.servico.Servico;
import br.edu.ifba.flowmanager.modules.servico.ServicoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final ClienteRepository clienteRepository;
    private final ProfissionalRepository profissionalRepository;
    private final ProfissionalServicoRepository profissionalServicoRepository;
    private final ServicoRepository servicoRepository;

    public Page<AgendamentoResponseDTO> listAll(
        Long clienteId, StatusAgendamento status,
        LocalDateTime dataInicio, LocalDateTime dataFim,
        Pageable pageable
    ) {
        return agendamentoRepository
            .findWithFilters(clienteId, status, dataInicio, dataFim, pageable)
            .map(this::toDTO);
    }

    public AgendamentoResponseDTO findById(Long id) {
        return toDTO(buscarOuLancar(id));
    }

    @Transactional
    public AgendamentoResponseDTO create(AgendamentoRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.clienteId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));

        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(cliente);
        agendamento.setDataHora(dto.dataHora());
        agendamento.setStatus(dto.status() != null ? dto.status() : StatusAgendamento.AGENDADO);
        agendamento.setObservacao(dto.observacao());
        agendamento.setDesconto(dto.desconto() != null ? dto.desconto() : BigDecimal.ZERO);

        BigDecimal valorTotal = processarServicos(agendamento, dto.servicos(), null);
        agendamento.setValorTotal(valorTotal);

        return toDTO(agendamentoRepository.save(agendamento));
    }

    @Transactional
    public AgendamentoResponseDTO update(Long id, AgendamentoRequestDTO dto) {
        Agendamento agendamento = buscarOuLancar(id);

        agendamento.setDataHora(dto.dataHora());
        agendamento.setStatus(dto.status());
        agendamento.setObservacao(dto.observacao());
        agendamento.setDesconto(dto.desconto() != null ? dto.desconto() : BigDecimal.ZERO);
        agendamento.getServicos().clear();

        BigDecimal valorTotal = processarServicos(agendamento, dto.servicos(), id);
        agendamento.setValorTotal(valorTotal);

        return toDTO(agendamentoRepository.save(agendamento));
    }

    @Transactional
    public void delete(Long id) {
        agendamentoRepository.delete(buscarOuLancar(id));
    }

    // ── privados ─────────────────────────────────────────────

    private BigDecimal processarServicos(
        Agendamento agendamento,
        List<AgendamentoServicoDTO> servicosDTO,
        Long excludeId
    ) {
        BigDecimal total = BigDecimal.ZERO;

        for (AgendamentoServicoDTO s : servicosDTO) {
            // verifica se profissional existe
            Profissional profissional = profissionalRepository.findById(s.profissionalId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Profissional não encontrado: " + s.profissionalId()));

            // verifica se serviço existe
            Servico servico = servicoRepository.findById(s.servicoId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Serviço não encontrado: " + s.servicoId()));

            // verifica se profissional está habilitado para o serviço
            ProfissionalServicoId psId = new ProfissionalServicoId(s.profissionalId(), s.servicoId());
            if (!profissionalServicoRepository.existsById(psId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Profissional não habilitado para o serviço: " + servico.getNome());
            }

            // verifica conflito de horário
            if (agendamentoRepository.existeConflito(s.profissionalId(), agendamento.getDataHora(), excludeId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Profissional já possui agendamento neste horário.");
            }

            AgendamentoServico as = new AgendamentoServico();
            as.setId(new AgendamentoServicoId(agendamento.getId(), s.profissionalId(), s.servicoId()));
            as.setAgendamento(agendamento);
            as.setProfissional(profissional);
            as.setServico(servico);

            agendamento.getServicos().add(as);
            total = total.add(servico.getValor());
        }

        // aplica desconto
        BigDecimal desconto = agendamento.getDesconto() != null
            ? agendamento.getDesconto() : BigDecimal.ZERO;

        return total.subtract(desconto).max(BigDecimal.ZERO);
    }

    private Agendamento buscarOuLancar(Long id) {
        return agendamentoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Agendamento não encontrado."));
    }

    private AgendamentoResponseDTO toDTO(Agendamento a) {
        List<AgendamentoServicoResponseDTO> servicos = a.getServicos().stream()
            .map(s -> new AgendamentoServicoResponseDTO(
                s.getProfissional().getId(),
                s.getProfissional().getUsuario().getNome(),
                s.getServico().getId(),
                s.getServico().getNome(),
                s.getServico().getValor(),
                s.getServico().getDuracao()
            )).toList();

        return new AgendamentoResponseDTO(
            a.getId(),
            a.getCliente().getId(),
            a.getCliente().getUsuario().getNome(),
            a.getDataHora(),
            a.getStatus(),
            a.getObservacao(),
            a.getDesconto(),
            a.getValorTotal(),
            servicos
        );
    }
}
