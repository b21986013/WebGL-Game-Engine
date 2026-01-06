"use strict";

import { createLightGUI, createSceneGUI, createTransformGUI, createMaterialGUI, createGlobalObjectSelector, createTextureGUI} from "./ui/gui.js";
import { applyLightUniforms } from "./core/Renderer.js";
import { Texture } from "./core/Texture.js";
import { Mesh } from "./core/Mesh.js";
import { Material } from "./core/Material.js";
import { vec3,  flatten } from "./mvNew.js";
import { Camera, FPSCamera } from "./camera/Camera.js";
import { Scene } from "./scene/Scene.js";
import { loadOBJ } from "./loaders/OBJLoader.js";
import { InputManager } from "./input/InputManager.js";
import { SceneController } from "./input/SceneController.js";
import { FPSController } from "./input/FPSController.js";
import { loadShaderSource, createProgram } from "./initshaders.js";
import { GameObject } from "./scene/GameObject.js";
import { createCube } from "./geometry/Cube.js";

// Global variables
let gl, canvas, shaderProgram, scene, aspect, lightSettings, fpsCamera, sceneController, fpsController, activeView, inputManager; 
 

function handleResize(){
    window.addEventListener('resize', () => 
    {
        console.log("resize");
        canvas.width = innerWidth; canvas.height = innerHeight;
        gl.viewport(0,0,canvas.width,canvas.height);
        aspect = canvas.width/canvas.height;
        scene.camera.updateAspect(aspect);
        const PLoc = scene.camera.getUniformLocations(gl, shaderProgram).PLoc;
        gl.uniformMatrix4fv(PLoc, false, flatten(scene.camera.getProjectionMatrix()));
    });
}

function updateViewIndicator() {
    const el = document.getElementById("view-indicator");

    if (inputManager.activeController === sceneController) {
        el.textContent = "FREE-VIEW is active (press SHIFT to activate FPS-VIEW)";
        el.style.color = "#00ffcc";
    } else {
        el.textContent = "FPS-VIEW is active (press CTRL to activate FREE-VIEW)";
        el.style.color = "#ffcc00";
    }
}

function handleViewChange(){

    inputManager = new InputManager();

    inputManager.setActive(sceneController);

    window.addEventListener("keydown", e => {
        if (e.key === "Control") inputManager.setActive(sceneController);
        if (e.key === "Shift")   inputManager.setActive(fpsController);
    });
}

async function init() {
    canvas = document.getElementById("gl-canvas");

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
    gl.useProgram(shaderProgram);

}


init().then(async() => {
    scene = new Scene();

    const camera = new Camera(45, aspect, 0.01, 50);
    camera.position = vec3(-5,10,17);
 
    scene.camera = camera;

    sceneController = new SceneController(scene, canvas, gl, shaderProgram);

    fpsCamera =  new FPSCamera(60, aspect, 0.01, 50);
    fpsCamera.position = vec3(0, 1.6, 5); 
    fpsCamera.yaw = -90;
    fpsCamera.pitch = 0;
    fpsCamera.fov = 60;

    fpsController = new FPSController(fpsCamera, canvas, gl, shaderProgram);


    handleViewChange();
    handleResize();

    demoSceneSetup().then(()=>
    {
        render();
    })
});


async function demoSceneSetup(){
    lightSettings = createLightGUI();
    
    createTransformGUI(scene);
    createMaterialGUI(scene);
    createTextureGUI(scene, gl);
    createGlobalObjectSelector(scene);
    createSceneGUI(scene, gl, shaderProgram);
    
    const checkerTexturedMat = new Material({
        color: vec3(1, 1, 1),
        shininess: 64,
        specularStrength: 1.0,
        texture: new Texture(gl, "./textures/wall.jpg")
    });

    const groundTexturedMat = new Material({
        color: vec3(1, 1, 1),
        shininess: 64,
        specularStrength: 1.0,
        texture: new Texture(gl, "./textures/ground.jpg")
    });

    const purpleMat = new Material({
        color: vec3(1, 0, 1),
        shininess: 32,
        specularStrength: 0.5
    })

    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 5; j++){
            const brick = new GameObject(new Mesh(gl, createCube(1.0), shaderProgram), checkerTexturedMat,null, false);
            brick.transform.position = vec3(i - 5 , j, -5);
            scene.add(brick);
        }
    }
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 5; j++){
            const brick = new GameObject(new Mesh(gl, createCube(1.0), shaderProgram), checkerTexturedMat, null, false);
            brick.transform.position = vec3(5 , j, i - 5);
            scene.add(brick);
        }
    }

    const groundObj = new GameObject(new Mesh(gl, createCube(1.0), shaderProgram), groundTexturedMat, null, false);
    groundObj.transform.position = vec3(0, -1, 0);
    groundObj.transform.scale = vec3(10, 1, 10);
    scene.add(groundObj)

    const objGeo = await loadOBJ("models/monkey_head.obj");
    const monkeyObj =  new GameObject(new Mesh(gl, objGeo, shaderProgram), purpleMat, null, false)
    monkeyObj.transform.scale = vec3(0.5, 0.5, 0.5)
    scene.add(monkeyObj)
    
}


function render(){

    const w = canvas.width;
    const h = canvas.height;

    applyLightUniforms(gl, shaderProgram, lightSettings); // ./core/Renderer.js


    gl.viewport(0, 0, w / 2, h);
    gl.scissor(0, 0, w / 2, h);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   
    scene.camera.updateAspect((w / 2) / h);
    scene.camera.init(gl, shaderProgram);

    if(inputManager.activeController === sceneController)
        sceneController.update();
    scene.draw(gl, shaderProgram);


     // ===== SAĞ: GAME / FPS VIEW =====
    gl.viewport(w / 2, 0, w / 2, h);
    gl.scissor(w / 2, 0, w / 2, h);
    gl.clear(gl.DEPTH_BUFFER_BIT); 

    fpsCamera.updateAspect((w / 2) / h);
    fpsCamera.init(gl, shaderProgram);

    updateViewIndicator();


    if(inputManager.activeController === fpsController)
        fpsController.update();
    scene.draw(gl, shaderProgram);

    requestAnimationFrame(render);
}


