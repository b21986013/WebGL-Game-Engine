import { flatten } from '../mvNew.js';

export class Mesh {
    constructor(gl, geometry, shaderProgram) {
        this.shaderProgram = shaderProgram;
        this.gl = gl;
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        const posLoc = gl.getAttribLocation(shaderProgram, "vPos");
        const normalLoc = gl.getAttribLocation(shaderProgram, "vNormal");
        const uvLoc = gl.getAttribLocation(shaderProgram, "vUV");

        
        // === POSITION ===
        this.vertexCount = geometry.positions.length;
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(flatten(geometry.positions)),
            gl.STATIC_DRAW
        );
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);

        // === NORMAL ===
        if (geometry.normals && normalLoc !== undefined) {
            this.normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(flatten(geometry.normals)),
                gl.STATIC_DRAW
            );
            gl.enableVertexAttribArray(normalLoc);
            gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
        }

        // === UV ===
        if (geometry.uvs && uvLoc !== -1) {
            this.uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(flatten(geometry.uvs)),
                gl.STATIC_DRAW
            );
            gl.enableVertexAttribArray(uvLoc);
            gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);
        }

        // === COLOR (optional) ===
        if (geometry.colors && attribs.color !== undefined) {
            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(flatten(geometry.colors)),
                gl.STATIC_DRAW
            );
            gl.enableVertexAttribArray(attribs.color);
            gl.vertexAttribPointer(attribs.color, 4, gl.FLOAT, false, 0, 0);
        }

        // === INDICES (optional) ===
        this.usesIndices = false;
        if (geometry.indices) {
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(
                gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(geometry.indices),
                gl.STATIC_DRAW
            );
            this.indexCount = geometry.indices.length;
            this.usesIndices = true;
        }

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    draw() {
        const gl = this.gl;
        gl.bindVertexArray(this.vao);

        if (this.usesIndices) {
            gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
        }

        gl.bindVertexArray(null);
    }
}
