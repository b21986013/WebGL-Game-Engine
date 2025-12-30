import { lookAt, perspective, vec3, normalize, cross, add, subtract, scale } from '../mvNew.js';

export class Camera {
    constructor(fov = 45, aspect = 1, near = 0.1, far = 100) {
        this.position = vec3(0, 0, 0);

        // Camera orientation
        this.yaw = -90;   // facing -Z
        this.pitch = 0;

        this.sensitivity = 0.1;

        this.front = vec3(0, 0, -1);
        this.up = vec3(0, 1, 0);
        this.right = vec3(1, 0, 0);
        this.worldUp = vec3(0, 1, 0);

        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;

        this.speed = 0.1;
        this.sensitivity = 0.1;

        this._updateVectors();
    }

    getViewMatrix() {
        const target = subtract(this.position, vec3(
            -this.front[0],
            -this.front[1],
            -this.front[2]
        ));  


        return lookAt(this.position, target, this.up);
    }

    getProjectionMatrix() {
        return perspective(this.fov, this.aspect, this.near, this.far);
    }

    updateAspect(aspect) {
        this.aspect = aspect;
    }

    // ===== Movement =====
    moveForward(dt = 1) {
        this.position = add(this.position, scale(this.speed * dt, this.front));
    }

    moveBackward(dt = 1) {
        this.position = subtract(this.position, scale(this.speed * dt, this.front));
    }

    moveRight(dt = 1) {
        this.position = add(this.position, scale(this.speed * dt, this.right ));
    }

    moveLeft(dt = 1) {
        this.position = subtract(this.position, scale(this.speed * dt, this.right, ));
    }

    // ===== Mouse look =====
    rotateYawPitch(dx, dy) {
        this.yaw   += dx * this.sensitivity;
        this.pitch += dy * this.sensitivity;

        // Clamp pitch
        this.pitch = Math.max(-89, Math.min(89, this.pitch));

        this._updateVectors();
    }

    _updateVectors() {
        const yawRad = this.yaw * Math.PI / 180;
        const pitchRad = this.pitch * Math.PI / 180;

        this.front = normalize(vec3(
            Math.cos(yawRad) * Math.cos(pitchRad),
            Math.sin(pitchRad),
            Math.sin(yawRad) * Math.cos(pitchRad)
        ));

        this.right = normalize(cross(this.front, this.worldUp));
        this.up = normalize(cross(this.right, this.front));
    }

    processMouseMovement(xoffset, yoffset) {

      xoffset *= this.sensitivity;
      yoffset *= this.sensitivity;

      this.yaw   += xoffset;
      this.pitch += yoffset;

      // Pitch clamp (boyun kırılmasın)
      if (this.pitch > 89.0)  this.pitch = 89.0;
      if (this.pitch < -89.0) this.pitch = -89.0;

      // Yeni front vektörü
      const radYaw   = this.yaw * Math.PI / 180;
      const radPitch = this.pitch * Math.PI / 180;

      const front = vec3(
          Math.cos(radYaw) * Math.cos(radPitch),
          Math.sin(radPitch),
          Math.sin(radYaw) * Math.cos(radPitch)
      );

      this.front = normalize(front);
    }

}
