package br.edu.ifba.flowmanager.modules.horarioAtendimento;

import java.time.LocalTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ifba.flowmanager.modules.horarioAtendimento.dto.HorarioAtendimentoRequestDTO;
import br.edu.ifba.flowmanager.modules.horarioAtendimento.dto.HorarioAtendimentoResponseDTO;
import br.edu.ifba.flowmanager.modules.profissional.Profissional;
import br.edu.ifba.flowmanager.modules.profissional.ProfissionalRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HorarioAtendimentoService {

    private final HorarioAtendimentoRepository horarioRepository;
    private final ProfissionalRepository profissionalRepository;

    public List<HorarioAtendimentoResponseDTO> listarPorProfissional(Long profissionalId) {
        return horarioRepository
            .findByProfissionalIdOrderByDiaSemanaAscHoraInicioAsc(profissionalId)
            .stream()
            .map(this::toDTO)
            .toList();
    }

    @Transactional
    public HorarioAtendimentoResponseDTO create(Long profissionalId, HorarioAtendimentoRequestDTO dto) {
        Profissional profissional = profissionalRepository.findById(profissionalId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Profissional não encontrado."));

        validarHorario(dto.horaInicio(), dto.horaFim());
        verificarConflito(profissionalId, dto.diaSemana(), dto.horaInicio(), dto.horaFim(), null);

        HorarioAtendimento horario = new HorarioAtendimento();
        horario.setProfissional(profissional);
        horario.setDiaSemana(dto.diaSemana());
        horario.setHoraInicio(dto.horaInicio());
        horario.setHoraFim(dto.horaFim());

        return toDTO(horarioRepository.save(horario));
    }

    @Transactional
    public HorarioAtendimentoResponseDTO update(Long profissionalId, Long id, HorarioAtendimentoRequestDTO dto) {
        HorarioAtendimento horario = buscarOuLancar(id);

        validarHorario(dto.horaInicio(), dto.horaFim());
        verificarConflito(profissionalId, dto.diaSemana(), dto.horaInicio(), dto.horaFim(), id);

        horario.setDiaSemana(dto.diaSemana());
        horario.setHoraInicio(dto.horaInicio());
        horario.setHoraFim(dto.horaFim());

        return toDTO(horarioRepository.save(horario));
    }

    @Transactional
    public void delete(Long id) {
        horarioRepository.delete(buscarOuLancar(id));
    }

    // ── privados ──────────────────────────────────────────────

    private void validarHorario(LocalTime inicio, LocalTime fim) {
        if (!inicio.isBefore(fim)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Hora de início deve ser anterior à hora de fim.");
        }
    }

    private void verificarConflito(Long profissionalId, DiaSemana dia,
        LocalTime inicio, LocalTime fim, Long excludeId) {
        if (horarioRepository.existeConflito(profissionalId, dia, inicio, fim, excludeId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Já existe um horário cadastrado neste período para este dia.");
        }
    }

    private HorarioAtendimento buscarOuLancar(Long id) {
        return horarioRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Horário não encontrado."));
    }

    private HorarioAtendimentoResponseDTO toDTO(HorarioAtendimento h) {
        return new HorarioAtendimentoResponseDTO(
            h.getId(),
            h.getDiaSemana(),
            h.getHoraInicio(),
            h.getHoraFim()
        );
    }
}