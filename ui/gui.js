import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm';
import { createCube } from "../geometry/Cube.js";
import { createCylinder } from '../geometry/Cylinder.js'; 
import {createSphere} from '../geometry/Sphere.js';
import {createTriangularPrism} from '../geometry/Prism.js';
import { Mesh } from "../core/Mesh.js";
import { GameObject } from "../scene/GameObject.js";
import { Material } from "../core/Material.js";
import { vec3 } from "../mvNew.js";

// ============================
// SINGLE GUI ROOT
// ============================
export const gui = new GUI({ title: "Scene Controls" });

// ============================
// LIGHT GUI
// ============================
export function createLightGUI() {
    const state = {
        lightType: 0,

        dirX: -5,
        dirY: 1,
        dirZ: 1,

        posX: -1,
        posY: 0,
        posZ: 5,

        constant: 1.0,
        linear: 0.09,
        quadratic: 0.032
    };

    const lightFolder = gui.addFolder("Lights");

    lightFolder.add(state, "lightType", {
        Directional: 0,
        Point: 1
    }).name("Type");

    const dir = lightFolder.addFolder("Directional");
    dir.add(state, "dirX", -1, 1, 0.01);
    dir.add(state, "dirY", -1, 1, 0.01);
    dir.add(state, "dirZ", -1, 1, 0.01);

    const point = lightFolder.addFolder("Point");
    point.add(state, "posX", -10, 10, 0.1);
    point.add(state, "posY", -10, 10, 0.1);
    point.add(state, "posZ", -10, 10, 0.1);
    point.add(state, "constant", 0.1, 2.0, 0.01);
    point.add(state, "linear", 0.0, 1.0, 0.01);
    point.add(state, "quadratic", 0.0, 1.0, 0.01);

    lightFolder.close();

    return state;
}

// ============================
// SCENE GUI
// ============================
export function createSceneGUI(scene, gl, shaderProgram, materialGUI, transformGUI) {

    const state = {
        addCube: () => {

            const defaultMat = new Material({
            color: vec3(0.2, 0.6, 1.0),
            shininess: 32,
            specularStrength: 0.5
        });
            const cubeGeo = createCube(1.0);

            const cube = new GameObject(
                new Mesh(gl, cubeGeo, shaderProgram),
                defaultMat, "Cube"
            );

            cube.transform.position = vec3(
                Math.random() * 6 - 3,
                0,
                0
            );

            scene.add(cube);
            materialGUI.syncFromObject();
            materialGUI.buildObjectSelector();
            transformGUI.syncFromObject();
            transformGUI.buildObjectSelector();
            console.log("Cube added");
        },

        addCylinder: () => {
            const defaultMat = new Material({
                color: vec3(1.0, 0, 1.0),
                shininess: 32,
                specularStrength: 0.5
            });
            const cylinder = new GameObject(new Mesh(gl, createCylinder(), shaderProgram), defaultMat, "Cylinder");
            cylinder.transform.position  = vec3(
                Math.random() * 6 - 3,
                0,
                0
            );
            scene.add(cylinder);
            materialGUI.syncFromObject();
            materialGUI.buildObjectSelector();
            transformGUI.syncFromObject();
            transformGUI.buildObjectSelector();
             console.log("Cylinder added");
        },

        addPrism: ()=>{
            const defaultMat = new Material({
                color: vec3(1.0, 0, 0),
                shininess: 32,
                specularStrength: 0.5
            });
            const prism = new GameObject(new Mesh(gl, createTriangularPrism(1, 2.0), shaderProgram), defaultMat, "Prism");
            prism.transform.position = new vec3(Math.random() * 10 - 5, 0, 0);
            scene.add(prism);
            materialGUI.syncFromObject();
            materialGUI.buildObjectSelector();
            transformGUI.syncFromObject();
            transformGUI.buildObjectSelector();
            console.log("Prism added.");
        },

        addSphere:()=>{
            const defaultMat = new Material({
                color: vec3(1.0, 1.0, 0.0),
                shininess: 32,
                specularStrength: 0.5
            });
            const sphere = new GameObject(new Mesh(gl, createSphere(0.5), shaderProgram), defaultMat, "Sphere");
            sphere.transform.position = new vec3(Math.random() * 6 - 3, 0, 0);
            scene.add(sphere);
            materialGUI.syncFromObject();
            materialGUI.buildObjectSelector();
            transformGUI.syncFromObject();
            transformGUI.buildObjectSelector();
            console.log("sphere added");
        },

        objectCount: () => {
            console.log("Scene object count:", scene.gameObjects.length);
        }
    };

    const sceneFolder = gui.addFolder("Scene Manipulation");
    sceneFolder.add(state, "addCube").name("Add Cube");
    sceneFolder.add(state, "addSphere").name("Add Sphere");
    sceneFolder.add(state, "addPrism").name("Add Prism");
    sceneFolder.add(state, "addCylinder").name("Add Cylinder");
    sceneFolder.add(state, "objectCount").name("Log Object Count");
    sceneFolder.close();

    return state;
}


