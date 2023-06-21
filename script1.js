const SCREEN_SIZE = 588;
const PIXEL_SIZE = 6;

var example = document.getElementById("example"),
    ctx = example.getContext('2d');
example.width = 600;
example.height = 600;
ctx.strokeRect(0, 0, 600, 600);
ctx.strokeRect(4, 4, 592, 592);

let centerX = Math.floor(SCREEN_SIZE / 2);
let centerY = Math.floor(SCREEN_SIZE / 2);

const camera = {
    x: 248,
    y: 248,
    z: 800
}

const screen = {
    z: 500
}


const vertex_table = [
    [centerX + 63, centerX + 63, centerX + 63],
    [centerX + 63, centerX - 63, centerX + 63],
    [centerX - 63, centerX - 63, centerX + 63],
    [centerX - 63, centerX + 63, centerX + 63],
    [centerX + 63, centerX + 63, centerX - 63],
    [centerX + 63, centerX - 63, centerX - 63],
    [centerX - 63, centerX - 63, centerX - 63],
    [centerX - 63, centerX + 63, centerX - 63]    
]

const edge_table = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
]

function paintVertex(vertex_table) {
    for (let vertex of vertex_table) {
        let [x_project, y_project] = project_vertex(vertex, 300)
        project_table.push([x_project, y_project]);
        ctx.fillRect(x_project, y_project, 6, 6)
    }
}

function papintEdges(edge_table, project_table) {
    for (let edge of edge_table) {
        ctx.moveTo(project_table[edge[0]][0] + 3, project_table[edge[0]][1] + 3);
        ctx.lineTo(project_table[edge[1]][0] + 3, project_table[edge[1]][1] + 3);
        ctx.stroke();
    }
}

function project_vertex(vertex) {
    let [x, y, z] = vertex;

    let x_length = (Math.abs(sreen.z - z) * Math.abs(x - camera.x)) / (Math.abs(sreen.z - z) + Math.abs(camera.z - sreen.z))    
    let x_project = x > camera.x ? x - x_length : x + x_length;

    let y_length = (Math.abs(sreen.z - z) * Math.abs(y - camera.y)) / (Math.abs(sreen.z - z) + Math.abs(camera.z - sreen.z))
    let y_project = y > camera.y ? y - y_length : y + y_length;

    return [x_project, y_project, z];
}


// const timer = ms => new Promise(res => setTimeout(res, ms))

// async function load() {
//     for (i = 0; i < 8; i ++)
//         for (j = 0; j < 8; j ++) {
//             ctx.clearRect(20 + i * 32, 20 + j * 32, 32, 32);            
//             await timer(500);
//         }
// }

// load();


// strokeRect(x, y, ширина, высота) // Рисует прямоугольник
// fillRect(x, y, ширина, высота)   // Рисует закрашенный прямоугольник
// clearRect(x, y, ширина, высота)  // Очищает область на холсте размер с прямоугольник заданного размера