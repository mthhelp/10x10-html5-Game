var R = R || {};

//
R.BASE_GAME_WIDTH = 640;
R.BASE_GAME_HEIGHT = 960;

R.MAX_GAME_HEIGHT = 1280;
R.MIN_GAME_HEIGHT = 916;

R.gameWidth = R.BASE_GAME_WIDTH;
R.gameHeight = R.BASE_GAME_HEIGHT;
R.halfGameWidth = R.gameWidth * 0.5;
R.halfGameHeight = R.gameHeight * 0.5;

R.prevWindowWidth = 0;
R.prevWindowHeight = 0;

//
R.fontName = 'Arvo';
R.strings = null;

R.currentGridShapeIdx = 1;
R.shapeStates = null;
R.score = 0;

R.sfx = {};

R.playerData = {

    score: 0,
    theme: 0
};

R.saveGame = function()
{
    if(game.device.localStorage) localStorage.setItem('Boostermedia_10x10plus_PlayerData', JSON.stringify(R.playerData));
};

R.loadGame = function()
{
    if(game.device.localStorage)
    {
        var saveData = localStorage.getItem('Boostermedia_10x10plus_PlayerData');
        if(saveData) R.playerData = JSON.parse(saveData);
    }
};

//
R.existsInArray = function(arr, a)
{
    var i = arr.length;
    while(i--) if(arr[i] === a) return true;
    return false;
};

//
var game = null;

var startGame = function()
{
    var renderType = Phaser.AUTO;
    var ua = detect.parse(window.navigator.userAgent);
    if(ua.device.family == 'SM-T110' || ua.device.family == 'SM-T111') renderType = Phaser.CANVAS;

    game = new Phaser.Game(R.BASE_GAME_WIDTH, R.BASE_GAME_HEIGHT, renderType, 'gameContainer', BootState);
};