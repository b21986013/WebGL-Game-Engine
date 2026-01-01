"use strict";

import { createLightGUI, createSceneGUI, createTransformGUI, createMaterialGUI} from "./ui/gui.js";
import { applyLightUniforms } from "./core/Renderer.js";
import { Texture } from "./core/Texture.js";
import { Mesh } from "./core/Mesh.js";
import { Material } from "./core/Material.js";
import { vec3,  flatten } from "./mvNew.js";
import { Camera } from "./camera/Camera.js";
import { Scene } from "./scene/Scene.js";
import { loadOBJ } from "./loaders/OBJLoader.js";
import { loadShaderSource, createProgram } from "./initshaders.js";
import { GameObject } from "./scene/GameObject.js";
import { createCube } from "./geometry/Cube.js";

// Global variables
let gl, canvas, shaderProgram, scene, aspect, lightSettings; 
const keys = {}; 

function mouseEvents()
{
    const camera = scene.camera;

    canvas.addEventListener("mousemove", (e) => 
    {
        if (document.pointerLockElement !== canvas) return;
        
        camera.processMouseMovement(e.movementX, -e.movementY);

        const VLoc = camera.getUniformLocations(gl, shaderProgram).VLoc;
        gl.uniformMatrix4fv(VLoc, false, flatten(camera.getViewMatrix()));
    });

    canvas.addEventListener("click", () => 
    {
        canvas.requestPointerLock();
    });

    document.addEventListener("pointerlockchange", () => 
    {
        if (document.pointerLockElement === canvas) 
        {
            console.log("Mouse locked");
        } 
        else 
        {
            console.log("Mouse released");
        }
    });


    window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
    window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);
}

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
    camera.position = vec3(0,3,10);
    camera.init(gl, shaderProgram);
    
    scene.camera = camera;

    mouseEvents();
    handleResize();

    demoSceneSetup().then(()=>
    {
        render();
    })
});


async function demoSceneSetup(){
    

    lightSettings = createLightGUI();
    const transformGUI = createTransformGUI(scene);
    const materialGUI =  createMaterialGUI(scene);
    createSceneGUI(scene, gl, shaderProgram, materialGUI, transformGUI);

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
            const brick = new GameObject(new Mesh(gl, createCube(1.0), shaderProgram), checkerTexturedMat);
            brick.transform.position = vec3(i - 5 , j, -5);
            scene.add(brick);
        }
    }
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 5; j++){
            const brick = new GameObject(new Mesh(gl, createCube(1.0), shaderProgram), checkerTexturedMat);
            brick.transform.position = vec3(5 , j, i - 5);
            scene.add(brick);
        }
    }

    const groundObj = new GameObject(new Mesh(gl, createCube(1.0), shaderProgram), groundTexturedMat);
    groundObj.transform.position = vec3(0, -1, 0);
    groundObj.transform.scale = vec3(10, 1, 10);
    scene.add(groundObj)

    const objGeo = await loadOBJ("models/monkey_head.obj");
    const monkeyObj =  new GameObject(new Mesh(gl, objGeo, shaderProgram), purpleMat)
    monkeyObj.transform.scale = vec3(0.5, 0.5, 0.5)
    scene.add(monkeyObj)

    
     

    
    // const monkeyHead = new GameObject(new Mesh(gl,objGeo,shaderProgram) , purpleMat);
    // monkeyHead.transform.position = vec3(0, 0, 0);
    // monkeyHead.transform.scale = vec3(1, 1, 1);

    // scene.add(monkeyHead);

    // scene.add(new GameObject(new Mesh(gl, createCube(2.0), shaderProgram), checkerTexturedMat));
    
}


function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    function updateCamera() 
    {
        const camera = scene.camera;

        if (keys['w']) camera.moveForward();
        if (keys['s']) camera.moveBackward();
        if (keys['a']) camera.moveLeft();
        if (keys['d']) camera.moveRight();

        const {VLoc, viewPosLoc} = camera.getUniformLocations(gl, shaderProgram);
        gl.uniformMatrix4fv(VLoc, false, flatten(camera.getViewMatrix()));
        gl.uniform3fv(viewPosLoc, flatten(camera.position));
    }

    updateCamera();  

    applyLightUniforms(gl, shaderProgram, lightSettings); // ./core/Renderer.js

    scene.draw(gl, shaderProgram);

    requestAnimationFrame(render);
}


