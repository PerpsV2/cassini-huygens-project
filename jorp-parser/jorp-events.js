import * as GRAPHICS from './graphic.js';

// set the position of an object to be inside of a slide
// args []
export function i(el, args) {
    el.classList.add("in");
    el.classList.remove("left");
    el.classList.remove("right");
    el.classList.remove("up");
    el.classList.remove("down");
}

// set the position of an object to be left of the slide
// args []
export function l(el, args) {
    el.classList.add("left");
    el.classList.remove("in");
    el.classList.remove("right");
}

// set the position of an object to be right of the slide
// args []
export function r(el, args) {
    el.classList.add("right");
    el.classList.remove("in");
    el.classList.remove("left");
}

// set the position of an object to be above the slide
// args []
export function u(el, args) {
    el.classList.add("up");
    el.classList.remove("in");
    el.classList.remove("down");
}

// set the position of an object to be below the slide
// args []
export function d(el, args) {
    el.classList.add("down");
    el.classList.remove("in");
    el.classList.remove("up");
}

// show an object
// args []
export function s(el, args) {
    el.classList.add("show");
    el.classList.remove("hide");
}

// hide an object
// args []
export function h(el, args) {
    el.classList.add("hide");
    el.classList.remove("show");
}

// play a video
// args []
export function play(el, args) {
    el.play();
}

// set the transition duration of an object
// args [], args [transitionDuration]
export function t(el, args) {
    if (args.length <= 0) el.classList.add("trans");
    else el.style.transitionDuration = String(args[0]);
}

// remove any transition duration of an object
// args []
export function line(el, args) {
    el.classList.remove("trans");
    el.style.transitionDuration = "0";
}

// initialize THREE.js canvas
// args [canvasWidth, canvasHeight]
export function initializeCanvas(el, args) {
    el.style.width = args[0];
    el.style.height = args[1];
    GRAPHICS.initCanvas(el, el.clientWidth, el.clientHeight);
}

// set the canvas to only take up half of the screen
// args []
export function halfScreenCanvas(el, args) {
    GRAPHICS.halfScreenCanvas(el.clientWidth, el.clientHeight);
}

// initialize the scene for a specific scene
// args [sceneType]
export function initializeCanvasScene(el, args) {
    switch (args[0]) {
        case "MODEL": GRAPHICS.initModelView(); break;
        case "SATURN": GRAPHICS.initSaturnView(); break;
        case "SOLAR": GRAPHICS.initSolarView(); break;
    }
}

// rotate camera around cassini-huygens model
// args [rotationalPeriod, distance, rotations]
export function orbitCamera(el, args) {
    GRAPHICS.orbitCamera(Number(args[0]), Number(args[1]), Number(args[2]));
}

// set camera position and a coordinate to look at
// args [cameraX, cameraY, cameraZ, lookAtX, lookAtY, lookAtZ, duration]
export function positionCamera(el, args) {
    GRAPHICS.positionCamera(Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3]), Number(args[4]), Number(args[5]), Number(args[6]))
}

// highlight an instrument on the cassini-huygens model
// args [instrumentName]
export function model_highlightInstrument(el, args) {
    switch (args[0]) {
        case "RTG": GRAPHICS.highlightInstrument(["RTG_1", "RTG_2"]); break;
        case "HUYGENS": GRAPHICS.highlightInstrument(["HUYGENS_1", "HUYGENS_2"]); break;
        case "DISH": GRAPHICS.highlightInstrument(["DISH_1", "DISH_2", "DISH_3"]); break;
        case "MAGNETOMETER": GRAPHICS.highlightInstrument(["BOOM"]); break;
        case "SPECTROMETER": GRAPHICS.highlightInstrument(["CAPS_INMS", "CI_1", "CI_2", "CI_3", "CI_4", "CI_5", "CIRS_1", "CIRS_2", "VIMS_1", "VIMS_2"]); break;
    }
}

// unhighlight all instruments on the cassini-huygens model
// args []
export function model_unhighlight(el, args) {
    GRAPHICS.unhighlightInstruments();
}

// progress Cassini's orbit around the Sun
// args [endDay, duration]
export function solar_progressOrbit(el, args) {
    GRAPHICS.progressSolarOrbits(Number(args[0]), Number(args[1]));
}

// progress Cassini's orbit around Saturn
// args [endDay, duration]
export function saturn_progressOrbit(el, args) {
    GRAPHICS.progressSaturnOrbits(Number(args[0]), Number(args[1]));
}