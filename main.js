var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// position of the ball
var x = canvas.width/2;
var y = canvas.height-30;
// change values for the ball movement
var dx = 2;
var dy = -2;

var ballRadius = 10;
var ballFill = 0;

var paddleHeight = 10;
var paddleWidth = 150;
var paddleX = (canvas.width-paddleWidth)/2;

// key event variables
var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var brickScore = 100;

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}
var fills = ["#33FF83", "#1543DE","#DE15BB", "BFDE15"];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}


function drawBall() {
    /**
     * Draws the ball to the canvas
     */

    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = fills[ballFill];
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
} 
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    // change the colour of the ball
                    if (ballFill < fills.length) {
                    ballFill++;
                    }
                    else {
                        ballFill = 0;
                    }
                    score += brickScore;
                    // Detect victory
                    if (score/ brickScore == brickRowCount * brickColumnCount) {
                        alert ("You are a winner\nPoints: " + score     );
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD"
    ctx.fillText("Score: " + score, 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    // Check for collisions
    if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height-ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                if (y = y-paddleHeight) {
                    dy = -dy;
                }

            } else {
                alert("GAME OVER");
                document.location.reload();
            }
    }

    // Move the paddle
    if (rightPressed && paddleX < canvas.width- (paddleWidth)) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;

    }
    x += dx;
    y += dy;
}

// call draw every 10ms
setInterval(draw, 10);
