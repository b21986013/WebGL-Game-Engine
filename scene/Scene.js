class Scene {
    constructor() {
        this.gameObjects = [];
    }

    add(gameObject) {
        this.gameObjects.push(gameObject);
    }

    update() {
        for (const obj of this.gameObjects) {
            // şimdilik boş
        }
    }

    draw(gl, program) {
        for (const obj of this.gameObjects) {
            obj.draw(gl, program);
        }
    }
}
