import { mat4, translate, rotateX, rotateY, rotateZ, scale, mult, vec3 } from '../mvNew.js';

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
}
