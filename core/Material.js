import { flatten } from "../mvNew.js";

export class Material {
    constructor({color = [1, 1, 1], shininess = 32.0, specularStrength = 0.5, texture = null} = {}) {
        this.color = color;
        this.shininess = shininess;
        this.specularStrength = specularStrength;
        this.texture = texture;
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

        if (this.texture) {
            this.texture.bind(0);
            gl.uniform1i(gl.getUniformLocation(program, "albedoMap"), 0);
            gl.uniform1i(gl.getUniformLocation(program, "useTexture"), 1);
        } else {
            gl.uniform1i(gl.getUniformLocation(program, "useTexture"), 0);
        }
    }
}
