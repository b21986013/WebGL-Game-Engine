import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm';
import { createCube } from "../geometry/Cube.js";
import { Mesh } from "../core/Mesh.js";
import { GameObject } from "../scene/GameObject.js";
import { Material } from "../core/Material.js";
import { vec3 } from "../mvNew.js";

export class LightGUI {
    constructor() {
        this.state = {
            lightType: 0,

            dirX: -1,
            dirY: -1,
            dirZ: -1,

            posX: -3,
            posY: 0,
            posZ: 5,

            constant: 1.0,
            linear: 0.09,
            quadratic: 0.032
        };

        this.gui = new GUI();
        this._build();
    }

    _build() {
        this.gui.add(this.state, "lightType", {
            Directional: 0,
            Point: 1
        });

        const dir = this.gui.addFolder("Directional Light");
        dir.add(this.state, "dirX", -1, 1, 0.01);
        dir.add(this.state, "dirY", -1, 1, 0.01);
        dir.add(this.state, "dirZ", -1, 1, 0.01);

        const point = this.gui.addFolder("Point Light");
        point.add(this.state, "posX", -10, 10, 0.1);
        point.add(this.state, "posY", -10, 10, 0.1);
        point.add(this.state, "posZ", -10, 10, 0.1);
        point.add(this.state, "constant", 0.1, 2.0, 0.01);
        point.add(this.state, "linear", 0.0, 1.0, 0.01);
        point.add(this.state, "quadratic", 0.0, 1.0, 0.01);
    }
}

export class SceneGUI {

    constructor(scene, gl, shaderProgram) {
        this.scene = scene;
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.gui = new GUI();

        this.state = {
            addCube: () => this.addCube(),
            objectCount: () => {
                console.log("Scene object count:", this.scene.gameObjects.length);
            }
        };

        const sceneFolder = this.gui.addFolder("Scene");
        sceneFolder.add(this.state, "addCube").name("Add Cube");
        sceneFolder.add(this.state, "objectCount").name("Log Object Count");
        sceneFolder.open();
    }

    addCube() {
        const cubeGeo = createCube(2.0);

        const mat = new Material({
            color: vec3(0.2, 0.6, 1.0),
            shininess: 32,
            specularStrength: 0.5
        });

        const cube = new GameObject(
            new Mesh(this.gl, cubeGeo, this.shaderProgram),
            mat
        );

        cube.transform.position = vec3(
            Math.random() * 6 - 3,
            0,
            Math.random() * 6 - 3
        );

        this.scene.add(cube);
        console.log("Cube added to scene");
    }
}
