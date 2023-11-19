var R = R || {};

//ShapeStates
var ShapeStates = function()
{    
    this.state = [];    
    
    //1
    this.state[0] = [[1]];

    //2
    this.state[1] = [[1, 1]];

    this.state[2] = [[1],
                     [1]];

    //3
    this.state[3] = [[1, 1, 1]];

    this.state[4] = [[1],
                     [1],
                     [1]];
    
    this.state[5] = [[1, 1],
                     [0, 1]];

    this.state[6] = [[1, 1],
                     [1, 0]];

    this.state[7] = [[1, 0],
                     [1, 1]];

    this.state[8] = [[0, 1],
                     [1, 1]];

    //4
    this.state[9] = [[1, 1, 1, 1]];

    this.state[10] = [[1],
                      [1],
                      [1],
                      [1]];

    this.state[11] = [[1, 1],
                      [1, 1]];

    //5
    this.state[12] = [[1, 1, 1, 1, 1]];

    this.state[13] = [[1],
                      [1],
                      [1],
                      [1],
                      [1]];
   
    this.state[14] = [[1, 0, 0],
                      [1, 0, 0],
                      [1, 1, 1]];

    this.state[15] = [[1, 1, 1],
                      [1, 0, 0],
                      [1, 0, 0]];

    this.state[16] = [[0, 0, 1],
                      [0, 0, 1],
                      [1, 1, 1]];

    this.state[17] = [[1, 1, 1],
                      [0, 0, 1],
                      [0, 0, 1]];
    //9
    this.state[18] = [[1, 1, 1],
                      [1, 1, 1],
                      [1, 1, 1]];

};

//
ShapeStates.prototype = {

    constructor: ShapeStates,

    getRnd: function()
    {
        return game.rnd.pick(this.state);
    }
};

//Shape
R.quadSize = 58;
R.quadPadding = 2;
R.quadScaleMin = 0.6;

//
var Shape = function(nQuads)
{    
    this.state = null;
    this.startX = 0;
    this.startY = 0;
    this.padding = new Phaser.Point(0, 0);   
    this.hh = 0;

    this.parent = game.add.sprite(0, 0, null);
    this.parent.texture.baseTexture.skipRender = false;
    this.parent.anchor.set(0.5);

    this.quads = new Array(nQuads);

    for(var i = 0; i < nQuads; i++)
    {        
        this.quads[i] = game.add.sprite(0, 0, 'main', 'quad0');
        this.quads[i].anchor.set(0.5);
        this.parent.addChild(this.quads[i]);
    }

    this.existsQuads = nQuads;
    this.frameName = 'quad0';
    this.well = null;

    //
    this.tweenDragScale = null;
    this.tweenDragPadding = null;
    this.tweenEndDragPosition = null;
    this.tweenEndDragScale = null;

    //
    this.readyForDrag = true;
};

