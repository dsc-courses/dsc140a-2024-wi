let data;
let w_0 = .4;
let w_1 = .1;

let PURPLE = "#6E66BA";
let RED = '#d20000';

function risk (w_0, w_1) {

    let risk = 0;

    for (let pt of data) {
        [x, y] = pt;
        let pred = w_0 + w_1 * x;
        let loss = (pred + y)**2;
        risk += loss
    }

    return risk / data.length;
}


let s1 = function (sketch) {
    let scale = 40;

    let w_0_slider, w_1_slider;
    let residual_checkbox;

    function sx(x) {
        return (sketch.width / 2) + x * scale
    }

    function sy(y) {
        return (sketch.height / 2) - y * scale
    }

    function generateData(n) {
        let xs = [];
        let ys = [];

        sketch.randomSeed(42);

        for (let i=0; i<n; i++) {
            let x = sketch.random(-5, 5);
            let y = -.75 * x - 1;
            y = y + sketch.randomGaussian(0, 1);
            xs.push(x);
            ys.push(y);
        }

        return [xs, ys];
    }

    function drawAxes(xmin, xmax, ymin, ymax) {
        sketch.stroke('black')
        sketch.strokeWeight(2);
        sketch.line(sx(xmin), sy(0), sx(xmax), sy(0));
        sketch.line(sx(0), sy(ymin), sx(0), sy(ymax));
    }

    function scatter(x, y) {
        sketch.stroke('#007aff')
        sketch.strokeWeight(6);
        for (let i = 0; i < x.length; i++) {
            sketch.point(sx(x[i]), sy(y[i]));
        }
    }

    function drawData() {
        [xs, ys] = data;
        scatter(xs, ys);
    }

    function drawRegressionLine() {
        let xmin = -10;
        let xmax = 10;

        let x1 = sx(xmin);
        let x2 = sx(xmax);
        let y1 = sy(w_1 * xmin + w_0);
        let y2 = sy(w_1 * xmax + w_0);

        sketch.strokeWeight(3);
        sketch.stroke(PURPLE);

        sketch.line(x1, y1, x2, y2);

    }

    function drawResiduals() {
        sketch.stroke(RED);
        sketch.strokeWeight(2);
        for (let i=0; i<xs.length; i++) {
            let x = xs[i];
            let y = ys[i];

            // the predicted y value
            let y_pred = w_0 + w_1 * x;

            // draw the residual line
            sketch.line(sx(x), sy(y), sx(x), sy(y_pred));
        }
    }

    sketch.setup = function () {
        sketch.createCanvas(500, 500);
        sketch.createEasyCam();
        data = generateData(30);

        sketch.createP('w_0');
        w_0_slider = sketch.createSlider(-9, 9, 0, .05);

        sketch.createP('w_1');
        w_1_slider = sketch.createSlider(-9, 9, .5, .05);

        sketch.createP('Show Residuals')
        residual_checkbox = sketch.createCheckbox();

    }

    sketch.draw = function () {
        w_0 = w_0_slider.value();
        w_1 = w_1_slider.value();

        sketch.background(255);
        drawAxes(-6, 6, -6, 6)
        drawData();
        drawRegressionLine();
        if (residual_checkbox.checked()) {
            drawResiduals();
        };
    }
}


let s2 = function (sketch) {

    const res = 40;
    const scaleFactor = 30;

    let x_min = -10;
    let x_max = 10;
    let z_min = -10;
    let z_max = 10;

    let points = [];

    let risk_p;

    let pointField;

    let cam;

    sketch.setup = function() {
        sketch.createCanvas(500, 500, sketch.WEBGL);
        sketch.noFill();
        sketch.stroke('black');
        cam = sketch.createCamera();

        sketch.textFont(inconsolata);

        let x_delta = (x_max - x_min) / res;
        let z_delta = (z_max - z_min) / res;

        for (let z_i = 0; z_i < res; z_i++) {
            let z = z_min + z_i * z_delta;
            for (let x_i = 0; x_i < res; x_i++) {
                let x = x_min + x_i * x_delta;
                let y = risk(x, z);

                points.push({
                    x: x,
                    y: -y - 10,
                    z: z
                });
            }
        }

        pointField = createModel();

        risk_p = sketch.createP("Risk")
    }

    let inconsolata;
    sketch.preload = function () {
        inconsolata = sketch.loadFont('../assets/inconsolata.ttf');
    }

    sketch.draw = function() {
        sketch.background(255);
        sketch.orbitControl(2, 1, 0.1);

        // Shine a light in the direction the camera is pointing

        sketch.translate(20, 200, -50);

        sketch.fill('#00000022')
        sketch.angleMode(sketch.DEGREES);
        sketch.noStroke();
        sketch.rotateX(90);
        sketch.plane(1000, 1000);
        sketch.rotateX(-90);

        sketch.scale(scaleFactor, .2*scaleFactor, scaleFactor);

        sketch.stroke('#00000022')
        sketch.fill('#00000022')
        sketch.strokeWeight(1);
        sketch.model(pointField);

        sketch.strokeWeight(2);
        sketch.stroke('red');
        sketch.line(0, 0, 0, 500/30, 0, 0);
        sketch.stroke('green');
        sketch.line(0, 0, 0, 0, -5000/30, 0);
        sketch.stroke('blue');
        sketch.line(0, 0, 0, 0, 0, 500/30);

        sketch.strokeWeight(10);
        // sketch.point(w_0, -risk(w_0, w_1), w_1);
        sketch.stroke(PURPLE)
        sketch.point(w_0, 0, w_1);
        // sketch.stroke('green');
        // sketch.point(-.75, -risk(-.75, -1), -1);
        sketch.stroke(RED);
        sketch.strokeWeight(5);
        sketch.line(w_0, 0, w_1, w_0, -risk(w_0, w_1) - 10, w_1);

        risk_p.html(risk(w_0, w_1));

        sketch.scale(1/scaleFactor, 1/(.2*scaleFactor), 1/scaleFactor);
        sketch.scale(10, 10, 10);
        sketch.fill('black');
        sketch.translate(0, -11, 0);
        sketch.text('w_0', 30, 10);

        sketch.rotateY(270);
        sketch.text('w_1', 30, 10);


    }


    function createModel() {
        return new p5.Geometry(
            // detailX and detailY are not used in this example
            res - 1, res - 1,
            // The callback must be an anonymous function, not an arrow function in
            // order for "this" to be bound correctly.
            function createGeometry() {
                for (let p of points) {
                    this.vertices.push(new p5.Vector(
                        p.x, p.y, p.z
                    ));
                }

                this.computeFaces();
                this.computeNormals();

                this.gid = "point-field";
            }
        );
    }

}

new p5(s1);
new p5(s2);
