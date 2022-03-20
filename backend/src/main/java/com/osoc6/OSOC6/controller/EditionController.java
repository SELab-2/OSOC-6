package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.assembler.EditionModelAssembler;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.dto.EditionDTO;
import com.osoc6.OSOC6.service.EditionService;
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
         * Get the list of all editions.
         * @return Collection of all editions
         */
        @GetMapping("/editions")
        public CollectionModel<EntityModel<Edition>> all() {
            List<EntityModel<Edition>> editions = service.getAll().stream()
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
        public ResponseEntity<EntityModel<Edition>> newEdition(@Valid @RequestBody final EditionDTO newEdition) {
            EntityModel<Edition> entityModel = assembler.toModel(service.createEdition(newEdition));

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
            Edition edition = service.get(id);

            return assembler.toModel(edition);

        }

        /**
         * Update the edition via a PATCH.
         * @param editionUpdate The updated entity
         * @param id The id of the edition that needs to be updated
         * @return The new edition entity
         */
        @PatchMapping("/editions/{id}")
        public ResponseEntity<EntityModel<Edition>> updateEdition(@Valid @RequestBody final EditionDTO editionUpdate,
                                                                  @PathVariable final String id) {
            Edition updatedEdition = service.updateEdition(editionUpdate, id);

            return ResponseEntity.ok(assembler.toModel(updatedEdition));
        }

        /**
         * Delete a edition via a DELETE.
         * @param id The id of the edition that needs to be deleted
         * @return empty response
         */
        @DeleteMapping("/editions/{id}")
        public ResponseEntity<Object> deleteEdition(@PathVariable final String id) {
            service.deleteEdition(id);

            return ResponseEntity.ok("Edition is deleted successsfully.");
        }

}

