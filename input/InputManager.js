export class InputManager {
    constructor() {
        this.activeController = null;
    }

    setActive(controller) {
        if (this.activeController) {
            this.activeController.setEnabled(false);
        }

        this.activeController = controller;

        if (controller) {
            controller.setEnabled(true);
        }
    }
}
