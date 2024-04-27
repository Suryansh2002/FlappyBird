import { sleep, randomChoice } from "./helpers.js";

class PipeManager{
    constructor(){
        this.pipeIds = [];
        this.index = 0;
        this.lastBig = false
        this.newPipe();
    }

    getStyle(element){
        return window.getComputedStyle(element);
    }

    newPipe(){
        const pipeLocation = [["top-0","transform","rotate-180"],["bottom-0"]][this.index];
        this.index = 1 - this.index;
        let height = randomChoice(["h-1/2","h-1/3","h-2/3"]);
        if (this.lastBig){
            height = "h-1/3";
        }
        if (["h-2/3"].includes(height)){
            this.lastBig = true;
        }
        this.lastBig = false;
        
        const id = Date.now().toString(36);
        let pipe = document.createElement("div");
        pipe.id = id;
        pipe.classList.add("absolute","-z-10",height,"right-0", ...pipeLocation);

        let img = document.createElement("img");
        img.src = "./images/pipe.png";
        img.alt = "pipe";
        img.classList.add("w-full", "h-full");
        pipe.appendChild(img);

        this.pipeIds.push(id);
        document.body.appendChild(pipe);
    }

    movePipes(){
        this.pipeIds.forEach(id=>{
            const pipe = document.getElementById(id);
            const right_value = parseInt(this.getStyle(pipe).right)+1;
            pipe.style.right = right_value + "px";
            if (right_value > document.body.clientWidth){
                pipe.remove();
                this.pipeIds.shift();
            }
        })    
    }

    generatePipes(){
        const lastPipe = document.getElementById(this.pipeIds[this.pipeIds.length - 1]);
        if (parseInt(this.getStyle(lastPipe).right) > randomChoice([400,450,500])){
            this.newPipe();
        }
    }

}


class Bird{
    constructor(){
        this.bird = document.getElementById("bird");
        this.state = "rise";
        this.counter = 0;
    }

    get computedStyle(){
        return window.getComputedStyle(this.bird);
    }

    transform(state){
        if (state == "rise"){
            this.state = state
            this.bird.style.transform = "rotate(-30deg)";
        }else if (state == "fall"){
            this.state = state
            this.bird.style.transform = "rotate(20deg)";
        }
    }

    async fly(){
        this.transform("rise");
        const times = 100;
        for (let i = 1; i <= times;i++){
            if (gameOver){
                return;
            }
            await sleep(1);
            this.counter = i;
            this.bird.style.top = parseInt(this.computedStyle.top) + -1 + "px";
        }
        await sleep(10);
        if (this.counter == times){
            this.transform("fall");
        }
    }

    async drop(){
        if (this.state == "rise"){
            return;
        }
        this.bird.style.top = parseInt(this.computedStyle.top) + 3 + "px";
    }
}

let loopId;
let gameOver = false;
let score = 0.0;
const bird = new Bird();
const pipeManager = new PipeManager();

function displayHighscore(){
    document.getElementById("highscore").innerText = "Highscore: " + (localStorage.getItem("highscore") || 0);
}
displayHighscore();



function checkEnd(){
    if (parseInt(bird.computedStyle.top) < -100 || parseInt(bird.computedStyle.bottom) < -100){
        endGame();
    }

    if (pipeManager.pipeIds.length == 0){
        return;
    }
    const lastPipe = document.getElementById(pipeManager.pipeIds[0]);
    const style = pipeManager.getStyle(lastPipe);
    if (parseInt(style.left)<10){
        return;
    }
    if (!(parseInt(bird.computedStyle.right)+20<parseInt(style.right)+parseInt(style.width))){
        return;
    }
    if (style.bottom == "0px"){
        if (parseInt(bird.computedStyle.bottom)< parseInt(style.height)){
            endGame();
        }
    } else if(style.top == "0px"){
        if (parseInt(bird.computedStyle.top)< parseInt(style.height)){
            endGame();
        }
    }
}

function changeScore(){
    document.getElementById("score").innerText = "Score: " + parseInt(score);
}


function gameLoop(){
    score += 1/100;
    changeScore();
    pipeManager.movePipes();
    pipeManager.generatePipes();
    bird.drop();
    checkEnd();
}

function endGame(){
    clearInterval(loopId);
    gameOver = true;
    loopId = undefined;
    let highscore = parseInt(localStorage.getItem("highscore"));
    if (!highscore || score > highscore){
        localStorage.setItem("highscore",parseInt(score));
        displayHighscore();
    }
    alert("Game Over");
    // window.location.reload();
}

function startGame(){
    loopId = setInterval(gameLoop,1);
}

document.body.addEventListener("click",()=>{
    if (gameOver){
        return;
    }
    if (!loopId){
        startGame();
    }
    bird.fly();
})