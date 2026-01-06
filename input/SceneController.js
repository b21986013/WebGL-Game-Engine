import { flatten } from "../mvNew.js";

export class SceneController {
    constructor(scene, canvas, gl, shaderProgram) {
        this.scene = scene;
        this.canvas = canvas;
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.keys = {};
        this.enabled = true;

        this._initKeyboard();
        this._initMouse();
    }

    /* ========================= */
    /* Keyboard (WASD)           */
    /* ========================= */
    _initKeyboard() {
        window.addEventListener("keydown", e => {
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", e => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    /* ========================= */
    /* Mouse Look + PointerLock  */
    /* ========================= */
    _initMouse() {
        this.canvas.addEventListener("click", () => {
            this.canvas.requestPointerLock();
        });

        document.addEventListener("pointerlockchange", () => {
            const locked = document.pointerLockElement === this.canvas;
            console.log(locked ? "Mouse locked" : "Mouse released");
        });

        this.canvas.addEventListener("mousemove", e => {
            if (document.pointerLockElement !== this.canvas) return;
            if (!this.enabled) return;

            const camera = this.scene.camera;
            camera.processMouseMovement(e.movementX, -e.movementY);
        });
    }

    /* ========================= */
    /* Update (Render Loop)      */
    /* ========================= */
    update() {
        if (!this.enabled) return;

        const camera = this.scene.camera;

        if (this.keys["w"]) camera.moveForward();
        if (this.keys["s"]) camera.moveBackward();
        if (this.keys["a"]) camera.moveLeft();
        if (this.keys["d"]) camera.moveRight();

        const { VLoc, viewPosLoc } =
            camera.getUniformLocations(this.gl, this.shaderProgram);

        this.gl.uniformMatrix4fv(
            VLoc,
            false,
            flatten(camera.getViewMatrix())
        );

        this.gl.uniform3fv(
            viewPosLoc,
            flatten(camera.position)
        );
    }

    /* ========================= */
    /* Enable / Disable          */
    /* ========================= */
    setEnabled(v) {
        this.enabled = v;

        // if(!v)
        // {
        //     if (document.pointerLockElement === this.canvas) 
        //     {
        //         document.exitPointerLock();
        //     }
        // }
    }
}
