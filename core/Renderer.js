import { vec3, flatten } from "../mvNew.js";

export function applyLightUniforms(gl, program, lightState) {

    gl.uniform1i(
        gl.getUniformLocation(program, "lightType"),
        lightState.lightType
    );

    gl.uniform3fv(
        gl.getUniformLocation(program, "lightDir"),
        flatten(vec3(
            lightState.dirX,
            lightState.dirY,
            lightState.dirZ
        ))
    );

    gl.uniform3fv(
        gl.getUniformLocation(program, "lightPos"),
        flatten(vec3(
            lightState.posX,
            lightState.posY,
            lightState.posZ
        ))
    );

    gl.uniform1f(
        gl.getUniformLocation(program, "constant"),
        lightState.constant
    );
    gl.uniform1f(
        gl.getUniformLocation(program, "linear"),
        lightState.linear
    );
    gl.uniform1f(
        gl.getUniformLocation(program, "quadratic"),
        lightState.quadratic
    );
}
