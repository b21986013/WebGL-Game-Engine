import { flatten } from "../mvNew.js";

export class FPSController {
    constructor(camera, canvas, gl, shaderProgram) {
        this.camera = camera;
        this.canvas = canvas;
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.keys = {};
        this.enabled = false;

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
    /* Mouse Look (FPS style)    */
    /* ========================= */
    _initMouse() {
        this.canvas.addEventListener("mousemove", e => {
            if (!this.enabled) return;
            if (document.pointerLockElement !== this.canvas) return;

            this.camera.processMouseMovement(
                e.movementX,
                -e.movementY
            );
        });
    }

    /* ========================= */
    /* Update (Render Loop)      */
    /* ========================= */
    update() {
        if (!this.enabled) return;

        if (this.keys["w"]) this.camera.moveForward();
        if (this.keys["s"]) this.camera.moveBackward();
        if (this.keys["a"]) this.camera.moveLeft();
        if (this.keys["d"]) this.camera.moveRight();

        const { VLoc, viewPosLoc } =
            this.camera.getUniformLocations(this.gl, this.shaderProgram);

        this.gl.uniformMatrix4fv(
            VLoc,
            false,
            flatten(this.camera.getViewMatrix())
        );

        this.gl.uniform3fv(
            viewPosLoc,
            flatten(this.camera.position)
        );
    }

    setEnabled(v) {
        this.enabled = v;

        if(!v)
        {
            if (document.pointerLockElement === this.canvas) 
            {
                document.exitPointerLock();
            }
        }
    }
}
