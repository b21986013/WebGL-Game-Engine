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

    // gl.enable(gl.CULL_FACE);
    // gl.cullFace(gl.BACK);
    // gl.frontFace(gl.CCW);

    const vertexSource = await loadShaderSource("shaders/vertex.glsl");
    const fragmentSource = await loadShaderSource("shaders/fragment.glsl");
    
    shaderProgram = createProgram(gl, vertexSource, fragmentSource);
}


function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const normalMatrixLoc = gl.getUniformLocation(shaderProgram, "normalMatrix");
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix(scene.gameObjects[0].transform.getModelMatrix())));

    scene.gameObjects[0].transform.rotation[1] += 0.1;  

    scene.draw(gl, shaderProgram);

    requestAnimationFrame(render);
}

init().then(() => {
    gl.useProgram(shaderProgram);
 
    VLoc = gl.getUniformLocation(shaderProgram, "V");
    PLoc = gl.getUniformLocation(shaderProgram, "P");
    MLoc = gl.getUniformLocation(shaderProgram, "M");

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

    gl.uniform3fv(lightPosLoc, flatten(vec3(0, 0, 5)));
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

    scene = new Scene();

    let cubeGeometry = createColoredCube();
    const cube = new GameObject(new Mesh(gl, cubeGeometry.positions,cubeGeometry.colors, attribLocations, cubeGeometry.normals));

    scene.add(cube);
    scene.gameObjects[0].transform.position = vec3(0,0,0);

   
    gl.uniform1f(shininessLoc, 32.0);        
    gl.uniform1f(specularStrengthLoc, 0.5);  

    render();

});



 