import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

const saturnViewScale = 1_000_000_000; // meters/unit
const solarViewPlanetScale = 500_000_000;
const solarViewScale = 1_000_000_000_000; // meters/unit

const saturnRadius = 120_536_000 / 2;

const titanRadius = 5_150_000 / 2;
const rheaRadius = 1_527_600 / 2;
const iapetusRadius = 1_468_600 / 2;
const dioneRadius = 1_122_800 / 2;
const tethysRadius = 1_062_200 / 2;
const enceladusRadius = 504_200 / 2;
const mimasRadius = 396_400 / 2;

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

const celestialBodyOutlineEffect = new OutlineEffect(renderer, {
    defaultThickness: 0.003,
    defaultColor: [1, 1, 1]
});

let orbitGeometry = new THREE.BufferGeometry().setFromPoints([]);
let orbitMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
let orbit = new THREE.Line(orbitGeometry, orbitMaterial);
scene.add(orbit);

let cassiniDataPointsSolarOrbit = [];
let cassiniCurrentIndexSolarOrbit = 0;
fetch("./assets/solar-orbit-data/cassini-position-log.txt").then(response => response.text()).then(text => {
    cassiniDataPointsSolarOrbit = parsePositionLogText(text, launchBeginDay, solarViewScale);
});

// for each element x in celestialBodyDataPoints
// x[0] stores a reference to the celestial body mesh
// x[1] stores the current data point index
// x[2] contains the actual data

// 0 - Sun
// 1 - Mercury
// 2 - Venus
// 3 - Earth
// 4 - Mars
// 5 - Jupiter
// 6 - Saturn
// 7 - Uranus
// 8 - Neptune
let celestialBodyDataPointsSolarOrbit = [];
let solarOrbitFileNames = [
    "sun-position-log.txt", "mercury-position-log.txt", "venus-position-log.txt", 
    "earth-position-log.txt", "mars-position-log.txt", "jupiter-position-log.txt", 
    "saturn-position-log.txt", "uranus-position-log.txt", "neptune-position-log.txt"
];
let solarOrbitMeshes = [
    sunMesh, mercuryMesh, venusMesh,
    earthMesh, marsMesh, jupiterMesh,
    saturnMesh, uranusMesh, neptuneMesh
]
for (let i = 0; i < solarOrbitFileNames.length; ++i) {
    fetch("./assets/solar-orbit-data/" + solarOrbitFileNames[i]).then(response => response.text()).then(text => {
        celestialBodyDataPointsSolarOrbit.push([solarOrbitMeshes[i], 0, parsePositionLogText(text, launchBeginDay, solarViewScale)]);
    });
}

let startDaySolarOrbit = 0;

let orbitMeshPoints = [];
let lastOrbitMeshPoint = new THREE.Vector3(0, 0, 0);

let animateOrbitProgression;
resetAnimateOrbitProgression();

export function halfScreenCanvas(elementWidth, elementHeight) {
    camera.aspect = elementWidth / 1.75 / elementHeight;
    renderer.setSize(elementWidth / 1.75, elementHeight);
}

function resetOrbitMesh() {
    orbitMeshPoints = [];
    orbit.geometry = new THREE.BufferGeometry();
}

export function initSolarView() {
    resetScene();
    resetOrbitMesh();

    scene.add(saturnMesh);
    saturnMesh.scale.x = 0.001 * saturnRadius / saturnViewScale;
    saturnMesh.scale.y = 0.002 * saturnRadius / saturnViewScale;
    saturnMesh.scale.z = 0.001 * saturnRadius / saturnViewScale;

    scene.add(sunMesh);
    scene.add(mercuryMesh);
    scene.add(venusMesh);
    scene.add(earthMesh);
    scene.add(marsMesh);
    scene.add(jupiterMesh);
    scene.add(uranusMesh);
    scene.add(neptuneMesh);

    scene.add(orbit);

    directionalLight.intensity = 1;
    ambientLight.intensity = 0;
    positionCamera(0, 1, 0, 0, 0, 0, 1);

    render = () => {
        celestialBodyOutlineEffect.render(scene, camera);
    };
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
        result.push([time, position[0], position[2], position[1]]);
    }
    return result;
}

