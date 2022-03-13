package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.assembler.OrganisationModelAssembler;
import com.osoc6.OSOC6.database.models.Organisation;
import com.osoc6.OSOC6.exception.OrganisationNotFoundException;
import com.osoc6.OSOC6.repository.OrganisationRepository;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class OrganisationController {

    /**
     * The link to the database.
     */
    private final OrganisationRepository repository;

    /**
     * Assembler, used to make the API more restfull.
     */
    private final OrganisationModelAssembler assembler;

    /**
     * The constructor for for the OrganisationController.
     * @param organisationRepository the link to the database
     * @param organisationModelAssembler used to make the API more restfull
     */
    OrganisationController(final OrganisationRepository organisationRepository,
                           final OrganisationModelAssembler organisationModelAssembler) {
        this.repository = organisationRepository;
        this.assembler = organisationModelAssembler;
    }

    /**
     * Add a new organisation via a POST.
     * @param newOrganisation The organisation entity that had to be added to the database
     * @return The newly added organisation entity
     */
    @PostMapping("/organisations")
    public ResponseEntity<EntityModel<Organisation>> newOrganisation(@RequestBody final Organisation newOrganisation) {
        EntityModel<Organisation> entityModel = assembler.toModel(repository.save(newOrganisation));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()) //
                .body(entityModel);
    }

    /**
     * Get all Organisation entities.
     * @return Collection of all organisations
     */
    @GetMapping("/organisations")
    public CollectionModel<EntityModel<Organisation>> all() {
        List<EntityModel<Organisation>> organisations = repository.findAll().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(organisations, linkTo(methodOn(OrganisationController.class).all()).withSelfRel());
    }

    /**
     * Get an organisation entity by id.
     * @param id The id of the organisation that needs to be fetched from the database
     * @return The organisation entity
     */
    @GetMapping("/organisations/{id}")
    public EntityModel<Organisation> one(@PathVariable final Long id) {
        Organisation organisation = repository.findById(id)
                .orElseThrow(() -> new OrganisationNotFoundException(id));

        return assembler.toModel(organisation);

    }

    /**
     * Update an organisation entity via a PATCH request.
     * @param organisationUpdate The updated entity
     * @param id The id of the organisation that needs to be updated
     * @return The new organisation entity
     */
    @PatchMapping("/organisations/{id}")
    public ResponseEntity<EntityModel<Organisation>> updateOrganisation(
            @RequestBody final Organisation organisationUpdate, @PathVariable final Long id) {

        Organisation updatedOrganisation = repository.findById(id)
                .map(organisation -> {
                    if (organisationUpdate.getName() != null) {
                        organisation.setName(organisationUpdate.getName());
                    }

                    if (organisationUpdate.getInfo() != null) {
                        organisation.setInfo(organisationUpdate.getInfo());
                    }
                    return repository.save(organisation);
                })
                .orElseThrow(() -> new OrganisationNotFoundException(id));

        return ResponseEntity.ok(assembler.toModel(updatedOrganisation));
    }

    /**
     * Delete a organisation via a DELETE.
     * @param id The id of the organisation that needs to be deleted
     */
    @DeleteMapping("/organisations/{id}")
    public void deleteOrganisation(@PathVariable final Long id) {
        repository.deleteById(id);
    }
}
