package com.osoc6.OSOC6.service;

import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.dto.EditionDTO;
import com.osoc6.OSOC6.exception.EditionNotFoundException;
import com.osoc6.OSOC6.repository.EditionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EditionService {

    /**
     * The link to the database.
     */
    private final EditionRepository repository;

    /**
     * Constructor for the EditionService, needs a link to database.
     * @param newRepository Connection to database
     */
    public EditionService(final EditionRepository newRepository) {
        this.repository = newRepository;
    }

    /**
     * Handle the post request.
     * @param editionDTO The edition that needs to be added to the database
     * @return added edition
     */
    public Edition createEdition(final EditionDTO editionDTO) {
        Edition newEdition = new Edition(editionDTO.getName(),
                                        editionDTO.getYear(),
                                        editionDTO.isActive());
        repository.save(newEdition);
        return newEdition;
    }

    /**
     * Handle the delete request.
     * @param id The id of the edition that needs to be deleted
     */
    public void deleteEdition(final String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new EditionNotFoundException(id);
        }
    }

    /**
     * Handle the get request on /editions.
     * @return List with all editions
     */
    public List<Edition> getAll() {
        return repository.findAll();
    }

    /**
     * Handle the get request.
     * @param id The id of the edition that needs to be fetched
     * @return the requested edition
     */
    public Edition get(final String id) {
        return repository.findById(id).orElseThrow(() -> new EditionNotFoundException(id));
    }

    /**
     * Handle the patch request.
     * @param editionDTO The edition with what /editions/id needs to be replaced with
     * @param id The id of the edition that needs to be replaced
     * @return the new edition
     */
    public Edition updateEdition(final EditionDTO editionDTO, final String id) {
        return repository.findById(id)
                .map(edition -> {
                    edition.setName(editionDTO.getName());
                    edition.setActive(editionDTO.isActive());
                    edition.setYear(editionDTO.getYear());

                    return repository.save(edition);
                })
                .orElseThrow(() -> new EditionNotFoundException(id));
    }
}
