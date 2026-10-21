import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});

const gltfLoader = new GLTFLoader();
const cassini = await gltfLoader.loadAsync("./assets/models/cassini-edited.glb");
const cassiniMesh = cassini.scene;
cassiniMesh.scale.y = 2;
scene.add(cassiniMesh);

const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(directionalLight);
scene.add(ambientLight);

let timer;
resetTimer();
function resetTimer() {
    timer = new THREE.Timer();
    timer.connect(document);
}

let animateCurrentMovement;
resetAnimateCurrentMovement()
let render;
resetRender()

function animate(time) {
    timer.update();
    let seconds = timer.getElapsed();
    animateCurrentMovement(seconds);
    render();
}

function resetAnimateCurrentMovement() {
    animateCurrentMovement = (time) => {};
}

function resetRender() {
    renderer.autoClear = true;
    render = () => { renderer.render(scene, camera) };
}

function lerp(start, end, progress) {
    return start + (end - start) * progress;
}

function smoothLerp(start, end, progress) {
    let smoothProgress = 3 * Math.pow(progress, 2) - 2 * Math.pow(progress, 3);
    return start + (end - start) * smoothProgress;
}

function sphericalLerp(startQuaternion, endQuaternion, progress) {
    return startQuaternion.slerp(endQuaternion, progress);
}

export function initCanvas(element, width, height) {
    camera.aspect = width / height;
    renderer.setSize(width, height);
    renderer.setAnimationLoop(animate);
    element.appendChild(renderer.domElement);
}

let prevCameraPosition = null;
let prevCameraLookAt = null;
export function positionCamera(x, y, z, lookAtX, lookAtY, lookAtZ, duration) {
    resetTimer();
    
    let cameraLookAt = new THREE.Vector3(lookAtX, lookAtY, lookAtZ);
    if (prevCameraPosition === null || prevCameraLookAt === null) {
        animateCurrentMovement = (time) => {
            camera.position.x = x;
            camera.position.y = y;
            camera.position.z = z;
            camera.lookAt(cameraLookAt);

            resetAnimateCurrentMovement();
            prevCameraPosition = camera.position;
            prevCameraLookAt = cameraLookAt;
        }
    }
    else {
        let startQuaternion = new THREE.Quaternion();
        startQuaternion.setFromEuler(camera.rotation);
        let endQuaternion = new THREE.Quaternion();
        let testCamera = new THREE.Camera();
        testCamera.position.x = x;
        testCamera.position.y = y;
        testCamera.position.z = z;
        testCamera.lookAt(cameraLookAt);
        endQuaternion.setFromEuler(testCamera.rotation);

        animateCurrentMovement = (time) => {
            let progress = time / duration;
            camera.setRotationFromQuaternion(sphericalLerp(startQuaternion, endQuaternion, progress));

            camera.position.x = smoothLerp(prevCameraPosition.x, x, progress);
            camera.position.y = smoothLerp(prevCameraPosition.y, y, progress);
            camera.position.z = smoothLerp(prevCameraPosition.z, z, progress);

            if (time >= duration) {
                resetAnimateCurrentMovement();
                prevCameraPosition = camera.position;
                prevCameraLookAt = cameraLookAt;
            }
        }
    }
}

export function orbitAroundModel(rotationalFrequency, distance, rotations) {
    resetTimer();

    animateCurrentMovement = (time) => {
        camera.position.z = distance * Math.cos(time * Math.PI * 2 * rotationalFrequency);
        camera.position.x = distance * Math.sin(time * Math.PI * 2 * rotationalFrequency);
        camera.position.y = distance * 2/3;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        if (time >= rotations / rotationalFrequency)
            resetAnimateCurrentMovement();
    }
}

const highlightedScene = new THREE.Scene();
const hsDirectionalLight = directionalLight.clone();
const hsAmbientLight = ambientLight.clone();
highlightedScene.add(hsDirectionalLight);
highlightedScene.add(hsAmbientLight);

const outlineEffect = new OutlineEffect(renderer, {
    defaultThickness: 0.003,
    defaultColor: [0.5, 1, 0.75]
});

export function highlightInstrument(targetNames) {
    let highlightedInstruments = [];
    cassiniMesh.traverse((mesh) => {
        if (targetNames.includes(mesh.name)) {
            highlightedInstruments.push(mesh);
            if (mesh.type !== "Group"){
                mesh.material = mesh.material.clone();
                mesh.originalColor = mesh.material.color;
                mesh.material.color = new THREE.Color(0x00ff00);
            }
        }
    });

    render = () => {
        let highlightedObjects = highlightedInstruments.slice();
        renderer.autoClear = false;
        renderer.clear();
        renderer.render(scene, camera);
        renderer.clearDepth();
        for (let i = 0; i < highlightedObjects.length; ++i) {
            let highlightedObj = highlightedObjects[i];
            highlightedScene.attach(highlightedObj);
        }
        outlineEffect.render(highlightedScene, camera);
    };
}

export function unhighlightInstruments() {
    let i = highlightedScene.children.length;
    while (i > 0) {
        let child = highlightedScene.children[i - 1];
        if (child.type === "Mesh" || child.type === "Group") { 
            scene.attach(child);
            if (child.type !== "Group")
                child.material.color = child.originalColor;
        }
        i--;
    }
    resetRender();
}
