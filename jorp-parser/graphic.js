import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

const saturnViewScale = 1_000_000_000; // meters/unit
const solarViewPlanetScale = 500_000_000;
const solarViewScale = 1_000_000_000_000; // meters/unit

const saturnRadius = 120_536_000 / 2;

const titanRadius = 5_150_000 / 2;
const rheaRadius = 5_150_000 / 2;
const iapetusRadius = 5_150_000 / 2;
const dioneRadius = 5_150_000 / 2;
const tethysRadius = 5_150_000 / 2;
const enceladusRadius = 5_150_000 / 2;
const mimasRadius = 5_150_000 / 2;

const mercuryRadius = 4_879_000 / 2;
const venusRadius = 12_104_000 / 2;
const earthRadius = 12_756_000 / 2;
const marsRadius = 6_792_000 / 2;

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

// --- SATURN SYSTEM ASSETS ---

const saturn = await gltfLoader.loadAsync("./assets/models/saturn.glb");
const saturnMesh = saturn.scene;

const titan = await gltfLoader.loadAsync("./assets/models/titan.glb");
const titanMesh = titan.scene;
titanMesh.scale.x = 0.01 * titanRadius / saturnViewScale;
titanMesh.scale.y = 0.02 * titanRadius / saturnViewScale;
titanMesh.scale.z = 0.01 * titanRadius / saturnViewScale;

const rhea = await gltfLoader.loadAsync("./assets/models/rhea.glb");
const rheaMesh = rhea.scene;
rheaMesh.scale.x = 0.01 * rheaRadius / saturnViewScale;
rheaMesh.scale.y = 0.02 * rheaRadius / saturnViewScale;
rheaMesh.scale.z = 0.01 * rheaRadius / saturnViewScale;

const iapetus = await gltfLoader.loadAsync("./assets/models/iapetus.glb");
const iapetusMesh = iapetus.scene;
iapetusMesh.scale.x = 0.01 * iapetusRadius / saturnViewScale;
iapetusMesh.scale.y = 0.02 * iapetusRadius / saturnViewScale;
iapetusMesh.scale.z = 0.01 * iapetusRadius / saturnViewScale;

const dione = await gltfLoader.loadAsync("./assets/models/dione.glb");
const dioneMesh = dione.scene;
dioneMesh.scale.x = 0.01 * dioneRadius / saturnViewScale;
dioneMesh.scale.y = 0.02 * dioneRadius / saturnViewScale;
dioneMesh.scale.z = 0.01 * dioneRadius / saturnViewScale;

const tethys = await gltfLoader.loadAsync("./assets/models/tethys.glb");
const tethysMesh = tethys.scene;
tethysMesh.scale.x = 0.01 * tethysRadius / saturnViewScale;
tethysMesh.scale.y = 0.02 * tethysRadius / saturnViewScale;
tethysMesh.scale.z = 0.01 * tethysRadius / saturnViewScale;

const enceladus = await gltfLoader.loadAsync("./assets/models/enceladus.glb");
const enceladusMesh = enceladus.scene;
enceladusMesh.scale.x = 0.01 * enceladusRadius / saturnViewScale;
enceladusMesh.scale.y = 0.02 * enceladusRadius / saturnViewScale;
enceladusMesh.scale.z = 0.01 * enceladusRadius / saturnViewScale;

const mimas = await gltfLoader.loadAsync("./assets/models/mimas.glb");
const mimasMesh = mimas.scene;
mimasMesh.scale.x = 0.02 * mimasRadius / saturnViewScale;
mimasMesh.scale.y = 0.04 * mimasRadius / saturnViewScale;
mimasMesh.scale.z = 0.02 * mimasRadius / saturnViewScale;

// --- SOLAR SYSTEM ASSETS (excluding saturn) ---
const sun = await gltfLoader.loadAsync("./assets/models/sun.glb");
const sunMesh = sun.scene;
sunMesh.scale.x = 0.001 * saturnRadius / saturnViewScale;
sunMesh.scale.y = 0.002 * saturnRadius / saturnViewScale;
sunMesh.scale.z = 0.001 * saturnRadius / saturnViewScale;

