"use strict";

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
let gl, canvas, shaderProgram, scene, camera, aspect, objGeo;  

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
}


init().then(async() => {
    gl.useProgram(shaderProgram);
 
    const VLoc = gl.getUniformLocation(shaderProgram, "V");
    const PLoc = gl.getUniformLocation(shaderProgram, "P");

    camera = new Camera(45, aspect, 0.01, 50);
    camera.position = vec3(0,3,20);

    let P = camera.getProjectionMatrix();
    gl.uniformMatrix4fv(PLoc, false, flatten(P));

    let V = camera.getViewMatrix();
    gl.uniformMatrix4fv(VLoc, false, flatten(V));
    
    const lightPosLoc = gl.getUniformLocation(shaderProgram, "lightPos");
    const viewPosLoc  = gl.getUniformLocation(shaderProgram, "viewPos");

    gl.uniform3fv(lightPosLoc, flatten(vec3(-3, 0, 5)));
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

    scene = new Scene();

    const purpleMat = new Material({
    color: vec3(1, 0, 1),
    shininess: 32,
    specularStrength: 0.5
});

    objGeo = await loadOBJ("models/teapot.obj");
    const teapot = new GameObject(new Mesh(gl,objGeo,shaderProgram) , purpleMat);
    teapot.transform.position = vec3(5, 0, 0);

    const cubeGeo =  createCube(1.0);
    const cube = new GameObject(new Mesh(gl, cubeGeo, shaderProgram), purpleMat);
 
    const sphereGeo = createSphere(1.0, 32, 32);
    const sphere = new GameObject(new Mesh(gl, sphereGeo, shaderProgram, purpleMat));
    sphere.transform.position = vec3(2, 0, 0);

    const cylinderGeo = createCylinder(0.5, 1.5, 32);
    const cylinder = new GameObject(new Mesh(gl, cylinderGeo, shaderProgram, purpleMat));
    cylinder.transform.position = vec3(-2, 0, 0);

    const prismGeo = createTriangularPrism(1.0, 2.0);
    const prism = new GameObject(new Mesh(gl, prismGeo, shaderProgram, purpleMat));
    prism.transform.position = vec3(-4, 0, 0);

    scene.add(cube);
    scene.add(sphere);
    scene.add(cylinder);
    scene.add(prism);
    scene.add(teapot);

    render();

});


function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    scene.draw(gl, shaderProgram);
    
    console.log(scene.gameObjects.length);
    scene.gameObjects[4].transform.rotation[1] += 0.1; // obj rotasyon

    requestAnimationFrame(render);
}


 