//禁止页面滚动
document.body.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, false);
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// 初始化参数
var v = 0;
var shake = true; // 标题抖动
var index = 0; // 水管下标
var startTimer;
var startTime = 0;
var gameTimer;
var gameTime = 0;
var pipes = []; //用于存放水管
var scroll = 0; //当前得分
var scrollImg = [imgs.scroe0, imgs.scroe1, imgs.scroe2,
  imgs.scroe3, imgs.scroe4, imgs.scroe5,
  imgs.scroe6, imgs.scroe7, imgs.scroe8,
  imgs.scroe9
];

// 初始化界面
function init() {
  imgs.loadImg(startLayer);
}
// 绘制背景
function drawBg() {
  ctx.drawImage(imgs.bg, 0, 0);
}
// 绘制开始按钮
function drawStartBtn() {
  ctx.drawImage(imgs.startBtn, 130, 300);
}
// 绘制草坪
function drawGrass() {
  ctx.drawImage(imgs.grass, 3 * v--, 423);
  ctx.drawImage(imgs.grass, 337 + 3 * v--, 423);
  if (3 * v < -343) {
    v = 0;
  }
}

//标题抖动
function titleShake() {
  if (shake) {
    ctx.drawImage(imgs.title, 53, 100);
    ctx.drawImage(imgs.bird1, 250, 140);
  } else {
    ctx.drawImage(imgs.title, 53, 103);
    ctx.drawImage(imgs.bird0, 250, 143);
  }
}

//开始界面
function startLayer() {
  startTimer = setInterval(function() {
    clean();
    drawBg();
    drawStartBtn();
    drawGrass();
    titleShake();
    //定时器每运行7次改变标题位置
    if (startTime == 7) {
      shake = !shake;
      startTime = 0;
    }
    //运行次数+1
    startTime++;

  }, 24);
}

//判断是否碰撞
function isHit(oPipe) {
  if (bird.posX + bird.bird[0].width > oPipe.posX && bird.posX < oPipe.posX + oPipe.down_pipe.width) {
    if (bird.posY < oPipe.up_posY || bird.posY + 30 > oPipe.down_posY) {
      bird.dead();
    }
  }
}

//判断是否越过水管
function isSkipped(oPipe) {
  if (bird.posX > oPipe.posX + oPipe.down_pipe.width) {
    //水管已经被越过
    oPipe.hadSkipped = true;
    //确保水管只被越过一次
    if (!oPipe.hadSkippedChange && oPipe.hadSkipped) {
      //分数+1
      scroll++;
      oPipe.hadSkippedChange = true;
    }
  }
}

//绘制当前得分
function drawScore() {
  //每绘制一位数，向右移23，绘制下一位数
  for (var i = 0; i < scroll.toString().length; i++) {
    ctx.drawImage(scrollImg[parseInt(scroll.toString().substr(i, 1))], 147 + i * 23, 40)
  }
}

//游戏界面
function gameLayer() {
  gameTimer = setInterval(function() {
    clean();
    drawBg();
    drawGrass();
    if (gameTime % 5 == 0) {
      if (gameTime == 30) {
        createPipes();
        gameTime = 0;
      }
      bird.wingWave();
    }
    gameTime++;
    for (var i = 0; i < pipes.length; i++) {
      pipes[i].move();
      isHit(pipes[i]);
      isSkipped(pipes[i]);
    }
    drawScore();
    bird.fly();
    //如果小鸟死了
    if (!bird.alive) {
      gameOver(); //游戏结束
      reset(); //数据重置
    }
  }, 24);
}

function createPipes() {
  var pipe = new Pipe(imgs.up_pipe, imgs.up_mod, imgs.down_pipe, imgs.down_mod);
  //添加进pipes中，如果已经有三个水管，则依次替换
  if (pipes.length < 3) {
    pipes.push(pipe);
  } else {
    pipes[index] = pipe;
    index++;
    if (index >= 3) {
      index = 0;
    }
  }
}

//键盘点击事件
function kd(e) {
  if (e.keyCode === 32) {
    bird.speed = -10;
  }
}
//触屏事件
function ts() {
  bird.speed = -10;
}
//start按钮点击事件
function startBtn_click(e) {
  //判断点击位置
  if (e.clientX > canvas.offsetLeft + canvas.width / 2 - imgs.startBtn.width / 2 &&
    e.clientX < canvas.offsetLeft + canvas.width / 2 + imgs.startBtn.width / 2 &&
    e.clientY < canvas.offsetTop + 300 + imgs.startBtn.height &&
    e.clientY > canvas.offsetTop + 300) {
    clean();
    //清除开始界面定时器
    clearInterval(startTimer);
    gameLayer();
    //添加响应事件
    window.addEventListener('keydown', kd, false)
    window.addEventListener('touchstart', ts, false)
      //删除start按钮响应事件
    canvas.removeEventListener('click', startBtn_click, false);
  }
}
canvas.addEventListener('click', startBtn_click, false);

//游戏结束
function gameOver() {
  //清除定时器
  clearInterval(gameTimer);
  //清除窗口响应事件
  window.removeEventListener('keydown', kd, false);
  window.removeEventListener('touchstart', ts, false);
  //绘制GAME OVER
  ctx.font = "50px blod";
  ctx.fontWeight = '1000'
  ctx.fillStyle = "white";
  ctx.fillText("GAME OVER", 20, 200);
  drawStartBtn();
}

//重置数据
function reset() {
  bird.posY = 200;
  bird.speed = 0;
  bird.alive = true;
  pipes = [];
  scroll = 0;
  canvas.addEventListener('click', startBtn_click, false);
}

// 清空画布
function clean() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

init();