export function progressOrbitSolar(endDay, duration) {
    resetTimer();

    let startDay = startDaySolarOrbit;
    let timeSpan = endDay - startDay;
    let daysPerSecond = timeSpan / duration;

    let dateElement = document.getElementById("date");
    let dayCountElement = document.getElementById("day-count");

    animateOrbitProgression = (time) => {
        let currentDay = startDay + daysPerSecond * time;

        // disgusting code to update the date. don't bother looking at it too hard. it works. probably.
        let daysSinceLaunch = currentDay;
        if (endDay <= 1) {
            currentDay = 1;
            daysSinceLaunch = 0;
        }
        dayCountElement.innerHTML = "<b>Days since launch: " + Math.round(daysSinceLaunch) + "</b><br>(" + Math.round(daysSinceLaunch / 3.65) / 100 + " Earth years)";
        let currentDate = new Date(launchBeginDate.getTime() + daysSinceLaunch * 24 * 60 * 60 * 1000);
        let currentDateText = String(currentDate);
        currentDateText = currentDateText.slice(0, 4) + "<b>" + currentDateText.slice(4, 16) + "</b>" + currentDateText.slice(16);
        dateElement.innerHTML = currentDateText;
        
        if (currentDay > endDay) {
            resetAnimateOrbitProgression();
        }

        let dataPoint = cassiniDataPointsSolarOrbit[cassiniCurrentIndexSolarOrbit];
        while (currentDay > dataPoint[0]) {
            let orbitMeshPoint = new THREE.Vector3(dataPoint[1], dataPoint[2], dataPoint[3]);
            if (new THREE.Vector3(orbitMeshPoint.x - lastOrbitMeshPoint.x, orbitMeshPoint.y - lastOrbitMeshPoint.y, orbitMeshPoint.z - lastOrbitMeshPoint.z).length() > 0.0005) {
                orbitMeshPoints.push(orbitMeshPoint);
                orbitGeometry.dispose();
                orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitMeshPoints);
                orbit.geometry = orbitGeometry;
                lastOrbitMeshPoint = orbitMeshPoint.clone();
            }
            dataPoint = cassiniDataPointsSolarOrbit[++cassiniCurrentIndexSolarOrbit];
        }

        for (let i = 0; i < celestialBodyDataPointsSolarOrbit.length; ++i) {
            let celestialBodyData = celestialBodyDataPointsSolarOrbit[i];

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

    startDaySolarOrbit = endDay;
}

// --- SATURN VIEW ---

const maxOrbitDataPoints = 1000;

let cassiniDataPointsSaturnOrbit = [];
let cassiniCurrentIndexSaturnOrbit = 0;
fetch("./assets/saturn-orbit-data/cassini-position-log.txt").then(response => response.text()).then(text => {
    cassiniDataPointsSaturnOrbit = parsePositionLogText(text, saturnBeginDay, saturnViewScale);
});

// 0 - Saturn
// 1 - Titan
// 2 - Iapetus
// 3 - Dione
// 4 - Tethys
// 5 - Enceladus
// 6 - Mimas
let celestialBodyDataPointsSaturnOrbit = [];
let saturnOrbitFileNames = [
    "saturn-position-log.txt", "titan-position-log.txt", "rhea-position-log.txt", "iapetus-position-log.txt", "dione-position-log.txt", "tethys-position-log.txt", "enceladus-position-log.txt", "mimas-position-log.txt"
];
let saturnOrbitMeshes = [
    saturnMesh, titanMesh, rheaMesh, iapetusMesh, dioneMesh, tethysMesh, enceladusMesh, mimasMesh
];
for (let i = 0; i < saturnOrbitFileNames.length; ++i) {
    fetch("./assets/saturn-orbit-data/" + saturnOrbitFileNames[i]).then(response => response.text()).then(text => {
        celestialBodyDataPointsSaturnOrbit.push([saturnOrbitMeshes[i], 0, parsePositionLogText(text, saturnBeginDay, saturnViewScale)]);
    });
}

let startDaySaturnOrbit = 0;

export function initSaturnView() {
    resetScene();
    resetOrbitMesh()

    scene.add(saturnMesh);
    saturnMesh.scale.x = 0.001 * saturnRadius / saturnViewScale;
    saturnMesh.scale.y = 0.002 * saturnRadius / saturnViewScale;
    saturnMesh.scale.z = 0.001 * saturnRadius / saturnViewScale;

    scene.add(titanMesh);
    scene.add(rheaMesh);
    scene.add(iapetusMesh);
    scene.add(dioneMesh);
    scene.add(tethysMesh);
    scene.add(enceladusMesh);
    scene.add(mimasMesh);
    
    scene.add(orbit);
    
    directionalLight.intensity = 1;
    ambientLight.intensity = 0;
    positionCamera(0, 2, -2, 0, 0, 0, 1);

    render = () => {
        celestialBodyOutlineEffect.render(scene, camera);
    };
}

export function progressOrbitSaturn(endDay, duration) {
    resetTimer();

    let startDay = startDaySaturnOrbit;
    let timeSpan = endDay - startDay;
    let daysPerSecond = timeSpan / duration;

    let dateElement = document.getElementById("date");
    let dayCountElement = document.getElementById("day-count");

    animateOrbitProgression = (time) => {
        let currentDay = startDay + daysPerSecond * time;
        
        // disgusting code to update the date. don't bother looking at it too hard. it works. probably.
        let daysSinceLaunch = currentDay + saturnBeginDay - launchBeginDay;
        dayCountElement.innerHTML = "<b>Days since launch: " + Math.round(daysSinceLaunch) + "</b><br>(" + Math.round(daysSinceLaunch / 3.65) / 100 + " Earth years)";
        let currentDate = new Date(launchBeginDate.getTime() + daysSinceLaunch * 24 * 60 * 60 * 1000);
        let currentDateText = String(currentDate);
        currentDateText = currentDateText.slice(0, 4) + "<b>" + currentDateText.slice(4, 16) + "</b>" + currentDateText.slice(16);
        dateElement.innerHTML = currentDateText;
        
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