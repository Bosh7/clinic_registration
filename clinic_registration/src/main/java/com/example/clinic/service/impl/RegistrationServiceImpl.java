package com.example.clinic.service.impl;

import com.example.clinic.mapper.RegistrationMapper;
import com.example.clinic.model.dto.RegistrationDTO;
import com.example.clinic.model.entity.Doctor;
import com.example.clinic.model.entity.Registration;
import com.example.clinic.repository.DoctorRepository;
import com.example.clinic.repository.RegistrationRepository;
import com.example.clinic.service.RegistrationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private RegistrationMapper registrationMapper;

    @Override
    public RegistrationDTO register(RegistrationDTO dto) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(dto.getDoctorId());
        if (doctorOpt.isEmpty()) {
            throw new RuntimeException("找不到醫師 ID：" + dto.getDoctorId());
        }

        //  移除 idNumber 前後空白，避免重複掛號偵測失效
        String cleanIdNumber = dto.getIdNumber().trim();
        dto.setIdNumber(cleanIdNumber); // 覆蓋乾淨的值

        //  檢查是否重複掛號（同一天、同時段、同醫師、同識別號不得重複）
        boolean isDuplicate = registrationRepository.existsByIdTypeAndIdNumberAndDoctorIdAndRegistrationDateAndTimePeriod(
                dto.getIdType(),
                cleanIdNumber,
                dto.getDoctorId(),
                dto.getRegistrationDate(),
                dto.getTimePeriod()
        );
        if (isDuplicate) {
            throw new RuntimeException("您已在此時段掛過號，請勿重複掛號");
        }

        //  檢查該時段是否已滿
        long count = registrationRepository.countByDoctorIdAndRegistrationDateAndTimePeriod(
                dto.getDoctorId(),
                dto.getRegistrationDate(),
                dto.getTimePeriod()
        );
        if (count >= 30) {
            throw new RuntimeException("此時段掛號人數已滿，請選擇其他時段");
        }

        // 儲存掛號資料
        Registration entity = registrationMapper.toEntity(dto, doctorOpt.get());
        Registration saved = registrationRepository.save(entity);
        return registrationMapper.toDTO(saved);
    }

    @Override
    public List<RegistrationDTO> getByDoctor(Integer doctorId) {
        return registrationRepository.findByDoctorId(doctorId).stream()
                .map(registrationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegistrationDTO> getByIdTypeAndNumber(String idType, String idNumber) {
        return registrationRepository.findByIdTypeAndIdNumber(idType, idNumber)
                .stream()
                .map(registrationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegistrationDTO> getAll() {
        return registrationRepository.findAll()
                .stream()
                .map(registrationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Integer id) {
        registrationRepository.deleteById(id);
    }

    @Override
    public int countByDate(LocalDate date) {
        return registrationRepository.countByRegistrationDate(date);
    }
}
