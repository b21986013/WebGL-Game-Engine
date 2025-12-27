import { Transform } from './Transform.js';
import { flatten } from '../mvNew.js';


export class GameObject {
    constructor(mesh, material = null) {
        this.mesh = mesh;
        this.transform = new Transform();
        this.material = material;
    }

    draw(gl, shaderProgram) {
        const M = this.transform.getModelMatrix();
        const MLoc = gl.getUniformLocation(shaderProgram, "M");
        gl.uniformMatrix4fv(MLoc, false, flatten(M));
        this.mesh.draw();
    }
}
