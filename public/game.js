
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
        for (let x = 0; x < this.dimension.length; x++) {
            const column = this.dimension[x];
            for (let y = 0; y < column.length; y++) {
                const tile = column[y];
                const cancel = fun(x, y, tile)

                if(cancel)
                    return
            }
        }
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
    map.iterate((x, y, tile) => {
        if(tile == undefined)
            return false
    
        for (let newIndex = 0; newIndex < y; newIndex++) {
            const testElement = map.getTileAt(x, newIndex)

            if(testElement == undefined) {
                map.setTileAt(x, newIndex, tile)
                map.setTileAt(x, y, undefined)
            } else {
                if(testElement.value == tile.value) {
                    testElement.value += tile.value
                    map.setTileAt(x, y, undefined)
                }
            }
        }

        return false

    })
}

function moveDown() {

    map.iterate((x, y, tile) => {
        if(tile == undefined)
            return false
    
        for (let newIndex = rows-1; newIndex > y; newIndex--) {
            const testElement = map.getTileAt(x, newIndex)

            if(testElement == undefined) {
                console.log('Position changed')
                map.setTileAt(x, newIndex, tile)
                map.setTileAt(x, y, undefined)
                return true
            } else {
                if(testElement.value == tile.value) {
                    testElement.value += tile.value
                    map.setTileAt(x, y, undefined)
                }
            }
        }
        return false
    })
}


function moveLeft() {

    moves = []

    map.iterate((x, y, tile) => {
        if(tile == undefined)
            return false

        let bestIndex = x

        for (let newIndex = x-1; newIndex > 0; newIndex--) {
            const element = map.getTileAt(newIndex, y)

            console.log(newIndex)

            if(element == undefined || element.value == tile.value) {
                bestIndex = newIndex
            }
        }

        const element = map.getTileAt(bestIndex, y)
        moves.push(() => {
            if(element == undefined) {
                    map.setTileAt(bestIndex, y, tile)
                    map.setTileAt(x, y, undefined)
            } else {
                if(element.value == tile.value) {
                    element.value += tile.value
                    map.setTileAt(x, y, undefined)
                }
            }
        })

        return false
    })

    moves.forEach(element => {
        element()
    });

}


function moveRight() {
    map.iterate((x, y, tile) => {
        if(tile == undefined)
            return false
        console.log(tile)
    
        for (let newIndex = columns-1; newIndex > x; newIndex--) {
            console.log(newIndex)
            const testElement = map.getTileAt(newIndex, y)

            if(testElement == undefined) {
                console.log('Position changed')
                map.setTileAt(newIndex, y, tile)
                map.setTileAt(x, y, undefined)
                return true
            } else {
                if(testElement.value == tile.value) {
                    testElement.value += tile.value
                    map.setTileAt(x, y, undefined)
                }
            }
        }
        return false
    })

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