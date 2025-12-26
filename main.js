"use strict";

let canvas, gl, shaderProgram, scene, camera, aspect, VLoc, V,  PLoc, P, MLoc, M;  

async function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available" );

    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect =  canvas.width/canvas.height;
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    const vertexSource = await loadShaderSource("shaders/vertex.glsl");
    const fragmentSource = await loadShaderSource("shaders/fragment.glsl");
    
    shaderProgram = createProgram(gl, vertexSource, fragmentSource);
}


function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    scene.gameObjects[0].transform.rotation[1] += 0.1; // rotate cube
    scene.gameObjects[1].transform.rotation[1] -= 0.1; // rotate cube2

    scene.draw(gl, shaderProgram);

    requestAnimationFrame(render);
}

init().then(() => {
    gl.useProgram(shaderProgram);
 
    VLoc = gl.getUniformLocation(shaderProgram, "V");
    PLoc = gl.getUniformLocation(shaderProgram, "P");
    MLoc = gl.getUniformLocation(shaderProgram, "M");

    camera = new Camera(45, aspect, 0.01, 50);
    camera.position = vec3(0,0,30);

    P = camera.getProjectionMatrix();
    gl.uniformMatrix4fv(PLoc, false, flatten(P));

    V = camera.getViewMatrix();
    gl.uniformMatrix4fv(VLoc, false, flatten(V));

    const lightPosLoc = gl.getUniformLocation(shaderProgram, "lightPos");
    const viewPosLoc  = gl.getUniformLocation(shaderProgram, "viewPos");

    gl.uniform3fv(lightPosLoc, flatten(vec3(0, 10, 0)));
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

    const attribLocations = {
        position: gl.getAttribLocation(shaderProgram, "vPos"),
        color: gl.getAttribLocation(shaderProgram, "vCol"),
        normal: gl.getAttribLocation(shaderProgram, "vNormal")
    };

    let cubeGeometry = createColoredCube();
    const cube = new GameObject(new Mesh(gl, cubeGeometry.positions,cubeGeometry.colors, attribLocations, cubeGeometry.normals));
    const cube2 = new GameObject(new Mesh(gl, cubeGeometry.positions,cubeGeometry.colors, attribLocations, cubeGeometry.normals));

    scene = new Scene();
    scene.add(cube);
    scene.add(cube2);

    scene.gameObjects[0].transform.position = vec3(-3,0,0);
    scene.gameObjects[1].transform.position = vec3(3,0,0);

    render();

});



 