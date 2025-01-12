
var gl;
var isMand = true;
var isMandLoc;
var complexLoc;

var complex = vec2(0.0,0.0);
var zoom = 1.0;
var zoomLoc;
var factor = 1.0;
var factorLoc;
var dxD;
var dyD;
var mouseDown = false;
var deslocamento = vec2(0.0,0.0);
var offsetLoc;
var offsetX = 0.0;
var offsetY = 0.0;
window.onload = function init() {
    var canvasProjeto = document.getElementById("gl-canvasProjecto1");
    gl = WebGLUtils.setupWebGL(canvasProjeto);
    if(!gl) { alert("WebGL isn't available"); }
    
    // Three vertices
    var vertices = [
        vec2(-1.0,1.0),
        vec2(-1.0,-1.0),
        vec2(1.0,1.0),
        vec2(1.0,-1.0)
    ];
    
    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader-1", "fragment-shader-1");
    gl.useProgram(program);
    isMandLoc = gl.getUniformLocation(program, "isMand");
    complexLoc = gl.getUniformLocation(program, "complex");
    zoomLoc =  gl.getUniformLocation(program, "zoom");
    factorLoc = gl.getUniformLocation(program,"factor");
    offsetLoc = gl.getUniformLocation(program,"offSet");
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
   
    
   document.getElementById("slid1").onmousemove =
   function() {
     factor= event.srcElement.value;
   };
    
    document.getElementById("Opcoes").onchange = function(m){
        console.log(this.value);
        switch (this.value) {
            case "0":
                isMand = true;
                break;
            case "1":
                isMand = false;
                complex[0] = -0.4;
                complex[1] = 0.6;
                break;
            case "2":
                isMand = false;
                complex[0] = 0.285;
                complex[1] = 0.0;
                break;
            
            case "3":
                isMand = false;
                complex[0] = 0.285;
                complex[1] = 0.01;
                break;
            case "4":
                isMand = false;
                complex[0] = -0.8;
                complex[1] = 0.156;
                break;
            case "5":
                isMand = false;
                complex[0] = 0.8;
                complex[1] = 0.0;
                break;
        }
           
        };

    //Selecao dos butoes para realização do eventos Zoom
        window.addEventListener("keydown", function() {
         switch (event.keyCode) {
             case 81: // Zoom IN -- Q
                 zoom *= 0.99;
                 break;
             case 65: // Zoom OUT -- A
                 zoom /= 0.99;
                 break;
          }  
        });

        canvas.onmousedown = function(event){
            mouseDown = true;
            dxD = event.x;
            dyD = event.y;
        };
        
        canvas.onmousemove = function(event){
            if(mouseDown){
            deslocamento.x = event.x - dxD;
            deslocamento.y = event.y - dyD;
                
            dxD = event.x;
            dyD = event.y;  
                
            offsetX += (2* deslocamento.x/this.width) * zoom;
            offsetY -= (2* deslocamento.y/this.height) * zoom;
            }
        };
        canvas.onmouseup= function(event){
            mouseDown = false; 
            
        };
        
     render();
}



function render() {
    
    gl.uniform2f(offsetLoc,offsetX,offsetY);
    gl.uniform1f(factorLoc,factor);
    gl.uniform1f(zoomLoc,zoom);
    gl.uniform2fv(complexLoc, complex);
    gl.uniform1i(isMandLoc,isMand);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    window.requestAnimFrame(render);
}
