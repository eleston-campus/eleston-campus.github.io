var gl;
var canvas;
var program, program1, program2;

var mNormals;
var mNormalsLoc;
var mModelView;
var mModelViewLoc;
var mProjectionLoc;

var mProjection = mat4();

var isSphere=true;
var isCube=false;
var isPyramid=false;
var isTorus=false;
var isWired=true;
var isFilled=false;

var topView = mat4();
var leftView = mat4();
var frontView = mat4();
var otherView = mat4();

var aspect;
var gammaI ;
var thetaI ;
var gamma ;
var theta ;
var l = 1;
var isAxon = true;
function load_file() {
    var selectedFile = this.files[0];
    var reader = new FileReader();
    var id=this.id == "vertex" ? "vertex-shader-2" : "fragment-shader-2";
    reader.onload = (function(f){
        var fname = f.name;
        return function(e) {
            console.log(fname);
            console.log(e.target.result);
            console.log(id);
            document.getElementById(id).textContent = e.target.result;
            program2 = initShaders(gl, "vertex-shader-2", "fragment-shader-2");
            reset_program(program2);
            program = program2;
        }
    })(selectedFile);
    reader.readAsText(selectedFile);
}

function reset_program(prg) {
    mModelViewLoc = gl.getUniformLocation(prg, "mModelView");
    mNormalsLoc = gl.getUniformLocation(prg, "mNormals");
    mProjectionLoc = gl.getUniformLocation(prg, "mProjection");
    program = prg;
}

