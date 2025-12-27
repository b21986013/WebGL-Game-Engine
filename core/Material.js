import { flatten } from "../mvNew.js";

export class Material {
    constructor({
        color = [1, 1, 1],
        shininess = 32.0,
        specularStrength = 0.5
    } = {}) {
        this.color = color;
        this.shininess = shininess;
        this.specularStrength = specularStrength;
    }

    apply(gl, program) {
        gl.uniform3fv(
            gl.getUniformLocation(program, "objectColor"),
            flatten(this.color)
        );

        gl.uniform1f(
            gl.getUniformLocation(program, "shininess"),
            this.shininess
        );

        gl.uniform1f(
            gl.getUniformLocation(program, "specularStrength"),
            this.specularStrength
        );
    }
}
