import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm';

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

    constructor(scene) {
        this.scene = scene;
        this.gui = new GUI();

        this.state = {
            objectCount: () => {
                console.log("Scene object count:", this.scene.gameObjects.length);
            }
        };

        const debugFolder = this.gui.addFolder("Scene Debug");
        debugFolder.add(this.state, "objectCount").name("Log Object Count");
        debugFolder.open();
    }
}
