package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.assembler.SkillTypeModelAssembler;
import com.osoc6.OSOC6.database.models.SkillType;
import com.osoc6.OSOC6.dto.SkillTypeDTO;
import com.osoc6.OSOC6.service.SkillTypeService;
import lombok.AllArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@AllArgsConstructor
public class SkillTypeController {

    /**
     * The link to the database.
     */
    private final SkillTypeService service;

    /**
     * Assembler, used to make the API more restfull.
     */
    private final SkillTypeModelAssembler assembler;

    /**
     * Get the list of all editions.
     * @return Collection of all editions
     */
    @GetMapping("/skillTypes")
    public CollectionModel<EntityModel<SkillType>> all() {
        List<EntityModel<SkillType>> skillTypes = this.service.getAll().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(skillTypes, linkTo(methodOn(EditionController.class).all()).withSelfRel());
    }

    /**
     * Add a new edition via a POST.
     * @param newEdition The edition entity that had to be added to the database
     * @return The newly added edition entity
     */
    @PostMapping("/skillTypes")
    public ResponseEntity<EntityModel<SkillType>> newProject(@Valid @RequestBody final SkillTypeDTO newSkillType) {
        EntityModel<SkillType> entityModel = assembler.toModel(this.service.createSkillType(newSkillType));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()) //
                .body(entityModel);
    }

    /**
     * Get a skillType by it's id.
     * @param id The id of the edition that needs to be fetched from the database
     * @return The edition entity
     */
    @GetMapping("/skillTypes/{id}")
    public EntityModel<SkillType> one(@PathVariable final String id) {
        SkillType skillType = this.service.get(id);

        return assembler.toModel(skillType);

    }

    /**
     * Update the edition via a PATCH.
     * @param editionUpdate The updated entity
     * @param id The id of the edition that needs to be updated
     * @return The new edition entity
     */
    @PatchMapping("/skillTypes/{id}")
    public ResponseEntity<EntityModel<SkillType>> updateProject(@Valid @RequestBody final SkillTypeDTO skillTypeUpdate,
                                                              @PathVariable final String id) {
        SkillType updatedEdition = this.service.updateSkillType(skillTypeUpdate, id);

        return ResponseEntity.ok(assembler.toModel(updatedEdition));
    }

    /**
     * Delete a edition via a DELETE.
     * @param id The id of the edition that needs to be deleted
     * @return empty response
     */
    @DeleteMapping("/skillTypes/{id}")
    public ResponseEntity<Object> deleteProject(@PathVariable final String id) {
        this.service.deleteSkillType(id);

        return ResponseEntity.ok("Project is deleted successsfully.");
    }

}

