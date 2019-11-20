var gl;

var canvas;

// GLSL programs
var program;

// Render Mode
var WIREFRAME=1;
var FILLED=2;
var renderMode = WIREFRAME;

var projection;
var modelView;
var view;
var QW=1;
var ZX=1;
var AS=1;
var OP=0.3;
var KL=1;
var Dx=0.3;
var Dz=-0.2;
var eyeX=0;
var eyeY=0;

matrixStack = [];

function pushMatrix()
{
    matrixStack.push(mat4(modelView[0], modelView[1], modelView[2], modelView[3]));
}

function popMatrix() 
{
    modelView = matrixStack.pop();
}

function multTranslation(t) {
    modelView = mult(modelView, translate(t));
}

function multRotX(angle) {
    modelView = mult(modelView, rotateX(angle));
}

function multRotY(angle) {
    modelView = mult(modelView, rotateY(angle));
}

function multRotZ(angle) {
    modelView = mult(modelView, rotateZ(angle));
}

function multMatrix(m) {
    modelView = mult(modelView, m);
}
function multScale(s) {
    modelView = mult(modelView, scalem(s));
}

function initialize() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    
    cubeInit(gl);
    sphereInit(gl);
    cylinderInit(gl);
    
    document.getElementById("EyeX").oninput =
   function() {
     eyeX = event.srcElement.value;  
      
   };
    
     document.getElementById("EyeY").oninput =
   function() {
     eyeY = event.srcElement.value;  
    
   };
    
    
    setupProjection();
    setupView();
}

function setupProjection() {
    //projection = perspective(60, 1, 0.1, 100);
    
    projection = ortho(-4,4,-4,4,0.1,100);
}

function setupView() {
    view = lookAt([eyeX,eyeY,5], [0,0,0], [0,1,0]);
    modelView = mat4(view[0], view[1], view[2], view[3]);
}

function setMaterialColor(color) {
    var uColor = gl.getUniformLocation(program, "color");
    gl.uniform3fv(uColor, color);
}

function sendMatrices()
{
    // Send the current model view matrix
    var mView = gl.getUniformLocation(program, "mView");
    gl.uniformMatrix4fv(mView, false, flatten(view));
    
    // Send the normals transformation matrix
    var mViewVectors = gl.getUniformLocation(program, "mViewVectors");
    gl.uniformMatrix4fv(mViewVectors, false, flatten(normalMatrix(view, false)));  

    // Send the current model view matrix
    var mModelView = gl.getUniformLocation(program, "mModelView");
    gl.uniformMatrix4fv(mModelView, false, flatten(modelView));
    
    // Send the normals transformation matrix
    var mNormals = gl.getUniformLocation(program, "mNormals");
    gl.uniformMatrix4fv(mNormals, false, flatten(normalMatrix(modelView, false)));  
}

function draw_sphere(color)
{
    setMaterialColor(color);
    sendMatrices();
    sphereDrawFilled(gl, program);
}

function draw_cube(color)
{
    setMaterialColor(color);
    sendMatrices();
    cubeDrawFilled(gl, program);
}

function draw_cylinder(color)
{
    setMaterialColor(color);
    sendMatrices();
    cylinderDrawFilled(gl, program);
}

function draw_scene()
{
    
    var d = 0;
    //var d = (new Date()).getTime();
    
    //multTranslation([0,Math.sin(d/500),0]);
    
    //Restricoes
    restriction();
    //Cena
    multTranslation([0,-3,0]); 
    floor();
    multTranslation([Dx,0.45,Dz]); 
    base();
    multRotY(QW);
    cylinderBase();
    firstRectangle();
    multTranslation([0,1.2,0]);
    multRotZ(ZX);
    firstCylinder();
    secondRectangle();
    multTranslation([0,1,0]);   
    multRotZ(AS);
    secondCylinder();
    thirdRectangle();
    multTranslation([1,1,0]);
    multRotX(35);
    multRotY(25);
    multRotZ(-54);
    multRotY(KL);
    thirdCylinder();
    fourthRectangle();
    fithRectangle();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    
    setupView();
    
    // Send the current projection matrix
    var mProjection = gl.getUniformLocation(program, "mProjection");
    gl.uniformMatrix4fv(mProjection, false, flatten(projection));
        
    draw_scene();
    
    requestAnimFrame(render);
}
function floor(){
    pushMatrix();
        multScale([7.5,0.5,15]); 
        draw_cube([0.3,0.3,0.3]);   
    popMatrix();   
}

