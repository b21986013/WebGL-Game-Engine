"use strict";

import { createSphere } from "./geometry/Sphere.js";
import { createCube } from "./geometry/Cube.js";
import { vec3,  flatten, normalMatrix } from "./mvNew.js";
import { Mesh } from "./core/Mesh.js";
import { Camera } from "./camera/Camera.js";
import { GameObject } from "./scene/GameObject.js";
import { Scene } from "./scene/Scene.js";
import { loadShaderSource, createProgram } from "./initshaders.js";



let gl, shaderProgram, scene, camera, aspect, VLoc, V,  PLoc, P, M;  


async function init() {
    const canvas = document.getElementById("gl-canvas");

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


init().then(() => {
    gl.useProgram(shaderProgram);
 
    VLoc = gl.getUniformLocation(shaderProgram, "V");
    PLoc = gl.getUniformLocation(shaderProgram, "P");

    camera = new Camera(45, aspect, 0.01, 50);
    camera.position = vec3(0,5,10);

    P = camera.getProjectionMatrix();
    gl.uniformMatrix4fv(PLoc, false, flatten(P));

    V = camera.getViewMatrix();
    gl.uniformMatrix4fv(VLoc, false, flatten(V));
    
    const shininessLoc = gl.getUniformLocation(shaderProgram, "shininess");
    const specularStrengthLoc = gl.getUniformLocation(shaderProgram, "specularStrength");
    const lightPosLoc = gl.getUniformLocation(shaderProgram, "lightPos");
    const viewPosLoc  = gl.getUniformLocation(shaderProgram, "viewPos");
    const objectColorLoc = gl.getUniformLocation(shaderProgram, "objectColor");


    gl.uniform3fv(lightPosLoc, flatten(vec3(0, -3, 5)));
    gl.uniform3fv(viewPosLoc, flatten(camera.position));
    gl.uniform3fv(objectColorLoc, flatten(vec3(1.0, 0.0, 1.0)));    

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

    const cubeGeo =  createCube(1.0);
    const cube = new GameObject(new Mesh(gl, cubeGeo, shaderProgram));
 
    const sphereGeo = createSphere(1.0, 32, 32);
    const sphere = new GameObject(new Mesh(gl, sphereGeo, shaderProgram));
    sphere.transform.position = vec3(2, 0, 0);

    scene.add(cube);
    scene.add(sphere);
 
    gl.uniform1f(shininessLoc, 32.0);        
    gl.uniform1f(specularStrengthLoc, 0.5);  

    render();

});


function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    scene.gameObjects[0].transform.rotation[1] += 0.1; 

    scene.draw(gl, shaderProgram);

    requestAnimationFrame(render);
}


 