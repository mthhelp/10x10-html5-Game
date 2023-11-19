//
var LoadState = {
    
    loadText: null,  
    loadingBar: null,
    sfx_key: null,

    //
    init: function()
    {       
        game.load.onFileComplete.add(this.fileComplete, this);
        game.load.onLoadComplete.add(this.loadComplete, this);        
    },

    //
    create: function()
    {
        var userLanguage = window.navigator.language;
        userLanguage = userLanguage ? userLanguage : window.navigator.browserLanguage;
        userLanguage = userLanguage ? userLanguage.split("-")[0] : 'en';
        if(!R.existsInArray(Publisher.languagesSupported, userLanguage)) userLanguage = 'en';        
        
        //
        game.load.json('strings', 'assets/text/' + userLanguage + '.json');        
        game.load.atlas('main', 'assets/atlas_main.png', 'assets/atlas_main.json');
        game.load.image('tile_dark', 'assets/tile_dark.png');
        game.load.image('tile_light', 'assets/tile_light.png');

        if(game.device.webAudio)
        {
            var sfx_key = ['error', 'new_shapes', 'new_game', 'put_shape', 'row_removed', 'button'];
            for(var i in sfx_key) game.load.audio(sfx_key[i], ['assets/sfx/' + sfx_key[i] + '.mp3', 'assets/sfx/' + sfx_key[i] + '.ogg']);
            this.sfx_key = sfx_key;
        }

        this.createEnvironment();

        //
        game.load.start();
    },

    shutdown: function()
    {        
        this.loadText = null;        
        this.loadingBar = null;
        this.sfx_key = null;
    },

    createEnvironment: function()
    {        
        game.stage.backgroundColor = '#071a33';
        game.canvas.parentElement.style.backgroundColor = '#061528';

        var logo = game.add.sprite(R.halfGameWidth, R.halfGameHeight - 100, 'load', 'logo');
        logo.anchor.set(0.5);

        var loading = game.add.sprite(R.halfGameWidth, R.halfGameHeight + 150, 'load', 'loading');
        loading.anchor.set(0.5);

        this.loadingBar = game.add.sprite(loading.x - 272, loading.y - 11, 'load', 'loading_bar');
        var cropRect = new Phaser.Rectangle(0, 0, 0, 32);
        this.loadingBar.crop(cropRect);     

        this.loadText = R.createText(R.halfGameWidth, loading.y + 4, 24, '', '#000000');               
    },

    //
    fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles)
    {
        this.loadingBar.cropRect.width = 552 * progress * 0.01;
        this.loadingBar.updateCrop();
        this.loadText.setText(progress.toString() + '%');
    },

    //
    loadComplete: function()
    {
        //sfx
        if(game.device.webAudio) for(var i in this.sfx_key) R.sfx[this.sfx_key[i]] = game.add.audio(this.sfx_key[i]);        
               
        //         
        R.strings = game.cache.getJSON('strings');        
        R.shapeStates = new ShapeStates();
        R.loadGame();
        Publisher.timeLoading = game.time.totalElapsedSeconds();
        R.sceneTransition(200, 'home');
    }
};