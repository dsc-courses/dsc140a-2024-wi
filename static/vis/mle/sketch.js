PASTELRED = "#d20000";
PASTELBLUE = "#007aff";
PASTELPURPLE = "#6E66BA";
PASTELYELLOW = "#FBC05E";
PASTELGREEN = "#8fc34f";

let figure;

let data = [-2.3, -1.5, -.4, -.3, -.2, .2, .24, .7, 1.1, 1.7, 2.5];

function gaussian(x, mu, sigma) {
    return Math.exp(-((x - mu)**2) / sigma**2) * (Math.sqrt(2*Math.PI) * sigma)**(-1);
}


function likelihood(mu, sigma) {
    let likelihood = 1;

    for (x of data) {
        let ell = gaussian(x, mu, sigma);
        likelihood *= ell
    }

    return likelihood;
}

function log_likelihood(mu, sigma) {
    let log_likelihood = 0;

    for (x of data) {
        let ell = gaussian(x, mu, sigma);
        log_likelihood += Math.log(ell);
    }

    return log_likelihood;
}


function sketch_curve (sketch) {

    function drawData () {
        let z = zeros(data.length);
        sketch.stroke('black');
        sketch.strokeWeight(3);
        figure.scatter(data, z);
    }

    function drawLikelihoods(mu, sigma) {
        for (x of data) {
            let ell = gaussian(x, mu, sigma);
            let [x0, y0] = figure.screen_coordinates([x, 0]);
            let [x1, y1] = figure.screen_coordinates([x, ell]);

            sketch.drawingContext.setLineDash([2, 4]);
            sketch.stroke(PASTELBLUE);
            sketch.line(x0, y0, x1, y1);
            sketch.drawingContext.setLineDash([1, 0]);
        }
    }


    sketch.setup = function() {
        let div = sketch.select('#canvas-curve');
        let scale = div.width / 8;

        // put setup code here
        sketch.createCanvas(div.width, .6 * scale * 9);
        figure = new Figure(sketch, [10, 10], [-4, 4], [0, .6], scale, scale*8);
    }


    sketch.draw = function() {
        sketch.background('#fff');

        mu = sketch.select('#mu').value();
        sigma = sketch.select('#sigma').value();

        let xx = linspace(-4, 4, 300);
        let yy = xx.map(x => gaussian(x, mu, sigma));

        sketch.strokeWeight(2);
        sketch.stroke('black');
        figure.draw_axes();

        drawLikelihoods(mu, sigma);

        sketch.stroke(PASTELBLUE);
        sketch.strokeWeight(5);
        figure.plot(xx, yy);

        drawData();
    }

}


function sketch_max (sketch) {

    let max_ell = 0;

    sketch.setup = function() {
        sketch.createCanvas(800, 50);
        sketch.background('black');
    }

    sketch.draw = function() {
        sketch.background('white');

        mu = sketch.select('#mu').value();
        sigma = sketch.select('#sigma').value();

        let ell = likelihood(mu, sigma) * 10**10;

        max_ell = Math.max(ell, max_ell);

        scale = 200;

        sketch.noStroke();

        let height = 20;
        sketch.fill(PASTELBLUE);
        sketch.rect(0, 0, ell * scale, height);

        sketch.text('current likelihood', ell * scale + 10, 0.5*height + 5);

        sketch.fill('#00000033');
        sketch.rect(0, height + 2, max_ell * scale, height);

        sketch.text('max likelihood seen', max_ell * scale + 10, 1.5*height + 5);
    }

}

new p5(sketch_curve, 'canvas-curve');
new p5(sketch_max, 'canvas-max');
