// Create the Space Namespace
var Space = {
	gl : null,		// Placeholder. Defined in Controller initialize
	width : null,
	height : null
};

// Shader Controller
Space.shaders = (function () {
	
	var shaderProgram;		// Holds the shading program
	
	// Dependencies
	var gl;
	
	function initialize() {
		
		// Give us a convenient local var
		gl = Space.gl;
		
		// Build the shaders
        var fragmentShader = getShader("shader-fs");
        var vertexShader = getShader("shader-vs");
		
		// Build the texture shaders
		var fragmentShaderTexture = getShader("shader-fs-texture");
		var vertexShaderTexture = getShader("shader-vs-texture");
		
		// Create our program for holding data for drawing
		shaderProgram = gl.createProgram();
		
		// Attach the shaders to the program variable.
		// using the gl object which has this method.
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);	
		
		// Usual error check
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
		
		// Set the program, built of the two shader code snippets as the object's program
		gl.useProgram(shaderProgram);
		
		// Here we set a variable on the shaderProgram object. This will hold the location of 'aVertexPosition'
		// which was built in the vertex shader GLSL code snippet).
		//
		// Next we set the vertex Array using that memory address.  
		//
		// Note here: GL object is what is asking for the attribute location, it is what talks to the GPU in this sense
		shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		
		// Likewise, we the vertex color attribute on the shader object to keep track of the memory location of aVertex color in the compiled shader color
		shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
								
		// Settting more variables for convenience on the shaderProgram object
		//
		// Using the GL object we are obtain the unifrom location.
		//
		// Note: There are different types of variables inside the GLSL code pieces.
		// So previously we snagged the AttribLocation to get an 'attrib' variable. Here we do the same but use the uniformLocation to get SURPRISE! uniform variables. 		  
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");		
		
	}
	
	// Fetches the 
    function getShader(id) {
		
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }
		
		// Here we're just breaking up the string.
        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

		// Here we do a switch based around the type of shader
		// There are two types: Fragment and Vertex
        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

		// Assign the shader source, then build. 
        gl.shaderSource(shader, str);
        gl.compileShader(shader);

		// Check if we have any errors
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
	
	// Shader retrieval and set functions
	function getShaderProgram() {
		return shaderProgram;	
	}
	function updateShader(shader) {
		shaderProgram = shader;	
	}
	

	// Public functions
	return {
		initialize : initialize,
		getShaderProgram : getShaderProgram,
		updateShader : updateShader
	}

})();


