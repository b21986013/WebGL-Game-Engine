import { Transform } from './Transform.js';


export class GameObject {

    static ID = 0;

    constructor(mesh, material = null, name = null) {
        this.mesh = mesh;
        this.transform = new Transform();
        this.material = material;
        this.name = name || `GameObject_${GameObject.ID++}`;
    }

    draw(gl, shaderProgram) {
        
        this.transform.apply(gl, shaderProgram);
        this.material.apply(gl, shaderProgram);
        this.mesh.draw();
    }
}
