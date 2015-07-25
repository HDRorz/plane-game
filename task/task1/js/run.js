var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

window.onload = init;
var stage, w, h, loader;
var sky, cat, ground, hill, hill2;
var goldContainer;

var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;

var moveLeft = false;
var moveRight = false;

var maxGolds = 2;
var score = 0;
var scoreText;

var catHeight;
var catWidth;

var goldWidth;
var goldHeight;

var remainTime = 6000;
var timeText;

var start = true;

window.addEventListener('keydown', function (e) {
    if (!e) {
        e = window.event;
    }
    switch (e.keyCode) {
        case KEYCODE_LEFT:
            moveLeft = true;
            return false;
        case KEYCODE_RIGHT:
            moveRight = true;
            return false;
    }
}, false);
window.addEventListener('keyup', function (e) {
    if (!e) {
        e = window.event;
    }
    switch (e.keyCode) {
        case KEYCODE_LEFT:
            moveLeft = false;
            break;
        case KEYCODE_RIGHT:
            moveRight = false;
            break;
    }
    return false;
}, false);

window.addEventListener('touchstart', function (event) {
    if (event.touches.length == 1) {
        if (event.touches[0].clientX > cat.x) {
            moveRight = true;
        }
        else {
            moveLeft = true;
        }
    }
}, false);
window.addEventListener('touchend', function () {
    moveRight = false;
    moveLeft = false;
}, false);


function init() {
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(60);

    w = stage.canvas.width;
    h = stage.canvas.height;

    manifest = [
        {
            src: '猫猫.png',
            id: 'cat'
        },
        {
            src: 'yuanbao.png',
            id: 'gold'
        }
    ];

    goldContainer = new createjs.Container();
    scoreText = new createjs.Text('分数: 0', '36px Arial', '#fff');
    scoreText.x = 32;
    scoreText.y = 32;

    timeText = new createjs.Text('剩余时间: ' + remainTime / 1000, '36px Arial', '#fff');
    timeText.x = w - 220 - 32;
    timeText.y = 32;


    loader = new createjs.LoadQueue();
    loader.addEventListener('complete', handleComplete);
    loader.loadManifest(manifest, true, './img/');
}

function handleComplete() {

    cat = new createjs.Bitmap(loader.getResult('cat'));
    cat.x = 100;
    cat.y = h - 96;
    catHeight = cat.image.height;
    catWidth = cat.image.width;

    gold = new createjs.Bitmap(loader.getResult('gold'));
    goldWidth = gold.image.width;
    goldHeight = gold.image.height;

    stage.addChild(cat, goldContainer, scoreText, timeText);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener('tick', tick);
}

function addGold(x, y) {
    var newGold = new createjs.Bitmap(loader.getResult('gold'));
    newGold.y = y || 0;
    newGold.x = x || Math.random() * w;
    goldContainer.addChild(newGold);
    return newGold;
}


function pause() {
    start = false;
    createjs.Ticker.paused = true;
}

function restart() {
    start = true;
    createjs.Ticker.paused = false;
    remainTime = createjs.Ticker.getTime() + 6000;
}

function tick(event) {

    // 暂停
    if (!start) {
        return false;
    }

    var deltaS = event.delta / 1000;
    var position = cat.x + 150 * deltaS;

//        if (remainTime <= createjs.Ticker.getTime()) {
//            pause();
//            return;
//        }

    timeText.text = '剩余时间: ' + Math.floor((remainTime - createjs.Ticker.getTime()) / 1000);

    if (moveLeft) {
        if (cat.x > 0) {
            cat.x -= 10;
        }
    }
    if (moveRight) {
        if (cat.x + 50 < w) {
            cat.x += 10;
        }
    }

    var numOfGold = goldContainer.getNumChildren();
    if (numOfGold < maxGolds && Math.random() < 0.05) {
        addGold();
        numOfGold++;
    }

    var thisGold;
    for (var i = 0; i < numOfGold; i++) {
        thisGold = goldContainer.getChildAt(i);
        if (thisGold.y + goldHeight > (h - catHeight) && thisGold.x + goldWidth > cat.x && thisGold.x < cat.x + catWidth) {
            goldContainer.removeChild(thisGold);
            numOfGold--;
            score++;
            scoreText.text = '分数: ' + score;
        }
        else if (thisGold.y > h) {
            goldContainer.removeChild(thisGold);
            numOfGold--;
        }
        else {
            thisGold.y += 5;
        }
    }

    stage.update(event);
}