// Buffer controller
Space.buffers = (function () {
	
	
	var positionBufferHolder = [], 			// Holds our buffer objects
		colorBufferHolder = [],				// Holds our color buffer objects
		indexBufferHolder = [];				// Holds our index buffer objects
		
	// Vertices Examples	
	// Triangle
	var verticesTriangle = [
		 0.0,  1.0,  0.0,
		-1.0, -1.0,  0.0,
		 1.0, -1.0,  0.0
	];
	// Square
	var verticesSquare = [
		 1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0,
		 1.0, -1.0,  0.0,
		-1.0, -1.0,  0.0
	];
	
	// Pyramid
	var verticesPyramid = [
		// Front face
		 0.0,  1.0,  0.0,
		-1.0, -1.0,  1.0,
		 1.0, -1.0,  1.0,
		
		// Right face
		 0.0,  1.0,  0.0,
		 1.0, -1.0,  1.0,
		 1.0, -1.0, -1.0,
		
		// Back face
		 0.0,  1.0,  0.0,
		 1.0, -1.0, -1.0,
		-1.0, -1.0, -1.0,
		
		// Left face
		 0.0,  1.0,  0.0,
		-1.0, -1.0, -1.0,
		-1.0, -1.0,  1.0
	];	
	// Cube
	var verticesCube = [
		// Front face
		-1.0, -1.0,  1.0,
		 1.0, -1.0,  1.0,
		 1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,
		
		// Back face
		-1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
		 1.0,  1.0, -1.0,
		 1.0, -1.0, -1.0,
		
		// Top face
		-1.0,  1.0, -1.0,
		-1.0,  1.0,  1.0,
		 1.0,  1.0,  1.0,
		 1.0,  1.0, -1.0,
		
		// Bottom face
		-1.0, -1.0, -1.0,
		 1.0, -1.0, -1.0,
		 1.0, -1.0,  1.0,
		-1.0, -1.0,  1.0,
		
		// Right face
		 1.0, -1.0, -1.0,
		 1.0,  1.0, -1.0,
		 1.0,  1.0,  1.0,
		 1.0, -1.0,  1.0,
		
		// Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0,  1.0,
		-1.0,  1.0,  1.0,
		-1.0,  1.0, -1.0
	];
	
	// Vertices Index
	/**
	*	Indices help us to order figures that require mutliple stiching of triangles.
	**/
	// Cube
	var cubeVertexIndices = [
		0, 1, 2,      0, 2, 3,    // Front face
		4, 5, 6,      4, 6, 7,    // Back face
		8, 9, 10,     8, 10, 11,  // Top face
		12, 13, 14,   12, 14, 15, // Bottom face
		16, 17, 18,   16, 18, 19, // Right face
		20, 21, 22,   20, 22, 23  // Left face
	];	
	
	
	// Color examples
	// (Right Now we're working just with solid colors
	var red = [1.0, 0.0, 0.0, 1.0],
		green = [0.0, 1.0, 0.0, 1.0],
		blue = [0.0, 0.0, 1.0, 1.0],
		white = [1.0, 1.0, 1.0, 1.0],
		black = [0.0, 0.0, 0.0, 1.0];
			
	// Local gl;
	var gl;
	
	function initialize() {

		// Local Convenience var
		gl = Space.gl;
	}
	
	function addShape(type, color, pos) {
				
				
		// Set to the color variable
		var colorToSend;
		switch (color) {
			case "red" :
						colorToSend = red;
						break;	
			case "green" :
						colorToSend = green;		
						break;
			case "blue":
						colorToSend = blue;	
						break;
			default:
					colorToSend = white;		
		};
		
		var positionItem = 0,
			colorItem = 0,
			indexItem = 0;
		
		// Send colors as arrays for 3d objects
		if (type == 'triangle') {
			// Create our buffers
			positionBufferHolder.push(createPositionBuffer(verticesTriangle, 3, 3, pos, type, 'TRIANGLES'));
			colorBufferHolder.push(createColorBuffer([colorToSend], 3, 4, color));
			indexBufferHolder.push(0);
		}
		else if (type == 'square') {
			positionBufferHolder.push(createPositionBuffer(verticesSquare, 3, 4, pos, type, 'TRIANGLE_STRIP'));
			colorBufferHolder.push(createColorBuffer([colorToSend], 4, 4, color));
			indexBufferHolder.push(0);
		}
		else if (type == 'pyramid') {
			positionBufferHolder.push(createPositionBuffer(verticesPyramid, 3, 12, pos, type, 'TRIANGLES'));
			colorBufferHolder.push(createColorBuffer([red, blue, red, green], 4, 12, color)); 
			indexBufferHolder.push(0);
		}
		else if (type =='cube') {
			positionBufferHolder.push(createPositionBuffer(verticesCube, 3, 24, pos, type, 'TRIANGLES'));
			colorBufferHolder.push(createColorBuffer([red, red, green, green, blue, blue], 4, 24, color)); 
			indexBufferHolder.push(createIndexBuffer(cubeVertexIndices, 1, 36));
		}
		else  {
			alert('That type is not recognized: ' + type);
			return;	
		}
		

	}
	
	function createPositionBuffer(vertices, itemSize, numItems, pos, name, drawMethod) {

		var bufferToBuild;

		// Create the buffer, again, using the GL object to allocate memory and such.
		bufferToBuild = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, bufferToBuild);
		
		// Set the data into the buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		
		// Set these convenience attributes for later procession
		bufferToBuild.itemSize = itemSize;
        bufferToBuild.numItems = numItems;
		bufferToBuild.pos = pos;
		bufferToBuild.name = name;
		bufferToBuild.drawMethod = drawMethod;
		bufferToBuild.rotation = 0;
				
		// Return the complted buffers
		return bufferToBuild;
	}
	
	function createColorBuffer(colors, itemSize, numItems, name) {
	
		// Build the initial buffer
		var colorBufferToBuild = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferToBuild);
		
		// We'll build colors based on the vertices 
        var unpackedColors = [];
        for (var i in colors) {
            var color = colors[i];
            for (var j=0; j < itemSize; j++) {
                unpackedColors = unpackedColors.concat(color);
            }
        }
		
		// Set in the buffer data
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
		
		// Set our helpful variablers
		colorBufferToBuild.itemSize = itemSize;
        colorBufferToBuild.numItems = numItems;
		colorBufferToBuild.name = name;
				
		return colorBufferToBuild;
	}
	
	function createIndexBuffer(indices, itemSize, numItems) {
		
		var indexBufferToBuild = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferToBuild);	
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		
		indexBufferToBuild.itemSize = itemSize;
		indexBufferToBuild.numItems = numItems;
		
		return indexBufferToBuild;
		
	}
	
	// Return mechanisms
	function getPositionBufferHolder () {
		return positionBufferHolder;	
	}
	function getColorBufferHolder () {
		return colorBufferHolder;	
	}
	function getIndexBufferHolder () {
		return indexBufferHolder;	
	}

	function goBack(pos) {
		var returnShift = [];
		
		for (var i=0; i<3;i++) {
			returnShift.push(-pos[i])
		}
		return returnShift;
	}
	
	return {
		initialize : initialize,
		getPositionBufferHolder : getPositionBufferHolder,
		getColorBufferHolder : getColorBufferHolder,
		getIndexBufferHolder : getIndexBufferHolder,
		addShape : addShape,
		goBack : goBack
	}
	
})();

