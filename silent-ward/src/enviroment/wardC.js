import * as THREE from "three";

import {
    darkMaterial,
    createWallMaterial,
    floorMaterial,
} from "./material";


// ====================================
// WARD C CONFIG
// ====================================

export const WARD_C_CONFIG = {
    width: 10,
    depth: 8,
    height: 4,
    centerZ: -9,
    exitWidth: 2,
    exitHeight: 3.5,
};


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


function createWallBox(
    width,
    height,
    depth,
    x,
    y,
    z
) {

    return createBox(
        width,
        height,
        depth,
        createWallMaterial(
            Math.max(width, depth),
            height
        ),
        x,
        y,
        z
    );

}


// ====================================
// CREATE WARD C
// ====================================

export function createWardC(scene) {

    const colliders = [];


    function addCollider(mesh) {

        scene.add(mesh);

        colliders.push(mesh);

    }


    // ====================================
    // ROOM CONFIG
    // ====================================

    const ROOM_WIDTH =
        WARD_C_CONFIG.width;

    const ROOM_DEPTH =
        WARD_C_CONFIG.depth;

    const ROOM_HEIGHT =
        WARD_C_CONFIG.height;


    // ====================================
    // ROOM POSITION
    // ====================================

    // Original room back wall is at Z = -5.
    //
    // Ward C front edge must also be at Z = -5.
    //
    // Depth = 8
    // Half depth = 4
    //
    // Center:
    //
    // -5 - 4 = -9

    const ROOM_Z =
        WARD_C_CONFIG.centerZ;


    const EXIT_WIDTH =
        WARD_C_CONFIG.exitWidth;

    const EXIT_HEIGHT =
        WARD_C_CONFIG.exitHeight;


    // ====================================
    // LIGHT
    // ====================================

    const wardCLight =
        new THREE.PointLight(
            0xffffff,
            8,
            20
        );


    wardCLight.position.set(
        0,
        3.5,
        ROOM_Z
    );


    wardCLight.castShadow =
        true;


    scene.add(
        wardCLight
    );


    // ====================================
    // FLOOR
    // ====================================

    scene.add(
        createBox(
            ROOM_WIDTH,
            0.2,
            ROOM_DEPTH,
            floorMaterial,
            0,
            -0.1,
            ROOM_Z
        )
    );


    // ====================================
    // BACK WALL / CORRIDOR EXIT
    // ====================================

    /*
     * Ward C exits through its back wall.
     * Split the wall around the opening so
     * the access-card door is a real passage,
     * rather than a door placed over a wall.
     */

    const EXIT_Z =
        ROOM_Z -
        ROOM_DEPTH / 2;


    const sideWallWidth =
        (
            ROOM_WIDTH -
            EXIT_WIDTH
        ) / 2;


    addCollider(
        createWallBox(
            sideWallWidth,
            ROOM_HEIGHT,
            0.2,
            -(
                EXIT_WIDTH / 2 +
                sideWallWidth / 2
            ),
            ROOM_HEIGHT / 2,
            EXIT_Z
        )
    );


    addCollider(
        createWallBox(
            sideWallWidth,
            ROOM_HEIGHT,
            0.2,
            EXIT_WIDTH / 2 +
            sideWallWidth / 2,
            ROOM_HEIGHT / 2,
            EXIT_Z
        )
    );


    const wallAboveExit =
        ROOM_HEIGHT -
        EXIT_HEIGHT;


    if (
        wallAboveExit > 0
    ) {

        addCollider(
            createWallBox(
                EXIT_WIDTH,
                wallAboveExit,
                0.2,
                0,
                EXIT_HEIGHT +
                wallAboveExit / 2,
                EXIT_Z
            )
        );

    }


    // ====================================
    // LEFT WALL
    // ====================================

    addCollider(
        createWallBox(
            0.2,
            ROOM_HEIGHT,
            ROOM_DEPTH,
            -ROOM_WIDTH / 2,
            ROOM_HEIGHT / 2,
            ROOM_Z
        )
    );


    // ====================================
    // RIGHT WALL
    // ====================================

    addCollider(
        createWallBox(
            0.2,
            ROOM_HEIGHT,
            ROOM_DEPTH,
            ROOM_WIDTH / 2,
            ROOM_HEIGHT / 2,
            ROOM_Z
        )
    );


    // ====================================
    // CEILING
    // ====================================

    scene.add(
        createBox(
            ROOM_WIDTH,
            0.2,
            ROOM_DEPTH,
            darkMaterial,
            0,
            ROOM_HEIGHT,
            ROOM_Z
        )
    );


    // ====================================
    // RETURN COLLIDERS
    // ====================================

    return colliders;

}
