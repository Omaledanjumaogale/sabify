<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	let host: HTMLDivElement;
	let failed = $state(false);

	onMount(() => {
		if (!host) return;
		let renderer: THREE.WebGLRenderer;
		try {
			renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
		} catch {
			failed = true;
			return;
		}
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(host.clientWidth, host.clientHeight);
		host.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 100);
		camera.position.set(0, 0.4, 7.6);

		const group = new THREE.Group();
		scene.add(group);

		const core = new THREE.Mesh(
			new THREE.IcosahedronGeometry(1.35, 1),
			new THREE.MeshStandardMaterial({ color: 0xc9f26b, roughness: 0.35, metalness: 0.15, emissive: 0x1d5c2f, emissiveIntensity: 0.35 })
		);
		group.add(core);

		const wire = new THREE.Mesh(
			new THREE.IcosahedronGeometry(1.62, 1),
			new THREE.MeshBasicMaterial({ color: 0x0d3b2a, wireframe: true, transparent: true, opacity: 0.28 })
		);
		group.add(wire);

		const ringA = new THREE.Mesh(
			new THREE.TorusGeometry(2.5, 0.035, 12, 120),
			new THREE.MeshBasicMaterial({ color: 0x0d3b2a, transparent: true, opacity: 0.3 })
		);
		ringA.rotation.x = Math.PI / 2.35;
		group.add(ringA);

		const ringB = new THREE.Mesh(
			new THREE.TorusGeometry(3.15, 0.025, 12, 140),
			new THREE.MeshBasicMaterial({ color: 0xffc53d, transparent: true, opacity: 0.6 })
		);
		ringB.rotation.x = Math.PI / 1.75;
		ringB.rotation.z = 0.5;
		group.add(ringB);

		const orbiters: { mesh: THREE.Mesh; radius: number; speed: number; offset: number }[] = [];
		const palette = [0xffc53d, 0x59c8f5, 0xff6b5e, 0xffffff, 0x7c6cf6];
		for (let i = 0; i < 7; i++) {
			const radius = 2.1 + (i % 4) * 0.42;
			const geo =
				i % 3 === 0
					? new THREE.BoxGeometry(0.32, 0.32, 0.32)
					: i % 3 === 1
						? new THREE.SphereGeometry(0.19, 18, 18)
						: new THREE.OctahedronGeometry(0.24);
			const mesh = new THREE.Mesh(
				geo,
				new THREE.MeshStandardMaterial({ color: palette[i % palette.length], roughness: 0.3, metalness: 0.25 })
			);
			group.add(mesh);
			orbiters.push({ mesh, radius, speed: 0.18 + i * 0.04, offset: (i / 7) * Math.PI * 2 });
		}

		const starGeo = new THREE.BufferGeometry();
		const positions = new Float32Array(240 * 3);
		for (let i = 0; i < 240; i++) {
			positions[i * 3] = (Math.random() - 0.5) * 18;
			positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
			positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;
		}
		starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		const stars = new THREE.Points(
			starGeo,
			new THREE.PointsMaterial({ color: 0x0d3b2a, size: 0.035, transparent: true, opacity: 0.45 })
		);
		scene.add(stars);

		scene.add(new THREE.AmbientLight(0xffffff, 1.5));
		const key = new THREE.DirectionalLight(0xffffff, 2.2);
		key.position.set(4, 6, 5);
		scene.add(key);
		const rim = new THREE.PointLight(0xffc53d, 8, 18);
		rim.position.set(-4, -2, 4);
		scene.add(rim);

		let mouseX = 0;
		let mouseY = 0;
		let targetX = 0;
		let targetY = 0;
		function pointer(e: PointerEvent) {
			const rect = host.getBoundingClientRect();
			mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
			mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
		}
		window.addEventListener('pointermove', pointer);

		let raf = 0;
		const clock = new THREE.Clock();
		function animate() {
			raf = requestAnimationFrame(animate);
			const t = clock.getElapsedTime();
			targetX += (mouseX * 0.22 - targetX) * 0.04;
			targetY += (mouseY * 0.16 - targetY) * 0.04;

			group.rotation.y = t * 0.16 + targetX;
			group.rotation.x = Math.sin(t * 0.3) * 0.08 + targetY * 0.4;
			core.rotation.y = t * 0.25;
			core.position.y = Math.sin(t * 0.9) * 0.1;
			wire.rotation.y = -t * 0.18;
			ringA.rotation.z = t * 0.08;
			ringB.rotation.z = 0.5 - t * 0.05;

			for (const o of orbiters) {
				const angle = t * o.speed + o.offset;
				const tilt = Math.sin(o.offset) * 0.55;
				o.mesh.position.set(Math.cos(angle) * o.radius, Math.sin(angle * 1.3 + o.offset) * 0.85 + tilt, Math.sin(angle) * o.radius * 0.55);
				o.mesh.rotation.x = t * 0.6 + o.offset;
				o.mesh.rotation.y = t * 0.4;
			}
			stars.rotation.y = t * 0.012;
			renderer.render(scene, camera);
		}
		animate();

		function resize() {
			if (!host) return;
			const w = host.clientWidth;
			const h = host.clientHeight;
			if (w === 0 || h === 0) return;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h);
		}
		const ro = new ResizeObserver(resize);
		ro.observe(host);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('pointermove', pointer);
			ro.disconnect();
			renderer.dispose();
			scene.traverse((obj) => {
				if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
					obj.geometry.dispose();
					const mat = obj.material;
					if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
					else mat.dispose();
				}
			});
			if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
		};
	});
</script>

<div class="relative h-full w-full" bind:this={host} aria-hidden="true">
	{#if failed}
		<div class="grid h-full place-items-center">
			<div class="floaty grid h-52 w-52 place-items-center rounded-full bg-gradient-to-br from-lime to-[#83e0b0] text-7xl shadow-lift">🪐</div>
		</div>
	{/if}
</div>
