import * as THREE from "three";

export class Flashlight {
    constructor(camera) {

        this.camera = camera;

        // ------------------------------------
        // FLASHLIGHT
        // ------------------------------------

        this.light = new THREE.SpotLight(
            0xffffff,
            18,
            22,
            Math.PI / 5.5,
            0.35,
            2
        );

        this.light.castShadow = false;


        // ------------------------------------
        // TARGET
        // ------------------------------------

        this.target = new THREE.Object3D();

        this.target.position.set(
            0,
            0,
            -10
        );


        // ------------------------------------
        // ATTACH TO CAMERA
        // ------------------------------------

        this.camera.add(
            this.light
        );

        this.camera.add(
            this.target
        );

        this.light.target =
            this.target;


        // ------------------------------------
        // POSITION
        // ------------------------------------

        this.light.position.set(
            0,
            -0.1,
            0
        );


        // ------------------------------------
        // STATE
        // ------------------------------------

        this.isOn = true;

        this.light.visible = true;
    }


    toggle() {

        this.isOn =
            !this.isOn;

        this.light.visible =
            this.isOn;
    }
}