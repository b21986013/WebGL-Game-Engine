import { flatten, normalMatrix } from "../mvNew.js";

export class Scene {
    constructor() {
        this.gameObjects = [];
    }

    add(gameObject) {
        this.gameObjects.push(gameObject);
    }

    update() {
        for (const obj of this.gameObjects) {
        }
    }

    draw(gl, program) {
        const modelLoc  = gl.getUniformLocation(program, "M");
        const normalLoc = gl.getUniformLocation(program, "normalMatrix");

        for (const obj of this.gameObjects) {

            const modelMatrix = obj.transform.getModelMatrix();
            const nM = normalMatrix(modelMatrix);

            gl.uniformMatrix4fv(modelLoc, false, flatten(modelMatrix));
            gl.uniformMatrix3fv(normalLoc, false, flatten(nM));

            obj.mesh.draw();
        }
    }
}
