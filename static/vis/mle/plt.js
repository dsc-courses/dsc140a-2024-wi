class Figure {

    constructor(sketch, top_left, x_range, y_range, x_scale, y_scale) {
        this.sketch = sketch;
        this.top_left = top_left;
        this.x_range = x_range;
        this.y_range = y_range;
        this.x_scale = x_scale;
        this.y_scale = y_scale;
    }

    screen_coordinates(pt) {
        let [x, y] = pt;
        let x_screen = this.top_left[0] + (x - this.x_range[0]) * this.x_scale;
        let y_screen = this.top_left[1] - (y - this.y_range[1]) * this.y_scale;
        return [x_screen, y_screen];
    }

    draw_axes() {
        let x_min = this.screen_coordinates([this.x_range[0], 0]);
        let x_max = this.screen_coordinates([this.x_range[1], 0]);
        let y_min = this.screen_coordinates([0, this.y_range[0]]);
        let y_max = this.screen_coordinates([0, this.y_range[1]]);

        this.sketch.line(x_min[0], x_min[1], x_max[0], x_max[1]);
        // line(y_min[0], y_min[1], y_max[0], y_max[1]);
    }

    plot (xs, ys) {

        let [prev_x, prev_y] = this.screen_coordinates([xs[0], ys[0]]);

        for (let i=1; i<xs.length; i++) {
            let [x, y] = this.screen_coordinates([xs[i], ys[i]]);
            this.sketch.line(prev_x, prev_y, x, y);
            prev_x = x;
            prev_y = y;
        }
    }

    scatter (xs, ys, s=10) {
        for (let i=0; i<xs.length; i++) {
            let [x, y] = this.screen_coordinates([xs[i], ys[i]]);
            this.sketch.circle(x, y, s);
        }
    }

}


function linspace(x0, x1, n) {
    let points = [];
    let delta = (x1 - x0) / (n-1);
    let x = x0;
    for (let i=0; i<n; i++) {
        points.push(x)
        x = x + delta;
    }
    return points;
}

function zeros(n) {
    return new Array(n).fill(0);
}
