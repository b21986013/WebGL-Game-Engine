class GameObject {
    constructor(mesh) {
        this.mesh = mesh;
        this.transform = new Transform();
    }

    draw(gl, program) {
        const M = this.transform.getModelMatrix();
        gl.uniformMatrix4fv(MLoc, false, flatten(M));
        this.mesh.draw();
    }
}
