//캔버스 세팅
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d"); // 2d로 보여줄 것이다.
canvas.width = 400; // 캔버스의 가로 길이 설정
canvas.height = 700; // 캔버스의 세로 길이 설정
document.body.appendChild(canvas); // 이것을 body 안에 붙이겠다.

//이미지 가져오기
let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage; // 이미지를 가져오기 위한 변수 선언
let gameOver = false // true이면 게임이 끝남, false이면 게임이 안 끝남
let score = 0;

// 우주선 좌표
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;

let bulletList = []; // 총알들을 저장하는 리스트
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init= function(){
        this.x = spaceshipX+20;
        this.y = spaceshipY;
        this.alive = true; // true면 살아있는 총알, false면 죽은 총알

        bulletList.push(this);
    }
    this.update = function(){
        this.y -= 7;
    }

    this.checkHit=function(){
        for(let i =0; i < enemyList.length; i++){
            if(this.y <= enemyList[i].y && this.x >=enemyList[i].x && this.x <= enemyList[i].x +48){
                // 총알과 적군이 사라지고 점수 증가
                score++;
                this.alive = false;
                enemyList.splice(i,1);
            }
        }
    }
}

const generateRandomValue =(min,max)=>{
    let randomNum = Math.floor(Math.random()*(max-min-1))+min;
    return randomNum;
}

let enemyList = [];
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init=function(){
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width-48);
        enemyList.push(this);
    }
    this.update = function(){
        this.y += 4;

        if(this.y >= canvas.height-48){
            gameOver = true;
        }
    }
}

const loadImage=()=>{
    backgroundImage = new Image();
    backgroundImage.src = "images/background.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png";

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.gif";
}

//방향키 이벤트
let keysDown = {};
const setupKeyboardListener=()=>{
    document.addEventListener("keydown",(event)=>{
        keysDown[event.key] = true;
    });

    document.addEventListener("keyup",(event)=>{
        delete keysDown[event.key]; 
        if(event.key == " "){ // 총알 발사를 위한 스페이스바에 이벤트 생성
            createBullet();
        }
    });
   
}

const createBullet=()=>{
    console.log("총알 발사");
    let b = new Bullet();
    b.init();
}

//적군 1초 생성
const createEnemy=()=>{
    const interval = setInterval(()=>{
        let e = new Enemy()
        e.init();
    },1000)
}

//우주선 위치 움직이기
const update=()=>{
    if("ArrowRight" in keysDown){ //오른쪽
        spaceshipX += 5;
    }
    if("ArrowLeft" in keysDown){ // 왼쪽
        spaceshipX -= 5;
    }

    if("ArrowUp" in keysDown){ // 위
        spaceshipY -= 3;
    }

    if("ArrowDown" in keysDown){ // 아래
        spaceshipY += 3;
    }

    if(spaceshipX <= 0){ // 왼쪽
        spaceshipX = 0;
    }

    if(spaceshipX >= canvas.width-64){ // 오른쪽
        spaceshipX = canvas.width-64;
    }

    if(spaceshipY <= 0){ // 위
        spaceshipY = 0;
    }

    if(spaceshipY >= canvas.height-64){ // 아래
        spaceshipY = canvas.height-64;
    }

    //총알의 y좌표 업데이트하는 함수 호출
    for(let i =0; i< bulletList.length; i++){
        if(bulletList[i].alive == true){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
        
    }

    for(let i = 0; i < enemyList.length; i++){
        enemyList[i].update();
    }
}

//이미지 보여주기
const render=()=>{
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText(`Score: ${score}`, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    for(let i = 0; i< bulletList.length; i++){
        if(bulletList[i].alive == true){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }
        
    }

    for(let i = 0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
}

// 계속 호출해주는 함수 만들기
const main=()=>{
    if(gameOver == false){
        update();
        render();
        requestAnimationFrame(main); 
    }else{
        ctx.drawImage(gameOverImage, 10, 100, 400, 380);
    }
   
}

loadImage();
setupKeyboardListener();
createEnemy();
main();