import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

const saturnViewScale = 1_000_000_000; // meters/unit
const saturnRadius = 120_536_000 / 2;
const titanRadius = 5_150_000 / 2;
const launchBeginDate = new Date(876904980000);
const launchBeginDay = 2450736;
const saturnBeginDay = 2453167;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});

const gltfLoader = new GLTFLoader();
const cassini = await gltfLoader.loadAsync("./assets/models/cassini-edited.glb");
const cassiniMesh = cassini.scene;
cassiniMesh.scale.y = 2;

const saturn = await gltfLoader.loadAsync("./assets/models/saturn.glb");
const saturnMesh = saturn.scene;
saturnMesh.scale.x = 0.001 * saturnRadius / saturnViewScale;
saturnMesh.scale.y = 0.002 * saturnRadius / saturnViewScale;
saturnMesh.scale.z = 0.001 * saturnRadius / saturnViewScale;

const titan = await gltfLoader.loadAsync("./assets/models/titan.glb");
const titanMesh = titan.scene;
titanMesh.scale.x = 0.01 * titanRadius / saturnViewScale;
titanMesh.scale.y = 0.02 * titanRadius / saturnViewScale;
titanMesh.scale.z = 0.01 * titanRadius / saturnViewScale;

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
    animateOrbitProgression(seconds);
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

function resetScene() {
    scene.clear();
    scene.add(directionalLight);
    scene.add(ambientLight);
}

export function initModelView() {
    resetScene();
    scene.add(cassiniMesh);
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

export function orbitCamera(rotationalFrequency, distance, rotations) {
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

// --- SATURN VIEW ---

const maxOrbitDataPoints = 1000;

let cassiniDataPointsSaturnOrbit = [];
let cassiniCurrentIndexSaturnOrbit = 0;
fetch("./assets/saturn-orbit-data/cassini-position-log.txt").then(response => response.text()).then(text => {
    cassiniDataPointsSaturnOrbit = parsePositionLogText(text, saturnBeginDay);
});

// 0 - Saturn
// 1 - Titan

// for each element x in celestialBodyDataPointsSaturnOrbit
// x[0] stores a reference to the celestial body mesh
// x[1] stores the current data point index
// x[2] contains the actual data
let celestialBodyDataPointsSaturnOrbit = [];
fetch("./assets/saturn-orbit-data/saturn-position-log.txt").then(response => response.text()).then(text => {
    celestialBodyDataPointsSaturnOrbit.push([saturnMesh, 0, parsePositionLogText(text, saturnBeginDay)]);
});
fetch("./assets/saturn-orbit-data/titan-position-log.txt").then(response => response.text()).then(text => {
    celestialBodyDataPointsSaturnOrbit.push([titanMesh, 0, parsePositionLogText(text, saturnBeginDay)]);
});

let orbitMeshPoints = [];
let startDaySaturnOrbit = 0;

let animateOrbitProgression;
resetAnimateOrbitProgression();

export function initSaturnView() {
    resetScene();
    scene.add(saturnMesh);
    scene.add(titanMesh);
    directionalLight.intensity = 1;
    ambientLight.intensity = 0;
    positionCamera(0, 2, 2, 0, 0, 0, 1);
}

export function halfScreenCanvas(elementWidth, elementHeight) {
    camera.aspect = elementWidth / 2 / elementHeight;
    renderer.setSize(elementWidth / 2, elementHeight);
}

function resetAnimateOrbitProgression() {
    animateOrbitProgression = (time) => {};
}

function parsePositionLogScientificNotation(input) {
    let numberComponents = input.split(/E\+/);
    let mantissa = Number(numberComponents[0]);
    let exponent = Number(numberComponents[1]);
    return mantissa * Math.pow(10, exponent) * 1000; // account for units being in kilometers
}

function parsePositionLogText(text, beginDay) {
    let result = [];
    let positionData = text.split("\n");
    for (let i = 0; i < positionData.length; i += 2) {
        let time = Number(positionData[i].split(" ")[0]) - saturnBeginDay;
        let position = positionData[i + 1]
            .split(/[a-zA-Z] =/)
            .map(x => x.trim())
            .filter(Boolean)
            .map(x => parsePositionLogScientificNotation(x) / saturnViewScale);
        result.push([time, position[0], position[2], position[1]]);
    }
    return result;
}

let lastOrbitMeshPoint = new THREE.Vector3(0, 0, 0);

export function progressOrbitSaturn(endDay, duration) {
    resetTimer();

    let orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitMeshPoints);
    let orbitMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
    let orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbit);

    let startDay = startDaySaturnOrbit;
    let timeSpan = endDay - startDay;
    let daysPerSecond = timeSpan / duration;

    let dateElement = document.getElementById("date");
    let dayCountElement = document.getElementById("day-count");

    animateOrbitProgression = (time) => {
        let currentDay = startDay + daysPerSecond * time;
        let daysSinceLaunch = currentDay + saturnBeginDay - launchBeginDay;
        dayCountElement.innerHTML = "<b>Days since launch: " + Math.round(daysSinceLaunch) + "</b><br>(" + Math.round(daysSinceLaunch / 3.65) / 100 + " Earth years)";
        let currentDate = new Date(launchBeginDate.getTime() + daysSinceLaunch * 24 * 60 * 60 * 1000);
        dateElement.innerText = currentDate;
        if (currentDay > endDay) {
            resetAnimateOrbitProgression();
        }

        let dataPoint = cassiniDataPointsSaturnOrbit[cassiniCurrentIndexSaturnOrbit];
        while (currentDay > dataPoint[0]) {
            let orbitMeshPoint = new THREE.Vector3(dataPoint[1], dataPoint[2], dataPoint[3]);
            if (new THREE.Vector3(orbitMeshPoint.x - lastOrbitMeshPoint.x, orbitMeshPoint.y - lastOrbitMeshPoint.y, orbitMeshPoint.z - lastOrbitMeshPoint.z).length() > 0.05) {
                orbitMeshPoints.push(orbitMeshPoint);
                if (orbitMeshPoints.length > maxOrbitDataPoints)
                    orbitMeshPoints.splice(0, orbitMeshPoints.length - maxOrbitDataPoints);
                orbitGeometry.dispose();
                orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitMeshPoints);
                orbit.geometry = orbitGeometry;
                lastOrbitMeshPoint = orbitMeshPoint.clone();
            }
            dataPoint = cassiniDataPointsSaturnOrbit[++cassiniCurrentIndexSaturnOrbit];
        }

        for (let i = 0; i < celestialBodyDataPointsSaturnOrbit.length; ++i) {
            let celestialBodyData = celestialBodyDataPointsSaturnOrbit[i];

            let celestialBodyMesh = celestialBodyData[0];
            let celestialBodyDataPointIndex = celestialBodyData[1];
            let celestialBodyDataPoint = celestialBodyData[2][celestialBodyDataPointIndex];
            while (currentDay > celestialBodyDataPoint[0]) {
                let celestialBodyPosition = new THREE.Vector3(celestialBodyDataPoint[1], celestialBodyDataPoint[2], celestialBodyDataPoint[3]);
                celestialBodyMesh.position.x = celestialBodyPosition.x;
                celestialBodyMesh.position.y = celestialBodyPosition.y;
                celestialBodyMesh.position.z = celestialBodyPosition.z;
                celestialBodyData[1]++;
                celestialBodyDataPoint = celestialBodyData[2][celestialBodyData[1]];
            }
        }
    }

    startDaySaturnOrbit = endDay;
}