const mercury = await gltfLoader.loadAsync("./assets/models/mercury.glb");
const mercuryMesh = mercury.scene;
mercuryMesh.scale.x = 0.001 * mercuryRadius / solarViewPlanetScale;
mercuryMesh.scale.y = 0.002 * mercuryRadius / solarViewPlanetScale;
mercuryMesh.scale.z = 0.001 * mercuryRadius / solarViewPlanetScale;

const venus = await gltfLoader.loadAsync("./assets/models/venus.glb");
const venusMesh = venus.scene;
venusMesh.scale.x = 0.001 * venusRadius / solarViewPlanetScale;
venusMesh.scale.y = 0.002 * venusRadius / solarViewPlanetScale;
venusMesh.scale.z = 0.001 * venusRadius / solarViewPlanetScale;

const earth = await gltfLoader.loadAsync("./assets/models/earth.glb");
const earthMesh = earth.scene;
earthMesh.scale.x = 0.001 * earthRadius / solarViewPlanetScale;
earthMesh.scale.y = 0.002 * earthRadius / solarViewPlanetScale;
earthMesh.scale.z = 0.001 * earthRadius / solarViewPlanetScale;

const mars = await gltfLoader.loadAsync("./assets/models/mars.glb");
const marsMesh = mars.scene;
marsMesh.scale.x = 0.001 * marsRadius / solarViewPlanetScale;
marsMesh.scale.y = 0.002 * marsRadius / solarViewPlanetScale;
marsMesh.scale.z = 0.001 * marsRadius / solarViewPlanetScale;

const jupiter = await gltfLoader.loadAsync("./assets/models/jupiter.glb");
const jupiterMesh = jupiter.scene;
jupiterMesh.scale.x = 0.001 * saturnRadius / saturnViewScale;
jupiterMesh.scale.y = 0.002 * saturnRadius / saturnViewScale;
jupiterMesh.scale.z = 0.001 * saturnRadius / saturnViewScale;

const uranus = await gltfLoader.loadAsync("./assets/models/uranus.glb");
const uranusMesh = uranus.scene;
uranusMesh.scale.x = 0.001 * saturnRadius / saturnViewScale;
uranusMesh.scale.y = 0.002 * saturnRadius / saturnViewScale;
uranusMesh.scale.z = 0.001 * saturnRadius / saturnViewScale;

const neptune = await gltfLoader.loadAsync("./assets/models/neptune.glb");
const neptuneMesh = neptune.scene;
neptuneMesh.scale.x = 0.001 * saturnRadius / saturnViewScale;
neptuneMesh.scale.y = 0.002 * saturnRadius / saturnViewScale;
neptuneMesh.scale.z = 0.001 * saturnRadius / saturnViewScale;

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

// --- SOLAR VIEW ---

let animateOrbitProgression;
resetAnimateOrbitProgression();

// each entry contains mesh?, orbit colour, and position log file
let solarOrbitDataReferences = [
    { mesh: sunMesh, orbitColour: 0xffffff, positionLog: "sun-position-log.txt" },
    { mesh: mercuryMesh, orbitColour: 0x7d7d7d, positionLog: "mercury-position-log.txt" },
    { mesh: venusMesh, orbitColour: 0xff9408, positionLog: "venus-position-log.txt" },
    { mesh: earthMesh, orbitColour: 0x00fff2, positionLog: "earth-position-log.txt" },
    { mesh: marsMesh, orbitColour: 0xff4f19, positionLog: "mars-position-log.txt" },
    { mesh: jupiterMesh, orbitColour: 0x805613, positionLog: "jupiter-position-log.txt" },
    { mesh: saturnMesh, orbitColour: 0xa69632, positionLog: "saturn-position-log.txt" },
    { mesh: uranusMesh, orbitColour: 0xc4faff, positionLog: "uranus-position-log.txt" },
    { mesh: neptuneMesh, orbitColour: 0x006bd6, positionLog: "neptune-position-log.txt" },
    { mesh: null, orbitColour: 0xffff00, positionLog: "cassini-position-log.txt" }
];
let solarOrbitData = constructOrbitData("./assets/solar-orbit-data/", solarOrbitDataReferences, launchBeginDay, solarViewScale);
let startDaySolarOrbit = 0;

