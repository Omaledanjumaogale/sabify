<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { Heart, Play, RotateCcw, Shield, Timer, Zap } from '@lucide/svelte';
	import { getGame, makeMathQuestion, games } from '$lib/data/games';
	import { progress, recordGame } from '$lib/stores/progress';
	import { celebrate } from '$lib/utils';
	import GameTopBar from '$lib/components/games/GameTopBar.svelte';
	import GameResult from '$lib/components/games/GameResult.svelte';

	const game = getGame('number-nebula')!;
	let host: HTMLDivElement;
	let started = $state(false);
	let over = $state(false);
	let score = $state(0);
	let shields = $state(3);
	let combo = $state(0);
	let round = $state(1);
	let timeLeft = $state(20);
	let xp = $state(0);
	let best = $derived($progress.gameBests['number-nebula'] ?? 0);
	let question = $state(makeMathQuestion(1));
	let feedback = $state<'none' | 'correct' | 'wrong' | 'timeout'>('none');
	let locked = $state(false);
	let flash = $state<'none' | 'correct' | 'wrong'>('none');
	let lastResult = $state('');

	// three.js handles kept outside reactive state
	let boostUntil = 0;
	let shakeUntil = 0;
	let crystalPulse = 0;
	let shipGroup: THREE.Group | null = null;
	let crystalGroup: THREE.Group | null = null;

	function newQuestion() {
		question = makeMathQuestion(1 + Math.floor(round / 3));
		timeLeft = 20;
		feedback = 'none';
		locked = false;
	}

	function start() {
		started = true;
		over = false;
		score = 0;
		shields = 3;
		combo = 0;
		round = 1;
		xp = 0;
		lastResult = '';
		question = makeMathQuestion(1);
		timeLeft = 20;
		feedback = 'none';
		locked = false;
	}

	function choose(option: string) {
		if (!started || over || locked) return;
		if (option === question.answer) {
			const points = 100 + combo * 25;
			score += points;
			xp += 15;
			combo += 1;
			lastResult = `+${points} points · combo ×${combo}`;
			feedback = 'correct';
			flash = 'correct';
			boostUntil = performance.now() + 750;
			crystalPulse = performance.now() + 750;
		} else {
			shields -= 1;
			combo = 0;
			lastResult = `The answer was ${question.answer}`;
			feedback = 'wrong';
			flash = 'wrong';
			shakeUntil = performance.now() + 500;
		}
		locked = true;
		if (shields <= 0) {
			setTimeout(() => endGame(false), 900);
			return;
		}
		setTimeout(() => {
			flash = 'none';
			if (round >= 10) {
				endGame(true);
			} else {
				round += 1;
				newQuestion();
			}
		}, 950);
	}

	function timeout() {
		if (!started || over || locked) return;
		shields -= 1;
		combo = 0;
		feedback = 'timeout';
		lastResult = `Time! The answer was ${question.answer}`;
		flash = 'wrong';
		shakeUntil = performance.now() + 500;
		locked = true;
		if (shields <= 0) {
			setTimeout(() => endGame(false), 800);
		} else {
			setTimeout(() => {
				flash = 'none';
				if (round >= 10) endGame(true);
				else {
					round += 1;
					newQuestion();
				}
			}, 950);
		}
	}

	function endGame(completed: boolean) {
		if (over) return;
		over = true;
		started = false;
		if (completed) {
			score += 200;
			xp += 40;
		}
		recordGame('number-nebula', score, xp);
		if (score > best) celebrate();
	}

	$effect(() => {
		if (!started || over) return;
		const timer = setInterval(() => {
			if (locked || over) return;
			timeLeft -= 1;
			if (timeLeft <= 0) timeout();
		}, 1000);
		return () => clearInterval(timer);
	});

	onMount(() => {
		if (!host) return;
		let renderer: THREE.WebGLRenderer;
		try {
			renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		} catch {
			return;
		}
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		renderer.setSize(host.clientWidth, host.clientHeight);
		host.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(52, host.clientWidth / host.clientHeight, 0.1, 120);
		camera.position.set(0, 2.2, 10);
		camera.lookAt(0, 0.4, 0);

		scene.add(new THREE.AmbientLight(0x9fe6c6, 1.4));
		const key = new THREE.DirectionalLight(0xffffff, 2.4);
		key.position.set(3, 6, 6);
		scene.add(key);
		const rim = new THREE.PointLight(0xc9f26b, 22, 25);
		rim.position.set(-4, 2, 1);
		scene.add(rim);
		const coral = new THREE.PointLight(0xff6b5e, 12, 20);
		coral.position.set(5, -2, 2);
		scene.add(coral);

		// ship
		const ship = new THREE.Group();
		const body = new THREE.Mesh(
			new THREE.ConeGeometry(0.62, 2.2, 5),
			new THREE.MeshStandardMaterial({ color: 0xdff7ea, roughness: 0.25, metalness: 0.55, emissive: 0x0d3b2a, emissiveIntensity: 0.25 })
		);
		body.rotation.x = -Math.PI / 2;
		ship.add(body);
		const cockpit = new THREE.Mesh(
			new THREE.SphereGeometry(0.32, 18, 18),
			new THREE.MeshStandardMaterial({ color: 0x59c8f5, roughness: 0.1, metalness: 0.4, emissive: 0x0a6486, emissiveIntensity: 0.5 })
		);
		cockpit.position.set(0, 0.18, 0.15);
		cockpit.scale.set(0.9, 0.5, 1.4);
		ship.add(cockpit);
		for (const dir of [-1, 1]) {
			const wing = new THREE.Mesh(
				new THREE.BoxGeometry(0.95, 0.09, 0.5),
				new THREE.MeshStandardMaterial({ color: 0xc9f26b, roughness: 0.35, metalness: 0.35 })
			);
			wing.position.set(dir * 0.7, -0.1, 0.35);
			wing.rotation.z = dir * 0.22;
			ship.add(wing);
			const engine = new THREE.Mesh(
				new THREE.CylinderGeometry(0.12, 0.18, 0.35, 12),
				new THREE.MeshStandardMaterial({ color: 0xffc53d, emissive: 0xff8a00, emissiveIntensity: 1.2 })
			);
			engine.rotation.x = Math.PI / 2;
			engine.position.set(dir * 0.36, -0.12, 1.15);
			ship.add(engine);
		}
		ship.position.set(0, -2.1, 1.5);
		ship.rotation.x = 0.08;
		scene.add(ship);
		shipGroup = ship;

		// crystals
		const crystals = new THREE.Group();
		const colors = [0xc9f26b, 0x59c8f5, 0xffc53d, 0xff6b5e, 0x7c6cf6, 0xffffff];
		for (let i = 0; i < 9; i++) {
			const crystal = new THREE.Mesh(
				new THREE.OctahedronGeometry(0.26 + Math.random() * 0.22),
				new THREE.MeshStandardMaterial({
					color: colors[i % colors.length],
					emissive: colors[i % colors.length],
					emissiveIntensity: 0.35,
					roughness: 0.2,
					metalness: 0.4,
					transparent: true,
					opacity: 0.95
				})
			);
			const angle = (i / 9) * Math.PI * 2;
			crystal.position.set(Math.cos(angle) * (2.2 + (i % 3) * 0.9), Math.sin(i * 1.7) * 1.6, -1 - (i % 4) * 1.8);
			crystals.add(crystal);
		}
		scene.add(crystals);
		crystalGroup = crystals;

		// star tunnel
		const count = 420;
		const starPos = new Float32Array(count * 3);
		for (let i = 0; i < count; i++) {
			starPos[i * 3] = (Math.random() - 0.5) * 22;
			starPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
			starPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 8;
		}
		const starGeo = new THREE.BufferGeometry();
		starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
		const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xdcffe8, size: 0.075, transparent: true, opacity: 0.8 }));
		scene.add(stars);

		// nebula clouds
		for (let i = 0; i < 3; i++) {
			const cloud = new THREE.Mesh(
				new THREE.SphereGeometry(7 + i * 2, 18, 18),
				new THREE.MeshBasicMaterial({ color: i === 0 ? 0x155c3e : i === 1 ? 0x123f5e : 0x3b2a5e, transparent: true, opacity: 0.1, side: THREE.BackSide })
			);
			cloud.position.set(i * 4 - 4, i * 2 - 2, -14 - i * 3);
			scene.add(cloud);
		}

		let raf = 0;
		const clock = new THREE.Clock();
		function animate() {
			raf = requestAnimationFrame(animate);
			const t = clock.getElapsedTime();
			const now = performance.now();
			stars.position.z = (t * 0.9) % 8;
			if (crystals) {
				crystals.rotation.y = t * 0.12;
				crystals.children.forEach((c, i) => {
					c.rotation.x = t * 0.4 + i;
					c.rotation.y = t * 0.3 + i;
					c.position.y += Math.sin(t * 1.4 + i) * 0.0014;
				});
			}
			if (ship) {
				const boosting = now < boostUntil;
				ship.position.y = -2.1 + Math.sin(t * 1.3) * 0.1 + (boosting ? 0.55 : 0);
				ship.position.z = 1.5 + (boosting ? -1.4 : 0);
				ship.rotation.z = Math.sin(t * 0.9) * 0.05;
				ship.rotation.x = 0.08 + (boosting ? -0.18 : 0);
				if (now < shakeUntil) ship.position.x = (Math.random() - 0.5) * 0.18;
				else ship.position.x = 0;
			}
			renderer.render(scene, camera);
		}
		animate();

		const ro = new ResizeObserver(() => {
			if (!host) return;
			camera.aspect = host.clientWidth / Math.max(1, host.clientHeight);
			camera.updateProjectionMatrix();
			renderer.setSize(host.clientWidth, host.clientHeight);
		});
		ro.observe(host);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			renderer.dispose();
			scene.traverse((o) => {
				if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
					o.geometry.dispose();
					const m = o.material;
					if (Array.isArray(m)) m.forEach((x) => x.dispose());
					else m.dispose();
				}
			});
		};
	});
