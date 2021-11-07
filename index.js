const WIDTH = 1024;
const HEIGHT = 1024;
const STEP_SIZE = 20;
const CURSOR_SIZE = 10;
const NUM_OBJECTS = 10;
const OBJECT_SIZE = 20;
const CURSOR_COLOR = 'rgba(149,0,255,0.5)';
const THRESHOLD = 0.1;
let objects = [];

let cursor = {
    // "player" position
    x: WIDTH / 2,
    y: HEIGHT / 2,
    size: CURSOR_SIZE,
    render: function (ctx) {
        // draw cursor
        renderCircle(ctx, this.x, this.y, this.size, 'blue')
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }
};

let target = {
    // point that we want to connect to
    x: 0,
    y: 0,
    render: function (ctx) {
        // draw line to our target
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.moveTo(cursor.x, cursor.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        renderCircle(ctx, this.x, this.y, 2, 'red')
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }
}


function onKeyPress(event) {
    // handle button press
    if (event.key === 'a') target.x -= STEP_SIZE;
    else if (event.key === 's') target.y += STEP_SIZE;
    else if (event.key === 'w') target.y -= STEP_SIZE;
    else if (event.key === 'd') target.x += STEP_SIZE;
    render();
}


function onMouseMove(event) {
    // handle mouse move
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    render();
}


function makeRandomObject() {
    // make something that can be rendered
    return makeRandomCircle();
}


function rotate(cx, cy, x, y, angle) {
    // rotate coordinates around point
    let radians = (Math.PI / 180) * angle
    let cos = Math.cos(radians);
    let sin = Math.sin(radians);
    let nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
    let ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return {
        x: nx,
        y: ny
    };
}

function getRandomObjectSize() {
    // common size getter
    return Math.round(Math.random() * OBJECT_SIZE + OBJECT_SIZE)
}


function getRandomX() {
    // get random x coordinate
    return Math.round(Math.random() * WIDTH)
}


function getRandomY() {
    // get random y coordinate
    return Math.round(Math.random() * HEIGHT)
}


function getAngleBetween(cy, cx, y, x) {
    // calculate angle between two points in space
    return Math.atan2(cy - y, cx - x) * 180 / Math.PI;
}


function getDistance(x1, y1, x2, y2) {
    // calculate distance between two points in space
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}


function makeRandomCircle() {
    // make random circle-like renderable object
    return {
        x: getRandomX(),
        y: getRandomY(),
        size: getRandomObjectSize(),
        render: function (ctx) {
            renderCircle(ctx, this.x, this.y, this.size, 'pink');
        },
        getClosest(point) {
            // get closest to the given point inside our shape
            let angle = getAngleBetween(this.y, point.x, point.y, this.x);
            return rotate(
                this.x,
                this.y,
                this.x + this.size,
                this.y,
                angle
            );
        }
    }
}


function getClosestPoint(given_vertexes, point) {
    let minimal = given_vertexes[0];
    let distance = getDistance(point.x, point.y, minimal.x, minimal.y);
    for (let i = 1; i < given_vertexes.length; i++) {
        let new_dist = getDistance(
            given_vertexes[i].x,
            given_vertexes[i].y,
            point.x, point.y);

        if (new_dist <= distance) {
            minimal = given_vertexes[i];
            distance = new_dist;
        }
    }
    return minimal;
}


function fillWorldWithObjects() {
    // create some stuff to work with
    for (let i = 0; i < NUM_OBJECTS; i++) {
        let new_object = makeRandomObject();
        objects.push(new_object);
    }
}


function renderCircle(ctx, x, y, radius, color) {
    // draw circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}


function refresh() {
    // starting point
    render();
}


function rayMarching(ctx, current_x, current_y) {
    // find closes point to the target
    let all_closest = [];
    for (let i = 0; i < objects.length; i++) {
        objects[i].render(ctx);
        let closest = objects[i].getClosest({x: cursor.x, y: cursor.y});
        all_closest.push(closest);
        renderCircle(ctx, closest.x, closest.y, 5, 'red');
    }
    let the_most_close = getClosestPoint(all_closest, {
        x: cursor.x,
        y: cursor.y
    });
    let radius = getDistance(cursor.x, cursor.y, the_most_close.x, the_most_close.y);
    renderCircle(ctx, cursor.x, cursor.y, radius, CURSOR_COLOR);
}


function render() {
    // main rendering function
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ------------------------------------------------------------------------
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'pink'

    rayMarching(ctx, cursor.x, cursor.y);
    target.render(ctx);
    cursor.render(ctx);
}