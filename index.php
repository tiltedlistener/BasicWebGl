<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>GLab</title>
<!-- Utils -->
<script type="text/javascript" src="glMatrix-0.9.5.min.js"></script>
<script type="text/javascript" src="webgl-utils.js"></script>
<script src="webgl-debug.js"></script>

<!-- Shader Programs -->
<script id="shader-fs" type="x-shader/x-fragment">
    precision mediump float;

    varying vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
</script>
<script id="shader-vs" type="x-shader/x-vertex">
    attribute vec3 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    varying vec4 vColor;
	
    void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        vColor = aVertexColor;
    }
</script>

<script id="shader-fs-texture" type="x-shader/x-fragment">
    precision mediump float;

    varying vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
        gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    }
</script>

<script id="shader-vs-texture" type="x-shader/x-vertex">
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    varying vec2 vTextureCoord;


    void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        vTextureCoord = aTextureCoord;
    }
</script>


<!-- Page Files -->
<script type="text/javascript" src="page.js"></script>
<link href="page.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<header>
    	<h1>GLab</h1>
    </header>
	<div id="wrapper">
		<canvas id="gl" width="600" height="400"></canvas>
	</div>
    <div id="controls">
    	
    	<h4>Rotation</h4>
        <input type="range" min="-360" max="360" id="rotation" />
    	<h4>X Shift</h4>
        <input type="range" min="-100" max="100" id="x-shift" />
    	<h4>Y Shift</h4>
        <input type="range" min="-100" max="100" id="y-shift" />     
    	<h4>Z Shift</h4>
        <input type="range" min="-100" max="0" id="z-shift" />        
    </div>
   
</body>
</html>