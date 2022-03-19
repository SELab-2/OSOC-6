package com.osoc6.OSOC6.service;

import com.osoc6.OSOC6.database.models.SkillType;
import com.osoc6.OSOC6.dto.SkillTypeDTO;
import com.osoc6.OSOC6.exception.skillType.IllegalSkillTypeEditException;
import com.osoc6.OSOC6.exception.skillType.SkillTypeNotFoundException;
import com.osoc6.OSOC6.repository.SkillTypeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SkillTypeService {

    /**
     * The link to the database.
     */
    private final SkillTypeRepository repository;

    /**
     * Handle the post request.
     * @param skillTypeDTO The skillType that needs to be added to the database
     * @return added skillType
     */
    public SkillType createSkillType(final SkillTypeDTO skillTypeDTO) {
        SkillType newSkillType = new SkillType(skillTypeDTO.getName(), skillTypeDTO.getColour());
        repository.save(newSkillType);
        return newSkillType;
    }

    /**
     * Handle the delete request.
     * @param id The id of the skillType that needs to be deleted
     */
    public void deleteSkillType(final String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new SkillTypeNotFoundException(id);
        }
    }

    /**
     * Handle the get request on /skillTypes.
     * @return List with all skillTypes
     */
    public List<SkillType> getAll() {
        return repository.findAll();
    }

    /**
     * Handle the get request.
     * @param id The id of the skillType that needs to be fetched
     * @return the requested skillType
     */
    public SkillType get(final String id) {
        return repository.findById(id).orElseThrow(() -> new SkillTypeNotFoundException(id));
    }

    /**
     * Handle the patch request.
     * @param skillTypeDTO The skillType with what /skillTypes/id needs to be replaced with
     * @param id The id of the skillType that needs to be replaced
     * @return the new skillType
     */
    public SkillType updateSkillType(final SkillTypeDTO skillTypeDTO, final String id) {
        if (! id.equals(skillTypeDTO.getName())) {
            throw new IllegalSkillTypeEditException("name");
        }
        return repository.findById(id)
                .map(skillType -> {
                    skillType.setColour(skillTypeDTO.getColour());
                    return repository.save(skillType);
                })
                .orElseThrow(() -> new SkillTypeNotFoundException(id));
    }
}