function base(){
    pushMatrix();   
        multScale([2.3,0.4,1.3]); 
        draw_cube([1,0,0]);   
    popMatrix();
}
function cylinderBase(){
    pushMatrix();
        multTranslation([0,0.2,0]);
        multScale([0.8,0.5,0.8]);
        draw_cylinder([0.0, 1.0, 0.0]);
    popMatrix();
}
function firstRectangle(){
    pushMatrix();
        multTranslation([0,0.8,0]);
        multScale([0.3,0.8,0.3]); 
        draw_cube([1,0,0]);   
    popMatrix();
}
function firstCylinder(){
    pushMatrix();
        multRotX(90);
        multScale([0.35,0.5,0.35]);
        draw_cylinder([0, 0, 1]);
    popMatrix();   
}
function secondRectangle(){
    pushMatrix();
        multTranslation([0,0.5,0]);
        multScale([0.3,0.8,0.3]); 
        draw_cube([1,0,0]);   
    popMatrix();
}
function secondCylinder(){
    pushMatrix();
        multRotX(90);
        multScale([0.35,0.5,0.35]);
        draw_cylinder([1, 1, 0]);
    popMatrix();   
}
function thirdRectangle(){
    pushMatrix();
        multTranslation([0.55,0.55,0]); 
        multRotZ(-45);
        multScale([0.3,1.5,0.3]); 
        draw_cube([1,0,0]);   
    popMatrix();
}
function thirdCylinder(){
    pushMatrix();
            multScale([1.3,0.4,1.3]);
            draw_cylinder([0.5, 0.5, 0.5]);
    popMatrix();   
}
function fourthRectangle(){
    pushMatrix();
        multTranslation([-OP,0.5,0]);
        multScale([0.25,0.6,0.25]); 
        draw_cube([1,1,0]);   
    popMatrix();
}
function fithRectangle(){
    pushMatrix();
        multTranslation([OP,0.5,0]);
        multScale([0.25,0.6,0.25]); 
        draw_cube([1,1,0]);   
    popMatrix();
}

function restriction(){
    //para as teclas O e P.
    if(OP >=0.43){
            OP = 0.43;

        }
    if(OP <=0.13){
            OP = 0.13;
        }
    
    //para as setas.
    if(Dx >=1){
            Dx = 1;

        }
    if(Dx <=-1){
            Dx = -1;
        }
    
    if(Dz >= 1){
            Dz = 1;

        }
    if(Dz <= -1){
            Dz = -1;
        }
    
    if(ZX >=60){
        ZX = 60;
    }
    
    if(ZX <=-60){
        ZX = -60;
    }
    
    if(AS >=120){
        AS = 120;
    }
    
    if(AS <=-25){
        AS = -25;
    }
    
}

window.onload = function init()
{
    canvas = document.getElementById("gl-canvasLamp");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    initialize();

      //Selecao dos butoes para realização do eventos Zoom
        window.addEventListener("keydown", function() {
         switch (event.keyCode) {
             case 81: // -- Q
                 QW += 10;
                 break;
             case 87: //  -- w
                 QW -= 10;
                 break;
             case 90: // -- Z
                 ZX += 10;
                 break;
             case 88: //  -- X
                 ZX -= 10;
                 break;
             case 65: // -- A
                 AS += 10;
                 break;
             case 83: //  -- S
                 AS -= 10;
                 break;
             case 79: // -- O
                 OP += 0.01;
                 break;
             case 80: //  -- P
                 OP -=0.01;
                 break;
             case 75: // -- K
                 KL += 5;
                 break;
             case 76: //  -- L
                 KL -= 5;
                 break;
             case 39: // -- ->
                 Dx += 0.1;
                 break;
             case 37: //  -- <-
                 Dx -=0.1;
                 break;
             case 38: // -- |
                 Dz -= 0.1;
                 break;
             case 40: //  -- _
                 Dz += 0.1;
                 break;
          }  
        });
    
    render();
}
