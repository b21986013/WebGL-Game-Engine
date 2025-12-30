"use strict";

import { LightGUI, SceneGUI } from "./ui/gui.js";
import { applyLightUniforms } from "./core/Renderer.js";
import { Texture } from "./core/Texture.js";
import { Material } from "./core/Material.js";
import { createSphere } from "./geometry/Sphere.js";
import { createCube } from "./geometry/Cube.js";
import { createCylinder } from "./geometry/Cylinder.js";
import { createTriangularPrism } from "./geometry/Prism.js";
import { vec3,  flatten } from "./mvNew.js";
import { Mesh } from "./core/Mesh.js";
import { Camera } from "./camera/Camera.js";
import { GameObject } from "./scene/GameObject.js";
import { Scene } from "./scene/Scene.js";
import { loadShaderSource, createProgram } from "./initshaders.js";
import { loadOBJ } from "./loaders/OBJLoader.js";

// Global variables
let gl, canvas, shaderProgram, scene, camera, aspect, objGeo, lightSettings, VLoc, PLoc, lastX, lastY, firstMouse; 
const keys = {}; 


async function init() {
    canvas = document.getElementById("gl-canvas");

    lastX = canvas.width / 2;
    lastY = canvas.height / 2;
    firstMouse = true;

    // canvas.addEventListener("click", () => {
    //     canvas.requestPointerLock();
    // });

   canvas.addEventListener("mousemove", (e) => {

    if (document.pointerLockElement !== canvas) return;

    camera.processMouseMovement(
        e.movementX,
        -e.movementY
    );

    gl.uniformMatrix4fv(
            gl.getUniformLocation(shaderProgram, "V"),
            false,
            flatten(camera.getViewMatrix())
        );
    });

    canvas.addEventListener("click", () => {
        canvas.requestPointerLock();
    });

    document.addEventListener("pointerlockchange", () => {
        if (document.pointerLockElement === canvas) {
            console.log("Mouse locked");
        } else {
            console.log("Mouse released");
        }
    });


    window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
    window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available" );

    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect =  canvas.width/canvas.height;
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // gl.enable(gl.CULL_FACE);
    // gl.cullFace(gl.BACK);
    // gl.frontFace(gl.CCW);


    const vertexSource = await loadShaderSource("shaders/vertex.glsl");
    const fragmentSource = await loadShaderSource("shaders/fragment.glsl");
    
    shaderProgram = createProgram(gl, vertexSource, fragmentSource);
}


init().then(async() => {
    gl.useProgram(shaderProgram);
 
    VLoc = gl.getUniformLocation(shaderProgram, "V");
    PLoc = gl.getUniformLocation(shaderProgram, "P");

    camera = new Camera(45, aspect, 0.01, 100);
    camera.position = vec3(0,10,30);

    let P = camera.getProjectionMatrix();
    gl.uniformMatrix4fv(PLoc, false, flatten(P));

    let V = camera.getViewMatrix();
    gl.uniformMatrix4fv(VLoc, false, flatten(V));
    
    const lightPosLoc = gl.getUniformLocation(shaderProgram, "lightPos");
    const viewPosLoc  = gl.getUniformLocation(shaderProgram, "viewPos");

    gl.uniform3fv(lightPosLoc, flatten(vec3(-5, 0, 5)));
    gl.uniform3fv(viewPosLoc, flatten(camera.position));

    

    window.addEventListener('resize', () => 
    {
        console.log("resize");
        canvas.width = innerWidth; canvas.height = innerHeight;
        gl.viewport(0,0,canvas.width,canvas.height);
        aspect = canvas.width/canvas.height;
        camera.updateAspect(aspect);
        P = camera.getProjectionMatrix();
        gl.uniformMatrix4fv(PLoc, false, flatten(P));
    });

    demoSceneSetup().then(()=>{
        render();
    })

 
});


async function demoSceneSetup(){
    // Create scene objects here and add to scene
    scene = new Scene();

   

    new LightGUI();
    lightSettings = new LightGUI().state;
    

    const checkerTexturedMat = new Material({
        color: vec3(1, 1, 1),
        shininess: 64,
        specularStrength: 1.0,
        texture: new Texture(gl, "./textures/checkers.png")
    });

    const purpleMat = new Material({
        color: vec3(1, 0, 1),
        shininess: 32,
        specularStrength: 0.5,
    });

    objGeo = await loadOBJ("models/monkey_head.obj");
    const monkeyHead = new GameObject(new Mesh(gl,objGeo,shaderProgram) , purpleMat);
    monkeyHead.transform.position = vec3(0, 0, 0);
    monkeyHead.transform.scale = vec3(3, 3, 3);


    const cylinderGeo = createCylinder(0.5, 3.0, 32);
    const cylinder = new GameObject(new Mesh(gl, cylinderGeo, shaderProgram), checkerTexturedMat);
    cylinder.transform.position = vec3(-4, 0, 0);

    const cubeGeo =  createCube(4.0);
    const cube = new GameObject(new Mesh(gl, cubeGeo, shaderProgram), checkerTexturedMat);
 
    const sphereGeo = createSphere(3.0, 16, 16);
    const sphere = new GameObject(new Mesh(gl, sphereGeo, shaderProgram), checkerTexturedMat);
    sphere.transform.position = vec3(0, 0, 0);

    const prismGeo = createTriangularPrism(1.0, 2.0);
    const prism = new GameObject(new Mesh(gl, prismGeo, shaderProgram), purpleMat);
    prism.transform.position = vec3(-4, 0, 0);

    cube.transform.position = vec3(4, 0, 0);
    scene.add(cube);
    // scene.add(sphere);
    // scene.add(cylinder);
    // scene.add(prism);
    scene.add(monkeyHead);

    

    const sceneGUI = new SceneGUI(scene, gl, shaderProgram);
}


function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    function updateCamera() 
    {
        if (keys['w']) camera.moveForward();
        if (keys['s']) camera.moveBackward();
        if (keys['a']) camera.moveLeft();
        if (keys['d']) camera.moveRight();

        const V = camera.getViewMatrix();
        gl.uniformMatrix4fv(VLoc, false, flatten(V));

        gl.uniform3fv(
            gl.getUniformLocation(shaderProgram, "viewPos"),
            flatten(camera.position)
        );
    }


    updateCamera();  

    applyLightUniforms(gl, shaderProgram, lightSettings); // ./core/Renderer.js

    scene.draw(gl, shaderProgram);
    
    scene.gameObjects[0].transform.rotation[1] += 0.1; // Rotate first object in scene

    requestAnimationFrame(render);
}


