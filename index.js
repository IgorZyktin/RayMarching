const WIDTH = 1024;
const HEIGHT = 1024;
const STEP_SIZE = 30;
const CURSOR_SIZE = 10;
const NUM_OBJECTS = 1;
const OBJECT_SIZE = 20;

let objects = [];

let cursor = {
    // "player" position
    x: WIDTH / 2,
    y: HEIGHT / 2,
    size: CURSOR_SIZE,
    render: function (ctx) {
        // draw cursor
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
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
    }
}


function onKeyPress(event) {
    // handle button press
    if (event.key === 'a') cursor.x -= STEP_SIZE;
    else if (event.key === 's') cursor.y += STEP_SIZE;
    else if (event.key === 'w') cursor.y -= STEP_SIZE;
    else if (event.key === 'd') cursor.x += STEP_SIZE;

    cursor.x = Math.min(cursor.x, WIDTH);
    cursor.y = Math.min(cursor.y, HEIGHT);
    cursor.x = Math.max(cursor.x, 0);
    cursor.y = Math.max(cursor.y, 0);

    render();
}


function onMouseMove(event) {
    // handle mouse move
    target.x = event.clientX;
    target.y = event.clientY;

    render();
}


function makeRandomObject() {
    // make something that can be rendered
    let num = Math.round(Math.random() * 5);
    if (num <= 2) return makeRandomCircle();
    return makeRandomNSided(num);
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


function getAngleBetween(cx, cy, x, y) {
    // calculate angle between two points in space
    // TODO
    let angle = Math.atan2(y - cy, x - cx) * 180 / Math.PI;
    return angle;
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
            // TODO
            let angle = getAngleBetween(this.x, this.y, point.x, point.y);
            console.log(`x=${this.x}, y=${this.y}, cx=${point.x}, cy=${point.y}, angle=${angle}`)
            // ????????????????????????????????????????????????????????????????
            let closest;
            if (point.x >= this.x && point.y >= this.y)
                closest = {
                    x: this.x + this.size / 2,
                    y: this.y + this.size / 2
                }

            else if (point.x >= this.x && point.y < this.y)
                closest = {
                    x: this.x + this.size / 2,
                    y: this.y - this.size / 2
                }

            else if (point.x < this.x && point.y >= this.y)
                closest = {
                    x: this.x - this.size / 2,
                    y: this.y + this.size / 2
                }

            else
                closest = {
                    x: this.x - this.size / 2,
                    y: this.y - this.size / 2
                }
            // ????????????????????????????????????????????????????????????????

            return closest;
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


function makeRandomNSided(sides) {
    // make triangle, square, etc
    let x = getRandomX();
    let y = getRandomY();
    let size = getRandomObjectSize() * 2;
    let per_point = 360 / sides;
    let vertexes = [];
    for (let i = 0; i < sides; i++) {
        let new_point = rotate(x, y, x, y - size, i * per_point);
        vertexes.push(new_point)
    }
    return {
        x: x,
        y: y,
        size: size,
        vertexes: vertexes,
        render: function (ctx) {
            ctx.fillStyle = 'pink';
            ctx.beginPath();
            ctx.moveTo(this.vertexes[0].x, this.vertexes[0].y)
            for (let i = 1; i < this.vertexes.length; i++) {
                ctx.lineTo(this.vertexes[i].x, this.vertexes[i].y)
            }
            ctx.lineTo(this.vertexes[0].x, this.vertexes[0].y)
            ctx.fill();
            ctx.stroke();
        },
        getClosest(point) {
            // get closest to the given point inside our shape
            // ????????????????????????????????????????????????????????????????
            let closest = this.vertexes[0];
            // ????????????????????????????????????????????????????????????????
            return closest;
        }
    }
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


function render() {
    // main rendering function
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ------------------------------------------------------------------------
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'pink'

    let all_closest = [];
    for (let i = 0; i < objects.length; i++) {
        objects[i].render(ctx);
        let closest = objects[i].getClosest({x: cursor.x, y: cursor.y});
        all_closest.push(closest);
        renderCircle(ctx, closest.x, closest.y, 5, 'red');
    }
    let the_most_close = getClosestPoint(all_closest, {x: cursor.x, y: cursor.y});
    let radius = getDistance(cursor.x, cursor.y, the_most_close.x, the_most_close.y);
    renderCircle(ctx, cursor.x, cursor.y, radius, 'purple');

    target.render(ctx);
    cursor.render(ctx);
}