//
Shape.prototype = {
    
    constructor: Shape,

    setStartPos: function(x, y)
    {
        this.startX = x;
        this.startY = y;
        this.setPosition(x, y);
    },

    isExists: function()
    {
        return this.parent.exists;
    },

    setState: function(state)
    {
        this.state = state;

        this.frameName = 'quad' + game.rnd.between(1, 8).toString();

        var i = this.quads.length;
        while(i--)
        {
            this.quads[i].exists = false;
            this.quads[i].frameName = this.frameName;
        }
        
        this.buildShape(R.quadPadding);       

        this.parent.scale.set(R.quadScaleMin);
        this.parent.exists = true;
        this.padding.x = R.quadPadding;
    },

    setPosition: function(x, y)
    {
        this.parent.x = x;
        this.parent.y = y;        
    },

    buildShape: function(padding)
    {
        var row = null;
        var i = 0;
        var idxQuad = 0;
        var size = R.quadSize + padding;
        var x = 0;
        var y = 0;
        var q = null;
        var maxX = 0;
        var maxY = 0;

        this.existsQuads = 0;

        for(var j = 0; j < this.state.length; ++j)
        {
            row = this.state[j];
            x = 0;
            for(i = 0; i < row.length; ++i)
            {
                if(row[i] === 1)
                {
                    q = this.quads[idxQuad];
                    q.x = x;
                    q.y = y;
                    q.exists = true;
                    if(maxX < x) maxX = x;
                    if(maxY < y) maxY = y;
                    ++idxQuad;
                }                
                x += size;
            }
            y += size;
        }

        this.existsQuads = idxQuad;

        //
        maxX *= 0.5;
        maxY *= 0.5;
        i = this.quads.length;

        while(i--)
        {
            if(this.quads[i].exists)
            {
                this.quads[i].x -= maxX;
                this.quads[i].y -= maxY;
            }
        }
        
        this.hh = maxY + size + 70;
    },

    updatePadding: function()
    {
        this.buildShape(this.padding.x);
    },

    startDrag: function()
    {
        this.readyForDrag = false;

        if(this.tweenEndDragPosition && this.tweenEndDragPosition.isRunning) this.tweenEndDragPosition.stop();
        if(this.tweenEndDragScale && this.tweenEndDragScale.isRunning) this.tweenEndDragScale.stop();        

        this.tweenDragScale = game.add.tween(this.parent.scale).to({ x: 0.85, y: 0.85 }, 100, Phaser.Easing.Linear.None, true);
        this.tweenDragPadding = game.add.tween(this.padding).to({ x: 12.588235294117647 }, 100, Phaser.Easing.Linear.None, true);
        this.tweenDragPadding.onUpdateCallback(this.updatePadding, this);
        this.tweenDragPadding.onComplete.add(this.updatePadding, this);
    },

    isNotReadyForAdding: function()
    {
        return (this.tweenDragScale && this.tweenDragScale.isRunning) || (this.tweenDragPadding && this.tweenDragPadding.isRunning);        
    },

    endDrag: function()
    {
        if(this.tweenDragScale && this.tweenDragScale.isRunning) this.tweenDragScale.stop();
        if(this.tweenDragPadding && this.tweenDragPadding.isRunning) this.tweenDragPadding.stop(); 

        this.tweenDragPadding = game.add.tween(this.padding).to({ x: R.quadPadding }, 160, Phaser.Easing.Linear.None, true);
        this.tweenDragPadding.onUpdateCallback(this.updatePadding, this);
        this.tweenDragPadding.onComplete.add(this.updatePadding, this);

        this.tweenEndDragPosition = game.add.tween(this.parent).to({ x: this.startX, y: this.startY }, 160, Phaser.Easing.Linear.None, true);
        this.tweenEndDragPosition.onComplete.add(this.onReadyForDrag, this);
        this.tweenEndDragScale = game.add.tween(this.parent.scale).to({ x: R.quadScaleMin, y: R.quadScaleMin }, 160, Phaser.Easing.Linear.None, true);
    },

    getQuadWorldX: function(i)
    {
        return this.parent.x + this.quads[i].x * this.parent.scale.x;
    },

    getQuadWorldY: function(i)
    {
        return this.parent.y + this.quads[i].y * this.parent.scale.x;
    },

    beginAddingToWell: function(well, firstAddingCell)
    {
        if(this.tweenDragScale && this.tweenDragScale.isRunning) this.tweenDragScale.stop();
        if(this.tweenDragPadding && this.tweenDragPadding.isRunning) this.tweenDragPadding.stop();

        var tx = firstAddingCell.x - this.getQuadWorldX(0) + this.parent.x + well.grid.x;
        var ty = firstAddingCell.y - this.getQuadWorldY(0) + this.parent.y + well.grid.y;
        this.well = well;
        
        var tween = game.add.tween(this.padding).to({ x: R.quadPadding }, 100, Phaser.Easing.Linear.None, true);
        tween.onUpdateCallback(this.updatePadding, this);
        tween.onComplete.add(this.updatePadding, this);

        this.tweenDragScale = game.add.tween(this.parent.scale).to({ x: 1.0, y: 1.0 }, 100, Phaser.Easing.Linear.None, true);

        tween = game.add.tween(this.parent).to({ x: tx, y: ty }, 100, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.onCompleteAddingToWell, this);
    },

    onCompleteAddingToWell: function()
    {        
        this.parent.exists = false;
        R.score += this.existsQuads;
        this.well.onCompliteAddingShape(this.frameName);        
    },

    reset: function(state)
    {        
        this.setPosition(this.startX + game.width, this.startY);
        this.setState(state);

        var tween = game.add.tween(this.parent).to({ x: this.startX }, 300, Phaser.Easing.Quadratic.Out, true);
        tween.onComplete.add(this.onReadyForDrag, this);
    },

    onReadyForDrag: function()
    {
        this.readyForDrag = true;
    }
};