</script>

<svelte:head><title>Number Nebula · Sabify Arcade</title></svelte:head>

<div class="space-y-3">
	<GameTopBar {game} score={score} {best} status={started ? `Sector ${round} of 10` : 'Mission ready'} />

	<div class="relative overflow-hidden rounded-[2rem] border border-[#1d3b31] bg-[#061a13] text-white shadow-lift">
		<div class="relative h-[min(68vh,620px)] min-h-[480px] w-full">
			<div class="absolute inset-0" bind:this={host}></div>
			<div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#061a13]/70 via-transparent to-[#061a13]/80"></div>

			{#if flash !== 'none'}
				<div class={`pointer-events-none absolute inset-0 ${flash === 'correct' ? 'bg-lime/10' : 'bg-coral/15'} transition`}></div>
			{/if}

			<!-- HUD -->
			<div class="relative z-10 flex items-start justify-between p-4">
				<div class="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 backdrop-blur">
					<p class="text-[0.56rem] font-extrabold uppercase tracking-[0.16em] text-lime">Number Nebula</p>
					<p class="text-[0.64rem] font-bold text-white/50">Sector {round} / 10</p>
				</div>
				<div class="flex items-center gap-2">
					<div class="flex items-center gap-1 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 backdrop-blur">
						{#each Array(3) as _, i}
							<Heart size={15} class={i < shields ? 'text-coral' : 'text-white/20'} fill={i < shields ? 'currentColor' : 'none'} />
						{/each}
					</div>
					{#if started}
						<div class={`flex items-center gap-1.5 rounded-2xl border px-3 py-2 backdrop-blur ${timeLeft <= 5 ? 'border-coral/50 bg-coral/20' : 'border-white/10 bg-black/25'}`}>
							<Timer size={14} class={timeLeft <= 5 ? 'text-coral' : 'text-white/60'} />
							<span class="text-sm font-extrabold">{timeLeft}s</span>
						</div>
					{/if}
				</div>
			</div>

			{#if started}
				<div class="absolute right-4 top-20 z-10 flex flex-col items-end gap-1">
					<span class="pill pill-dark text-[0.6rem]">Combo ×{combo}</span>
					<span class="pill pill-dark text-[0.6rem]"><Zap size={11} /> {score} pts</span>
				</div>
			{/if}

			<!-- start / over overlays -->
			{#if !started && !over}
				<div class="absolute inset-0 z-20 grid place-items-center p-4">
					<div class="w-full max-w-md rounded-[1.75rem] border border-white/15 bg-[#0b2b1f]/80 p-6 text-center backdrop-blur-xl">
						<p class="text-5xl">🚀</p>
						<h1 class="mt-2 display text-2xl font-semibold">Pilot the Atlas-9</h1>
						<p class="mt-1 text-xs leading-relaxed text-white/60">Solve 10 maths puzzles to charge the ship, collect star crystals and survive the nebula. Three shields. Twenty seconds each.</p>
						<button class="btn btn-lime mt-4 w-full" onclick={start}><Play size={16} fill="currentColor" /> Launch mission</button>
						<p class="mt-2 text-[0.6rem] font-bold text-white/35">Use the answer buttons below the ship</p>
					</div>
				</div>
			{/if}

			{#if over}
				<div class="absolute inset-0 z-20 grid place-items-center overflow-y-auto p-3">
					<div class="w-full max-w-lg">
						<GameResult
							title={shields > 0 ? 'Nebula cleared!' : 'Ship disabled — almost!'}
							subtitle={shields > 0 ? 'You made it through all 10 sectors.' : 'You ran out of shields. The nebula is tough today.'}
							{score}
							{xp}
							{best}
							stats={[
								{ label: 'Sectors', value: `${Math.min(round, 10)}/10` },
								{ label: 'Shields left', value: `${Math.max(0, shields)}` },
								{ label: 'Best combo', value: `×${Math.max(1, combo)}` }
							]}
							onreplay={start}
							nextHref="/app/games/memory-match"
						/>
					</div>
				</div>
			{/if}

			<!-- question panel -->
			{#if started && !over}
				<div class="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
					<div class="mx-auto max-w-2xl rounded-[1.5rem] border border-white/15 bg-[#071f17]/85 p-3.5 backdrop-blur-xl sm:p-4">
						<div class="flex items-center justify-between gap-2">
							<p class="text-[0.58rem] font-extrabold uppercase tracking-[0.14em] text-lime">Charge the thrusters</p>
							<span class="text-[0.58rem] font-bold text-white/40">Round {round} · {question.prompt}</span>
						</div>
						<h2 class="display mt-1 text-center text-2xl font-semibold sm:text-3xl">{question.prompt}</h2>
						<div class="mt-3 grid grid-cols-2 gap-2">
							{#each question.options as option}
								<button
									class={`rounded-2xl border-2 px-3 py-2.5 text-base font-extrabold transition sm:py-3 ${
										locked && option === question.answer
											? 'border-lime bg-lime text-ink'
											: locked && option !== question.answer
												? 'border-white/10 bg-white/5 text-white/40'
												: 'border-white/15 bg-white/[0.07] text-white hover:border-lime/60 hover:bg-lime/10'
									}`}
									disabled={locked}
									onclick={() => choose(option)}
								>
									{option}
								</button>
							{/each}
						</div>
						{#if feedback !== 'none'}
							<p class={`mt-2 text-center text-[0.7rem] font-extrabold ${feedback === 'correct' ? 'text-lime' : 'text-coral'}`}>{lastResult}</p>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-wrap items-center justify-between gap-2 px-1 text-[0.64rem] font-bold text-slate">
		<span class="flex items-center gap-1"><Shield size={12} /> Correct answers collect crystals and build your combo.</span>
		<span class="flex items-center gap-1"><RotateCcw size={12} /> Replay to beat your best score.</span>
	</div>
</div>
