export class Scene {
    constructor() {
        this.gameObjects = [];
        this.activeObject = null;
        this.camera = null;
        this.onActiveObjectChangedSyncTransform = null;
        this.onActiveObjectChangedSyncMaterial = null;   
    }

    add(gameObject) {
        this.gameObjects.push(gameObject);
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
            // console.log("Active object index:", index);
            if (this.onActiveObjectChangedSyncMaterial) {
                this.onActiveObjectChangedSyncMaterial();
            }

            if(this.onActiveObjectChangedSyncTransform){
                this.onActiveObjectChangedSyncTransform();
            }
        }
    }

    draw(gl, shaderProgram) {

        for (const obj of this.gameObjects) 
        {
            obj.draw(gl, shaderProgram);
        }
    }
}