window.onload = function init() {
    // Get the canvas
    canvas = document.getElementById("gl-canvasObject");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }

    // Setup the contexts and the program
    gl = WebGLUtils.setupWebGL(canvas);
    program1 = initShaders(gl, "vertex-shader-2", "fragment-shader-2");
    //INIT Z-BUFFER
    gl.enable(gl.DEPTH_TEST);
    
    document.getElementById("vertex").onchange = load_file;
    document.getElementById("fragment").onchange = load_file;

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0,0,canvas.width, canvas.height);

    
    
    sphereInit(gl);
    cubeInit(gl);
    pyramidInit(gl); 
    torusInit(gl);

    
    window.onresize = function() {
        reSize();
    }

   
    getGammaTheta(42,7);
    gamma = gammaI;
    theta = thetaI;
    mModelView = mat4();
    mNormals = transpose(inverse(mat4()));
    mProjection = ortho(-1,1,-1,1,-1,1);

    topView = rotateX(90);
    leftView = rotateY(90);
    frontView = mModelView;
    otherView = mult(rotateX(gammaI), rotateY(thetaI));
    
    reSize();   
    
    //Comecar com a axonometrica
    document.getElementById('axon').style.display = 'block';
    //Comecar com as obliquas escondidas
    document.getElementById('obliq').style.display = 'none';
    document.getElementById('tiposDeObliqua').style.display = 'none';
    //Comecar com a perspectiva escondida
    document.getElementById('perspect').style.display = 'none';
    
     document.getElementById("Objectos").onchange = function(m){
        switch (this.value) {
            case "0":
                 isSphere=true;
                 isCube=false;
                 isPyramid=false;
                 isTorus=false;
                 isAxon = true;
                 otherView = mult(rotateX(gammaI),rotateY(thetaI));
                 document.getElementById("Projecoes").value = 0;
                 document.getElementById("gammaS").value = gammaI;
                 document.getElementById("thetaS").value =thetaI;
                 document.getElementById('axon').style.display = 'block';
                 document.getElementById('obliq').style.display = 'none';
                 document.getElementById('perspect').style.display = 'none';
                 
                break;
            case "1":
                 isSphere=false;
                 isCube=true;
                 isPyramid=false;
                 isTorus=false;
                 isAxon = true;
                 otherView = mult(rotateX(gammaI), rotateY(thetaI));
                 document.getElementById("Projecoes").value = 0;
                 document.getElementById("gammaS").value = gammaI;
                 document.getElementById("thetaS").value = thetaI;
                 document.getElementById('axon').style.display = 'block';
                 document.getElementById('obliq').style.display = 'none';
                 document.getElementById('perspect').style.display = 'none';
                break;
            case "2":
                 isSphere=false;
                 isCube=false;
                 isPyramid=true;
                 isTorus=false;
                 isAxon = true;
                 otherView = mult(rotateX(gammaI), rotateY(thetaI));
                 document.getElementById("Projecoes").value = 0;
                 document.getElementById("gammaS").value = gammaI;
                 document.getElementById("thetaS").value = thetaI;
                 document.getElementById('axon').style.display = 'block';
                 document.getElementById('obliq').style.display = 'none';
                 document.getElementById('perspect').style.display = 'none';
                break;
            
            case "3":
                 isSphere=false;
                 isCube=false;
                 isPyramid=false;
                 isTorus=true;
                 isAxon = true;
                 otherView = mult(rotateX(gammaI), rotateY(thetaI));
                 document.getElementById("Projecoes").value = 0;
                 document.getElementById("gammaS").value = gammaI;
                 document.getElementById("thetaS").value = thetaI;
                 document.getElementById('axon').style.display = 'block';
                 document.getElementById('obliq').style.display = 'none';
                 document.getElementById('perspect').style.display = 'none';
                break;
        }
           
        };
    
    document.getElementById("Fillings").onchange = function(m){
        console.log(this.value);
        switch (this.value) {
            case "0":
                isWired = true;
                isFilled = false;
                break;
            case "1":
                isWired = false;
                isFilled = true;
                break;
        }    
        };
    
    document.getElementById("Projecoes").onchange = function(m){
        console.log(this.value);
        
        switch (this.value) { 
            case "0": //axonometrica
                isAxon = true;
                otherView = mult(rotateX(gammaI), rotateY(thetaI));
                document.getElementById('gammaS').value = gammaI;
                document.getElementById('thetaS').value = thetaI;
                document.getElementById('axon').style.display = 'block';
                document.getElementById('obliq').style.display = 'none';
                document.getElementById('perspect').style.display = 'none';
                break;//
            case "1": //Oblíqua
                var obliq = mat4(   1.0,  0.0,   (-1 * Math.cos(45)),  0.0,
                                    0.0,  1.0,   (-1 * Math.sin(45)),  0.0,
                                    0.0,  0.0,                   1.0,  0.0,
                                    0.0,  0.0,                   0.0,  1.0 );
                
                otherView = obliq;
                
                document.getElementById('axon').style.display = 'none';
                document.getElementById('obliq').style.display = 'block';
                document.getElementById('obliquas').style.display = 'block';
                document.getElementById('obliquas').value = 0;
                document.getElementById('perspect').style.display = 'none';
                isAxon = false;
                break;
             case "2": //Perspectiva
                isAxon = false;
                var d = 2;
                var perspect = mat4(    1.0,  0.0, 0.0,  0.0,
                                        0.0,  1.0, 0.0,  0.0,
                                        0.0,  0.0, 1.0,  0.0,
                                        0.0,  0.0, -1/d,  1.0 );
                otherView = perspect;
                document.getElementById('axon').style.display = 'none';
                document.getElementById('obliq').style.display = 'none';
                document.getElementById('perspect').style.display = 'block';
                break;
        }    
        };
    
    document.getElementById("obliquas").onchange = function(m){
        console.log(this.value);
        
        switch (this.value) {
            case "0": //Cavaleira
                l = 1;
                var obliq = mat4(   1.0,  0.0,   (-l * Math.cos(45)),  0.0,
                                    0.0,  1.0,   (-l * Math.sin(45)),  0.0,
                                    0.0,  0.0,                   1.0,  0.0,
                                    0.0,  0.0,                   0.0,  1.0 );
                
                otherView = obliq;
                break;//
            case "1": //Gabinete
                l = 0.5;
                var obliq = mat4(   1.0,  0.0,   (-l * Math.cos(45)),  0.0,
                                    0.0,  1.0,   (-l * Math.sin(45)),  0.0,
                                    0.0,  0.0,                   1.0,  0.0,
                                    0.0,  0.0,                   0.0,  1.0 );
                
                otherView = obliq;
                break;
             case "2": //Ortogonal
                l = 0;
                var obliq = mat4(   1.0,  0.0,   (-l * Math.cos(45)),  0.0,
                                    0.0,  1.0,   (-l * Math.sin(45)),  0.0,
                                    0.0,  0.0,                   1.0,  0.0,
                                    0.0,  0.0,                   0.0,  1.0 );
                
                otherView = obliq;
                break;
        }    
        };

     document.getElementById("gammaS").oninput =
   function() {
     gamma = event.srcElement.value;  
     otherView = mult(rotateX(gamma), rotateY(theta)); 
   };
    
     document.getElementById("thetaS").oninput =
   function() {
     theta = event.srcElement.value;  
     otherView = mult(rotateX(gamma), rotateY(theta));
   };
    
    document.getElementById("zS").oninput =
   function() {
     var z = event.srcElement.value;  
     var perspect = mat4(    1.0,  0.0, 0.0,  0.0,
                             0.0,  1.0, 0.0,  0.0,
                             0.0,  0.0, 1.0,  0.0,
                             0.0,  0.0, -1/z,  1.0 );
    otherView = perspect;
   };
    
    reset_program(program1);
    
    render();
}

