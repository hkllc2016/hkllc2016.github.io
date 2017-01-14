var myCanvas = document.getElementById("playarea");
var myContext = myCanvas.getContext("2d");
var ballSpeed = 5,
	ballRadius = 10;
var mouseX = myCanvas.width / 2,
    mouseY = myCanvas.height / 2,
    currentX = 0,
    currentY = 0;
//P1: CSS -> canvas
myCanvas.width = 1100;
myCanvas.height = 600;
//Colors: maroon,orange red,gold,lime,teal,navy,purple,pink,chocolate,slate gray
var ballColors = ["#800000","#FF4500","#FFD700","#00FF00","	#008080","#000080","#800080","#FFC0CB","#D2691E","#708090"]; 
var allBalls = new Array();
var maxNum = 50;

function initializeBall(num) {
	allBalls[num][0]=0; //0 or 1
	allBalls[num][1]=0; //x
	allBalls[num][2]=0; //y
	allBalls[num][3]=0; //radius
	allBalls[num][4]=0; //color
}

for(var i=0; i<maxNum; i++){
	allBalls[i] = new Array();
	initializeBall(i);
}
 
//console.log(allBalls.length);

//P5: canvas draw steps
var ball = function(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.draw = function() {
    	myContext.beginPath();
    	myContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        myContext.fillStyle = this.color;
        myContext.fill();
        myContext.lineWidth = 5;
        myContext.strokeStyle = this.color;
        myContext.stroke();
    }
}

//Small ball spawns
function smallBallSpawn() {
	var index=0;
	setInterval(
		function() {
			//range -- width(10-1090) height(10-590)
			spawnX = Math.random() * 1080 + 10;
			spawnY = Math.random() * 580 + 10;
			var radius = 3 + 3*Math.random();
			var colorIndex = Math.floor(Math.random()*ballColors.length);
			var color = ballColors[colorIndex];

			if(allBalls[index][0] == 0){
				allBalls[index][0] = 1;
				allBalls[index][1] = spawnX;
				allBalls[index][2] = spawnY;
				allBalls[index][3] = radius;
				allBalls[index][4] = color;
				new ball(spawnX,spawnY,radius,color).draw();
			}
			else index++;
			if(index == maxNum) index=0; 
		}
	,300); //spawn speed
}
window.onload = smallBallSpawn();

//Draw small balls
function smallBallDraw() {
	for(var i=0; i<maxNum; i++) {
		smallBallRemove(i);
		if(allBalls[i][0]==0) continue;
		new ball(allBalls[i][1],allBalls[i][2],allBalls[i][3],allBalls[i][4]).draw();
	}
}

//Check ball existing
function smallBallRemove(num) {
	var dx = allBalls[num][1] - currentX;
	var dy = allBalls[num][2] - currentY;
	var dis = Math.sqrt(dx*dx + dy*dy);
	if(dis <= (ballRadius + allBalls[num][3])){
		eatOne(num);
		initializeBall(num);
	}
}

function drawCircle(X, Y) {
    // Clear the background
    myContext.clearRect(0, 0, myCanvas.width, myCanvas.height);

    // Establish the circle path
    myContext.beginPath();
    myContext.arc(X, Y, ballRadius, 0, 2 * Math.PI, false);

    //console.log(X+" "+Y);
    // Fill the circle
    myContext.fillStyle = 'black';
    myContext.fill();

    // Outline (stroke) the circle
    myContext.lineWidth = 10;
    myContext.strokeStyle = 'black';
    myContext.stroke();
    currentX = X;
    currentY = Y;

    //draw small balls
    smallBallDraw();
}

function eatOne(num) {	
	ballRadius += 0.2*allBalls[num][3];
	if(ballSpeed>1) 
		ballSpeed -= 0.003*allBalls[num][3];
}

//P2: Ball move logic
//P4: clearInterval

// Ball move
var timer;
function ballMove() {
	//console.log(1);
	timer = setInterval(
        function() {
            var dx = mouseX - currentX;
            var dy = mouseY - currentY;
            var angle = Math.atan2(dy, dx);

            currentX += Math.cos(angle) * ballSpeed;
            currentY += Math.sin(angle) * ballSpeed;
            drawCircle(currentX, currentY);
        }, 15)
}

// P3: addEventListener -> this

// Mouse move
myCanvas.addEventListener('mousemove', function(e) {
	//console.log(this);
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    //console.log(mouseX - currentX);
    //console.log(mouseY - currentY);

});

// Mouse over
myCanvas.addEventListener('mouseover', ballMove);

// Mouse out
myCanvas.addEventListener('mouseout', function(e) {
	//console.log(allBalls);
	mouseX = currentX;
	mouseY = currentY;
	drawCircle(mouseX, mouseY);
	clearInterval(timer);
});

// Initial ball
drawCircle(myCanvas.width / 2, myCanvas.height / 2);
