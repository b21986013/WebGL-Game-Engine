import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm';
import { createCube } from "../geometry/Cube.js";
import { Texture } from '../core/Texture.js';
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

const activeObjectFolder = gui.addFolder("Active Object"); 
let activeObjectController;

function withActiveObject(scene, fn) {
    return v => {
        if (!scene.activeObject) {
            console.warn("No active object selected");
            return;
        }
        fn(scene.activeObject, v);
    };
}


export function createGlobalObjectSelector(scene) {
    const state = {
        selectedObject: "None",
    };

    function buildOptions() {
        const options = {};
        scene.gameObjects.forEach((obj, index) => {
            if(obj.selectable){
                options[`${obj.name}${index}`] = index;
            }
        });

        return options;
    }

    function rebuild() {
        if (activeObjectController) activeObjectController.destroy();
        activeObjectController = activeObjectFolder
            .add(state, "selectedObject", buildOptions())
            .name("Selected")
            .onChange(v => {
                scene.setActiveObjectByIndex(Number(v));
            });
    }

    rebuild();
}

// ============================
// LIGHT GUI
// ============================
export function createLightGUI() {
    const state = {
        lightType: 0,

        dirX: -1,
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
export function createSceneGUI(scene, gl, shaderProgram) {
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
                defaultMat, "Cube", true
            );

            cube.transform.position = vec3(
                Math.random() * 6 - 3,
                0,
                0
            );

            scene.add(cube);
            createGlobalObjectSelector(scene);
            scene.activeObject = null;
            console.log("Cube added");
        },

        addCylinder: () => {
            const defaultMat = new Material({
                color: vec3(1.0, 0, 1.0),
                shininess: 32,
                specularStrength: 0.5
            });
            const cylinder = new GameObject(new Mesh(gl, createCylinder(), shaderProgram), defaultMat, "Cylinder", true);
            cylinder.transform.position  = vec3(
                Math.random() * 6 - 3,
                0,
                0
            );
            scene.add(cylinder);
            createGlobalObjectSelector(scene);
            scene.activeObject = null;
             console.log("Cylinder added");
        },

        addPrism: ()=>{
            const defaultMat = new Material({
                color: vec3(1.0, 0, 0),
                shininess: 32,
                specularStrength: 0.5
            });
            const prism = new GameObject(new Mesh(gl, createTriangularPrism(1, 2.0), shaderProgram), defaultMat, "Prism", true);
            prism.transform.position = new vec3(Math.random() * 10 - 5, 0, 0);
            scene.add(prism);
            createGlobalObjectSelector(scene);
            scene.activeObject = null;
            console.log("Prism added.");
        },

        addSphere:()=>{
            const defaultMat = new Material({
                color: vec3(1.0, 1.0, 0.0),
                shininess: 32,
                specularStrength: 0.5
            });
            const sphere = new GameObject(new Mesh(gl, createSphere(0.5), shaderProgram), defaultMat, "Sphere", true);
            sphere.transform.position = new vec3(Math.random() * 6 - 3, 0, 0);
            scene.add(sphere);
            scene.activeObject = null;
            createGlobalObjectSelector(scene);
            console.log("sphere added");
        },

        objectCount: () => {
            console.log("Scene object count:", scene.gameObjects.length);
        }
    };

    const sceneFolder = gui.addFolder("Add Geometric Objects");
    sceneFolder.add(state, "addCube").name("Add Cube");
    sceneFolder.add(state, "addSphere").name("Add Sphere");
    sceneFolder.add(state, "addPrism").name("Add Prism");
    sceneFolder.add(state, "addCylinder").name("Add Cylinder");
    sceneFolder.add(state, "objectCount").name("Log Object Count");
    sceneFolder.close();
}


