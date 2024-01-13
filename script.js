let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d'); // context 란 뜻으로 ctx

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;


//공룡
let dinoImg = new Image(40, 50);
dinoImg.src = './img.jfif';
let dino = {
    x: 10,
    y: 200,
    width: 40,
    height: 50,
    draw() {
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        //뒤에 숫자가 크기 설정
        ctx.drawImage(dinoImg, this.x, this.y, 50, 50);
    }
}

//장애물
class Cactus {
    constructor() {
        //장애물 크기 설정
        this.width = 20 + getRandomInt(-3, 4);
        this.height = 30 + getRandomInt(-10, 100);
        //장애물 위치 설정
        this.x = 700;
        this.y = 250 - this.height;
    }
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

let timer = 0;
let cactusArr = [];
let gameState = 0; // 0: end, 1: start
let jumpState = 0; // 0: default, 1: jumping
let jumpTimer = 0;
let animation;
//목숨 수
let life = 5;
let score = 0;

function frameAction() {
    animation = requestAnimationFrame(frameAction);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timer += 1;
    
    //장애물 제어 및 점수
    if(timer % 80 == 0){
        let cactus = new Cactus();
        cactusArr.push(cactus);
    }
    cactusArr.forEach((a, i, o)=>{
        if(a.x < 0){
            o.splice(i, 1);
            score += 10;
            document.querySelector('#score').innerHTML = score;
        } else if(collisionDetection(dino, a) < 0){
            o.splice(i, 1);
        }
        
        //장애물 속도 제어
        a.x -= 10;
        a.draw();
    })    

    //점프 속도 컨트롤
    if(jumpState == 1){
        jumpTimer++; 
        dino.y -= 5;
    }
    if(jumpTimer > 25){
        jumpState = 0;
        jumpTimer = 0;
    }
    if(jumpState == 0){
        if(dino.y < 200){
            dino.y += 5;
        }
    }

    drawLine();
    dino.draw();
}

//게임 시작 및 게임 진행 코드
document.addEventListener('keydown', (e)=>{
    console.log(dino.y);
    if(e.code == 'Space'){
        if(gameState == 0){
            gameState = 1; // 게임실행
            frameAction();
            document.querySelector('h2').style.display = 'none';
        } else if(gameState == 1){ // 점프하는 코드
            if (dino.y !== 200) return; //점프중인 경우 return
            jumpState = 1; // 점프중으로 변경
        }
    }
})

//충돌 코드
function collisionDetection(dino, cactus){
    let xValue = cactus.x - ( dino.x + dino.width );
    let yValue = cactus.y - ( dino.y + dino.height );
    if( xValue < 0 && yValue < 0 ){ // 충돌!
        // 충돌 시 실행되는 코드
        life--;
        document.querySelector('#life').innerHTML = life;
        if(life == 0){
            alert('게임오버');
            gameState = 0;
            cancelAnimationFrame(animation);
            location.reload();
        }
        return -1;
    } else {
        return 1;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function drawLine(){
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.lineTo(600, 250);  
    ctx.stroke();
}