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
            x: width * Math.random(),
            y: height * Math.random(),
            dx: Math.pow(-1, Math.floor(Math.random()*2)),
            dy: Math.pow(-1, Math.floor(Math.random()*2)),
            size: Math.random()*dim/2+dim/4,
            color: 'rgb(142, 36, 170)',
            transparency: Math.random()*0.2+0.2,
            rotation: Math.floor(Math.random()*4)*Math.PI
        }

        if (arrow.x+arrow.size >= width)
            arrow.x = width-arrow.size-1;
        if (arrow.y+arrow.size >= height)
            arrow.y = height-arrow.size-1;
        
        return arrow;
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestIdRef = useRef<number|null>(null);
    const arrows = useRef(Array.from({ length: 10 }, randomArrow));

    console.log(arrows.current);

    const drawArrow = (ctx: CanvasRenderingContext2D, arrow: Arrow) => {
        ctx.save();
        ctx.translate(arrow.x, arrow.y);
        ctx.scale(arrow.size/137, arrow.size/143);
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

        ctx.moveTo(0, 66);
        coords.forEach((coord) => {
            ctx.lineTo(coord[0], coord[1]);
        });

        ctx.fillStyle = arrow.color;
        ctx.globalAlpha = arrow.transparency;
        ctx.fill();

        ctx.closePath();
        ctx.restore();
    }

    const updateArrow = (arrows: Array<Arrow>) => {
        arrows.forEach((arrow) => {
            if (arrow.x < 0 || arrow.x+arrow.size >= width) arrow.dx *= -1;
            arrow.x += arrow.dx;

            if (arrow.y < 0 || arrow.y+arrow.size >= height) arrow.dy *= -1;
            arrow.y += arrow.dy;
        });
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