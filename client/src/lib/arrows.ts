export type Arrow = {
    x: number;
    y: number;
    dx: number;
    dy: number;
    size: number;
    color: string;
    transparency: number;
    rotation: number;
}

export function randomArrow(ctx: CanvasRenderingContext2D): Arrow {
    const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        const dim = Math.min(width, height);

        const arrow = {
            x: 2*width * Math.random() - width,
            y: 2*height * Math.random() - height,
            dx: Math.random()*2-1,
            dy: Math.random()*2-1,
            size: Math.random()*dim/2+dim/3,
            color: `rgb(${Math.floor(142+Math.random()*142/2-142/4)}, ${Math.floor(36+Math.random()*18-9)}, ${Math.floor(170+Math.random()*170/2-170/4)})`,
            transparency: Math.random()*0.5+0.1,
            rotation: Math.floor(Math.random()*4)*Math.PI/2
        }

        return arrow;
}

export function drawArrow(ctx: CanvasRenderingContext2D, arrow: Arrow) {
    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.scale(arrow.size/137, arrow.size/143);
    ctx.translate(137/2, 143/2);
    ctx.rotate(arrow.rotation);
    ctx.beginPath();

    const coords = [
        [0, 77],
        [11, 89],
        [79, 89],
        [48, 119],
        [48, 131],
        [59, 143],
        [72, 143],
        [137, 72],
        [137, 65],
        [72, 0],
        [59, 0],
        [48, 12],
        [48, 23],
        [79, 54],
        [11, 54]
    ];

    ctx.moveTo(-137/2, 66-143/2);
    coords.forEach((coord) => {
        ctx.lineTo(coord[0]-137/2, coord[1]-143/2);
    });

    ctx.fillStyle = arrow.color;
    ctx.globalAlpha = arrow.transparency;
    ctx.fill();

    ctx.closePath();
    ctx.restore();
}

export function updateArrow(ctx: CanvasRenderingContext2D, arrows: Array<Arrow>) {
    const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        for (var i = 0; i < arrows.length; i++) {
            const arrow = arrows[i];

            arrow.x += arrow.dx;
            arrow.y += arrow.dy;

            if (arrow.x <= -arrow.size || arrow.x > width || arrow.y <= -arrow.size || arrow.y > height) {
                const arrow = randomArrow(ctx);

                while (!(arrow.x <= -arrow.size || arrow.x > width || arrow.y <= -arrow.size || arrow.y > height)) {
                    arrow.x -= arrow.dx;
                    arrow.y -= arrow.dy;
                }

                arrows[i] = arrow;
            }
        }
}

