/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
	createTRPCRouter,
	protectedProcedure,
} from "~/server/api/trpc";
export const userRouter = createTRPCRouter({
	main: protectedProcedure.query(async ({ ctx }) => {
		const userRes = await ctx.db.user.findFirst({
			where: { id: ctx.session.user.id },
			select: { nickname: true, UUID: true, subscription: true, balance: true, management: true },
		});
		const userAdded = await ctx.db.user.findFirst({
			where: { id: ctx.session.user.id },
			select: { nickname: true, subscription: true, balance: true, addedPlayers: true, subscriptionOwner: true, noSubscriptionOwnerYet: true, noPlayersAddedYet: true, expirydate: true },
		});
		if (userAdded && userAdded.expirydate && userAdded.subscription != "NO" &&  userAdded.expirydate.getTime() < new Date().getTime()) {
			const date1 = new Date()
			const date2 = userAdded.expirydate
			if ((userAdded?.subscription === "MULTI" || userAdded?.subscription === "fMULTI" || userAdded?.subscription === "MAX" || userAdded?.subscription === "fMAX" || userAdded?.subscription === "ONE") && userAdded?.expirydate && userAdded.addedPlayers && date2.getTime() < date1.getTime()) {
				if (userAdded.subscription === "fMAX" || userAdded.subscription === "fMULTI" || userAdded.subscription === "MAX" || userAdded.subscription === "MULTI") {
					const whoAddedInfo = await ctx.db.user.findFirst({
						where: { nickname: userAdded.subscriptionOwner },
						select: { balance: true, subscription: true }
					});
					if (whoAddedInfo && (whoAddedInfo.balance || whoAddedInfo.balance === 0) && whoAddedInfo.subscription) {
						if (whoAddedInfo.balance >= (whoAddedInfo.subscription === "MULTI" ? 24 : 32) && userAdded.subscriptionOwner) {
							date1.setMonth(date1.getMonth() + 1)
							await ctx.db.user.update({
								where: { nickname: userAdded.subscriptionOwner },
								data: {
									balance: whoAddedInfo.balance - (whoAddedInfo.subscription === "MULTI" ? 24 : 32),
									expirydate: date1
								}
							});
							for (let i = 0; i < userAdded.addedPlayers.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userAdded.addedPlayers[i] },
									data: {
										expirydate: date1
									}
								});
							}
						} else if (userAdded.subscriptionOwner) {
							for (let i = 0; i < userAdded.addedPlayers.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userAdded.addedPlayers[i] },
									data: {
										subscription: "NO",
										addedPlayers: [],
										subscriptionOwner: null,
										noPlayersAddedYet: []
									}
								});
							}
							for (let i = 0; i < userAdded.noPlayersAddedYet.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userAdded.noPlayersAddedYet[i] },
									data: {
										noSubscriptionOwnerYet: null,
									}
								});
							}
							await ctx.db.user.update({
								where: { nickname: userAdded.subscriptionOwner },
								data: {
									subscription: "NO",
									addedPlayers: [],
									subscriptionOwner: null,
									noPlayersAddedYet: []
								}
							});
						}
					}
				} else if (userAdded.subscription === "ONE") {
					if ((userAdded.balance || userAdded.balance === 0) && userAdded.nickname) {
						if (userAdded.balance >= 16) {
							await ctx.db.user.update({
								where: { nickname: userAdded.nickname },
								data: {
									expirydate: date1,
									balance: userAdded.balance - 16
								}
							});
						} else {
							await ctx.db.user.update({
								where: { nickname: userAdded.nickname },
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
	fulluserinfo: protectedProcedure.query(async ({ ctx }) => {
		const userRes = await ctx.db.user.findFirst({
			where: { id: ctx.session.user.id },
			select: { nickname: true, UUID: true, subscription: true, balance: true, addedPlayers: true, subscriptionOwner: true, noSubscriptionOwnerYet: true, noPlayersAddedYet: true, expirydate: true, fav: true, acq: true, management: true },
		});
		const userAdded = await ctx.db.user.findFirst({
			where: { id: ctx.session.user.id },
			select: { nickname: true, subscription: true, balance: true, addedPlayers: true, subscriptionOwner: true, noSubscriptionOwnerYet: true, noPlayersAddedYet: true, expirydate: true },
		});
		if (userAdded && userAdded.expirydate) {
			const date1 = new Date()
			const date2 = userAdded.expirydate
			if ((userAdded?.subscription === "MULTI" || userAdded?.subscription === "fMULTI" || userAdded?.subscription === "MAX" || userAdded?.subscription === "fMAX" || userAdded?.subscription === "ONE") && userAdded?.expirydate && userAdded.addedPlayers && date2.getTime() < date1.getTime()) {
				if (userAdded.subscription === "fMAX" || userAdded.subscription === "fMULTI" || userAdded.subscription === "MAX" || userAdded.subscription === "MULTI") {
					const whoAddedInfo = await ctx.db.user.findFirst({
						where: { nickname: userAdded.subscriptionOwner },
						select: { balance: true, subscription: true }
					});
					if (whoAddedInfo && (whoAddedInfo.balance || whoAddedInfo.balance === 0) && whoAddedInfo.subscription) {
						if (whoAddedInfo.balance >= (whoAddedInfo.subscription === "MULTI" ? 24 : 32) && userAdded.subscriptionOwner) {
							date1.setMonth(date1.getMonth() + 1)
							await ctx.db.user.update({
								where: { nickname: userAdded.subscriptionOwner },
								data: {
									balance: whoAddedInfo.balance - (whoAddedInfo.subscription === "MULTI" ? 24 : 32),
									expirydate: date1
								}
							});
							for (let i = 0; i < userAdded.addedPlayers.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userAdded.addedPlayers[i] },
									data: {
										expirydate: date1
									}
								});
							}
						} else if (userAdded.subscriptionOwner) {
							for (let i = 0; i < userAdded.addedPlayers.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userAdded.addedPlayers[i] },
									data: {
										subscription: "NO",
										addedPlayers: [],
										subscriptionOwner: null,
										noPlayersAddedYet: []
									}
								});
							}
							for (let i = 0; i < userAdded.noPlayersAddedYet.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userAdded.noPlayersAddedYet[i] },
									data: {
										noSubscriptionOwnerYet: null,
									}
								});
							}
							await ctx.db.user.update({
								where: { nickname: userAdded.subscriptionOwner },
								data: {
									subscription: "NO",
									addedPlayers: [],
									subscriptionOwner: null,
									noPlayersAddedYet: []
								}
							});
						}
					}
				} else if (userAdded.subscription === "ONE") {
					if ((userAdded.balance || userAdded.balance === 0) && userAdded.nickname) {
						if (userAdded.balance >= 16) {
							await ctx.db.user.update({
								where: { nickname: userAdded.nickname },
								data: {
									expirydate: date1,
									balance: userAdded.balance - 16
								}
							});
						} else {
							await ctx.db.user.update({
								where: { nickname: userAdded.nickname },
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
	contentinfo: protectedProcedure.query(async ({ ctx }) => {
		const userRes = await ctx.db.user.findFirst({
			where: { id: ctx.session.user.id },
			select: { nickname: true, UUID: true, subscription: true, balance: true, fav: true, acq: true, volume: true, management: true },
		});
		const userAdded = await ctx.db.user.findFirst({
			where: { id: ctx.session.user.id },
			select: { nickname: true, subscription: true, balance: true, addedPlayers: true, subscriptionOwner: true, noSubscriptionOwnerYet: true, noPlayersAddedYet: true, expirydate: true },
		});
		if (userAdded && userAdded.expirydate) {
			const date1 = new Date()
			const date2 = userAdded.expirydate
			if ((userAdded?.subscription === "MULTI" || userAdded?.subscription === "fMULTI" || userAdded?.subscription === "MAX" || userAdded?.subscription === "fMAX" || userAdded?.subscription === "ONE") && userAdded?.expirydate && userAdded.addedPlayers && date2.getTime() < date1.getTime()) {
				if (userAdded.subscription === "fMAX" || userAdded.subscription === "fMULTI" || userAdded.subscription === "MAX" || userAdded.subscription === "MULTI") {
					const whoAddedInfo = await ctx.db.user.findFirst({
						where: { nickname: userAdded.subscriptionOwner },
						select: { balance: true, subscription: true }
					});
					if (whoAddedInfo && (whoAddedInfo.balance || whoAddedInfo.balance === 0) && whoAddedInfo.subscription) {
						if (whoAddedInfo.balance >= (whoAddedInfo.subscription === "MULTI" ? 24 : 32) && userAdded.subscriptionOwner) {
							date1.setMonth(date1.getMonth() + 1)
							await ctx.db.user.update({
								where: { nickname: userAdded.subscriptionOwner },
								data: {
									balance: whoAddedInfo.balance - (whoAddedInfo.subscription === "MULTI" ? 24 : 32),
									expirydate: date1
								}
							});
							for (let i = 0; i < userAdded.addedPlayers.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userAdded.addedPlayers[i] },
									data: {
										expirydate: date1
									}
								});
							}
						} else if (userAdded.subscriptionOwner) {
							for (let i = 0; i < userAdded.addedPlayers.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userAdded.addedPlayers[i] },
									data: {
										subscription: "NO",
										addedPlayers: [],
										subscriptionOwner: null,
										noPlayersAddedYet: []
									}
								});
							}
							for (let i = 0; i < userAdded.noPlayersAddedYet.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userAdded.noPlayersAddedYet[i] },
									data: {
										noSubscriptionOwnerYet: null,
									}
								});
							}
							await ctx.db.user.update({
								where: { nickname: userAdded.subscriptionOwner },
								data: {
									subscription: "NO",
									addedPlayers: [],
									subscriptionOwner: null,
									noPlayersAddedYet: []
								}
							});
						}
					}
				} else if (userAdded.subscription === "ONE") {
					if ((userAdded.balance || userAdded.balance === 0) && userAdded.nickname) {
						if (userAdded.balance >= 16) {
							await ctx.db.user.update({
								where: { nickname: userAdded.nickname },
								data: {
									expirydate: date1,
									balance: userAdded.balance - 16
								}
							});
						} else {
							await ctx.db.user.update({
								where: { nickname: userAdded.nickname },
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
	management: protectedProcedure.query(async ({ ctx }) => {
		const userRes = await ctx.db.user.findFirst({
			where: { id: ctx.session.user.id },
			select: { nickname: true, UUID: true, subscription: true, balance: true, management: true },
		});
		const userAdded = await ctx.db.user.findFirst({
			where: { id: ctx.session.user.id },
			select: { nickname: true, subscription: true, balance: true, addedPlayers: true, subscriptionOwner: true, noSubscriptionOwnerYet: true, noPlayersAddedYet: true, expirydate: true },
		});
		if (userAdded && userAdded.expirydate) {
			const date1 = new Date()
			const date2 = userAdded.expirydate
			if ((userAdded?.subscription === "MULTI" || userAdded?.subscription === "fMULTI" || userAdded?.subscription === "MAX" || userAdded?.subscription === "fMAX" || userAdded?.subscription === "ONE") && userAdded?.expirydate && userAdded.addedPlayers && date2.getTime() < date1.getTime()) {
				if (userAdded.subscription === "fMAX" || userAdded.subscription === "fMULTI" || userAdded.subscription === "MAX" || userAdded.subscription === "MULTI") {
					const whoAddedInfo = await ctx.db.user.findFirst({
						where: { nickname: userAdded.subscriptionOwner },
						select: { balance: true, subscription: true }
					});
					if (whoAddedInfo && (whoAddedInfo.balance || whoAddedInfo.balance === 0) && whoAddedInfo.subscription) {
						if (whoAddedInfo.balance >= (whoAddedInfo.subscription === "MULTI" ? 24 : 32) && userAdded.subscriptionOwner) {
							date1.setMonth(date1.getMonth() + 1)
							await ctx.db.user.update({
								where: { nickname: userAdded.subscriptionOwner },
								data: {
									balance: whoAddedInfo.balance - (whoAddedInfo.subscription === "MULTI" ? 24 : 32),
									expirydate: date1
								}
							});
							for (let i = 0; i < userAdded.addedPlayers.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userAdded.addedPlayers[i] },
									data: {
										expirydate: date1
									}
								});
							}
						} else if (userAdded.subscriptionOwner) {
							for (let i = 0; i < userAdded.addedPlayers.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userAdded.addedPlayers[i] },
									data: {
										subscription: "NO",
										addedPlayers: [],
										subscriptionOwner: null,
										noPlayersAddedYet: []
									}
								});
							}
							for (let i = 0; i < userAdded.noPlayersAddedYet.length; i++) {
								await ctx.db.user.update({
									where: { nickname: userAdded.noPlayersAddedYet[i] },
									data: {
										noSubscriptionOwnerYet: null,
									}
								});
							}
							await ctx.db.user.update({
								where: { nickname: userAdded.subscriptionOwner },
								data: {
									subscription: "NO",
									addedPlayers: [],
									subscriptionOwner: null,
									noPlayersAddedYet: []
								}
							});
						}
					}
				} else if (userAdded.subscription === "ONE") {
					if ((userAdded.balance || userAdded.balance === 0) && userAdded.nickname) {
						if (userAdded.balance >= 16) {
							await ctx.db.user.update({
								where: { nickname: userAdded.nickname },
								data: {
									expirydate: date1,
									balance: userAdded.balance - 16
								}
							});
						} else {
							await ctx.db.user.update({
								where: { nickname: userAdded.nickname },
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