/** 
*	Controls input
**/
Space.input = (function () {

	// Dependencies
	var Buffers = Space.buffers;
	
	// Shape Objects
	var positionBuffer;
	
	// Controls
	var rotation,
		xShift,
		yShift,
		zShift;

	function initialize() {
		
		// Get Buffer objects
		positionBuffer = Buffers.getPositionBufferHolder();
	
		// Set our resize event
		window.onresize = windowResize;	
		
		// Fetch controls
		rotation = document.getElementById('rotation');
		xShift = document.getElementById('x-shift');
		yShift = document.getElementById('y-shift');
		zShift = document.getElementById('z-shift');
		
		// Assign Functions
		rotation.oninput = rotationChange;
		xShift.oninput = xChange;
		yShift.oninput = yChange;
		zShift.oninput = zChange;
		
	}
	
	function windowResize() {}
	
	function rotationChange() {
		positionBuffer[0].rotation = rotation.value;	
	}
	function xChange() {
		positionBuffer[0].pos[0] = xShift.value/10;	
	}
	function yChange() {
		positionBuffer[0].pos[1] = yShift.value/10;	
	}
	function zChange() {
		positionBuffer[0].pos[2] = zShift.value/10;	
	}
	
	return {
		initialize : initialize	
	}
})();

/**
*	Utility module for motion and color effects
**/
Space.motion = (function() {
	
  // For rotations
	function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

	return {
		degToRad : degToRad	
	}
	
})();



