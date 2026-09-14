import * as THREE from "three";

import {
    Interactable,
} from "../interaction/Interactable.js";

import {
    createKeypad,
} from "../ui/keypad.js";


// ====================================
// CREATE BOX
// ====================================

function createBox(
    width,
    height,
    depth,
    material,
    x,
    y,
    z
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );


    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    mesh.position.set(
        x,
        y,
        z
    );


    mesh.castShadow =
        true;

    mesh.receiveShadow =
        true;


    return mesh;

}


// ====================================
// CREATE LOCKED DRAWER
// ====================================

export function createLockedDrawer(
    scene,
    interactionManager,
    wardCAccessCard
) {

    // ====================================
    // DRAWER GROUP
    // ====================================

    const drawer =
        new THREE.Group();


    drawer.name =
        "ward-c-locked-drawer";


    // ====================================
    // DRAWER POSITION
    // ====================================

    /*
     * The front of the medical table
     * is approximately Z = -10.6.
     *
     * The drawer front sits here.
     *
     * The drawer body extends BACK
     * into the table using negative Z.
     */

    drawer.position.set(
        -2.8,
        0.95,
        -10.55
    );


    scene.add(
        drawer
    );


    // ====================================
    // DIMENSIONS
    // ====================================

    const width =
        1.2;

    const height =
        0.5;

    const depth =
        0.55;


    // ====================================
    // MATERIALS
    // ====================================

    const drawerMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x292929,
            roughness: 0.7,
            metalness: 0.25,
        });


    const innerMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x151515,
            roughness: 0.9,
            metalness: 0.05,
        });


    const metalTrimMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.3,
            metalness: 0.85,
        });


    const lockMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x303030,
            roughness: 0.25,
            metalness: 0.9,
        });


    // ====================================
    // DRAWER FRONT
    // ====================================

    const front =
        createBox(
            width,
            height,
            0.08,

            drawerMaterial,

            0,
            0,
            0
        );


    front.name =
        "ward-c-drawer-front";


    drawer.add(
        front
    );


    // ====================================
    // DRAWER BODY
    // ====================================

    /*
     * IMPORTANT:
     *
     * The body extends BEHIND the front.
     *
     * Previously this was +depth / 2,
     * which caused the drawer to already
     * stick outside the table when closed.
     */

    const body =
        createBox(
            width - 0.12,
            height - 0.1,
            depth,

            innerMaterial,

            0,
            0,
            -(depth / 2)
        );


    body.name =
        "ward-c-drawer-body";


    drawer.add(
        body
    );


    // ====================================
    // DRAWER BOTTOM
    // ====================================

    const bottom =
        createBox(
            width - 0.12,
            0.06,
            depth,

            drawerMaterial,

            0,
            -(height / 2) + 0.04,
            -(depth / 2)
        );


    drawer.add(
        bottom
    );


    // ====================================
    // LEFT SIDE
    // ====================================

    const leftSide =
        createBox(
            0.06,
            height,
            depth,

            drawerMaterial,

            -(width / 2) + 0.03,
            0,
            -(depth / 2)
        );


    drawer.add(
        leftSide
    );


    // ====================================
    // RIGHT SIDE
    // ====================================

    const rightSide =
        createBox(
            0.06,
            height,
            depth,

            drawerMaterial,

            (width / 2) - 0.03,
            0,
            -(depth / 2)
        );


    drawer.add(
        rightSide
    );


    // ====================================
    // DRAWER BACK
    // ====================================

    const back =
        createBox(
            width - 0.12,
            height - 0.08,
            0.06,

            drawerMaterial,

            0,
            0,
            -depth
        );


    drawer.add(
        back
    );


    // ====================================
    // RECESSED FRONT PANEL
    // ====================================

    const recessedPanel =
        createBox(
            0.9,
            0.28,
            0.025,

            innerMaterial,

            0,
            0,
            -0.045
        );


    drawer.add(
        recessedPanel
    );


    // ====================================
    // TOP TRIM
    // ====================================

    const topTrim =
        createBox(
            1.05,
            0.035,
            0.035,

            metalTrimMaterial,

            0,
            0.19,
            0.045
        );


    drawer.add(
        topTrim
    );


    // ====================================
    // BOTTOM TRIM
    // ====================================

    const bottomTrim =
        createBox(
            1.05,
            0.035,
            0.035,

            metalTrimMaterial,

            0,
            -0.19,
            0.045
        );


    drawer.add(
        bottomTrim
    );


    // ====================================
    // HANDLE
    // ====================================

    const handle =
        createBox(
            0.38,
            0.045,
            0.07,

            metalTrimMaterial,

            0,
            0.08,
            0.075
        );


    handle.name =
        "ward-c-drawer-handle";


    drawer.add(
        handle
    );


    // ====================================
    // HANDLE MOUNTS
    // ====================================

    const leftMount =
        createBox(
            0.045,
            0.12,
            0.045,

            metalTrimMaterial,

            -0.16,
            0.08,
            0.055
        );


    drawer.add(
        leftMount
    );


    const rightMount =
        createBox(
            0.045,
            0.12,
            0.045,

            metalTrimMaterial,

            0.16,
            0.08,
            0.055
        );


    drawer.add(
        rightMount
    );


    // ====================================
    // LOCK PLATE
    // ====================================

    const lockPlate =
        createBox(
            0.16,
            0.12,
            0.035,

            lockMaterial,

            0,
            -0.1,
            0.06
        );


    drawer.add(
        lockPlate
    );


    // ====================================
    // LOCK INDICATOR
    // ====================================

    const lockIndicator =
        createBox(
            0.035,
            0.035,
            0.04,

            metalTrimMaterial,

            0,
            -0.1,
            0.08
        );


    drawer.add(
        lockIndicator
    );


    // ====================================
    // SHADOWS
    // ====================================

    drawer.traverse(
        (child) => {

            if (
                !child.isMesh
            ) {

                return;

            }


            child.castShadow =
                true;

            child.receiveShadow =
                true;

        }
    );


    // ====================================
    // STATE
    // ====================================

    let unlocked =
        false;

    let isOpening =
        false;


    // ====================================
    // KEYPAD
    // ====================================

    const keypad =
        createKeypad({

            correctCode:
                "417",

            onSuccess: () => {

                keypad.close();

                openDrawer();

            },


            onClose: () => {

                interactionManager.setBlocked(
                    false
                );

            },

        });


    // ====================================
    // INTERACTION
    // ====================================

    const drawerInteraction =
        new Interactable({

            object:
                drawer,

            name:
                "Locked Drawer",

            interactionText:
                "Press E to enter code",

            onInteract: () => {

                if (
                    unlocked ||
                    isOpening
                ) {

                    return;

                }


                interactionManager.setBlocked(
                    true
                );


                keypad.open();

            },

        });


    interactionManager.addInteractable(
        drawerInteraction
    );


    // ====================================
    // OPEN DRAWER
    // ====================================

    function openDrawer() {

        if (
            isOpening
        ) {

            return;

        }


        isOpening =
            true;


        const startZ =
            drawer.position.z;


        /*
         * Only pull the drawer out
         * about 0.45 units.
         *
         * The previous 0.8 was too much.
         */

        const openDistance =
            0.45;


        const targetZ =
            startZ +
            openDistance;


        const duration =
            700;


        const startTime =
            performance.now();


        function animateDrawer(
            currentTime
        ) {

            const elapsed =
                currentTime -
                startTime;


            const progress =
                Math.min(
                    elapsed /
                    duration,
                    1
                );


            const easedProgress =
                1 -
                Math.pow(
                    1 -
                    progress,
                    3
                );


            drawer.position.z =
                startZ +
                (
                    targetZ -
                    startZ
                ) *
                easedProgress;


            if (
                progress < 1
            ) {

                requestAnimationFrame(
                    animateDrawer
                );

                return;

            }


            // ==================================
            // COMPLETE
            // ==================================

            drawer.position.z =
                targetZ;


            unlocked =
                true;

            isOpening =
                false;


            // ==================================
            // REVEAL ACCESS CARD
            // ==================================

            if (
                wardCAccessCard &&
                wardCAccessCard.reveal
            ) {

                wardCAccessCard.reveal();

            }


            // ==================================
            // REMOVE INTERACTION
            // ==================================

            interactionManager.removeInteractable(
                drawerInteraction
            );


            interactionManager.clearInteraction();


            interactionManager.setBlocked(
                false
            );

        }


        requestAnimationFrame(
            animateDrawer
        );

    }


    // ====================================
    // RETURN
    // ====================================

    return {

        drawer,

        interaction:
            drawerInteraction,

    };

}