export function createTransformGUI(scene) {

    const state = {
        posX: 0, posY: 0, posZ: 0,
        rotX: 0, rotY: 0, rotZ: 0,
        scaleX: 1, scaleY: 1, scaleZ: 1
    };

    const folder = gui.addFolder("Transform");
    folder.close();

    // ===== Helper =====
    const guard = (fn) => withActiveObject(scene, fn);

    // ===== Position =====
    const pos = folder.addFolder("Position");
    pos.add(state, "posX", -10, 10, 0.1)
        .onChange(guard((obj, v) => obj.transform.position[0] = v));

    pos.add(state, "posY", -10, 10, 0.1)
        .onChange(guard((obj, v) => obj.transform.position[1] = v));

    pos.add(state, "posZ", -10, 10, 0.1)
        .onChange(guard((obj, v) => obj.transform.position[2] = v));

    // ===== Rotation =====
    const rot = folder.addFolder("Rotation");
    rot.add(state, "rotX", -180, 180, 1)
        .onChange(guard((obj, v) => obj.transform.rotation[0] = v));

    rot.add(state, "rotY", -180, 180, 1)
        .onChange(guard((obj, v) => obj.transform.rotation[1] = v));

    rot.add(state, "rotZ", -180, 180, 1)
        .onChange(guard((obj, v) => obj.transform.rotation[2] = v));

    // ===== Scale =====
    const scl = folder.addFolder("Scale");
    scl.add(state, "scaleX", 0.1, 5, 0.1)
        .onChange(guard((obj, v) => obj.transform.scale[0] = v));

    scl.add(state, "scaleY", 0.1, 5, 0.1)
        .onChange(guard((obj, v) => obj.transform.scale[1] = v));

    scl.add(state, "scaleZ", 0.1, 5, 0.1)
        .onChange(guard((obj, v) => obj.transform.scale[2] = v));

    // ===== Sync GUI ← Object =====
    function syncFromObject() {
        if (!scene.activeObject) return;

        const t = scene.activeObject.transform;

        state.posX = t.position[0];
        state.posY = t.position[1];
        state.posZ = t.position[2];

        state.rotX = t.rotation[0];
        state.rotY = t.rotation[1];
        state.rotZ = t.rotation[2];

        state.scaleX = t.scale[0];
        state.scaleY = t.scale[1];
        state.scaleZ = t.scale[2];

        folder.controllersRecursive().forEach(c => c.updateDisplay());
    }

    scene.onActiveObjectChangedSyncTransform = syncFromObject;
    syncFromObject();
}


export function createMaterialGUI(scene) {

    const state = {
        R: 0,
        G: 0,
        B: 0,
        shininess: 32,
        specularStrength: 0.5
    };

    const folder = gui.addFolder("Material");
    folder.close();

    const guard = fn => withActiveObject(scene, fn);

    // ===== Color =====
    const colorFolder = folder.addFolder("Color");

    colorFolder.add(state, "R", 0, 1, 0.01)
        .onChange(guard((obj, v) => obj.material.color[0] = v));

    colorFolder.add(state, "G", 0, 1, 0.01)
        .onChange(guard((obj, v) => obj.material.color[1] = v));

    colorFolder.add(state, "B", 0, 1, 0.01)
        .onChange(guard((obj, v) => obj.material.color[2] = v));

    // ===== Material Params =====
    folder.add(state, "shininess", 1, 128, 1)
        .onChange(guard((obj, v) => obj.material.shininess = v));

    folder.add(state, "specularStrength", 0.0, 1.0, 0.01)
        .onChange(guard((obj, v) => obj.material.specularStrength = v));

    // ===== Sync GUI ← Object =====
    function syncFromObject() {
        if (!scene.activeObject) return;

        const mat = scene.activeObject.material;

        state.R = mat.color[0];
        state.G = mat.color[1];
        state.B = mat.color[2];

        state.shininess = mat.shininess;
        state.specularStrength = mat.specularStrength;

        folder.controllersRecursive().forEach(c => c.updateDisplay());
    }

    scene.onActiveObjectChangedSyncMaterial = syncFromObject;
    syncFromObject();
}


export function createTextureGUI(scene, gl) {

    const guard = fn => withActiveObject(scene, fn);

    const state = {
        applyCheckerTexture: guard((obj) => {
            obj.material = new Material({
                color: vec3(1, 1, 1),
                shininess: 64,
                specularStrength: 1.0,
                texture: new Texture(gl, "./textures/checker.png")
            });
        })
    };

    const textureFolder = gui.addFolder("Apply Preset Textures");
    textureFolder.close();

    textureFolder
        .add(state, "applyCheckerTexture")
        .name("Apply Checker Texture");
}
