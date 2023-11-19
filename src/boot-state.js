//
var BootState = {

    //
    init: function()
    {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;       
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        if(!game.device.desktop)
        {
            game.scale.forceOrientation(false, true);
            game.scale.enterIncorrectOrientation.add(this.onEnterIncorrectOrientation, this);
            game.scale.leaveIncorrectOrientation.add(this.onLeaveIncorrectOrientation, this);
            game.scale.onSizeChange.add(this.onSizeChange, this);
            game.scale.setResizeCallback(this.onResize, this);
            this.resizeGame();
        }
        else
        {
            if(game.renderType === Phaser.WEBGL) game.canvas.style.boxShadow = "0 0 30px black";
            //document.getElementsByTagName('body')[0].style.backgroundImage = "url(assets/dtile.png)";
           
            game.scale.setResizeCallback(this.gameContainerResize, this);
        }

        game.input.maxPointers = 1;
        game.stage.disableVisibilityChange = false;

        this.additionalAudioCheck();        
    },

    preload: function()
    {
        game.load.atlas('load', 'assets/atlas_load.png', 'assets/atlas_load.json');
    },

    //
    create: function()
    {
        game.state.add('load', LoadState);
        game.state.add('home', HomeState); 
        game.state.add('play', PlayState);
        game.state.start('load');
    },

    gameContainerResize: function()
    {
        var gameContainer = document.getElementById(game.parent);
        gameContainer.style.width = window.innerWidth + "px";
        gameContainer.style.height = window.innerHeight + "px";
    },

    onResize: function()
    {        
        var ww = window.innerWidth;
        var wh = window.innerHeight;
        if(R.prevWindowWidth != ww || R.prevWindowHeight != wh) this.onSizeChange();
        this.gameContainerResize();
    },

    onSizeChange: function()
    {
        if(window.innerWidth < window.innerHeight)
        {
            this.resizeGame();
            game.state.resize(R.gameWidth, R.gameHeight);
        }
    },

    resizeGame: function()
    {
        var ww = window.innerWidth;
        var wh = window.innerHeight;   

        R.prevWindowWidth = ww;
        R.prevWindowHeight = wh;

        R.gameHeight = R.BASE_GAME_WIDTH / ww * wh;

        if(R.gameHeight > R.MAX_GAME_HEIGHT) R.gameHeight = R.MAX_GAME_HEIGHT;
        else if(R.gameHeight < R.MIN_GAME_HEIGHT) R.gameHeight = R.MIN_GAME_HEIGHT;

        R.halfGameHeight = R.gameHeight * 0.5;

        game.scale.setGameSize(R.BASE_GAME_WIDTH, R.gameHeight);        
    },

    onEnterIncorrectOrientation: function()
    {
        game.paused = true;
    },

    onLeaveIncorrectOrientation: function()
    {
        game.paused = false;
        this.onSizeChange();
    },

    additionalAudioCheck: function()
    {
        //second check sound
        /*
            Sharp = SH-01F
            Fujitsu = F-01F
            Xperia A = SO-04E
            Sharp Mini = SHL24
            */

        function isStock()
        {
            var matches = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
            return matches && matches[1] < 537;
        }

        var ua = navigator.userAgent; // Returns a string which tells you what device you're using
        var isSharpStock = ((/SHL24|SH-01F/i).test(ua)) && isStock(); // Checks if device is, Sharp(SH-01F) or Sharp Mini(SHL24)
        var isXperiaAStock = ((/SO-04E/i).test(ua)) && isStock(); // Checks if device is, Xperia A(SO-04E)
        var isFujitsuStock = ((/F-01F/i).test(ua)) && isStock(); // Checks if device is, Fujitsu(F-01F)

        if(isSharpStock || isXperiaAStock || isFujitsuStock) game.device.webAudio = false;
    }    
};