var R = R || {};

//GUI
R.createText = function(x, y, size, text, fill, isStroke, strokeThicknes, isWrap)
{
    if(!fill) fill = '#ffffff';
    var style = { font: R.fontName, fontSize: size, fill: fill, fontWeight: '100', align: 'center' };
    var label = game.add.text(x, y, text, style);   
    label.anchor.set(0.5);     
    if(isStroke)
    {
        label.stroke = '#000000';
        label.strokeThickness = strokeThicknes;
    }
    if(isWrap)
    {
        label.wordWrap = true;
        label.wordWrapWidth = game.width;
    }
    return label;
};

//Button
R.createButton = function(x, y, callback, context, frame, framePushed)
{    
    var button = game.add.button(x, y, 'main', callback, context, frame, frame, framePushed, frame);
    button.anchor.set(0.5);   
    if(R.sfx.button) button.setDownSound(R.sfx.button);
    return button;
};

//ThemeButton
R.onThemeButton = function(button)
{
    var t = R.playerData.theme;
    R.playerData.theme = 1 - t;
    R.saveGame();

    var frame = t === 0 ? 'btn_lamp_on' : 'btn_lamp_off';    
    button.setFrames(frame, frame, t === 0 ? 'btn_lamp_on_pushed' : 'btn_lamp_off_pushed', frame);

    var state = game.state.getCurrentState();
    if('applyTheme' in state) state.applyTheme();
};

R.createButtonTheme = function(x, y)
{
    var t = R.playerData.theme;    
    return R.createButton(x, y, R.onThemeButton, R, t === 1 ? 'btn_lamp_on' : 'btn_lamp_off', t === 1 ? 'btn_lamp_on_pushed' : 'btn_lamp_off_pushed');
};

//SoundButton
R.SoundButton = function(x, y, frameOn, frameOff)
{
    Phaser.Button.call(this, game, x, y, 'main', this.onClick, this, frameOn, frameOn, 'btn_sound_off_pushed', frameOn);

    this.anchor.set(0.5);

    this.frameOn = frameOn;
    this.frameOff = frameOff;

    this.checkFrame();

    if(R.sfx.button) this.setDownSound(R.sfx.button);

    this.exists = game.device.webAudio;   
};

R.SoundButton.prototype = Object.create(Phaser.Button.prototype);
R.SoundButton.prototype.constructor = R.SoundButton;

R.SoundButton.prototype.checkFrame = function()
{
    var frame = game.sound.mute ? this.frameOff : this.frameOn;
    this.setFrames(frame, frame, 'btn_sound_off_pushed', frame);
};

R.SoundButton.prototype.onClick = function()
{    
    game.sound.mute = !game.sound.mute;
    this.checkFrame();
};

//OptionsScreen
R.OptionsScreen = function()
{
    Phaser.Sprite.call(this, game, 0, 0, null);

    this.curtain = game.add.sprite(0, 0, R.bitmapData);
    this.curtain.scale.set(game.width / R.bmdSize, game.height / R.bmdSize);    
    this.addChild(this.curtain);

    this.buttons = game.add.group();
    this.addChild(this.buttons);

    this.homeButton = R.createButton(230, 0, this.onHomeButton, this, 'btn_home', 'btn_home_pushed');
    this.buttons.add(this.homeButton);

    this.themeButton = R.createButtonTheme(410, 0);
    this.buttons.add(this.themeButton);

    this.soundButton = new R.SoundButton(230, 177, 'btn_sound_on', 'btn_sound_off');
    this.buttons.add(this.soundButton);

    this.continueButton = R.createButton(this.soundButton.exists ? 410 : 320, 177, this.onContinueButton, this, 'btn_small_play', 'btn_small_play_pushed');
    this.buttons.add(this.continueButton);

    this.exists = false;
    this.enableButtons(false);
};

R.OptionsScreen.prototype = Object.create(Phaser.Sprite.prototype);
R.OptionsScreen.prototype.constructor = R.OptionsScreen;

R.OptionsScreen.prototype.enableButtons = function(enable)
{
    this.homeButton.inputEnabled = enable;
    this.themeButton.inputEnabled = enable;
    this.soundButton.inputEnabled = enable;
    this.continueButton.inputEnabled = enable;
};

R.OptionsScreen.prototype.open = function()
{
    this.soundButton.checkFrame();
    game.world.add(this);
    this.exists = true;

    this.curtain.alpha = 0.0;
    game.add.tween(this.curtain).to({ alpha: 0.4 }, 200, Phaser.Easing.Linear.None, true);

    var bhh = this.homeButton.height * 0.5;
    this.buttons.y = game.height + bhh;
    game.add.tween(this.buttons).to({ y: (game.height - this.buttons.height) * 0.5 + bhh }, 600, Phaser.Easing.Back.Out, true).onComplete.add(this.enableButtons, this, true);
};

