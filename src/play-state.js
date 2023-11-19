//
var PlayState = {    

    bg: null,
    shapeStates: null,
    placeX: [],
    placeY: 790,
    shapes: [],
    selectedShape: null,
    inputPointOffset: null,
    tweenDragOffset: null,
    existsShapes: 0,
    well: null,
    isPostFindPlaces: false,
    labelScore: null,
    labelTotalScore: null,
    displayScore: 0,
    pauseScreen: null,

    cup: null,
    buttonPause: null,
    shapeReleased: false,

    //
    shutdown: function()
    {
        this.bg = null;
        this.well = null;
        this.shapeStates = null;
        this.placeX.length = 0;
        this.shapes.length = 0;
        this.selectedShape = null;
        this.inputPointOffset = null;
        this.tweenDragOffset = null;
        this.cup = null;
        this.labelTotalScore = null;
        this.labelScore = null;
        this.buttonPause = null;
        this.shapeReleased = false;
        this.pauseScreen = null;
    },

    create: function()
    {        
        this.bg = new R.Background(R.playerData.theme === 0 ? 'tile_dark' : 'tile_light');

        this.well = new Well(this);
        this.well.setPosition(120);

        this.inputPointOffset = new Phaser.Point(0, 0);

        this.shapeStates = new ShapeStates();        

        this.placeX[0] = 115;
        this.placeX[1] = game.width / 2;
        this.placeX[2] = game.width - this.placeX[0];

        this.placeY = 795;
        R.quadScaleMin = 0.42;        

        for(var i = 0; i < 3; i++)
        {            
            this.shapes[i] = new Shape(9);
            this.shapes[i].setState(R.shapeStates.getRnd());
        }

        //        
        this.existsShapes = 3;
        this.displayScore = R.score = 0;

        //cup
        this.cup = game.add.sprite(R.halfGameWidth, 65, 'main', 'cup');
        this.cup.anchor.set(0.5);

        //score
        this.labelTotalScore = R.createText(R.halfGameWidth + 50, this.cup.y + 70, 50, R.playerData.score.toString(), '#21c1ef');
        this.labelTotalScore.anchor.set(0.0, 1.0);        
        this.labelTotalScore.align = 'left';        

        this.labelScore = R.createText(R.halfGameWidth - 50, this.labelTotalScore.y, 50, R.score.toString(), '#14b05d');
        this.labelScore.anchor.set(1.0);        
        this.labelScore.align = 'right';
        
        //gui
        this.buttonPause = R.createButton(game.width - 50, 60, this.showPauseMenu, this, 'pause_button', 'pause_button_pushed');
        this.pauseScreen = new R.OptionsScreen();           

        //                   
        this.resize(game.width, game.height);
        R.sceneTransition(200, null);
    },

    resize: function(width, height)
    {
        var wby = this.well.y + this.well.height;
        //var placeY = wby + (game.height - wby) * 0.5;

        for(var i in this.shapes) this.shapes[i].setStartPos(this.placeX[i], this.placeY);       
    },

    start: function()
    {
        game.input.onDown.add(this.inputOnDown, this);
        game.input.onUp.add(this.inputOnUp, this);

        game.time.events.loop(75, this.updateLabelScore, this);

        if(R.sfx.new_game) R.sfx.new_game.play();
    },

    inputOnDown: function(pointer, event)
    {
        if(this.selectedShape)
        {
            this.inputOnUp(pointer, event);
            return;
        }        

        if(pointer.y < this.well.y + this.well.height) return;

        var px = pointer.x;
        var i = 2;
        if(px < 214) i = 0;
        else if(px < 428) i = 1;

        var shape = this.shapes[i];

        if(shape.readyForDrag) this.selectedShape = shape;
        else return;

        this.inputPointOffset.x = this.selectedShape.parent.x - pointer.x;
        this.inputPointOffset.y = this.selectedShape.parent.y - pointer.y;

        this.selectedShape.startDrag();

        if(!game.device.desktop) this.tweenDragOffset = game.add.tween(this.inputPointOffset).to({ y: -this.selectedShape.hh }, 100, Phaser.Easing.Linear.None, true);        

        game.world.bringToTop(this.selectedShape.parent);

        this.shapeReleased = false;        
    },

    inputOnUp: function(pointer, event)
    {
        if(this.selectedShape) this.shapeReleased = true;
    },

    releaseShape: function()
    {
        if(this.tweenDragOffset && this.tweenDragOffset.isRunning) this.tweenDragOffset.stop();

        if(this.well.tryAddShape(this.selectedShape))
        {
            --this.existsShapes;
            if(R.sfx.put_shape) R.sfx.put_shape.play();
        }
        else
        {
            this.selectedShape.endDrag();
            if(R.sfx.error) R.sfx.error.play();
        }
        this.selectedShape = null;
    },

    update: function()
    {
        if(this.selectedShape)
        {
            if(this.shapeReleased) this.releaseShape();
            else
            {
                var pointer = game.input.activePointer;
                this.selectedShape.setPosition(this.inputPointOffset.x + pointer.x, this.inputPointOffset.y + pointer.y);
            }
        }
    },

    onCompleteAddingShapeToWell: function()
    {
        if(this.existsShapes === 0) this.generateNextShapes();
        else
        {
            if(this.well.waitLines === 0) this.findPlaces();
            else this.isPostFindPlaces = true;
        }
    },

    generateNextShapes: function()
    {        
        this.shapes[0].reset(this.shapeStates.getRnd());
        this.shapes[1].reset(this.shapeStates.getRnd());
        this.shapes[2].reset(this.shapeStates.getRnd());
        this.existsShapes = 3;
        if(this.well.waitLines === 0) this.findPlaces();
        else this.isPostFindPlaces = true;
        if(R.sfx.new_shapes) R.sfx.new_shapes.play();
    },    

    findPlaces: function()
    {
        var n = 0;
        var i = 3;
        while(i--)
        {
            if(this.shapes[i].isExists())
            {
                if(this.well.findShapePlace(this.shapes[i].state)) break;
                ++n;
            }
        }

        if(n === this.existsShapes) this.showGameoverMenu();
    },

    onComleteRemoveLines: function()
    {
        if(this.isPostFindPlaces)
        {
            this.isPostFindPlaces = false;
            this.findPlaces();
        }
    },    

    showGameoverMenu: function()
    {
        if(R.playerData.score < R.score)
        {
            R.playerData.score = R.score;
            R.saveGame();
        }

        game.input.onDown.remove(this.inputOnDown, this);
        game.input.onUp.remove(this.inputOnUp, this);
        this.buttonPause.inputEnabled = false;
        this.inputOnUp();        

        new R.EndScreen();       

        //        
        Publisher.submitScore(R.score);
    },

    updateLabelScore: function()
    {
        if(this.displayScore < R.score)
        {
            ++this.displayScore;
            this.labelScore.text = this.displayScore.toString();
        }
    },

    showPauseMenu: function(button)
    {
        game.input.onDown.remove(this.inputOnDown, this);
        game.input.onUp.remove(this.inputOnUp, this);
        button.inputEnabled = false;
        this.pauseScreen.open();        
    },    

    onClosePauseScreen: function()
    {
        game.input.onDown.add(this.inputOnDown, this);
        game.input.onUp.add(this.inputOnUp, this);
        this.buttonPause.inputEnabled = true;
    },

    applyTheme: function()
    {
        this.bg.setTile(R.playerData.theme === 0 ? 'tile_dark' : 'tile_light');
        game.canvas.parentElement.style.backgroundColor = R.playerData.theme === 0 ? '#061528' : '#979ea5';
    }
};


