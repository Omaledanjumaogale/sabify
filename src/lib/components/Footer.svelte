<script lang="ts">
	import Logo from './Logo.svelte';
	const columns = [
		{
			title: 'Learn',
			links: [
				{ label: 'Subjects', href: '/#subjects' },
				{ label: 'Learning games', href: '/#games' },
				{ label: 'AI study buddy', href: '/app/tutor' },
				{ label: 'Resource library', href: '/app/library' }
			]
		},
		{
			title: 'For grown-ups',
			links: [
				{ label: 'Parents', href: '/parent' },
				{ label: 'Teachers', href: '/teacher' },
				{ label: 'Schools', href: '/#schools' },
				{ label: 'Pricing', href: '/pricing' }
			]
		},
		{
			title: 'Company',
			links: [
				{ label: 'Our story', href: '/#why' },
				{ label: 'Curriculum', href: '/#curriculum' },
				{ label: 'Safety', href: '/#safety' },
				{ label: 'Contact', href: 'mailto:hello@sabify.ng' }
			]
		}
	];
</script>

<footer class="border-t border-[#e8e3d4] bg-[#0b2b1f] text-white">
	<div class="container-page py-14">
		<div class="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
			<div>
				<Logo light size={38} />
				<p class="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
					Nigeria’s gamified learning universe. Built for curious kids, ambitious youths and the teachers and parents who cheer them on.
				</p>
				<div class="mt-5 flex flex-wrap gap-2">
					<span class="pill pill-dark text-[0.62rem]">🇳🇬 NERDC aligned</span>
					<span class="pill pill-dark text-[0.62rem]">🔒 Child-safe AI</span>
					<span class="pill pill-dark text-[0.62rem]">📱 Works offline</span>
				</div>
			</div>
			<div class="grid gap-8 sm:grid-cols-3">
				{#each columns as col}
					<div>
						<p class="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-white/35">{col.title}</p>
						<ul class="mt-3 space-y-2">
							{#each col.links as link}
								<li><a href={link.href} class="text-sm font-semibold text-white/65 transition hover:text-lime">{link.label}</a></li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
		<div class="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
			<p class="text-xs text-white/40">© {new Date().getFullYear()} Sabify Technologies Ltd. All rights reserved.</p>
			<div class="flex flex-wrap gap-4 text-xs font-semibold text-white/45">
				<a href="/pricing" class="hover:text-white">Terms</a>
				<a href="/pricing" class="hover:text-white">Privacy</a>
				<a href="/pricing" class="hover:text-white">Child safety</a>
				<a href="mailto:hello@sabify.ng" class="hover:text-white">hello@sabify.ng</a>
			</div>
		</div>
	</div>
</footer>