function constructOrbitData(rootFilePath, references, beginDay, viewScale) {
    let solarOrbitData = [];
    for (let i = 0; i < references.length; ++i) {
        let reference = references[i];
        let orbitGeometry = new THREE.BufferGeometry();
        let orbitMaterial = new THREE.LineBasicMaterial({color: reference.orbitColour});
        let orbitMesh = new THREE.Line(orbitGeometry, orbitMaterial);
        fetch(rootFilePath + reference.positionLog).then(response => response.text()).then(text => {
            let positionDataPoints = parsePositionLogText(text, beginDay, viewScale);
            solarOrbitData.push({
                orbitMeshGeometry: orbitGeometry,
                orbitMesh: orbitMesh,
                orbitMeshPoints: [],
                lastOrbitMeshPoint: new THREE.Vector3(0, 0, 0),
                dataPoints: positionDataPoints,
                dataPointIndex: 0,
                mesh: reference.mesh
            });
        })
    }
    return solarOrbitData;
}

export function halfScreenCanvas(elementWidth, elementHeight) {
    camera.aspect = elementWidth / 1.75 / elementHeight;
    renderer.setSize(elementWidth / 1.75, elementHeight);
}

function initMeshes(orbitDataList) {
    for (let i = 0; i < orbitDataList.length; ++i) {
        let orbitData = orbitDataList[i];
        if (orbitData.mesh)
            scene.add(orbitData.mesh);
        scene.add(orbitData.orbitMesh);
    }
}

