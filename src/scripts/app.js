
'use strict';

/**
 * Smash targets below this line
 * -----------------------------
 */

var
    Vec         = require('./modules/Vec'),
    Graphics    = require('./modules/Graphics'),

    $           = require('jquery');

(function(win, doc, c) {

    let

        cx = c.getContext('2d'),

        dpi = win.devicePixelRatio,
        w = win.innerWidth,
        h = win.innerHeight,

        P,

        // These are all used for the main rendering loop
        now,
        then = Date.now(),
        interval = 1000/60,
        delta,

        point_idx = 0, // point index

        points = [],
        bg = 'rgb(0, 5, 25)',
        pal = [
            'rgba(0, 91, 197,',
            'rgba(0, 180, 252,',
            'rgba(23, 249, 255,',
            'rgba(223, 147, 0,',
            'rgba(248, 190, 0,'
        ],

        // global configuration
        vector_scale = 0.01, // vector scaling factor, we want small steps
        time = 0; // time passes by

    // function randomGaussian () {
    //     var x1, x2, rad, y1;
    //     do {
    //         x1 = 2 * this.random() - 1;
    //         x2 = 2 * this.random() - 1;
    //         rad = x1 * x1 + x2 * x2;
    //     } while(rad >= 1 || rad == 0);
    //     var c = this.sqrt(-2 * Math.log(rad) / rad);
    //     return x1 * c;
    // };

    // function map (value, istart, istop, ostart, ostop) {
    //     return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    // };

    function render () {

        requestAnimationFrame(render);

        now = Date.now();
        delta = now - then;

        if (delta > interval) {

            then = now - (delta % interval);

            points.map( (p, i) => {

                let xx = P.map(p.x, -5, 0, 0, w);
                let yy = P.map(p.y, -5, 0, 0, h);

                // select color from palette (index based on noise)
                // let cn = (100*pal.length*P.noise(point_idx)) % pal.length;
                // cx.fillStyle = pal[0] + '0.015)';
                cx.fillStyle = 'rgba(255,255,255,0.015)';
                // stroke(pal[cn], 15);
                cx.beginPath();
                cx.arc(xx,yy, 1, 0, 2 * Math.PI, false);
                cx.closePath();
                cx.fill();

                // point(xx, yy); //draw
                // placeholder for vector field calculations
                // v is vector from the field

                let n = (Math.PI*2) * P.noise(p.x,p.y);
                let v = new Vec(Math.cos(n),Math.sin(n));

                // let n = 1000 * P.map(P.noise(p.x/5,p.y/5),0,1,-1,1); // 100, 300 or 1000
                // let v = new Vec(Math.cos(n),Math.sin(n));

                // let n1a = 3*P.map(P.noise(p.x/2,p.y/2,time),0,1,-1,1);
                // let n1b = 3*P.map(P.noise(p.y/2,p.x/2,time),0,1,-1,1);
                // let nn = 6*P.map(P.noise(n1a,n1b,time),0,1,-1,1);

                // let v = new Vec(Math.cos(nn), Math.sin(nn));

                // let n = 5*P.map(P.noise(p.x,p.y),0,1,-1,1);

                // let a = 1;
                // let b = 1;
                // let m = 6;
                // let n1 = 1;
                // let n2 = 7;
                // let n3 = 8;

                // let f1 = Math.pow(Math.abs(Math.cos(m*n/4)/a),n2);
                // let f2 = Math.pow(Math.abs(Math.sin(m*n/4)/b),n3);
                // let fr = Math.pow(f1+f2,-1/n1);

                // let xt = Math.cos(n)*fr;
                // let yt = Math.sin(n)*fr;

                // let v = new Vec(xt,yt);

                // let v = new Vec(0.1, 0.1);

                p.x += vector_scale * v.x;
                p.y += vector_scale * v.y;

                // go to the next point
                point_idx++;

                time += 0.01;

            });

        }

    }

    function init() {

        P = new Processing();

        c.width = w * dpi;
        c.height = h * dpi;

        cx.lineWidth = 1;
        cx.fillStyle = bg;
        cx.fillRect(0, 0, w*dpi, h*dpi);

        for (var x=-3; x<=3; x+=0.07) {
            for (var y=-3; y<=3; y+=0.07) {
                points.push(new Vec(x+P.randomGaussian()*0.003, y+P.randomGaussian()*0.003));
            }
        }

        // Start the rendering loop wahey oh yeah
        window.requestAnimationFrame(render);
    }

    $(init);

})(window,document,document.querySelectorAll('canvas')[0]);
