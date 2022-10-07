<script lang="ts">
	import { onMount } from 'svelte';
	import { linear } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import Background from '$lib/Background.svelte';
	import type { IMQueueInfo, IMJoinQueue } from '$lib/messages';
	import { OMQueueInfo, OMJoinQueue } from '$lib/messages';
	import { socket } from '$lib/websocket';
	import { uuid } from '$lib/uuid';
	import { base } from '$app/paths';
	import '$lib/firebase';

	let queueSize: number | undefined;
	let posInQueue: number | undefined;
	let loading = true;

	function joinQueue() {
        loading = true;
		socket.send(new OMJoinQueue(uuid));
	}

	function flyIn(node: any) {
		return {
			easing: linear,
			css: (t: number) => `transform: translate(-${100 - 100 * t}%)`,
			duration: 150
		};
	}

	function flyOut(node: any) {
		return {
			easing: linear,
			css: (t: number) => `transform: translate(${100 - 100 * t}%)`,
			duration: 150
		};
	}

	onMount(() => {
		const unsubscribe: (() => void)[] = [];
		unsubscribe.push(socket.subscribe((msg: string) => {
			console.log(msg);
		}));
		unsubscribe.push(socket.onQueueInfo((msg: IMQueueInfo) => {
            loading = false;
			queueSize = msg.queueSize;
			posInQueue = msg.posInQueue;
		}));
		unsubscribe.push(socket.onJoinQueue((msg: IMJoinQueue) => {
			if (!msg.success) loading = false;
		}));
		socket.send(new OMQueueInfo(uuid));

		return () => {
			unsubscribe.forEach(u => u());
		};
	});
</script>

<Background />
<div class="absolute flex items-center h-full w-full">
	{#if !loading}
		<div class="flex w-full h-full" transition:fade={{ duration: 150 }}>
			<div class="flex flex-col items-center m-auto">
				<img src="{base}/logo.png" class="max-w-[50vw] max-h-[25vh]" alt="DDR Queue logo" />
				<p class="text-[5vw] sm:text-3xl font-misolight text-white text-center">
					{#if queueSize === 0}
						No team in queue!
					{:else if queueSize === 1}
						1 team in queue
					{:else}
						{queueSize} teams in queue
					{/if}
				</p>
				<p class="text-[5vw] sm:text-3xl font-misolight text-white text-center">
					Estimated wait time:
					{#if queueSize}
						{(posInQueue === undefined ? queueSize : posInQueue)*5} minutes
					{:else}
						play now!
					{/if}
				</p>
			</div>
			<div class="absolute bottom-0 w-full text-center">
				<button on:click={joinQueue} class="text-[10vw] sm:text-7xl font-wendy text-white">
					{#if posInQueue === undefined}
						join queue
					{:else}
						{#if posInQueue === 0}
							your turn
						{:else if posInQueue === 1}
							next in queue
						{:else}
							{posInQueue}th in queue
						{/if}
					{/if}
				</button>
			</div>
		</div>
	{/if}
	<div class="absolute h-16 sm:h-36 flex justify-center items-center w-full overflow-x-hidden">
		{#if loading}
			<div in:flyIn out:flyOut class="absolute h-full w-full bg-white" />
			<p
				transition:fade={{ duration: 150 }}
				class="absolute m-auto text-center font-wendy text-6xl sm:text-9xl"
			>
				LOADING
			</p>
		{/if}
	</div>
</div>
