export class Scene {
    constructor() {
        this.gameObjects = [];
        this.activeObject = null;
        this.camera = null;
        this.onActiveObjectChanged = null;
    }

    add(gameObject) {
        this.gameObjects.push(gameObject);

        // İlk obje otomatik seçili olsun
        if (!this.activeObject) {
            this.activeObject = gameObject;
        }
    }

    update() {
        for (const obj of this.gameObjects) {
            // Future update logic can be added here
        }
    }

    setActiveObjectByIndex(index) 
    {
        if (index >= 0 && index < this.gameObjects.length) {
            this.activeObject = this.gameObjects[index];
            console.log("Active object index:", index);
        }
    }

    draw(gl, shaderProgram) {

        for (const obj of this.gameObjects) 
        {
            obj.draw(gl, shaderProgram);
        }
    }

    setActiveObject(obj) {
        this.activeObject = obj;
        console.log("Active object set:", obj);

        if (this.onActiveObjectChanged) {
         this.onActiveObjectChanged(obj);
        }
    }
}
