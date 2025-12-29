import { flatten, normalMatrix } from "../mvNew.js";

export class Scene {
    constructor() {
        this.gameObjects = [];
        this.light = null;
    }

    add(gameObject) {
        this.gameObjects.push(gameObject);
    }

    update() {
        for (const obj of this.gameObjects) {
            // Future update logic can be added here
        }
    }

    setLight(light) {
        this.light = light;
    }

    draw(gl, shaderProgram) {

        if (this.light) {
            this.light.apply(gl, shaderProgram);
        }

        const modelLoc  = gl.getUniformLocation(shaderProgram, "M");
        const normalLoc = gl.getUniformLocation(shaderProgram, "normalMatrix");

        for (const obj of this.gameObjects) {

            const modelMatrix = obj.transform.getModelMatrix();
            const nM = normalMatrix(modelMatrix);

            gl.uniformMatrix4fv(modelLoc, false, flatten(modelMatrix));
            gl.uniformMatrix3fv(normalLoc, false, flatten(nM));

            if (obj.material) {
                obj.material.apply(gl, shaderProgram);
            }

            obj.mesh.draw();
        }
    }
}
