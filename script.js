const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const PIXEL_SIZE = 4;
const CENTER = (canvas.width / 2) - PIXEL_SIZE / 2;
const DISPLAY_SIZE = 500;

canvas.width = DISPLAY_SIZE;
canvas.height = DISPLAY_SIZE;

ctx.strokeRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);

const OFFSET = 125 + PIXEL_SIZE / 2;

const cube = {
    vertex_table: [
        [0 + OFFSET, 0 + OFFSET, 0 + OFFSET],
        [0 + OFFSET, 0 - OFFSET, 0 + OFFSET],
        [0 - OFFSET, 0 - OFFSET, 0 + OFFSET],
        [0 - OFFSET, 0 + OFFSET, 0 + OFFSET],
        [0 + OFFSET, 0 + OFFSET, 0 - OFFSET],
        [0 + OFFSET, 0 - OFFSET, 0 - OFFSET],
        [0 - OFFSET, 0 - OFFSET, 0 - OFFSET],
        [0 - OFFSET, 0 + OFFSET, 0 - OFFSET]
    ],

    edge_table: [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
    ]
}

const pyramid = {
    vertex_table: [
        [0 + OFFSET, 0 + OFFSET, 0 + OFFSET],
        [0 + OFFSET, 0 + OFFSET, 0 - OFFSET],
        [0 - OFFSET, 0 + OFFSET, 0 + OFFSET],
        [0 - OFFSET, 0 + OFFSET, 0 - OFFSET],
        [0, 0 - OFFSET, 0]
    ],

    edge_table: [
        [3, 1], [3, 2], [2, 0], [1, 0],
        [0, 4], [1, 4], [2, 4], [3, 4]
    ]
}

const figures = {
    current_figure: cube,
    cube: cube,
    pyramid: pyramid,
    chosen_figure: cube,
    x_radians: 0,
    y_radians: 0
}

const camera = {
    x: 248,
    y: 248,
    z: 2800
}

const screen = {
    z: 500
}

function shiftCoordinates(vertex_table) {
    return vertex_table.map(row => row.map(value => value + CENTER));
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

function drawFigure(figure) {
    ctx.clearRect(1, 1, 490, 490);
    drawVertices(getProgectVertexTable(shiftCoordinates(figure.vertex_table)));
    drawEdges(getProgectVertexTable(shiftCoordinates(figure.vertex_table)), figure.edge_table);
};

drawFigure(figures.current_figure);

const distance_range = document.querySelector('#distance_range')
const distance = document.querySelector('.distance')

distance_range.addEventListener('input', function () {
    camera.z = Number(this.value);
    distance.innerHTML = this.value;
    drawFigure(figures.current_figure);
})

const camera_x = document.querySelector('#camera_x')

camera_x.addEventListener('input', function () {
    camera.x = Number(this.value);    
    drawFigure(figures.current_figure);
})

const camera_y = document.querySelector('#camera_y')

camera_y.addEventListener('input', function () {
    camera.y = Number(this.value);    
    drawFigure(figures.current_figure);
})


const btn = document.querySelector('#btn')

btn.addEventListener('click', function () {
    ctx.clearRect(1, 1, 490, 490);
})

figureForm = document.querySelector('#figure')

figureForm.addEventListener('change', function () {
    let figure = document.querySelector('input[name="figure"]:checked').value;
    figures.chosen_figure = figures[figure];
    figures.current_figure = figures[figure];
    drawFigure(figures.current_figure);
})

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

function rotateAroundX(vertex_table, radians) {
    let rotated_table = [];
    let rotation_matrix = [
        [Math.cos(radians), -Math.sin(radians)],
        [Math.sin(radians), Math.cos(radians)]
    ]

    for (let vertex of vertex_table) {
        [x, y, z] = vertex;
        let res = multiply([[y, z]], rotation_matrix);
        rotated_table.push([x, ...res[0]])
    }

    return rotated_table;
}

function rotateAroundY(vertex_table, radians) {
    let rotated_table = [];
    let rotation_matrix = [
        [Math.cos(radians), -Math.sin(radians)],
        [Math.sin(radians), Math.cos(radians)]
    ]

    for (let vertex of vertex_table) {
        [x, y, z] = vertex;
        let res = multiply([[x, z]], rotation_matrix);
        rotated_table.push([res[0][0], y, res[0][1]])
    }

    return rotated_table;
}

function rotateAroundZ(vertex_table, radians) {
    let rotated_table = [];
    let rotation_matrix = [
        [Math.cos(radians), -Math.sin(radians)],
        [Math.sin(radians), Math.cos(radians)]
    ]

    for (let vertex of vertex_table) {
        [x, y, z] = vertex;
        let res = multiply([[x, y]], rotation_matrix);
        rotated_table.push([...res[0], z])
    }

    return rotated_table;
}

const timer = ms => new Promise(res => setTimeout(res, ms))

// async function load(figure) { // We need to wrap the loop into an async function for this to work
//     i = 0;
//     while(true) {

//         let rotated_table = rotateAroundX(figure.vertex_table, i / 100);
//         i++;
//         rotated_table = rotateAroundY(rotated_table, i / 100);  
//         // rotated_table = rotateAroundZ(rotated_table, i / 100);        

//         let rotated_figure = {
//             vertex_table: rotated_table,

//             edge_table: figure.edge_table
//         }

//         figures.current_figure = rotated_figure;
//         drawFigure(rotated_figure);
//         await timer(11); // then the created Promise can be awaited
//     }
// }

let rotationFlag = false;

async function test() { // We need to wrap the loop into an async function for this to work
    i = 0;

    let cur_fig = figures.chosen_figure;    

    while(rotationFlag) {
        
        if (cur_fig !== figures.chosen_figure) {
            cur_fig = figures.chosen_figure
        };       

        rotated_table = rotateAroundX(cur_fig.vertex_table, figures.x_radians);      
        rotated_table = rotateAroundY(rotated_table, figures.y_radians);

        figures.x_radians = i / 100;
        figures.y_radians = i / 100;

        i++;
        // rotated_table = rotateAroundZ(rotated_table, i / 100);        

        let rotated_figure = {
            vertex_table: rotated_table,

            edge_table: cur_fig.edge_table
        }

        figures.current_figure = rotated_figure;
        drawFigure(rotated_figure);
        await timer(11); // then the created Promise can be awaited
    }
}

const rotateBtn = document.querySelector('#rotate_btn')

rotateBtn.addEventListener('click', function() {
    if (this.innerHTML === 'Вращать') {
        rotationFlag = true;
        test();
        this.innerHTML = 'Остановить'        
    } else {
        rotationFlag = false;
        this.innerHTML = 'Вращать'
    }
})