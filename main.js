var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// position of the ball
var x = canvas.width/2;
var y = canvas.height-30;
// change values for the ball movement

// key event variables
var rightPressed = false;
var leftPressed = false;

var ball = {
    fills : ["#33FF83", "#1543DE","#DE15BB", "BFDE15"],
    radius : 10,
    fill : 0,
    dx : 2,
    dy : -2
};

var paddle = {
    height : 10,
    width : 150,
    x : (canvas.width- this.width)/2
};


function buildBricksArray() {
    var bricks = []
    for (c = 0; c < 5; c++) {
        bricks[c] = [];
        for (r = 0; r < 3; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1};
        }
      }
    return bricks;
}

function Brick(b) {
    this.rowCount = 3;
    this.columnCount = 5;
    this.width = 75;
    this.height = 20;
    this.padding = 10;
    this.offsetTop = 30;
    this.offsetLeft = 30;
    this.score = 200;
    this.bricks = b;

    this.drawBricks = function() {
        for(c=0; c<this.columnCount; c++) {
            for(r=0; r<this.rowCount; r++) {
                if(this.bricks[c][r].status == 1) {
                    var brickX = (c*(this.width + this.padding)) + this.offsetLeft;
                    var brickY = (r*(this.height + this.padding)) + this.offsetTop;
                    this.bricks[c][r].x = brickX;
                    this.bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, this.width, this.height);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    };
}
var brick = new Brick(buildBricksArray());

var score = 0;


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
        paddle.x = relativeX - paddle.width/2;
    }
}


function drawBall() {
    /**
     * Draws the ball to the canvas
     */

    ctx.beginPath();
    ctx.arc(x, y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = ball.fills[ball.fill];
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height-paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function collisionDetection() {
    for(c=0; c<brick.columnCount; c++) {
        for(r=0; r<brick.rowCount; r++) {
            var b = brick.bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brick.width && y > b.y && y < b.y + brick.height) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    // change the colour of the ball
                    if (ball.fill < ball.fills.length) {
                    ball.fill++;
                    }
                    else {
                        ball.fill = 0;
                    }
                    score += brick.score;
                    // Detect victory
                    if (score/ brick.score == brick.rowCount * brick.columnCount) {
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
    brick.drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    // Check for collisions
    if (x + ball.dx > canvas.width-ball.radius || x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
        if (y + ball.dy < ball.radius) {
            ball.dy = -ball.dy;
        } else if (y + ball.dy > canvas.height - ball.radius) {
            if (x > paddle.x && x < paddle.x + paddle.width) {
                if (y = y - paddle.height) {
                    ball.dy = -ball.dy;
                }

            } else {
                alert("GAME OVER");
                document.location.reload();
            }
    }

    // Move the paddle
    if (rightPressed && paddle.x < canvas.width- (paddle.width)) {
        paddle.x += 7;
    }
    else if (leftPressed && paddle.x > 0) {
        paddle.x -= 7;

    }
    x += ball.dx;
    y += ball.dy;
}

// call draw every 10ms
setInterval(draw, 10);
