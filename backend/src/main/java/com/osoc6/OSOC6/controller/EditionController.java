package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.assembler.EditionModelAssembler;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.dto.EditionDTO;
import com.osoc6.OSOC6.service.EditionService;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class EditionController {

        /**
         * The link to the database.
         */
        private final EditionService service;

        /**
         * Assembler, used to make the API more restfull.
         */
        private final EditionModelAssembler assembler;

        /**
         * The constructor for the editionController.
         * @param editionService the link to the database
         * @param editionModelAssembler used to make the API more restfull
         */
        EditionController(final EditionService editionService, final EditionModelAssembler editionModelAssembler) {
            this.service = editionService;
            this.assembler = editionModelAssembler;
        }

        /**
         * Get the list of all editions.
         * @return Collection of all editions
         */
        @GetMapping("/editions")
        public CollectionModel<EntityModel<Edition>> all() {
            List<EntityModel<Edition>> editions = this.service.getAll().stream()
                    .map(assembler::toModel)
                    .collect(Collectors.toList());

            return CollectionModel.of(editions, linkTo(methodOn(EditionController.class).all()).withSelfRel());
        }

        /**
         * Add a new edition via a POST.
         * @param newEdition The edition entity that had to be added to the database
         * @return The newly added edition entity
         */
        @PostMapping("/editions")
        public ResponseEntity<EntityModel<Edition>> newProject(@Valid @RequestBody final EditionDTO newEdition) {
            EntityModel<Edition> entityModel = assembler.toModel(this.service.createEdition(newEdition));

            return ResponseEntity
                    .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()) //
                    .body(entityModel);
        }

        /**
         * Get a edition by id.
         * @param id The id of the edition that needs to be fetched from the database
         * @return The edition entity
         */
        @GetMapping("/editions/{id}")
        public EntityModel<Edition> one(@PathVariable final String id) {
            Edition edition = this.service.get(id);

            return assembler.toModel(edition);

        }

        /**
         * Update the edition via a PATCH.
         * @param editionUpdate The updated entity
         * @param id The id of the edition that needs to be updated
         * @return The new edition entity
         */
        @PatchMapping("/editions/{id}")
        public ResponseEntity<EntityModel<Edition>> updateProject(@Valid @RequestBody final EditionDTO editionUpdate,
                                                                  @PathVariable final String id) {
            Edition updatedEdition = this.service.updateEdition(editionUpdate, id);

            return ResponseEntity.ok(assembler.toModel(updatedEdition));
        }

        /**
         * Delete a edition via a DELETE.
         * @param id The id of the edition that needs to be deleted
         * @return empty response
         */
        @DeleteMapping("/editions/{id}")
        public ResponseEntity<Object> deleteProject(@PathVariable final String id) {
            this.service.deleteEdition(id);

            return ResponseEntity.ok("Project is deleted successsfully.");
        }

}

