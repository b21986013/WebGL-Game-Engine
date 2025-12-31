import { mat4, translate, rotateX, rotateY, rotateZ, scale, mult, vec3, normalMatrix, flatten } from '../mvNew.js';

export class Transform {
    constructor() {
        this.position = vec3(0, 0, 0);
        this.rotation = vec3(0, 0, 0); // radians
        this.scale    = vec3(1, 1, 1);
    }

    getModelMatrix() {
        let M = mat4();

        M = mult(M, translate(this.position[0], this.position[1], this.position[2]));
        M = mult(M, rotateX(this.rotation[0]));
        M = mult(M, rotateY(this.rotation[1]));
        M = mult(M, rotateZ(this.rotation[2]));
        M = mult(M, scale(this.scale[0], this.scale[1], this.scale[2]));

        return M;
    }

    apply(gl, shaderProgram)
    {
        const NLoc = gl.getUniformLocation(shaderProgram, "normalMatrix");
        const MLoc = gl.getUniformLocation(shaderProgram, "M");

        const M = this.getModelMatrix();
        gl.uniformMatrix4fv(MLoc, false, flatten(M));

        const nM = normalMatrix(M);
        gl.uniformMatrix3fv(NLoc, false, flatten(nM));
    }
}
