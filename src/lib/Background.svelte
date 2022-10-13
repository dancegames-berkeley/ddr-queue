<script lang='ts'>
	import { onMount } from 'svelte';
    import { drawArrow, randomArrow, updateArrow } from './arrows.js'
    import type { Arrow } from './arrows'

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let frameHandle: number;
    let arrows: Array<Arrow> = [];

    function handleResize() {
        ctx.canvas.height = window.innerHeight;
        ctx.canvas.width = window.innerWidth;

        arrows = Array.from({ length: 20 }, () => randomArrow(ctx));
    };

    function render() {
        if (!arrows.length) handleResize();
        
        updateArrow(ctx, arrows);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        arrows.forEach((arrow) => drawArrow(ctx, arrow));
    }

    onMount(() => {
        (function loop() {
            ctx = canvas.getContext('2d')!!;

            render();

            frameHandle = requestAnimationFrame(loop);
        })();

        return () => {
            cancelAnimationFrame(frameHandle)
        };
    });
</script>

<div class="absolute x-0 y-0 w-full h-full bg-gray-900 -z-50">
    <canvas bind:this={canvas} />
</div>
<svelte:window on:resize|passive={handleResize}/>
