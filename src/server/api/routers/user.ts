/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
	createTRPCRouter,
	protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
	me: protectedProcedure.query(async ({ ctx }) => {
		const userRes = await ctx.db.user.findFirst({
			where: { id: ctx.session.user.id },
			select: { nickname: true, UUID: true, subscription: true, balance: true, addedPlayers: true, subscriptionOwner: true, noSubscriptionOwnerYet: true, noPlayersAddedYet: true, expirydate: true, favorite: true, acquired: true, volume: true },
		});

		if ((userRes?.subscription === "MULTI" || userRes?.subscription === "fMULTI" || userRes?.subscription === "MAX" || userRes?.subscription === "fMAX" || userRes?.subscription === "ONE") && userRes?.expirydate && userRes.addedPlayers) {
			
			const date1 = new Date()
			const date2 = userRes.expirydate
			
			if (date2.getTime() < date1.getTime()) {
				if (userRes.subscription === "fMAX" || userRes.subscription === "fMULTI" || userRes.subscription === "MAX" || userRes.subscription === "MULTI") {
					const whoAddedInfo = await ctx.db.user.findFirst({
						where: { nickname: userRes.subscriptionOwner },
						select: { balance: true, subscription: true }
					});

					if (whoAddedInfo && (whoAddedInfo.balance || whoAddedInfo.balance === 0) && whoAddedInfo.subscription) {
						if (whoAddedInfo.balance >= (whoAddedInfo.subscription === "MULTI" ? 24 : 32) && userRes.subscriptionOwner) {
							date1.setMonth(date1.getMonth() + 1)
							await ctx.db.user.update({
								where: { nickname: userRes.subscriptionOwner },
								data: {
									balance: whoAddedInfo.balance - (whoAddedInfo.subscription === "MULTI" ? 24 : 32),
									expirydate: date1
								}
							});
							for (let i = 0; i < userRes.addedPlayers.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userRes.addedPlayers[i] },
									data: {
										expirydate: date1
									}
								});
							}
						} else if(userRes.subscriptionOwner) {
							for (let i = 0; i < userRes.addedPlayers.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userRes.addedPlayers[i] },
									data: {
										subscription: "NO",
										addedPlayers: [],
										subscriptionOwner: null,
										noPlayersAddedYet: []
									}
								});
							}
							for (let i = 0; i < userRes.noPlayersAddedYet.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userRes.noPlayersAddedYet[i] },
									data: {
										noSubscriptionOwnerYet: null,
									}
								});
							}
							await ctx.db.user.update({
								where: { nickname: userRes.subscriptionOwner },
								data: {
									subscription: "NO",
									addedPlayers: [],
									subscriptionOwner: null,
									noPlayersAddedYet: []
								}
							});
						}
					}
				} else if (userRes.subscription === "ONE") {
					if ((userRes.balance || userRes.balance === 0) && userRes.nickname) {
						
						if (userRes.balance >= 16) {
							await ctx.db.user.update({
								where: { nickname: userRes.nickname },
								data: {
									expirydate: date1,
									balance: userRes.balance - 16
								}
							});
						} else {
							await ctx.db.user.update({
								where: { nickname: userRes.nickname },
								data: {
									subscription: "NO",
								}
							});
						}
					}
				}
			}
		}
		return userRes
	}),
});
