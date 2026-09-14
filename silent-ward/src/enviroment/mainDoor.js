import {
    Interactable,
} from "../interaction/Interactable.js";

import {
    showMessage,
} from "../ui/interactablePrompt.js";


export function createMainDoor(
    scene,
    inventory,
    interactionManager
) {

    // ====================================
    // FIND EXISTING ROOM DOOR
    // ====================================

    const door =
        scene.getObjectByName(
            "main-room-door"
        );


    if (!door) {

        console.error(
            "Main room door not found."
        );

        return null;

    }


    // ====================================
    // STATE
    // ====================================

    let isOpen =
        false;

    let isOpening =
        false;


    // ====================================
    // INTERACTION
    // ====================================

    const doorInteraction =
        new Interactable({

            object:
                door,

            name:
                "Main Room Door",

            interactionText:
                "Press E to use access card",

            onInteract: () => {

                // --------------------------------
                // PREVENT DOUBLE INTERACTION
                // --------------------------------

                if (
                    isOpen ||
                    isOpening
                ) {

                    return;

                }


                // --------------------------------
                // CHECK ACCESS CARD
                // --------------------------------

                if (
                    !inventory.hasItem(
                        "ward_c_access_card"
                    )
                ) {

                    showMessage(
                        "The door is locked. It requires an access card."
                    );

                    return;

                }


                // --------------------------------
                // ACCESS GRANTED
                // --------------------------------

                showMessage(
                    "The access card works. The door unlocks."
                );


                isOpening =
                    true;


                openDoor();

            },

        });


    // ====================================
    // REGISTER INTERACTION
    // ====================================

    interactionManager.addInteractable(
        doorInteraction
    );


    // ====================================
    // OPEN DOOR
    // ====================================

    function openDoor() {

        const startRotation =
            door.rotation.y;


        const targetRotation =
            startRotation +
            Math.PI / 2;


        const duration =
            700;


        const startTime =
            performance.now();


        function animateDoor(
            currentTime
        ) {

            const elapsed =
                currentTime -
                startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            // --------------------------------
            // SMOOTH EASING
            // --------------------------------

            const easedProgress =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            door.rotation.y =
                startRotation +
                (
                    targetRotation -
                    startRotation
                ) *
                easedProgress;


            // --------------------------------
            // CONTINUE ANIMATION
            // --------------------------------

            if (
                progress < 1
            ) {

                requestAnimationFrame(
                    animateDoor
                );

                return;

            }


            // --------------------------------
            // COMPLETE
            // --------------------------------

            door.rotation.y =
                targetRotation;


            isOpen =
                true;

            isOpening =
                false;


            // --------------------------------
            // MARK COLLIDER AS OPEN
            // --------------------------------

            door.userData.isOpen =
                true;


            // --------------------------------
            // REMOVE INTERACTION
            // --------------------------------

            interactionManager.removeInteractable(
                doorInteraction
            );


            interactionManager.clearInteraction();


            showMessage(
                "The door is open."
            );

        }


        requestAnimationFrame(
            animateDoor
        );

    }


    // ====================================
    // RETURN
    // ====================================

    return {

        door,

        interaction:
            doorInteraction,

        isOpen: () => isOpen,

    };

}