
var canvas = document.getElementById('test')
var ctx = canvas.getContext('2d')

// Adding key listener
document.addEventListener("keydown", keyDownTextField, false);

var width = canvas.width
var height = canvas.height

let margin = 3

let columns = 4
let rows = 4

// 100 milliseconds
var moveDelay = 100


class Tile {

    constructor(value) {
        this.value = value
    }

    render(x, y, width, height) {
        let green = 255 / this.value

        ctx.fillStyle = "rgba(0, " + green + ",0,0.85)"

        ctx.fillRect(x, y, width, height)
        ctx.font = "20px Arial"
        ctx.textAlign = "center";
        ctx.fillStyle = "white"

        ctx.fillText(this.value, x + width / 2, y + height / 2 + 10)
    }
}

class GameMap {

    constructor(rows, columns, margin, tileWidth, tileHeight) {
        this.rows = rows
        this.columns = columns
        this.margin = margin
        this.tileWidth = tileWidth
        this.tileHeight = tileHeight
        this.running = false
    }

    begin() {
        if(this.running)
            throw Error('Already running!')
        this.running = true

        this.reset()


        this.setTileAt(getRandomInRange(this.columns), getRandomInRange(this.rows), createTile())
        this.render()
    }

    reset() {
        this.dimension = new Array(this.columns);
    
        for (var i = 0; i < this.dimension.length; i++) {
            this.dimension[i] = new Array(this.rows);
        }
        console.log(this.dimension)
    }

    getTileAt(x, y) {
        return this.dimension[x][y]
    }

    setTileAt(x, y, tile) {
        this.dimension[x][y] = tile
    }

    iterate(fun) {
        this.dimension.forEach((column, x) => {
            for (let index = 0; index < column.length; index++) {
                const tile = column[index];
                fun(x, index, tile)
            }
        })
    }

    hasEmptyField() {
        for (let x = 0; x < this.dimension.length; x++) {
            const column = this.dimension[x];
            for (let y = 0; y < column.length; y++) {
                const tile = column[y];
                if(tile == undefined)
                    return true
            }
        }
        return false
    }

    update() {

    }

    render() {
        // Clear Buffer
        ctx.clearRect(0, 0, width, height)

        // Drawing vertical lines
        for (let index = 1; index < columns; index++) {
            let x = width * index / columns
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        //Drawing horizontal lines
        for (let index = 1; index < rows; index++) {
            let y = height * index / rows
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Drawing tiles
        this.iterate((x, y, tile) => {
            if(tile == undefined)
                return
        
            let tileX = this.margin + x * (this.tileWidth + this.margin * 2)
            let tileY = this.margin + y * (this.tileHeight + this.margin * 2)


            tile.render(tileX, tileY, tileWidth, tileHeight)
        })
    }

    end() {
        if(!this.running)
            throw Error('Game is not running.')
        this.running = false
    }
}




var tileWidth = (width - columns * margin * 2) / columns
var tileHeight = (height - rows * margin * 2) / rows

var map = new GameMap(rows, columns, margin, tileWidth, tileHeight)
map.begin()


function moveUp() {

}

function moveDown() {

}


function moveLeft() {

    map.iterate((x, y, tile) => {
        if(tile == undefined)
            return
    
        for (let newIndex = 0; newIndex < x; newIndex++) {
            const testElement = map.getTileAt(newIndex, y)

            if(testElement == undefined) {
                map.setTileAt(newIndex, y, tile)
                map.setTileAt(x, y, undefined)
                return
            } else {
                if(testElement.value == tile.value) {
                    testElement.value += tile.value
                    map.setTileAt(x, y, undefined)
                }
            }
        }

    

    })

}


function moveRight() {

    for (let columnIndex = 0; columnIndex < array.length; columnIndex++) {
        const rowArray = array[columnIndex];

        for (let index = rowArray.length-1; index >= 0; index--) {
            const element = rowArray[index];

            if(element != undefined) {

                for (let newIndex = rowArray.length-1; newIndex > index; newIndex--) {
                    const testElement = rowArray[newIndex];

                    if(testElement == undefined) {
                        rowArray[newIndex] = element
                        rowArray[index] = undefined
                        break
                    } else {
                        if(testElement.value == element.value) {
                            testElement.value += element.value
                            rowArray[index] = undefined
                        }
                    }
                }

            }
            
        }
        
    }


}

function createTile() {
    let ran = Math.round(Math.random())
    let value = ran == 1 ? 2 : 4
    return new Tile(value)
}

function possibleActions() {
    return true
}

var lastMove = Date.now()

function keyDownTextField(e) {
    let keyCode = e.keyCode;

    if(keyCode >= 37 && keyCode <= 40)  {    

        // Move delay
        if(lastMove > Date.now()-moveDelay) {
            return
        }
        lastMove = Date.now()

        switch(keyCode) {
            case 38:
                moveUp()
                break
            case 40:
                moveDown()
                break
            case 39:
                moveRight()
                break
            case 37:
                moveLeft()
                break
        }

        if(!map.hasEmptyField()) {
            alert('You lost!')
        }


        let tile = createTile()

        do {
            var ranX = getRandomInRange(columns)
            var ranY = getRandomInRange(rows)
        } while(map.getTileAt(ranX, ranY) != undefined)

        console.log('Tile spawned at X: ' + ranX + ' Y: ' + ranY)

        map.setTileAt(ranX, ranY, tile)

        map.render()


        if(!possibleActions()) {
            alert('You lost!')
        }
        
    }

}

function getRandomInRange(max) {
    return Math.floor(Math.random() * Math.floor(max))
}