export function createTransformGUI(scene) {

    const state = {
        selectedIndex: 0,

        posX: 0, posY: 0, posZ: 0,
        rotX: 0, rotY: 0, rotZ: 0,
        scaleX: 1, scaleY: 1, scaleZ: 1
    };


    const folder = gui.addFolder("Transform");
    folder.close();

    let objectController, pos, rot, scl;

    function buildObjectOptions() {
        const options = {};
        scene.gameObjects.forEach((obj, i) => {
            options[`${obj.name} ${i}`] = String(i);
        });
        return options;
    }

    function buildObjectSelector() {
        if (objectController) {
            objectController.destroy();
        }

        objectController = folder
            .add(state, "selectedObject", buildObjectOptions())
            .name("Active Object")
            .onChange(v => {
                 
                const index = Number(v);
                scene.setActiveObjectByIndex(index);
                syncFromObject();

                if(pos || rot || scl)
                {
                    pos.destroy();
                    rot.destroy();
                    scl.destroy();
                }
                // ===== Position =====
                pos = folder.addFolder("Position");
                pos.add(state, "posX", -10, 10, 0.1).onChange(v => scene.activeObject.transform.position[0] = v);
                pos.add(state, "posY", -10, 10, 0.1).onChange(v => scene.activeObject.transform.position[1] = v);
                pos.add(state, "posZ", -10, 10, 0.1).onChange(v => scene.activeObject.transform.position[2] = v);

                // ===== Rotation (degrees → radians) =====
                rot = folder.addFolder("Rotation");
                rot.add(state, "rotX", -180, 180, 1).onChange(v => scene.activeObject.transform.rotation[0] = v);
                rot.add(state, "rotY", -180, 180, 1).onChange(v => scene.activeObject.transform.rotation[1] = v);
                rot.add(state, "rotZ", -180, 180, 1).onChange(v => scene.activeObject.transform.rotation[2] = v);

                // ===== Scale =====
                scl = folder.addFolder("Scale");
                scl.add(state, "scaleX", 0.1, 5, 0.1).onChange(v => scene.activeObject.transform.scale[0] = v);
                scl.add(state, "scaleY", 0.1, 5, 0.1).onChange(v => scene.activeObject.transform.scale[1] = v);
                scl.add(state, "scaleZ", 0.1, 5, 0.1).onChange(v => scene.activeObject.transform.scale[2] = v);
                
            });

         
    }

    // ===== Object Selector =====
    buildObjectSelector();

    
    // ===== Sync GUI ← Object =====
    function syncFromObject() {

        if(scene.activeObject){
            const t = scene.activeObject.transform;

        state.posX = t.position[0];
        state.posY = t.position[1]; 
        state.posZ = t.position[2];

        state.rotX = t.rotation[0] * 180 / Math.PI;
        state.rotY = t.rotation[1] * 180 / Math.PI;
        state.rotZ = t.rotation[2] * 180 / Math.PI;

        state.scaleX = t.scale[0];
        state.scaleY = t.scale[1];
        state.scaleZ = t.scale[2];

        folder.controllersRecursive().forEach(c => c.updateDisplay());
        }
        
    }

    scene.onActiveObjectChanged = () => {
        syncFromObject();
    };

    // İlk senkron
    if (scene.activeObject) syncFromObject();

    return {
        buildObjectSelector, syncFromObject
    };
}

export function createMaterialGUI(scene){
    const state = {
        selectedIndex:0,
        R: 0, G: 0, B: 0,
        shininess: 32,
        specularStrength: 0.5
    }

    const folder = gui.addFolder("Material");
    folder.close();

    let objectController;
     function buildObjectOptions() {
        const options = {};
        scene.gameObjects.forEach((obj, i) => {
            options[`${obj.name} ${i}`] = String(i);
        });
        return options;
    }

    function buildObjectSelector(){
        if (objectController) {
            objectController.destroy();
        }

        objectController = folder
            .add(state, "selectedObject", buildObjectOptions())
            .name("Active Object")
            .onChange(v => {
                const index = Number(v);
                scene.setActiveObjectByIndex(index);
                syncFromObject();

                folder.add(state, "R", 0, 1, 0.1).onChange(v => scene.activeObject.material.color[0] = v);
                folder.add(state, "G", 0, 1, 0.1).onChange(v => scene.activeObject.material.color[1] = v);
                folder.add(state, "B", 0, 1, 0.1).onChange(v => scene.activeObject.material.color[2] = v);
                folder.add(state, "shininess", 1, 128, 1).onChange(v => scene.activeObject.material.shininess = v);
                folder.add(state, "specularStrength", 0.0, 1.0, 0.01).onChange(v => scene.activeObject.material.specularStrength = v);
            });
    }

    // ===== Object Selector =====
    buildObjectSelector();
    
     // ===== Sync GUI ← Object =====
    function syncFromObject() {
        if(scene.activeObject){
            const defMat = scene.activeObject.material;

            state.R = defMat.color[0];
            state.G = defMat.color[1];
            state.B = defMat.color[2];

            state.shininess = defMat.shininess;
            state.specularStrength = defMat.specularStrength;

            folder.controllersRecursive().forEach(c => c.updateDisplay());
        }  
        
    }

    scene.onActiveObjectChanged = () => {
        syncFromObject();
    };
    
    // İlk senkron
    if (scene.activeObject) syncFromObject();

    return {
        syncFromObject, buildObjectSelector
    };
}