import * as THREE from "three";

import {
    showInteractionPrompt,
    hideInteractionPrompt,
    setCrosshairActive,
    setCrosshairInactive,
} from "../ui/interactablePrompt.js";


export class InteractionManager {

    constructor({
        camera,
        scene,
    }) {

        // ====================================
        // CORE
        // ====================================

        this.camera =
            camera;

        this.scene =
            scene;

        this.isBlocked =
            false;


        // ====================================
        // RAYCASTER
        // ====================================

        this.raycaster =
            new THREE.Raycaster();


        // ====================================
        // INTERACTABLES
        // ====================================

        this.interactables =
            [];

        this.currentInteractable =
            null;


        // ====================================
        // SETTINGS
        // ====================================

        this.maxDistance =
            5;


        this.prompt =
            null;


        // ====================================
        // HIGHLIGHT SYSTEM
        // ====================================

        this.highlightedObject =
            null;

        this.highlightMaterials =
            new Map();

        this.highlightStrength =
            0;

        this.highlightTarget =
            0;


        // ====================================
        // INPUT
        // ====================================

        this.setupInput();

    }


    // ====================================
    // BLOCK INTERACTION
    // ====================================

    setBlocked(
        blocked
    ) {

        this.isBlocked =
            blocked;


        if (
            blocked
        ) {

            this.clearInteraction();

        }

    }


    // ====================================
    // PROMPT
    // ====================================

    setPrompt(
        prompt
    ) {

        this.prompt =
            prompt;

    }


    // ====================================
    // ADD INTERACTABLE
    // ====================================

    addInteractable(
        interactable
    ) {

        if (
            !interactable
        ) {

            return;

        }


        this.interactables.push(
            interactable
        );

    }


    // ====================================
    // INPUT
    // ====================================

