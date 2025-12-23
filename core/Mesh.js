class Mesh {
  // positions/colors/normals/uvs: arrays of vec* (not flattened)
  // attribLocations: { position: loc, color: loc, normal: loc|null, uv: loc|null }
  // indices: optional array of integers (for ELEMENT_ARRAY_BUFFER)
  constructor(gl, positions, colors, attribLocations, normals = null, uvs = null, indices = null) {
    this.gl = gl;
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    // Positions
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    const posFloats = flatten(positions);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posFloats), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribLocations.position);
    gl.vertexAttribPointer(attribLocations.position, 4, gl.FLOAT, false, 0, 0);

    // Colors (optional)
    if (colors) {
      this.colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
      const colFloats = flatten(colors);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colFloats), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(attribLocations.color);
      gl.vertexAttribPointer(attribLocations.color, 4, gl.FLOAT, false, 0, 0);
    }

    // Normals (optional)
    if (normals && attribLocations.normal !== undefined && attribLocations.normal !== -1) {
      this.normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
      const nFloats = flatten(normals);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nFloats), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(attribLocations.normal);
      gl.vertexAttribPointer(attribLocations.normal, 3, gl.FLOAT, false, 0, 0);
    }

    // UVs (optional)
    if (uvs && attribLocations.uv !== undefined && attribLocations.uv !== -1) {
      this.uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
      const uvFloats = flatten(uvs);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvFloats), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(attribLocations.uv);
      gl.vertexAttribPointer(attribLocations.uv, 2, gl.FLOAT, false, 0, 0);
    }

    // Indices (optional)
    if (indices) {
      this.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
      this.indexCount = indices.length;
      this.drawMode = gl.TRIANGLES;
      this.usesElements = true;
    } else {
      this.vertexCount = posFloats.length / 4; // 4 floats per vertex
      this.usesElements = false;
    }

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  draw() {
    const gl = this.gl;
    gl.bindVertexArray(this.vao);
    if (this.usesElements) {
      gl.drawElements(this.drawMode, this.indexCount, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(this.drawMode || gl.TRIANGLES, 0, this.vertexCount);
    }
    gl.bindVertexArray(null);
  }
}
