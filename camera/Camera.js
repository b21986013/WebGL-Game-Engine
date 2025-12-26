class Camera {
  constructor(fov = 45, aspect = 1, near = 0.1, far = 100) {
    this.position = vec3(0,0,0);
    this.target = vec3(0,0,0);
    this.up = vec3(0,1,0);
    this.fov = fov; this.aspect = aspect; this.near = near; this.far = far;
  }

  getViewMatrix() { return lookAt(this.position, this.target, this.up); }
  getProjectionMatrix() {
     return perspective(this.fov, this.aspect, this.near, this.far);
    }
  // add methods: moveForward, moveRight, rotateYawPitch, updateAspect(newAspect) etc.

  updateAspect(newAspect) {
    this.aspect = newAspect;
  }
}