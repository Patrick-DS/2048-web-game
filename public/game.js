var canvas = document.getElementById('test')

var width = canvas.width
var height = canvas.height

let margin = 3

let columns = 4
let rows = 4

var array

{
    array = new Array(columns);

    for (var i = 0; i < array.length; i++) {
        array[i] = new Array(rows);
    }
}


let context = canvas.getContext('2d')
context.strokeRect(0, 0, width, height);

var tileWidth = (width - columns * margin * 2) / columns
var tileHeight = (heigt - rows * margin * 2) / rows

context.fillStyle = "green";
context.fillRect(10, 10, 100, 100);