    setupInput() {

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.code === "KeyE" &&
                    !event.repeat
                ) {

                    this.interact();

                }

            }
        );

    }


    // ====================================
    // UPDATE
    // ====================================

    update() {

        // ------------------------------------
        // HIGHLIGHT ANIMATION
        // ------------------------------------

        this.updateHighlight();


        // ------------------------------------
        // BLOCKED
        // ------------------------------------

        if (
            this.isBlocked
        ) {

            return;

        }


        // ------------------------------------
        // CAMERA CHECK
        // ------------------------------------

        if (
            !this.camera
        ) {

            return;

        }


        // ====================================
        // RAYCAST FROM SCREEN CENTER
        // ====================================

        this.raycaster.setFromCamera(
            new THREE.Vector2(
                0,
                0
            ),
            this.camera
        );


        // ====================================
        // GET INTERACTABLE OBJECTS
        // ====================================

        const objects =
            this.interactables.map(
                (item) =>
                    item.object
            );


        // ====================================
        // RAYCAST
        // ====================================

        const intersections =
            this.raycaster.intersectObjects(
                objects,
                true
            );


        // ====================================
        // NOTHING HIT
        // ====================================

        if (
            intersections.length === 0
        ) {

            this.clearInteraction();

            return;

        }


        // ====================================
        // CLOSEST HIT
        // ====================================

        const hit =
            intersections[0];


        // ====================================
        // DISTANCE CHECK
        // ====================================

        if (
            hit.distance >
            this.maxDistance
        ) {

            this.clearInteraction();

            return;

        }


        // ====================================
        // FIND INTERACTABLE
        // ====================================

        const interactable =
            this.findInteractable(
                hit.object
            );


        if (
            !interactable
        ) {

            this.clearInteraction();

            return;

        }


        // ====================================
        // SET CURRENT
        // ====================================

        this.currentInteractable =
            interactable;


        // ====================================
        // HIGHLIGHT
        // ====================================

        this.setHighlightedObject(
            interactable.object
        );


        // ====================================
        // PROMPT
        // ====================================

        showInteractionPrompt(
            this.prompt,
            interactable.interactionText
        );


        // ====================================
        // CROSSHAIR
        // ====================================

        setCrosshairActive();

    }


    // ====================================
    // FIND INTERACTABLE
    // ====================================

    findInteractable(
        object
    ) {

        let current =
            object;


        while (
            current
        ) {

            const interactable =
                this.interactables.find(
                    (item) =>
                        item.object ===
                        current
                );


            if (
                interactable
            ) {

                return interactable;

            }


            current =
                current.parent;

        }


        return null;

    }


    // ====================================
    // SET HIGHLIGHT
    // ====================================

    setHighlightedObject(
        object
    ) {

        // ------------------------------------
        // ALREADY HIGHLIGHTED
        // ------------------------------------

        if (
            this.highlightedObject ===
            object
        ) {

            this.highlightTarget =
                1;

            return;

        }


        // ------------------------------------
        // REMOVE PREVIOUS
        // ------------------------------------

        this.removeHighlight();


        // ------------------------------------
        // SET CURRENT
        // ------------------------------------

        this.highlightedObject =
            object;

        this.highlightTarget =
            1;


        // ====================================
        // TRAVERSE OBJECT
        // ====================================

        object.traverse(
            (child) => {

                if (
                    !child.isMesh
                ) {

                    return;

                }


                if (
                    !child.material
                ) {

                    return;

                }


                // ==================================
                // MATERIAL ARRAY
                // ==================================

                const materials =
                    Array.isArray(
                        child.material
                    )
                        ? child.material
                        : [
                            child.material
                        ];


                const clonedMaterials =
                    materials.map(
                        (material) => {

                            // --------------------------------
                            // MATERIAL WITHOUT EMISSIVE
                            // --------------------------------

                            if (
                                !material.emissive
                            ) {

                                return material;

                            }


                            // --------------------------------
                            // CLONE MATERIAL
                            // --------------------------------

                            const clone =
                                material.clone();


                            // --------------------------------
                            // SAVE ORIGINAL
                            // --------------------------------

                            this.highlightMaterials.set(
                                clone,
                                {

                                    mesh:
                                        child,

                                    original:
                                        material,

                                    originalEmissive:
                                        material.emissive.clone(),

                                    originalIntensity:
                                        material.emissiveIntensity,

                                }
                            );


                            return clone;

                        }
                    );


                // ==================================
                // APPLY CLONED MATERIALS
                // ==================================

                child.material =
                    Array.isArray(
                        child.material
                    )
                        ? clonedMaterials
                        : clonedMaterials[0];

            }
        );

    }


    // ====================================
    // UPDATE HIGHLIGHT
    // ====================================

    updateHighlight() {

        // ====================================
        // TARGET
        // ====================================

        if (
            this.highlightedObject
        ) {

            this.highlightTarget =
                1;

        }
        else {

            this.highlightTarget =
                0;

        }


        // ====================================
        // SMOOTH TRANSITION
        // ====================================

        this.highlightStrength +=
            (
                this.highlightTarget -
                this.highlightStrength
            ) *
            0.15;


        // ====================================
        // PULSE
        // ====================================

        const pulse =
            0.5 +
            (
                Math.sin(
                    performance.now() *
                    0.0025
                ) *
                0.5
            );


        const intensity =
            this.highlightStrength *
            pulse *
            0.12;


        // ====================================
        // APPLY
        // ====================================

        this.highlightMaterials.forEach(
            (
                data,
                material
            ) => {

                if (
                    !material.emissive
                ) {

                    return;

                }


                // --------------------------------
                // GLOW COLOR
                // --------------------------------

                material.emissive.set(
                    0x6f6f55
                );


                // --------------------------------
                // GLOW INTENSITY
                // --------------------------------

                material.emissiveIntensity =
                    data.originalIntensity +
                    intensity;

            }
        );


        // ====================================
        // REMOVE AFTER FADE
        // ====================================

        if (
            this.highlightStrength <
            0.01 &&
            this.highlightTarget ===
            0
        ) {

            this.removeHighlight();

        }

    }


    // ====================================
    // REMOVE HIGHLIGHT
    // ====================================

    removeHighlight() {

        // ====================================
        // RESTORE MATERIALS
        // ====================================

        this.highlightMaterials.forEach(
            (
                data,
                clonedMaterial
            ) => {

                const mesh =
                    data.mesh;


                if (
                    !mesh
                ) {

                    return;

                }


                // ==================================
                // MATERIAL ARRAY
                // ==================================

                if (
                    Array.isArray(
                        mesh.material
                    )
                ) {

                    const index =
                        mesh.material.indexOf(
                            clonedMaterial
                        );


                    if (
                        index !== -1
                    ) {

                        mesh.material[index] =
                            data.original;

                    }

                }

                // ==================================
                // SINGLE MATERIAL
                // ==================================

                else if (
                    mesh.material ===
                    clonedMaterial
                ) {

                    mesh.material =
                        data.original;

                }


                // ==================================
                // DISPOSE CLONE
                // ==================================

                clonedMaterial.dispose();

            }
        );


        // ====================================
        // RESET
        // ====================================

        this.highlightMaterials.clear();

        this.highlightedObject =
            null;

        this.highlightStrength =
            0;

    }


    // ====================================
    // REMOVE INTERACTABLE
    // ====================================

    removeInteractable(
        interactable
    ) {

        const index =
            this.interactables.indexOf(
                interactable
            );


        if (
            index === -1
        ) {

            return;

        }


        this.interactables.splice(
            index,
            1
        );


        // ------------------------------------
        // CLEAR CURRENT
        // ------------------------------------

        if (
            this.currentInteractable ===
            interactable
        ) {

            this.clearInteraction();

        }

    }


    // ====================================
    // CLEAR INTERACTION
    // ====================================

    clearInteraction() {

        this.currentInteractable =
            null;


        // ------------------------------------
        // REMOVE HIGHLIGHT
        // ------------------------------------

        this.highlightTarget =
            0;


        if (
            this.prompt
        ) {
            hideInteractionPrompt(
                this.prompt
            );
        }
        setCrosshairInactive();
    }
    // ====================================
    // INTERACT
    // ====================================

    interact() {
        if (
            this.isBlocked
        ) {
            return;
        }
        if (
            !this.currentInteractable
        ) {
            return;
        }
        this.currentInteractable.interact();

    }

}