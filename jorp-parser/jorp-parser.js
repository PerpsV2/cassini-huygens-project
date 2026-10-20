import * as eventFunctions from "./jorp-events.js";

for (let key in eventFunctions) {
    if (typeof eventFunctions[key] === 'function') {
        window[key] = eventFunctions[key];
    }
}

// --- HELPER FUNCTIONS ---

function isLetter(char) {
    return char.length === 1 && char.match(/[a-z]/i);
}

function isQuote(char) {
    return char.length === 1 && char.match(/["']/);
}

function isKeywordChar(char) {
    return char.length === 1 && char.match(/[a-z0-9_-]/i)
}

function isOperator(char) {
    return char.length === 1 && char.match(/[+=*,;(){}&!/]/i);
}

function isDigit(char) {
    return char.length === 1 && char.match(/\d/);
}

function isKeyword(string) {
    for (let c = 0; c < string.length; ++c) {
        let char = string[c];
        if (!isKeywordChar(char)) return false;
        if (c === 0 && !isLetter(char)) return false; 
    } 
    return true;
}

// --- LEXER ---

// tokenize keywords
function lexKeyword(string) {
    let keywordToken = "";

    // continue checking for a keyword if the first character is a letter
    if (!isLetter(string[0])) return;

    // add characters to the keyword until a non keyword character is found
    for (let c = 0; c < string.length; ++c) {
        let char = string[c];
        if (!isKeywordChar(char)) {
            return {
                tokens: keywordToken,
                string: string.substring(c)
            };
        }
        keywordToken += char;
    }
}

// tokenize operators
function lexOperator(string) {
    // return the first character if it is an operator
    if (!isOperator(string[0])) return;

    return {
        tokens: string[0],
        string: string.substring(1)
    };
}


// tokenize numbers
function lexNumber(string) {
    let numberToken = "";

    // if the first character a number, continue checking
    if (!isDigit(string[0])) return;

    // add digits to the number until a non-numeric character is found
    for (let c = 0; c < string.length; ++c) {
        let char = string[c];
        if (!isDigit(char)) {
            return {
                tokens: Number.parseInt(numberToken),
                string: string.substring(c)
            };
        }
        numberToken += char;
    }
}

// tokenize strings
function lexString(string) {
    let stringToken = "";

    // if the first character is a quote, continue checking
    if (!isQuote(string[0])) return;

    // ignoring the initial quote, keep checking until a closing quote is found
    for (let c = 1; c < string.length; ++c) {
        let char = string[c];
        if (isQuote(char)) {
            return {
                tokens: stringToken,
                string: string.substring(c + 1)
            };
        }
        stringToken += char;
    }

    throw new Error("Unclosed quotation mark.");
}

// tokenize inner text
function lexInnerText(string) {
    let innerTextToken = "";

    // interpret the rest of the statement as innertext when a colon is found
    if (string[0] !== ":") return;
    // remove colon
    string = string.substring(1); 

    for (let c = 1; c < string.length; ++c) {
        let char = string[c];
        // ignore the first newline of innertext
        if (c === 1 && char === "\n") continue;
        if (char === ";") {
            return {
                tokens: [":", innerTextToken],
                string: string.substring(c)
            };
        }
        innerTextToken += char;
    }
}

// tokenize jorp file
function lex(string) {
    let tokens = [];

    while (string.length > 0) {
        let lexResult;
        let continueFlag = false;

        let subLexers = [
            lexKeyword, 
            lexOperator, 
            lexNumber, 
            lexString, 
            lexInnerText
        ];

        // loop through every sublexer
        for (let subLexer of subLexers) {
            lexResult = subLexer(string);
            // if the sublexer returned something, update the tokens and remaining string
            if (lexResult) {
                tokens = tokens.concat(lexResult.tokens);
                string = lexResult.string;
                continueFlag = true;
                break;
            }
        }
        if (continueFlag) continue;

        // ignore whitespace characters
        if (string[0].match(/\s/)) {
            string = string.substring(1);
        }
        // ignore single line comments
        else if (string.slice(0, 2) === "##") {
            string = string.slice(string.indexOf("\n"));
        }  
        // ignore multiline comments
        else if (string.slice(0, 2) === "#*") {
            string = string.slice(string.indexOf("*#") + 2);
        }
        else {
            throw new Error("Unrecognized symbol '" + string[0] + "' detected.");
        }
    }
    
    return tokens;
}

// --- PARSER ---

function parseFunctionArgs(tokens, func) {
    // add argument list to function if it doesn't already exist
    func.args ??= [];

    // this function has no parameters
    if (tokens[0] !== "(") return {tokens: tokens};
    tokens = tokens.slice(1);

    while (tokens[0] !== ")") {
        let token = tokens[0];
        // commas aren't technically required for function parameters
        if (token === ",")  {
            tokens = tokens.slice(1);
            continue;
        }
        func.args.push(token);
        tokens = tokens.slice(1);
    }

    tokens = tokens.slice(1);

    return {
        tokens: tokens
    };
}

// parses attributes and adds them to an object as a property
function parseAttributes(tokens, object = {}) {
    let functions = [];
    while (tokens[0] !== ";" && tokens[0] !== "{") {
        let token = tokens[0];

        // append attribute
        if (tokens[1] === "+") {
            if (tokens[2] !== "=")
                throw new Error("Expected in place addition operator for attribute");

            // special case: adding class to class list
            if (token === "class") token = "classList";

            let attribute = object[token];
            if (!(attribute instanceof DOMTokenList))
                throw new Error("In-place addition operator used on invalid attribute type");
            
            for (let className of tokens[3].split(" ")) {
                attribute.add(className);
            }
            tokens = tokens.slice(3);
        }

        // set attribute
        if (tokens[1] === "=") {
            if (!isKeyword(token))
                throw new Error("Invalid attribute name being set.");
            object[token] = tokens[2];
            tokens = tokens.slice(3);
        }

        // add following literal text
        else if (token === ":") {
            object.innerText = tokens[1];
            tokens = tokens.slice(2);
        }

        // push functions to functions array
        else {
            if (!isKeyword(token)) {
                console.log(tokens);
                throw new Error("Invalid function name found.");
                
            }
            let func = {};
            func.name = token;
            tokens = tokens.slice(1);

            let parseResult = parseFunctionArgs(tokens, func);
            functions.push(func);
            tokens = parseResult.tokens;
        }
    }

    return {
        tokens: tokens,
        functions: functions
    }
}

// parse and create a zone which may be attached to an element/flex
function parseZone(tokens, element) {
    if (tokens[0] !== "/")
        throw new Error("Invalid token for zone parser");
    tokens = tokens.slice(1)
    let zone = null;

    // create zone with specified zone name
    if (isKeyword(tokens[0])) {
        zone = createZone(tokens[0], element);
    }
    tokens = tokens.slice(1);

    return {
        tokens: tokens,
        zone: zone
    }
}

// parse and create a vertical or horizontal flex box with empty children div
function parseFlex(tokens) {
    let isVertical = null;
    // create flex element
    let element = document.createElement("div");
    element.style.display = "flex";

    // set flex to be either vertical or horizontal
    if (tokens[0] === "vertical-flex") {
        element.style.flexDirection = "column";
        isVertical = true;
    }

    if (tokens[0] === "horizontal-flex") {
        element.style.flexDirection = "row";
        isVertical = false;
    }

    // remove flex name token
    tokens = tokens.slice(1);

    // parse zone if it exists
    let zone = null;
    if (tokens[0] === "/") {
        let parseResult = parseZone(tokens, element);
        tokens = parseResult.tokens;
        zone = parseResult.zone;
    }

    // set relative children sizes
    let childSizeRatios = [0];
    for (let i = 0; i < tokens.length; ++i) {
        let token = tokens[i];
        if (token === "*")
            childSizeRatios[childSizeRatios.length - 1]++;
        else if (!isNaN(token)) 
            childSizeRatios[childSizeRatios.length - 1] += token;
        else if (token === ",")
            childSizeRatios.push(0);
        else {
            tokens = tokens.slice(i);
            break;
        }
    }

    if (childSizeRatios.includes(0)) {
        throw new Error("Flexbox missing relative child size.");
    }

    // calculate child sizes in percentage
    let totalChildrenSize = childSizeRatios.reduce(
        (accumulator, curr) => accumulator + curr, 0
    );

    // add empty div children to flex with correct size ratios
    for (let childSizeRatio of childSizeRatios) {
        // create child and adjust sizes
        let child = document.createElement("div");
        let childSize = (childSizeRatio / totalChildrenSize * 100).toString() + "%";
        child.style[isVertical ? "height" : "width"] = childSize;
        child.style[isVertical ? "width" : "height"] = "100%";
        // add class named empty to child
        child.classList.add("empty");
        // add child to flexbox
        element.appendChild(child);
    }

    return {
        element: element,
        tokens: tokens,
        zone: zone
    }
}

// creates an element using tag name and attributes
function parseElement(tokens) {
    let token = tokens[0];
    let element = null;
    let zone = null;

    // create an element based on the tag name provided
    if (token === "horizontal-flex" || token === "vertical-flex") {
        // create a flex box if the tag name is horizontal of vertical flex
        let parseResult = parseFlex(tokens);
        tokens = parseResult.tokens;
        element = parseResult.element;
        zone = parseResult.zone;
    }
    else  {
        // create an ordinary html element otherwise
        element = document.createElement(token);
        tokens = tokens.slice(1);

        // parse zone if it exists
        if (tokens[0] === "/") {
            let parseResult = parseZone(tokens, element);
            tokens = parseResult.tokens;
            zone = parseResult.zone;
        }
    }
    // parse attributes and add them to the element
    let parseResult = parseAttributes(tokens, element);
    tokens = parseResult.tokens;

    return {
        element: element,
        tokens: tokens,
        zone: zone
    }
}

// parse animation block
function parseAnim(tokens) {
    let animation = [];
    let parseResult = parseAttributes(tokens.slice(1), animation);
    tokens = parseResult.tokens;
    return {
        tokens: tokens,
        animation: animation
    }
}

function parseZoneIncrementAction(tokens) {
    let zoneName = tokens[0];
    let zoneAction = {
        zoneName: zoneName,
        operator: null,
        value: null
    }

    // set zone index
    if (tokens[1] === "=") {
        if (isNaN(tokens[2]))
            throw new Error("Zone increment must be set to a number");
        if (tokens[2] < 0)
            throw new Error("Zone increment cannot be greater or equal to zero");
        if (tokens[2] > zoneIncrements[zoneName].max)
            throw new Error("Zone increment does not correspond to a marked element (out of bounds)");

        zoneAction.operator = "set";
        zoneAction.value = tokens[2];

        tokens = tokens.slice(3)
    }

    // add to zone index
    else if (tokens[1] === "+") {
        zoneAction.operator = "add";
        if (tokens[2] != "=" && tokens[2] != "+")
            throw new Error("Unexpected token after addition to zone index");
        // in place addition of index
        else if (tokens[2] == "=") {
            if (isNaN(tokens[3]))
                throw new Error("In place addition of zone index must require a number");
            zoneAction.value = tokens[3];
            tokens = tokens.slice(4);
        }
        // increment index
        else if (tokens[2] == "+") {
            zoneAction.value = 1;
            tokens = tokens.slice(3);
        }
    }

    // subtract from zone index
    else if (tokens[1] === "-") {
        zoneAction.operator = "add";
        if (tokens[2] != "=" && tokens[2] != "-")
            throw new Error("Unexpected token after subtraction to zone index");
        // in place subtraction of index
        if (tokens[2] == "=") {
            if (isNaN(tokens[3]))
                throw new Error("In place subtraction of zone index must require a number");
            zoneAction.value = -tokens[3];
            tokens = tokens.slice(4);
        }
        // decrement index
        if (tokens[2] == "-") {
            zoneAction.value = -1;
            tokens = tokens.slice(3);
        }
    }

    // action on current zone element
    else {
        zoneAction.operator = "action";
        let parseResult = parseAttributes(tokens.slice(1));
        tokens = parseResult.tokens;
        zoneAction.value = parseResult.functions;
    }

    return {
        tokens: tokens,
        zoneAction: zoneAction
    }
}

function parseFrame(tokens, frames) {
    let frame = { actions: [] };
    let actions = null;
    let amount = 1;

    // parse frame attributes
    let parseResult = parseAttributes(tokens.slice(1), frame);
    tokens = parseResult.tokens;
    if (tokens[0] !== "{") 
        throw new Error("Anim properties should be followed by block '{}'");

    // parse frame amount property
    if (frame.amount && !isNaN(frame.amount)) {
        amount = frame.amount;
    }

    // remove opening brace
    tokens = tokens.slice(1);

    // parse contents of the frame
    while (tokens[0] !== "}") {
        let token = tokens[0];

        if (token === ";") {
            // add the accumulated list of actions to the frame
            if (actions)
                frame.actions = frame.actions.concat(structuredClone(actions));
            actions = null;
            tokens = tokens.slice(1);
        }

        else if (token === "frame") {
            if (actions)
                throw new Error("Missing semicolon between frame actions");
            // read and add properties of frame to a new object
            let frameId = {};
            let parseResult = parseAttributes(tokens, frameId);
            if (!frameId?.id)
                throw new Error("Frame action missing reference id");
            // check existing frames for a matching id
            let referencedFrame = frames.find((x) => x.id === frameId.id);
            // add the actions from the referenced frame to the list of actions
            actions = [].concat(referencedFrame.actions);
            tokens = parseResult.tokens;
        }

        // action on all marked elements of zone
        else if (token === "/") {
            // parse / operator and retrieve information about the zone
            actions = [];
            let zoneName = tokens[1];
            if (!zoneIncrements[zoneName])
                throw new Error("Invalid zone name in frame action");
            let maxZoneIncrement = zoneIncrements[zoneName].max;
            tokens = tokens.slice(2);

            // receive all functions executed on the zone
            let parseResult = parseAttributes(tokens);
            tokens = parseResult.tokens;

            // add an action to execute each function for every marked element in the zone
            for (let i = 0; i <= maxZoneIncrement; ++i) {
                actions.push({
                    id: zoneName + "-" + i,
                    functions: parseResult.functions
                })
            }
        }

        // action on zone index
        else if (Object.keys(zoneIncrements).includes(token)) {
            let parseResult = parseZoneIncrementAction(tokens, actions)
            actions = parseResult.zoneAction
            tokens = parseResult.tokens;
        }

        else {
            if (actions)
                throw new Error("Missing semicolon between frame actions");
            actions = {};
            let parseResult = parseAttributes(tokens, actions);
            actions.functions = parseResult.functions;
            tokens = parseResult.tokens;
        }
    }
    // remove closing brace
    tokens = tokens.slice(1);

    return {
        tokens: tokens,
        frame: frame,
        amount: amount
    }
}

function parseSlideContainer(tokens) {
    let attributes = {};
    let parseResult = parseAttributes(tokens, attributes);
    tokens = parseResult.tokens;
    if (!attributes?.id)
        throw new Error("Slide container declaration missing id");
    let element = document.getElementById(attributes.id);
    if (!element)
        throw new Error("Slide container reference id is invalid");
    for (let attribute in attributes) {
        element[attribute] = attributes[attribute];
    }
    return {
        tokens: tokens,
        element: element
    }
}

// slide zoning related functions
function createZone(name, element) {
    zoneIncrements[name] = {current: 0, max: null}
    return {
        name: name,
        root: element, 
        markedElements: []
    }
}

// parse jorp tokens into a root element for slides and an animation
function parse(tokens, rootElement = null, parentElement = null, parentZone = null, animation = [], frames = []) {
    parentElement ??= rootElement;
    let latestElement = null;
    let selectedElement = null;
    let relativeFlag = false;
    let markedFlag = false;
    let zone = null;
    while (tokens.length > 0) {
        let token = tokens[0];

        // token is a number
        if(!isNaN(token)) {
            if ((parentElement?.children?.length ?? 0) < token)
                throw new Error("Address number out of parent's bounds");
            // set selected element to the specified child
            selectedElement = parentElement.children[token];
            tokens = tokens.slice(1);
        }

        // element should be positioned relative
        else if (token === "&") {
            relativeFlag = true;
            tokens = tokens.slice(1);
        }

        // mark an element
        else if (token === "!") {
            markedFlag = true;
            tokens = tokens.slice(1);
        }

        // start of block, parse the contents and update the tokens
        else if (token === "{") {
            // continue parent zone as long as this element has not overwritten it by declaring a new zone
            if (!zone && parentZone) zone = parentZone;

            let parseResult = parse(
                tokens.slice(1), 
                rootElement, 
                latestElement,
                zone, 
                animation,
                frames
            );
            
            tokens = parseResult.tokens;
            animation = parseResult.animation;
        }

        // end of block, return left over tokens back to caller
        else if (token === "}") {
            return {
                tokens: tokens.slice(1),
                animation: animation
            };
        }

        // end of statement
        else if (token === ";") {
            // reset selected element
            selectedElement = null;
            tokens = tokens.slice(1);
            relativeFlag = false;
        }

        // parse slide container statement
        else if (token === "slide-container") {
            let parseResult = parseSlideContainer(tokens);
            tokens = parseResult.tokens;
            if (rootElement)
                throw new Error("Slide container already declared");
            rootElement = parseResult.element;
            parentElement ??= rootElement;
        }

        // parse animation block
        else if (token === "anim") {
            let parseResult = parseAnim(tokens);
            tokens = parseResult.tokens;
            animation = parseResult.animation;
            latestElement = "anim";
        }

        else if (token === "frame") {
            let parseResult = parseFrame(tokens, frames);
            tokens = parseResult.tokens;
            // only add the frame into the animation sequence if it located in the anim block
            if (parentElement === "anim") {
                for (let i = 0; i < parseResult.amount; ++i)
                    animation.push(parseResult.frame);
            }
            frames.push(parseResult.frame);
        }

        // create a new element and add it to the slide structure
        else if (isKeyword(token)) {
            // create the element and set the latest element to it
            let parseResult = parseElement(tokens);
            tokens = parseResult.tokens;
            latestElement = parseResult.element;
            zone = parseResult.zone ?? zone;

            if (markedFlag) {
                if (!parentZone)
                    throw new Error("Marked element found outside of zone");
                let numMarkedElements = parentZone.markedElements.length;
                latestElement.id = parentZone.name + "-" + numMarkedElements;
                zoneIncrements[parentZone.name].max = numMarkedElements;
                parentZone.markedElements.push(latestElement);
                markedFlag = false;
            }

            // if it has been proceeded by an & (relative), set the position to be relative
            if (relativeFlag) {
                latestElement.style.position = "relative";
                parentElement.appendChild(latestElement);
                continue;
            }
            
            // inherit size from the selected element if it exists, otherwise set to 100%
            let sizeElement = selectedElement ?? { style: {width: "100%", height: "100%"} };

            // if an element has been selected, replace the selected element
            if (selectedElement) {
                if (!selectedElement.classList.contains("empty"))
                    throw new Error("Element already exists at address number");
                selectedElement.replaceWith(latestElement);
            }
            // otherwise, append the element to the current parent 
            else {
                latestElement.style.gridColumn = "1";
                latestElement.style.gridRow = "1";

                parentElement.style.display = "grid";
                
                latestElement.style.overflow = "hidden";

                parentElement.appendChild(latestElement);
            }

            // set size to match selected element or if it doesn't exist
            latestElement.style.width = sizeElement.style.width;
            latestElement.style.height = sizeElement.style.height;
        }
        
        else { 
            throw new Error("Unrecognized token '" + token.toString() + "'");
        }
    }

    return {
        rootElement: rootElement,
        animation: animation
    }
}

function executeElementAnimationFunction(element, func) {
    window[func.name](element, func.args);
}

let zoneIncrements = {};
let currentFrame = null;
let slideObject = null;
let events = {};

function executeZoneAction(action) {
    if (!action.operator)
        throw new Error("Zone action object missing operator property");

    else if (action.operator === "set") {
        zoneIncrements[action.zoneName].current = action.value;
    }

    else if (action.operator === "add") {
        zoneIncrements[action.zoneName].current += action.value;
    }

    else if (action.operator === "action") {
        let targetElement = document.getElementById(action.zoneName + "-" + zoneIncrements[action.zoneName].current);
        for (let func of action.value) {
            executeElementAnimationFunction(targetElement, func);
        }
    }

    else 
        throw new Error("Zone action operator is invalid");
}

function executeFrame(frame) {
    for (let action of frame.actions) {
        // execute standard action
        if (action.id) {
            let targetElement = document.getElementById(action.id);
            for (let func of action.functions)
                executeElementAnimationFunction(targetElement, func);
        }
        // execute zone action
        else if (action.zoneName) {
            executeZoneAction(action);
        }
        else
            throw new Error("Action provided has invalid structure");
    }
}

function setAnimationState(initialFrame) {
    let animation = slideObject.animation;

    // set the initial frame when it is defined as a number
    if (!isNaN(initialFrame))
        currentFrame = initialFrame;
    // set the initial frame when it is defined as an id
    else
        currentFrame = animation.findIndex((frame) => frame.id === initialFrame);

    if (currentFrame < 0)
        throw new Error("Initial frame must be greater or equal to zero");
    if (currentFrame >= animation.length)
        throw new Error("Initial frame cannot be greater than length of animation");
    
    for (let i = 0; i <= currentFrame; ++i) {
        let frame = animation[i];
        executeFrame(frame);
    }
}

function incrementAnimationState() {
    let animation = slideObject.animation;
    ++currentFrame;
    if (currentFrame >= animation.length)
        return;

    let frame = animation[currentFrame];
    executeFrame(frame);
}

function createSlide(fileData) {
    handleFileData(fileData);

    // lex file contents
    let tokens = lex(fileData);
    
    // parse slide object using tokens
    slideObject = parse(tokens);

    // increment slide when a certain key is pressed
    document.addEventListener("keydown", (e) => {
        if (e.key !== "c") return;
        incrementAnimationState();
    })

    // set the initial frame of the slide
    setAnimationState(slideObject.animation["initial-frame"] ?? 0);

    // import custom style sheet
    getFile("assets/style.css", importStyleSheet);
}

function importModule(filePath) {
    let scriptElement = document.createElement("script");
    document.body.appendChild(scriptElement);
    scriptElement.type = "module";
    scriptElement.src = filePath;
}

function importStyleSheet(fileData) {
    handleFileData(fileData);
    
    // get id from root element
    if (!slideObject)
        throw new Error("Unable to import stylesheet before slide constructed");
    let rootElement = slideObject.rootElement;
    let id = rootElement.id;
    if (!id)
        throw new Error("Unable to import stylesheet as slide root node is missing id");

    // prepend id to all css classes and add it to a style element
    let regex = /([,|\}][\s$]*)([\.#]?-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g
    fileData = fileData.replaceAll(regex, "$1#" + id + " $2");
    let style = document.createElement("style");
    style.textContent = fileData;

    // append the style element to the root element
    rootElement.appendChild(style);
}

function handleFileData(fileData) {
    if (!fileData)
        throw new Error("Get file call failed");
}

function getFile(path, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            // request is done
            if (request.status == 200) {
                callback(request.responseText);
            }
            else {
                callback(null);
            }
        }
    }
    request.open("GET", path);
    request.send();
}

document.addEventListener("keydown", (e) => {
    if (e.key !== "v") return;
    // prevent slide from being generated multiple times
    if (slideObject)
        return;
    getFile("assets/default.jorp", createSlide);
})