R.OptionsScreen.prototype.onHomeButton = function()
{
    if(R.playerData.score < R.score)
    {
        R.playerData.score = R.score;
        R.saveGame();        
    }

    Publisher.showAdvertising();

    this.enableButtons(false);
    R.sceneTransition(200, 'home');
};

R.OptionsScreen.prototype.onContinueButton = function()
{
    this.enableButtons(false);
    game.add.tween(this.buttons).to({ y: game.height + this.homeButton.height * 0.5 }, 600, Phaser.Easing.Back.In, true).onComplete.add(this.enableButtons, this, true);
    game.add.tween(this.curtain).to({ alpha: 0.0 }, 200, Phaser.Easing.Linear.None, true, 400).onComplete.add(this.endClose, this);
};

R.OptionsScreen.prototype.endClose = function()
{    
    this.exists = false;
    game.world.remove(this);
    PlayState.onClosePauseScreen();
};

//EndScreen
R.EndScreen = function()
{
    Phaser.Sprite.call(this, game, 0, 0, null);

    this.curtain = game.add.sprite(0, 0, R.bitmapData);
    this.curtain.scale.set(game.width / R.bmdSize, game.height / R.bmdSize);
    this.curtain.alpha = 0.4;
    this.addChild(this.curtain);

    this.buttons = game.add.group();
    this.addChild(this.buttons);

    var label = R.createText(320, 0, 50, R.strings.no_moves_left, '#ffffff');
    this.buttons.add(label);
    
    this.buttonPlay = R.createButton(322, 154, this.onPlayButton, this, 'btn_big_play', 'btn_big_play_pushed');
    this.buttons.add(this.buttonPlay);

    this.homeButton = R.createButton(Publisher.enableMoreGames ? 230 : 320, 320, this.onHomeButton, this, 'btn_home', 'btn_home_pushed');
    this.buttons.add(this.homeButton);

    this.buttonMoreGames = R.createButton(410, 320, Publisher.moregamesRedirect, Publisher, 'btn_moregames', 'btn_moregames_pushed');
    this.buttons.add(this.buttonMoreGames);
    this.buttonMoreGames.visible = Publisher.enableMoreGames;

    //
    this.enableButtons(false);

    this.curtain.alpha = 0.0;
    game.add.tween(this.curtain).to({ alpha: 0.5 }, 200, Phaser.Easing.Linear.None, true);
    
    this.buttons.y = game.height + label.height * 0.5;
    game.add.tween(this.buttons).to({ y: (game.height - this.buttons.height) * 0.5 }, 600, Phaser.Easing.Back.Out, true).onComplete.add(this.enableButtons, this, true);
    
    game.world.add(this);

    if(R.sfx.new_game) R.sfx.new_game.play();
};

R.EndScreen.prototype = Object.create(Phaser.Sprite.prototype);
R.EndScreen.prototype.constructor = R.EndScreen;

R.EndScreen.prototype.enableButtons = function(enabled)
{
    this.buttonPlay.inputEnabled = enabled;
    this.homeButton.inputEnabled = enabled;
    this.buttonMoreGames.inputEnabled = enabled;
};

R.EndScreen.prototype.onPlayButton = function()
{
    this.enableButtons(false);
    R.sceneTransition(200, 'play');
    Publisher.showAdvertising();
};

R.EndScreen.prototype.onHomeButton = function()
{
    this.enableButtons(false);
    R.sceneTransition(200, 'home');
    Publisher.showAdvertising();
};

//Background
R.Background = function(textureName)
{
    Phaser.Group.call(this, game);

    var image = game.cache.getImage(textureName);

    this.textureName = textureName;    

    this.tileWidth = image.width;
    this.tileHeight = image.height;

    this.fillArea(R.gameWidth, R.gameHeight);
};

R.Background.prototype = Object.create(Phaser.Group.prototype);
R.Background.prototype.constructor = R.Background;

R.Background.prototype.fillArea = function(areaWidth, areaHeight)
{
    var cols = Math.round(areaWidth / this.tileWidth + 0.5);
    var rows = Math.round(areaHeight / this.tileHeight + 0.5);

    var x = 0;
    var y = 0;

    for(var r = 0; r < rows; r++)
    {
        for(var c = 0; c < cols; c++)
        {
            this.create(x, y, this.textureName);
            x += this.tileWidth - 0.5;
        }
        x = 0;
        y += this.tileHeight - 0.5;
    }
};

R.Background.prototype.resize = function()
{
    this.removeAll(true, false);
    this.fillArea(R.gameWidth, R.gameHeight);
};

R.Background.prototype.setTile = function(textureName)
{
    this.textureName = textureName;
    this.resize();
};