var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");  			//2d 렌더링을 위한 사용
    var ballRadius = 10;				//원의 반지름 크기			
    var x = canvas.width/2;				//canvas 너비의 중간으로 오게 공설정 
    var y = canvas.height-30;				//canvas 공 위치의 높이 설정 
    var dx = 2;					// 공의 위치 표현 위해 매 프레임 마다 더해주는 변수 설정 
    var dy = -2;					// 공의 위치 표현 위해 매 프레임 마다 더해주는 변수 설정 
    var StickHeight = 10;				//공 치는 막대기의 크기 
    var StickWidth = 75;			
    var StickX = (canvas.width-StickWidth)/2;
    var rightPress = false;			//컨트롤 을 위해 오른쪽컨트롤이 눌러졌는지
    var leftPress = false;			//왼쪽 컨트롤
    var brickRow = 5;			//벽돌의 행, 렬 설정
    var brickColumn = 3;
    var brickWidth = 75;			//벽돌의 크기
    var brickHeight = 20;
    var brickPadding = 10;			//벽돌의 간격
    var brickfromTop = 30;			//벽돌이 닿지 않게 하는것
    var brickfromLeft = 30;
    var score = 0;
    var life = 2;

    var bricks = [];				//벽돌들 생성
    for(var c=0; c<brickColumn; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRow; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);			//컨트롤이 눌러져 있나를 체크하는 함수
    document.addEventListener("keyup", keyUpHandler, false);			//컨트롤이 뗐나를 체크하는 함수
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {						//이때 39는오른쪽방향키 , 37은 왼쪽 방향키를 뜻함
        if(e.keyCode == 39) {							// 이 함수들을 통해 방향키 사용을 체크
            rightPress = true;
        }
        else if(e.keyCode == 37) {
            leftPress = true;
        }
    }
    function keyUpHandler(e) {						//키를 땠을 때 발생함 ==> keyup이벤트가
        if(e.keyCode == 39) {
            rightPress = false;
        }
        else if(e.keyCode == 37) {
            leftPress = false;
        }
    }
    function mouseMoveHandler(e) {						
        var relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width) {
            StickX = relativeX - StickWidth/2;
        }
    }
    function collisionDetection() {				//충돌 감지함수
        for(var i=0; i<brickColumn; i++) {
            for(var j=0; j<brickRow; j++) {
                var b = bricks[i][j];
                if(b.status == 1) {				//벽돌의 존재 유무 확인
                    if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;					//지워지면 score 증가
                        if(score == brickRow*brickColumn) {		// score가 벽돌의 개수 되면 끝
                            alert("YOU WIN, CONGRATULATION!");
                            document.location.reload();		// 다시 시작0
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);			//위의 변수에서 공의 위치, 크기 미리 정해놓음
        ctx.fillStyle = "#ff2400";				//공 색깔(원래는 0095DD : 파랑) 
        ctx.fill();						//공 색깔 채우기
        ctx.closePath();
    }
    function drawStick() {					//막대기  그리는것
        ctx.beginPath();
        ctx.rect(StickX, canvas.height-StickHeight, StickWidth, StickHeight);  //막대기를 사각형으로 그리기, 위치까지 설정
        ctx.fillStyle = "#000000";				         // 막대기 색깔 (검정색)
        ctx.fill();
        ctx.closePath();
    }
    function drawBricks() {
        for(var i=0; i<brickColumn; i++) {
            for(var j=0; j<brickRow; j++) {
                if(bricks[i][j].status == 1) {
                    var brickX = (j*(brickWidth+brickPadding))+brickfromLeft;		//차례로 벽돌 그리기
                    var brickY = (i*(brickHeight+brickPadding))+brickfromTop;
                    bricks[i][j].x = brickX;
                    bricks[i][j].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#000000";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText("Score: "+score, 8, 20);
    }
    function drawLife() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText("Life: "+life, canvas.width-65, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);		//이 함수는 이전 프레임을 지워 공의 전 위치를 지우기 위한 함수 입니다.
        drawBricks();
        drawBall();
        drawStick();
        drawScore();
        drawLife();
        collisionDetection();

        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {	//좌우 모서리 설정 
            dx = -dx;
        }
        if(y + dy < ballRadius) {				//벽에 튕기면 방향이 바뀌기 떄문에 볼이 상단 모서리에 닿았을 때 음/양이 바뀌게 설정 
            dy = -dy;
        }
        else if(y + dy > canvas.height-ballRadius) {		//하단 모서리에 닿았을 때의 경우 
            if(x > StickX && x < StickX + StickWidth) {		//하단과 동시에 stick과 닿았을 경우는 튕겨 나옴
                dy = -dy;
            }
            else {						//stick에 안닿았을 경우 life 한개 깎임
                life--;
                if(!life) {					//목숨이 다 달면 game over가 나오게 설정
                    alert("GAME OVER");
                    document.location.reload();			//끝나고 페이지 reload 되게 설정
                }
                else {						// life가 남아 있을 경우 다시 처음 위치에서 시작
                    x = canvas.width/2;
                    y = canvas.height-30;
                    dx = 3;
                    dy = -3;
                    StickX = (canvas.width-StickWidth)/2;
                }
            }
        }

        if(rightPress && StickX < canvas.width-StickWidth) {		//한번 누를때 이동하는 stick의 이동거리
            StickX += 7;
        }
        else if(leftPress && StickX > 0) {
            StickX -= 7;
        }

        x += dx;
        y += dy;
        requestAnimationFrame(draw);
    }

    draw();