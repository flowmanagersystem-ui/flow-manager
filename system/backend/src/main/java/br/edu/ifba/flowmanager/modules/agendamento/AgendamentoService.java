package br.edu.ifba.flowmanager.modules.agendamento;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ifba.flowmanager.modules.agendamento.dto.AgendamentoRequestDTO;
import br.edu.ifba.flowmanager.modules.agendamento.dto.AgendamentoResponseDTO;
import br.edu.ifba.flowmanager.modules.agendamento.dto.AgendamentoServicoDTO;
import br.edu.ifba.flowmanager.modules.agendamento.dto.AgendamentoServicoResponseDTO;
import br.edu.ifba.flowmanager.modules.cliente.ClienteRepository;
import br.edu.ifba.flowmanager.modules.cliente.Cliente;
import br.edu.ifba.flowmanager.modules.profissional.Profissional;
import br.edu.ifba.flowmanager.modules.profissional.ProfissionalRepository;
import br.edu.ifba.flowmanager.modules.profissional.ProfissionalServicoId;
import br.edu.ifba.flowmanager.modules.profissional.ProfissionalServicoRepository;
import br.edu.ifba.flowmanager.modules.servico.Servico;
import br.edu.ifba.flowmanager.modules.servico.ServicoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final ClienteRepository clienteRepository;
    private final ProfissionalRepository profissionalRepository;
    private final ProfissionalServicoRepository profissionalServicoRepository;
    private final ServicoRepository servicoRepository;

    // ── listagem ──────────────────────────────────────────────

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

    // ── create ────────────────────────────────────────────────
    @Transactional
    public AgendamentoResponseDTO create(AgendamentoRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.clienteId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Cliente não encontrado."));

        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(cliente);
        agendamento.setStatus(dto.status() != null ? dto.status() : StatusAgendamento.AGENDADO);
        agendamento.setObservacao(dto.observacao());
        agendamento.setDesconto(dto.desconto() != null ? dto.desconto() : BigDecimal.ZERO);
        agendamento.setDataHora(dto.servicos().get(0).dataHoraInicio());
        agendamento.setValorTotal(BigDecimal.ZERO); // ← valor provisório para o primeiro save

        Agendamento salvo = agendamentoRepository.save(agendamento);

        BigDecimal valorTotal = processarServicos(salvo, dto.servicos(), null);
        salvo.setValorTotal(valorTotal); // ← atualiza com o valor real

        return toDTO(agendamentoRepository.save(salvo)); // ← segundo save com valor correto
    }

    // ── update ────────────────────────────────────────────────

    @Transactional
    public AgendamentoResponseDTO update(Long id, AgendamentoRequestDTO dto) {
        Agendamento agendamento = buscarOuLancar(id);

        agendamento.setStatus(dto.status());
        agendamento.setObservacao(dto.observacao());
        agendamento.setDesconto(dto.desconto() != null ? dto.desconto() : BigDecimal.ZERO);
        agendamento.setDataHora(dto.servicos().get(0).dataHoraInicio());
        agendamento.getServicos().clear();

        BigDecimal valorTotal = processarServicos(agendamento, dto.servicos(), id);
        agendamento.setValorTotal(valorTotal);

        return toDTO(agendamentoRepository.save(agendamento));
    }

    // ── delete ────────────────────────────────────────────────

    @Transactional
    public void delete(Long id) {
        agendamentoRepository.delete(buscarOuLancar(id));
    }

    // ── processarServicos ─────────────────────────────────────
    // processa cada serviço do agendamento:
    // - valida profissional habilitado
    // - verifica conflito de horário com data real
    // - calcula data_hora_fim baseado na duração
    // - encadeia serviços do mesmo profissional

    private BigDecimal processarServicos(
        Agendamento agendamento,
        List<AgendamentoServicoDTO> servicosDTO,
        Long excludeId
    ) {
        BigDecimal total = BigDecimal.ZERO;

        for (AgendamentoServicoDTO s : servicosDTO) {

            Profissional profissional = profissionalRepository.findById(s.profissionalId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Profissional não encontrado: " + s.profissionalId()));

            Servico servico = servicoRepository.findById(s.servicoId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Serviço não encontrado: " + s.servicoId()));

            // valida habilitação profissional → serviço
            ProfissionalServicoId psId = new ProfissionalServicoId(s.profissionalId(), s.servicoId());
            if (!profissionalServicoRepository.existsById(psId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Profissional não habilitado para o serviço: " + servico.getNome());
            }

            // calcula data_hora_fim com base na duração do serviço
            LocalDateTime dataHoraInicio = s.dataHoraInicio();
            LocalDateTime dataHoraFim = dataHoraInicio.plusMinutes(servico.getDuracao());

            // verifica conflito com horários reais
            if (agendamentoRepository.existeConflito(
                s.profissionalId(), dataHoraInicio, dataHoraFim, excludeId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    String.format("Profissional %s já possui agendamento entre %s e %s.",
                        profissional.getUsuario().getNome(),
                        dataHoraInicio, dataHoraFim));
            }

            AgendamentoServico as = new AgendamentoServico();
            as.setId(new AgendamentoServicoId(
                agendamento.getId(), s.profissionalId(), s.servicoId()));
            as.setAgendamento(agendamento);
            as.setProfissional(profissional);
            as.setServico(servico);
            as.setDataHoraInicio(dataHoraInicio);
            as.setDataHoraFim(dataHoraFim);

            agendamento.getServicos().add(as);
            total = total.add(servico.getValor());
        }

        // aplica desconto
        BigDecimal desconto = agendamento.getDesconto() != null
            ? agendamento.getDesconto() : BigDecimal.ZERO;

        return total.subtract(desconto).max(BigDecimal.ZERO);
    }

    // ── utilitários ───────────────────────────────────────────

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
                s.getServico().getDuracao(),
                s.getDataHoraInicio(),
                s.getDataHoraFim()
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