export function initSolarView() {
    resetScene();

    initMeshes(solarOrbitData);

    saturnMesh.scale.x = 0.001 * saturnRadius / saturnViewScale;
    saturnMesh.scale.y = 0.002 * saturnRadius / saturnViewScale;
    saturnMesh.scale.z = 0.001 * saturnRadius / saturnViewScale;

    directionalLight.intensity = 1;
    ambientLight.intensity = 0;
    positionCamera(0, 1, 0, 0, 0, 0, 1);
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

function parsePositionLogText(text, beginDay, scale) {
    let result = [];
    let positionData = text.split(/\r?\n/);
    for (let i = 0; i < positionData.length; i += 2) {
        let time = Number(positionData[i].split(" ")[0]) - beginDay;
        let position = positionData[i + 1]
            .split(/[a-zA-Z] =/)
            .map(x => x.trim())
            .filter(Boolean)
            .map(x => parsePositionLogScientificNotation(x) / scale);
        result.push({
            time: time, 
            x: position[0], 
            y: position[2], 
            z: position[1]
        });
    }
    return result;
}

function updateDate(daysSinceLaunch) {
    let dateElement = document.getElementById("date");
    let dayCountElement = document.getElementById("day-count");

    dayCountElement.innerHTML = "<b>Days since launch: " + Math.round(daysSinceLaunch) + "</b><br>(" + Math.round(daysSinceLaunch / 3.65) / 100 + " Earth years)";
    let currentDate = new Date(launchBeginDate.getTime() + daysSinceLaunch * 24 * 60 * 60 * 1000);
    let currentDateText = String(currentDate);
    currentDateText = currentDateText.slice(0, 4) + "<b>" + currentDateText.slice(4, 16) + "</b>" + currentDateText.slice(16);
    dateElement.innerHTML = currentDateText;
}

function progressOrbits(startDay, startDaySetter, endDay, duration, orbitDataList, maxOrbitPoints, moveTolerance = 0.0005, dateOffset = 0) {
    resetTimer();

    let timeSpan = endDay - startDay;
    let daysPerSecond = timeSpan / duration;

    animateOrbitProgression = (time) => {
        let currentDay = startDay + daysPerSecond * time;
        // duct tape patch for funny dates when loading scene
        let daysSinceLaunch = currentDay + dateOffset;
        if (endDay <= 1) {
            currentDay = 1;
            daysSinceLaunch = 0;
        }
        updateDate(daysSinceLaunch);
        
        if (currentDay > endDay) {
            resetAnimateOrbitProgression();
        }

        for (let i = 0; i < orbitDataList.length; ++i) {
            let orbitData = orbitDataList[i];
            let dataPoint = orbitData.dataPoints[orbitData.dataPointIndex];
            while (currentDay > dataPoint.time) {
                let orbitMeshPoint = new THREE.Vector3(dataPoint.x, dataPoint.y, dataPoint.z);
                if (orbitMeshPoint.distanceTo(orbitData.lastOrbitMeshPoint) > moveTolerance) {
                    orbitData.orbitMeshPoints.push(orbitMeshPoint);
                    if (orbitData.orbitMeshPoints.length > maxOrbitPoints)
                        orbitData.orbitMeshPoints.splice(0, orbitData.orbitMeshPoints.length - maxOrbitPoints);

                    orbitData.orbitMeshGeometry.dispose();
                    orbitData.orbitMeshGeometry = new THREE.BufferGeometry().setFromPoints(orbitData.orbitMeshPoints);
                    orbitData.orbitMesh.geometry = orbitData.orbitMeshGeometry;

                    orbitData.lastOrbitMeshPoint = orbitMeshPoint.clone();

                    if (orbitData.mesh) {
                        orbitData.mesh.position.set(dataPoint.x, dataPoint.y, dataPoint.z);
                    }
                }
                dataPoint = orbitData.dataPoints[++orbitData.dataPointIndex];
            }
        }
    }

    startDaySetter(endDay);
}

export function progressSolarOrbits(endDay, duration) {
    progressOrbits(startDaySolarOrbit, (v) => {startDaySolarOrbit = v}, endDay, duration, solarOrbitData, 10000);
}

// --- SATURN VIEW ---

let saturnOrbitDataReferences = [
    { mesh: saturnMesh, orbitColour: 0xffffff, positionLog: "saturn-position-log.txt" },
    { mesh: titanMesh, orbitColour: 0x63531b, positionLog: "titan-position-log.txt" },
    { mesh: rheaMesh, orbitColour: 0x575757, positionLog: "rhea-position-log.txt" },
    { mesh: iapetusMesh, orbitColour: 0x13360f, positionLog: "iapetus-position-log.txt" },
    { mesh: dioneMesh, orbitColour: 0x999999, positionLog: "dione-position-log.txt" },
    { mesh: tethysMesh, orbitColour: 0xb8b8b8, positionLog: "tethys-position-log.txt" },
    { mesh: enceladusMesh, orbitColour: 0x20c9c1, positionLog: "enceladus-position-log.txt" },
    { mesh: mimasMesh, orbitColour: 0x6b1087, positionLog: "mimas-position-log.txt" },
    { mesh: null, orbitColour: 0xffff00, positionLog: "cassini-position-log.txt" }
];
let saturnOrbitData = constructOrbitData("./assets/saturn-orbit-data/", saturnOrbitDataReferences, saturnBeginDay, saturnViewScale);
let startDaySaturnOrbit = 0;

export function initSaturnView() {
    resetScene();
    resetAnimateOrbitProgression();
    saturnMesh.position.x = 0;
    saturnMesh.position.y = 0;
    saturnMesh.position.z = 0;

    saturnMesh.rotation.z = 0.09;
    saturnMesh.rotation.x = 3.5;

    initMeshes(saturnOrbitData);

    saturnMesh.scale.x = 0.001 * saturnRadius / saturnViewScale;
    saturnMesh.scale.y = 0.001 * saturnRadius / saturnViewScale;
    saturnMesh.scale.z = 0.001 * saturnRadius / saturnViewScale;
    
    directionalLight.intensity = 1;
    ambientLight.intensity = 0;
    positionCamera(0, 2, -2, 0, 0, 0, 1);
}

export function progressSaturnOrbits(endDay, duration) {
    progressOrbits(startDaySaturnOrbit, (v) => {startDaySaturnOrbit = v}, endDay, duration, saturnOrbitData, 1000, 0.05, saturnBeginDay - launchBeginDay);
}