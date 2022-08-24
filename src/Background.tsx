import { useRef, useEffect } from 'react'

interface CanvasProps {
    width: number;
    height: number;
}

interface Arrow {
    x: number;
    y: number;
    dx: number;
    dy: number;
    size: number;
    color: string;
    transparency: number;
    rotation: number;
}

const Background = ({ width, height }: CanvasProps) => {

    const randomArrow = () => {
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

        if (arrow.x+arrow.size >= width)
            arrow.x = width-arrow.size-1;
        if (arrow.y+arrow.size >= height)
            arrow.y = height-arrow.size-1;
        
        return arrow;
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestIdRef = useRef<number|null>(null);
    const arrows = useRef(Array.from({ length: 20 }, randomArrow));

    console.log(arrows.current);

    const drawArrow = (ctx: CanvasRenderingContext2D, arrow: Arrow) => {
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

    const updateArrow = (arrows: Array<Arrow>) => {
        for (var i = 0; i < arrows.length; i++) {
            const arrow = arrows[i];

            arrow.x += arrow.dx;
            arrow.y += arrow.dy;

            if (arrow.x <= -arrow.size || arrow.x > width || arrow.y <= -arrow.size || arrow.y > height) {
                const arrow = randomArrow();

                while (!(arrow.x <= -arrow.size || arrow.x > width || arrow.y <= -arrow.size || arrow.y > height)) {
                    arrow.x -= arrow.dx;
                    arrow.y -= arrow.dy;
                }

                arrows[i] = arrow;
            }
        }
    };

    const renderFrame = (ctx: CanvasRenderingContext2D) => {
        updateArrow(arrows.current);
        ctx.clearRect(0, 0, width, height);
        arrows.current.forEach((arrow) => drawArrow(ctx, arrow));
    };

    const tick = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        renderFrame(ctx);

        requestIdRef.current = requestAnimationFrame(tick);
    };

    useEffect(() => {
        requestIdRef.current = requestAnimationFrame(tick);
        return () => {
            const requestId = requestIdRef.current;
            if (!requestId) return;

            cancelAnimationFrame(requestId);
        };
    }, []);

    return <canvas className="blur-sm" ref={canvasRef} height={height} width={width} />;
}

Background.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight
};

export default Background;