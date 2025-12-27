import { Transform } from './Transform.js';
import { flatten } from '../mvNew.js';


export class GameObject {
    constructor(mesh) {
        this.mesh = mesh;
        this.transform = new Transform();
    }

    draw(gl, shaderProgram) {
        const M = this.transform.getModelMatrix();
        const MLoc = gl.getUniformLocation(shaderProgram, "M");
        gl.uniformMatrix4fv(MLoc, false, flatten(M));
        this.mesh.draw();
    }
}
