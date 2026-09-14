import * as THREE from "three";

import {
    GLTFLoader,
} from "three/examples/jsm/loaders/GLTFLoader.js";

import {
    Interactable,
} from "../interaction/Interactable.js";

import {
    updateInventoryUI,
} from "../inventory/InventoryUI.js";


export function createHospitalKey(
    scene,
    inventory,
    interactionManager
) {

    // ====================================
    // GLTF LOADER
    // ====================================

    const loader =
        new GLTFLoader();


    // ====================================
    // KEY ITEM
    // ====================================

    const keyItem = {

        id:
            "hospital_key",

        name:
            "Hospital Key",

        description:
            "An old key. The tag reads: Ward B.",

    };


    // ====================================
    // LOAD KEY MODEL
    // ====================================

    loader.load(

        "/assets/models/furniture/Key.glb",

        (gltf) => {

            const key =
                gltf.scene;


            key.name =
                "hospital-key";


            // ====================================
            // POSITION
            // ====================================

            key.position.set(
                0.5,
                1.5,
                -1
            );


            // ====================================
            // ROTATION
            // ====================================

            key.rotation.z =
                Math.PI;


            // ====================================
            // SCALE
            // ====================================

            key.scale.set(
                0.1,
                0.2,
                0.2
            );


            // ====================================
            // SHADOWS
            // ====================================

            key.traverse(
                (child) => {

                    if (
                        child.isMesh
                    ) {

                        child.castShadow =
                            true;

                        child.receiveShadow =
                            true;

                    }

                }
            );


            // ====================================
            // ADD TO SCENE
            // ====================================

            scene.add(
                key
            );


            // ====================================
            // INTERACTION
            // ====================================

            const keyInteraction =
                new Interactable({

                    object:
                        key,

                    name:
                        "Hospital Key",

                    interactionText:
                        "Press E to pick up",

                    onInteract: () => {

                        // ----------------------------
                        // ADD TO INVENTORY
                        // ----------------------------

                        inventory.addItem(
                            keyItem
                        );


                        // ----------------------------
                        // UPDATE INVENTORY UI
                        // ----------------------------

                        updateInventoryUI(
                            inventory
                        );


                        // ----------------------------
                        // REMOVE INTERACTION
                        // ----------------------------

                        interactionManager.removeInteractable(
                            keyInteraction
                        );


                        // ----------------------------
                        // REMOVE FROM WORLD
                        // ----------------------------

                        scene.remove(
                            key
                        );


                        // ----------------------------
                        // CLEAR PROMPT
                        // ----------------------------

                        interactionManager.clearInteraction();

                    },

                });


            // ====================================
            // REGISTER INTERACTION
            // ====================================

            interactionManager.addInteractable(
                keyInteraction
            );

        },


        // ====================================
        // ERROR
        // ====================================

        (error) => {

            console.error(
                "Failed to load hospital key:",
                error
            );

        }

    );

}