import * as THREE from "three";

import {
    Interactable,
} from "../interaction/Interactable.js";

import {
    createDocumentViewer,
} from "../ui/documentViewer.js";


export function createPatientFile(
    scene,
    interactionManager
) {

    // ====================================
    // DOCUMENT VIEWER
    // ====================================

    const documentViewer =
        createDocumentViewer({

            onOpen: () => {

                interactionManager.setBlocked(
                    true
                );

            },

            onClose: () => {

                interactionManager.setBlocked(
                    false
                );

            },

        });


    // ====================================
    // FILE GEOMETRY
    // ====================================

    const geometry =
        new THREE.BoxGeometry(
            0.7,
            0.05,
            0.5
        );


    const material =
        new THREE.MeshStandardMaterial({
            color: 0xcfc6b5,
            roughness: 0.9,
        });


    const file =
        new THREE.Mesh(
            geometry,
            material
        );


    file.name =
        "ward-c-patient-file";


    // ====================================
    // POSITION
    // ====================================

    // Ward C desk:
    //
    // X = 2.5
    // Z = -11
    // Top = Y 1.45
    //
    // Put the file slightly above
    // the desk surface.

    file.position.set(
        2.5,
        1.55,
        -11
    );


    file.rotation.y =
        -0.15;


    file.castShadow =
        true;

    file.receiveShadow =
        true;


    scene.add(
        file
    );


    // ====================================
    // INTERACTION
    // ====================================

    const fileInteraction =
        new Interactable({

            object:
                file,

            name:
                "Patient File",

            interactionText:
                "Press E to inspect",

            onInteract: () => {

                documentViewer.open();

            },

        });


    interactionManager.addInteractable(
        fileInteraction
    );


    // ====================================
    // RETURN
    // ====================================

    return {

        file,

        interaction:
            fileInteraction,

    };

}