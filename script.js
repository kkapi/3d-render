const canvas = document.getElementById("example");
const ctx = example.getContext('2d');

const PIXEL_SIZE = 4;
const CENTER = (example.width / 2) - PIXEL_SIZE / 2;
const DISPLAY_SIZE = 500;

example.width = DISPLAY_SIZE;
example.height = DISPLAY_SIZE;

ctx.strokeRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);

const OFFSET = 125 + PIXEL_SIZE / 2;

const cube = {
    vertex_table: [
        [CENTER + OFFSET, CENTER + OFFSET, CENTER + OFFSET],
        [CENTER + OFFSET, CENTER - OFFSET, CENTER + OFFSET],
        [CENTER - OFFSET, CENTER - OFFSET, CENTER + OFFSET],
        [CENTER - OFFSET, CENTER + OFFSET, CENTER + OFFSET],
        [CENTER + OFFSET, CENTER + OFFSET, CENTER - OFFSET],
        [CENTER + OFFSET, CENTER - OFFSET, CENTER - OFFSET],
        [CENTER - OFFSET, CENTER - OFFSET, CENTER - OFFSET],
        [CENTER - OFFSET, CENTER + OFFSET, CENTER - OFFSET]    
    ],

    edge_table: [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
    ]
}

const pyramid = {
    vertex_table: [
        [CENTER + OFFSET, CENTER + OFFSET, CENTER + OFFSET],
        [CENTER + OFFSET, CENTER + OFFSET, CENTER - OFFSET],
        [CENTER - OFFSET, CENTER + OFFSET, CENTER + OFFSET],
        [CENTER - OFFSET, CENTER + OFFSET, CENTER - OFFSET],
        [CENTER, CENTER - OFFSET, CENTER]   
    ],

    edge_table: [
        [3, 1], [3, 2], [2, 0], [1, 0],
        [0, 4], [1, 4], [2, 4], [3, 4]
    ]
}

let current_figure = pyramid;

const camera = {
    x: 248,
    y: 248,
    z: 2800
}

const screen = {
    z: 500
}

function drawVertices(vertex_table) {
    for (let vertex of vertex_table) {
        ctx.fillRect(vertex[0], vertex[1], PIXEL_SIZE, PIXEL_SIZE)
    }    
}

function drawEdges(vertex_table, edge_table) {
    ctx.beginPath();

    for (let edge of edge_table) {
        ctx.moveTo(vertex_table[edge[0]][0] + PIXEL_SIZE / 2, vertex_table[edge[0]][1] + PIXEL_SIZE / 2);
        ctx.lineTo(vertex_table[edge[1]][0] + PIXEL_SIZE / 2, vertex_table[edge[1]][1] + PIXEL_SIZE / 2);        
    }

    ctx.stroke();
}

function getProgectVertex(vertex) {
    let [x, y, z] = vertex;

    let x_length = (Math.abs(screen.z - z) * Math.abs(x - camera.x)) / (Math.abs(screen.z - z) + Math.abs(camera.z - screen.z))    
    let x_project = x > camera.x ? x - x_length : x + x_length;

    let y_length = (Math.abs(screen.z - z) * Math.abs(y - camera.y)) / (Math.abs(screen.z - z) + Math.abs(camera.z - screen.z))
    let y_project = y > camera.y ? y - y_length : y + y_length;

    return [x_project, y_project, z];
}

function getProgectVertexTable(vertex_table) {
    project_table = [];

    for (let vertex of vertex_table) {
        let project_coordinates = getProgectVertex(vertex);
        project_table.push(project_coordinates);
    }

    return project_table;
}

function rotateAroundX(vertex_table, radians) {
    let rotated_table = [];
    let rotation_matrix = [
        [Math.cos(radians), -Math.sin(radians)],
        [Math.sin(radians), Math.cos(radians)]
    ]

    console.log(rotation_matrix)

    for (let vertex of vertex_table) {
        [x, y, z] = vertex;
        console.log([y, z]);
        let res = multiply([[y, z]], rotation_matrix);
        console.log(res)
        rotated_table.push([x, ...res[0]])
    }

    return rotated_table;
}

function drawFigure(figure) {
    drawVertices(getProgectVertexTable(figure.vertex_table));
    drawEdges(getProgectVertexTable(figure.vertex_table), figure.edge_table);
};

drawFigure(current_figure);

function multiply(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols); // initialize the current row
      for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }
    return m;
  }

  var a = [[8, 3], [2, 4], [3, 6]],
  b = [[1, 2, 3], [4, 6, 8]];

  const range = document.querySelector('#range')
  const distance = document.querySelector('.distance')

  range.addEventListener('input', function() {
    camera.z = this.value;
    distance.innerHTML = this.value;
    ctx.clearRect(1, 1, 490, 490);
    drawFigure(current_figure);
  })

  const btn = document.querySelector('#btn')

  btn.addEventListener('click', function() {
    ctx.clearRect(1, 1, 490, 490);
  })