function getGammaTheta(a,b){
    //gamma
    var g;
    g = Math.asin(Math.sqrt(Math.tan(radians(a)) * Math.tan(radians(b))));
    
    gammaI = (g * 180) / Math.PI;
    console.log(gammaI);
    //theta
    var t;    
    t = (Math.atan(Math.sqrt(Math.tan(radians(a)) / Math.tan(radians(b))))) - (Math.PI/2);
    thetaI = ( t * 180 ) / Math.PI;
    console.log(thetaI);
    
}
function reSize(){
    
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        aspect = canvas.width / canvas.height;  
    
        if(aspect ==1)
               mProjection = ortho(-1,1,-1,1,-1,1);
        if(aspect > 1){
               mProjection = ortho(-1*aspect,1*aspect,-1,1,-1,1);
        } if(aspect < 1){
               mProjection = ortho(-1,1,-1/aspect,1/aspect,-1,1);
        }
    
}
function drawObject(gl, program) 
{
    if(isSphere && isWired)
        sphereDrawWireFrame(gl, program);
    if(isCube && isWired)
        cubeDrawWireFrame(gl, program);
    if(isPyramid && isWired)
        pyramidDrawWireFrame(gl, program);
    if(isTorus && isWired)
        torusDrawWireFrame(gl, program);
    if(isSphere && isFilled)
        sphereDrawFilled(gl, program);
    if(isCube && isFilled)
        cubeDrawFilled(gl, program);
    if(isPyramid && isFilled)
        pyramidDrawFilled(gl, program);
    if(isTorus && isFilled)
        torusDrawFilled(gl, program);
    
}


function render() 
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.uniformMatrix4fv(mProjectionLoc, false, flatten(mProjection));

    // Top view
    gl.viewport(0,0,canvas.width/2, canvas.height/2);
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(topView));
    gl.uniformMatrix4fv(mNormalsLoc, false, flatten(transpose(inverse(topView))));
    drawObject(gl, program);

    // Other view
    gl.viewport(canvas.width/2,0,canvas.width/2, canvas.height/2);
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(otherView));
    //Na axonometrica tem que estar transpose nas outras e a matrix identidade
    if(isAxon){
        gl.uniformMatrix4fv(mNormalsLoc, false, flatten(transpose(inverse(otherView))));
    } else {
        gl.uniformMatrix4fv(mNormalsLoc, false, flatten(mat4()));
    }
    
    drawObject(gl, program);

    // Front view
    gl.viewport(0,canvas.height/2,canvas.width/2, canvas.height/2);
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(frontView));
    gl.uniformMatrix4fv(mNormalsLoc, false, flatten(transpose(inverse(frontView))));
    drawObject(gl, program);

    // Side view
    gl.viewport(canvas.width/2,canvas.height/2,canvas.width/2, canvas.height/2);
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(leftView));
    gl.uniformMatrix4fv(mNormalsLoc, false, flatten(transpose(inverse(leftView))));
    drawObject(gl, program);

    window.requestAnimationFrame(render);
}
