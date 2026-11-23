import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const plan = v.union(v.literal('family'), v.literal('family-plus'), v.literal('school'));
const interval = v.union(v.literal('monthly'), v.literal('annual'));
const provider = v.union(v.literal('paystack'), v.literal('transfer'), v.literal('ussd'));

const PRICES = {
	'family': { monthly: 5000, annual: 50000 },
	'family-plus': { monthly: 12000, annual: 120000 },
	'school': { monthly: 3500, annual: 35000 }
} as const;

export const current = query({
	args: { userId: v.id('users') },
	handler: async (ctx, { userId }) => {
		const subs = await ctx.db
			.query('subscriptions')
			.withIndex('by_user', (q) => q.eq('userId', userId))
			.collect();
		return subs.sort((a, b) => b.createdAt - a.createdAt)[0] ?? null;
	}
});

export const invoices = query({
	args: { userId: v.id('users') },
	handler: async (ctx, { userId }) => {
		return await ctx.db
			.query('payments')
			.withIndex('by_user', (q) => q.eq('userId', userId))
			.order('desc')
			.take(24);
	}
});

/** Creates a pending payment. The client then opens Paystack with the returned reference. */
export const startCheckout = mutation({
	args: { userId: v.id('users'), plan, interval, provider },
	handler: async (ctx, { userId, plan, interval, provider }) => {
		const amountNaira = PRICES[plan][interval];
		const reference = `SAB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
		const paymentId = await ctx.db.insert('payments', {
			userId,
			amountNaira,
			status: 'pending',
			provider,
			reference,
			createdAt: Date.now()
		});
		return { paymentId, reference, amountNaira };
	}
});

/** Called by the verified payment webhook after Paystack confirms the charge. */
export const confirmPayment = mutation({
	args: { reference: v.string() },
	handler: async (ctx, { reference }) => {
		const payment = await ctx.db
			.query('payments')
			.withIndex('by_reference', (q) => q.eq('reference', reference))
			.first();
		if (!payment) throw new Error('Unknown payment reference');
		if (payment.status === 'successful') return { alreadyProcessed: true };

		await ctx.db.patch(payment._id, { status: 'successful', paidAt: Date.now() });

		const userId = payment.userId;
		if (!userId) return { alreadyProcessed: false };

		const user = await ctx.db.get(userId);
		await ctx.db.patch(userId, { plan: user?.plan === 'free' ? 'family' : user?.plan ?? 'family' });

		const periodMs = payment.amountNaira > 20_000 ? 365 * 86_400_000 : 30 * 86_400_000;
		const existing = await ctx.db
			.query('subscriptions')
			.withIndex('by_user', (q) => q.eq('userId', userId))
			.collect();
		const active = existing.sort((a, b) => b.createdAt - a.createdAt)[0];

		if (active) {
			await ctx.db.patch(active._id, {
				status: 'active',
				amountNaira: payment.amountNaira,
				provider: payment.provider as 'paystack' | 'transfer' | 'ussd',
				reference,
				currentPeriodEnd: Date.now() + periodMs
			});
		} else {
			await ctx.db.insert('subscriptions', {
				userId,
				plan: 'family',
				amountNaira: payment.amountNaira,
				interval: payment.amountNaira > 20_000 ? 'annual' : 'monthly',
				status: 'active',
				provider: payment.provider as 'paystack' | 'transfer' | 'ussd',
				reference,
				currentPeriodEnd: Date.now() + periodMs,
				createdAt: Date.now()
			});
		}

		await ctx.db.insert('notifications', {
			userId,
			title: 'Subscription active',
			body: `Payment of ₦${payment.amountNaira.toLocaleString('en-NG')} confirmed.`,
			kind: 'billing',
			read: false,
			href: '/parent/billing',
			createdAt: Date.now()
		});
		return { alreadyProcessed: false };
	}
});

export const cancel = mutation({
	args: { userId: v.id('users') },
	handler: async (ctx, { userId }) => {
		const subs = await ctx.db
			.query('subscriptions')
			.withIndex('by_user', (q) => q.eq('userId', userId))
			.collect();
		const active = subs.find((s) => s.status === 'active');
		if (active) await ctx.db.patch(active._id, { status: 'cancelled' });
		return { cancelled: Boolean(active) };
	}
});
