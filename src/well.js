var R = R || {};

//gridShapes
R.gridShapes = [
    //0 - heart
    [0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //1 - quad
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    //2 - cat
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //3 - cross
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //4 - house
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    //5 - o
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0]
];

//Well
var Well = function(parentState)
{        
    this.rows = 10;
    this.cols = 10;

    this.n = this.rows * this.cols;

    //
    var grid = game.add.group();
    grid.createMultiple(this.n * 2, 'main', 'quad0', true);

    var cells = new Array(this.rows);

    var size = R.quadSize + R.quadPadding;

    var x = 0;
    var y = size * 0.5;
    var c = 0;   
    var shape = R.gridShapes[R.currentGridShapeIdx];
    var s = 0;

    for(var j = 0; j < this.rows; j++)
    {
        x = size * 0.5;
        cells[j] = new Array(this.cols);
        var cj = cells[j];
        for(var i = 0; i < this.cols; i++)
        {
            s = j * 10 + i;            
            var q = grid.getAt(c++);
            q.anchor.set(0.5);
            q.position.set(x, y);
            q.exists = shape[s] === 1;
            q = grid.getAt(c++);
            q.anchor.set(0.5);
            q.position.set(x, y);
            if(shape[s] === 0)  q.visible = false;            
            else q.exists = false;
            cj[i] = q;
            x += size;
        }
        y += size;
    }

    this.grid = grid;
    this.cells = cells;

    this.x = 0;
    this.y = 0;

    this.width = size * this.cols;
    this.height = size * this.rows;

    this.invSizeW = 1.0 / size;
    this.invSizeH = 1.0 / size;

    this.addingCells = [];

    this.parentState = parentState;

    this.scaleRemove = { x: 0.1, y: 0.1 };

    this.waitLines = 0;
};

//
Well.prototype = {

    constructor: Well,

    setPosition: function(y)
    {
        var x = (game.width - this.grid.width) * 0.5;        
        this.grid.position.set(x, y);
        this.x = x;
        this.y = y;
    },

    tryAddShape: function(shape)
    {
        if(this.addingCells.length > 0 || shape.isNotReadyForAdding()) return false;

        var n = shape.existsQuads;
        var wx = 0;
        var wy = 0;

        for(var i = 0; i < n; ++i)
        {
            wx = Math.floor((shape.getQuadWorldX(i) - this.x) * this.invSizeW);
            wy = Math.floor((shape.getQuadWorldY(i) - this.y) * this.invSizeH);           
            if(wx < 0 || wx >= this.cols || wy < 0 || wy >= this.rows || this.cells[wy][wx].exists) break;
            
            this.addingCells.push(this.cells[wy][wx]);            
        }        

        if(this.addingCells.length === n)
        {            
            shape.beginAddingToWell(this, this.addingCells[0]);
            return true;
        }
        this.addingCells.length = 0;
        return false;
    },

    onCompliteAddingShape: function(frameName)
    {
        var i = this.addingCells.length;        
        while(i--)
        {
            this.addingCells[i].frameName = frameName;
            this.addingCells[i].exists = true;
        }
        this.addingCells.length = 0;
        this.checkLines();
        this.parentState.onCompleteAddingShapeToWell();        
    },

    checkLines: function()
    {
        var i = 0;
        var j = this.rows;
        var row = null;        
        var s = 0;

        while(j--)
        {
            row = this.cells[j];
            i = this.cols;
            s = 0;
            while(i--)
            {                
                if(!row[i].exists) break;
                if(row[i].visible) s = 1;
            }
            if(s === 1 && i === -1) this.removeRow(j);
        }

        j = this.cols;       
        while(j--)
        {
            i = this.rows;
            s = 0;
            while(i--)
            {                
                if(!this.cells[i][j].exists) break;
                if(this.cells[i][j].visible) s = 1;
            }
            if(s === 1 && i === -1) this.removeCol(j);
        }
    },

    removeRow: function(j)
    {
        var row = this.cells[j];
        var i = this.rows;
        var tween = null;
        while(i--)
        {
            tween = game.add.tween(row[i].scale).to(this.scaleRemove, 250, Phaser.Easing.Back.In, true, i * 50);
            tween.onComplete.add(onQuadScaleDown, row[i]);
            if(i === this.rows - 1) tween.onComplete.add(this.onComleteRemoveLine, this);
            if(row[i].visible) ++R.score;
        }        
        ++this.waitLines;       
        if(R.sfx.row_removed) R.sfx.row_removed.play();
    },

    removeCol: function(j)
    {
        var tween = null;
        var i = this.cols;        
        while(i--)
        {
            tween = game.add.tween(this.cells[i][j].scale).to(this.scaleRemove, 250, Phaser.Easing.Back.In, true, i * 50);
            tween.onComplete.add(onQuadScaleDown, this.cells[i][j]);
            if(i === this.cols - 1) tween.onComplete.add(this.onComleteRemoveLine, this);
            if(this.cells[i][j].visible) ++R.score;
        }        
        ++this.waitLines;        
        if(R.sfx.row_removed) R.sfx.row_removed.play();
    },

    onComleteRemoveLine: function()
    {
        if(--this.waitLines === 0) this.parentState.onComleteRemoveLines();        
    },

    findShapePlace: function(state)
    {           
        var ci = 0;
        var si = 0;
        var sj = 0;
        var ci2 = 0;
        var cj2 = 0;

        var lj = this.cols - state.length + 1;
        var li = this.rows - state[0].length + 1;        

        var isNextCells = false;

        for(var cj = 0; cj < lj; ++cj)
        {            
            for(ci = 0; ci < li; ++ci)
            {                                
                for(sj = 0, cj2 = cj; sj < state.length; ++sj, ++cj2)
                {                    
                    for(si = 0, ci2 = ci; si < state[sj].length; ++si, ++ci2)
                    {
                        if(state[sj][si] === 1 && this.cells[cj2][ci2].exists)
                        {
                            isNextCells = true;
                            break;
                        }                        
                    }
                    if(isNextCells) break;
                }
                if(isNextCells) isNextCells = false;
                else return true;
            }
        }

        return false;
    },

    clear: function()
    {
        this.waitLines = 0;
        this.grid.forEach(function(item) { item.exists = false; });
    }
};

//
function onQuadScaleDown()
{
    if(this.visible) this.exists = false;
    this.scale.set(1);
}