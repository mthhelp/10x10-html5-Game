//
var HomeState = {

    bg: null,
    cup: null,
    labelScore: null,
    labelSelectShape: null,
    logo: null,
    buttonPlay: null,
    buttonTheme: null,
    buttonMoreGames: null,
    gShapes: null,
    tws: [],

    //
    shutdown: function()
    {
        this.bg = null;
        this.cup = null;
        this.labelScore = null;
        this.labelSelectShape = null;
        this.logo = null;
        this.buttonPlay = null;
        this.buttonTheme = null;
        this.buttonMoreGames = null;
        this.gShapes = null;
        this.tws.length = 0;
    },

    create: function()
    {        
        this.bg = new R.Background(R.playerData.theme === 0 ? 'tile_dark' : 'tile_light');        

        this.cup = game.add.sprite(R.halfGameWidth, 120, 'main', 'cup');
        this.cup.anchor.set(0.5);
        this.cup.alpha = 0.0;

        this.labelScore = R.createText(R.halfGameWidth, 230, 50, R.playerData.score.toString(), '#21c1ef');
        this.labelScore.alpha = 0.0;

        this.labelSelectShape = R.createText(R.halfGameWidth, -60, 50, R.strings.select_shape, '#21c1ef');
        this.labelSelectShape.visible = false;

        this.logo = game.add.sprite(R.halfGameWidth + 36, game.height + 35, 'main', 'logo_small');
        this.logo.anchor.set(0.5);

        //
        this.buttonPlay = R.createButton(329, -80, this.onPlayButton, this, 'btn_big_play', 'btn_big_play_pushed');
        this.buttonTheme = R.createButtonTheme(-90, 538);
        this.buttonMoreGames = R.createButton(game.width + 90, 538, Publisher.moregamesRedirect, Publisher, 'btn_moregames', 'btn_moregames_pushed');
        this.buttonMoreGames.visible = Publisher.enableMoreGames;

        //
        this.gShapes = game.add.group();        
        var s = 240, x1 = R.halfGameWidth - s * 0.5, x = x1, y = game.height * 0.25;
        var frames = ['grid_heart', 'grid_quad', 'grid_cat', 'grid_cross', 'grid_house', 'grid_o'];
        for(var i = 0; i < 6; ++i)
        {
            var sh = this.gShapes.create(x, y, 'main', frames[i]);
            sh.anchor.set(0.5);
            sh.r_id = i;
            sh.inputEnabled = true;            
            sh.events.onInputDown.add(this.onShapeSelect, this);

            if((i + 1) % 2 === 0)
            {
                x = x1;
                y += 220;
            }
            else x += s;
        }
        this.gShapes.visible = false;

        //
        this.tws.push(game.add.tween(this.buttonPlay).to({ y: 372 }, 500, Phaser.Easing.Cubic.Out, false));
        this.tws.push(game.add.tween(this.buttonTheme).to({ x: Publisher.enableMoreGames ? 243 : 324 }, 500, Phaser.Easing.Cubic.Out, false));
        this.tws.push(game.add.tween(this.buttonMoreGames).to({ x: 418 }, 500, Phaser.Easing.Cubic.Out, false));
        this.tws.push(game.add.tween(this.cup).to({ alpha: 1.0 }, 500, Phaser.Easing.Cubic.Out, false, 300));
        this.tws.push(game.add.tween(this.labelScore).to({ alpha: 1.0 }, 500, Phaser.Easing.Cubic.Out, false, 400));
        this.tws.push(game.add.tween(this.logo).to({ y: game.height - 120 }, 300, Phaser.Easing.Back.Out, false, 200));

        this.tws[this.tws.length - 1].onComplete.add(this.enableButtons, this, true);

        //
        this.enableButtons(false);
        Publisher.analyticsMenu();
        R.sceneTransition(200, null);
    },

    start: function()
    {
        for(var i in this.tws) this.tws[i].start();        
    },

    enableButtons: function(enable)
    {
        this.buttonPlay.inputEnabled = this.buttonTheme.inputEnabled = this.buttonMoreGames.inputEnabled = enable;
    },

    onPlayButton: function()
    {
        this.enableButtons(false);
        
        game.add.tween(this.buttonPlay).to({ y: -80 }, 300, Phaser.Easing.Linear.None, true);
        game.add.tween(this.buttonTheme).to({ x: -90 }, 300, Phaser.Easing.Linear.None, true);
        game.add.tween(this.buttonMoreGames).to({ x: game.width + 90 }, 300, Phaser.Easing.Linear.None, true);
        game.add.tween(this.cup).to({ alpha: 0.0 }, 300, Phaser.Easing.Cubic.Out, true);
        game.add.tween(this.labelScore).to({ alpha: 0.0 }, 200, Phaser.Easing.Cubic.Out, true);
        game.add.tween(this.logo).to({ y: game.height - 60 }, 500, Phaser.Easing.Cubic.Out, true, 300);

        this.labelSelectShape.visible = true;
        game.add.tween(this.labelSelectShape).to({ y: 60 }, 500, Phaser.Easing.Cubic.Out, true, 300);

        var sh = null;
        var x = 0, timeDelay = 300;
        for(var i = 0; i < 6; ++i)
        {
            sh = this.gShapes.children[i];
            x = sh.x;            
            sh.x = x < R.halfGameWidth ? -100 : game.width + 100;
            game.add.tween(sh).to({ x: x }, 400, Phaser.Easing.Back.Out, true, timeDelay);
            if((i + 1) % 2 === 0) timeDelay += 100;
        }
        this.gShapes.visible = true;
    },

    applyTheme: function()
    {        
        this.bg.setTile(R.playerData.theme === 0 ? 'tile_dark' : 'tile_light');
        game.canvas.parentElement.style.backgroundColor = R.playerData.theme === 0 ? '#061528' : '#979ea5';
    },

    onShapeSelect: function(shape)
    {
        if(R.sfx.button) R.sfx.button.play();
        R.currentGridShapeIdx = shape.r_id;

        var sh = null;
        for(var i = 0; i < 6; ++i)
        {
            sh = this.gShapes.children[i];
            sh.inputEnabled = false;

            if(sh !== shape)
            {
                game.add.tween(sh.scale).to({ x: 0.8, y: 0.8 }, 400, Phaser.Easing.Cubic.Out, true);
                game.add.tween(sh).to({ alpha: 0.5 }, 400, Phaser.Easing.Cubic.Out, true);
            }
            else
            {
                
                game.add.tween(sh.scale).to({ x: 1.2, y: 1.2 }, 400, Phaser.Easing.Cubic.Out, true).onComplete.add(this.startPlaying, this);
                continue;
            }
        }        
    },

    startPlaying: function()
    {        
        R.sceneTransition(200, 'play');
    }
};