// Main controller
/**
	- Builds
	- Controls Calls to gather vertex and pixel shaders
	- Calls input functions
**/
Space.controller = (function() {
	
	// Main Variables
	var c, gl = null;
		
	// Module Dependencies
	var Shaders = Space.shaders,
		Buffers = Space.buffers,
		Input = Space.input,
		Motion = Space.motion;
		
	// Animation vars
	var lastTime = 0;
	
	// Our model-view and perspective matrix
	// The 'mat4' nomenclature is from WebGL-Utils library
	var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
	var mvMatrixStack = [];				// Stack that will keep track of our Model-View Matrick (we're going to be shifting a lot)
	
	// Fetch the Canvas and initialize
	function initialize() {
		
		// Get the initial canvas object
		c = document.getElementById('gl');
				
		// Try to get context
		try {  
			// Get the Canvas
			gl = c.getContext("webgl") || c.getContext("experimental-webgl");
						
			// Set a master object
			Space.gl = gl;
			Space.width = c.width;
			Space.height = c.height;
			
			// Fire off refresh
			startCanvas();
			
			// Now that we got that set let's build the shader programs
			Shaders.initialize();
			Buffers.initialize();
			Input.initialize();
						
			// 3D Shapes
			Buffers.addShape('cube', 'blue', [0.0, 0.0, -9.0]);		
			Buffers.addShape('pyramid','blue', [-4.0, -1.0, -9.0]);
											
			// Kick off the drawing
			tick();
			
		}  
		catch(e) { 
			if (!gl)
				alert("Unable to initialize WebGL. Your browser may not support it. Error:\n\n" + e);  
		}
				
	}	
	
	// Clear and set the standards for the canvas
	function startCanvas() {	
		// Establish the size we're looking at
		gl.viewportWidth = c.width;
		gl.viewportHeight = c.height;
			
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  		// Set background as black
        gl.enable(gl.DEPTH_TEST);					// Enable depth testing
	}
		
	// Animation Functions
	function animate() {
		var timeNow = new Date().getTime();
		if (lastTime != 0) {
			var elapsed = timeNow - lastTime;
		}
		lastTime = timeNow;
	}	
    function tick() {
        requestAnimFrame(tick);
        draw();
        animate();
    }
	
	// Model-View helper functions 
	function mvPushMatrix() {
		var copy = mat4.create();
		mat4.set(mvMatrix, copy);
		mvMatrixStack.push(copy);
	}
	
	function mvPopMatrix() {
		if (mvMatrixStack.length == 0) {
			throw "Invalid popMatrix!";
		}
		mvMatrix = mvMatrixStack.pop();
	}
	
			
	// Drawing functions
    function setMatrixUniforms(shaderProgram) {
				
		// Assign values of the perspective and model-view matrix to program
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
		
		// Set the new value
		Shaders.updateShader(shaderProgram); 
    }	
	
	function draw() {
			
		// Clear out the canvas
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		// Let's get some variables
		var positionBuffer = Buffers.getPositionBufferHolder();
		var colorBuffer = Buffers.getColorBufferHolder();
		var indexBuffer = Buffers.getIndexBufferHolder();
		var shaderProgram = Shaders.getShaderProgram();
		
		// And then create some convenience vars
		var length = positionBuffer.length;						
											
		// Here we use WebGL utils to define the perspective matrix and assign it to our pMatrix set above.
		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
		mat4.identity(mvMatrix);																								// Assign the mvMatrix to be an identity matrix	
				
		// Draw each shape
		for (var i=0; i<length; i++) {
			
			// Go to our new position
			mat4.translate(mvMatrix, positionBuffer[i].pos);																	// Translate to do our first position	
			mvPushMatrix();																										// Keep track of the Model-View matrix since we're rotating
			mat4.rotate(mvMatrix, Motion.degToRad(positionBuffer[i].rotation), [1, 1, 1]);														// Actual do the rotation
			
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer[i]);																	// Bind the buffer to the gl object (now GL can access those vertices
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,  positionBuffer[i].itemSize, gl.FLOAT, false, 0, 0);	// Establish our position
			
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer[i]);
			gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,  colorBuffer[i].itemSize, gl.FLOAT, false, 0, 0);
			
			// Build our index buffer if present
			if (indexBuffer[i] != 0) {
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer[i]);
				setMatrixUniforms(shaderProgram);																					// Now that we've updated those values here, set them in the GPU passing it the shader program				
				gl.drawElements(gl[positionBuffer[i].drawMethod], indexBuffer[i].numItems, gl.UNSIGNED_SHORT, 0);
			}
			else {
				setMatrixUniforms(shaderProgram);																					// Now that we've updated those values here, set them in the GPU passing it the shader program				
				gl.drawArrays(gl[positionBuffer[i].drawMethod], 0, positionBuffer[i].numItems);																
			}
				
			// Go back to where we were.
			mvPopMatrix();																										// Pop off the stored matrix
			mat4.translate(mvMatrix, Buffers.goBack(positionBuffer[i].pos));													// We translate back in order to keep ourselves around one position (for now)					
		}
	}	
	
	return {
		initialize : initialize
	}
})();

// Onload the GL build
window.onload = Space.controller.initialize;
