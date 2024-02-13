/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { PrismaClient, type Subscription } from '@prisma/client'
import { type NextApiRequest, type NextApiResponse } from 'next';
const prisma = new PrismaClient()
export interface NewApiRequest extends NextApiRequest {
	body: {
		nickname: string;
		amount: number;
		nicknameAdder: string;
		payer: string,
		redirect: string
	};
	json: {
		data: string;
		amount: number;
		payer: string
	}
}
export default async function Page(req: NewApiRequest, res: NextApiResponse) {
	try {

		if (req.query.action === "add") {
			const moreInfoAdder = await prisma.user.findFirst({
				where: {
					nickname: req.body.nicknameAdder,
				},
				select: {
					subscription: true, addedPlayers: true, subscriptionOwner: true, noSubscriptionOwnerYet: true, noPlayersAddedYet: true
				}
			})
			const moreInfoAdding = await prisma.user.findFirst({
				where: {
					nickname: req.body.nickname,
				},
				select: {
					subscription: true, addedPlayers: true, subscriptionOwner: true, noSubscriptionOwnerYet: true, noPlayersAddedYet: true
				}
			})
			if (!moreInfoAdder || !moreInfoAdding) {
				res.status(200).json({ "code": 2 });
			} else if (moreInfoAdding.subscription !== 'NO') {
				res.status(200).json({ "code": 4 });
			} else if (moreInfoAdding.noSubscriptionOwnerYet || moreInfoAdding.subscriptionOwner) {
				res.status(200).json({ "code": 3 });
			} else {
				moreInfoAdder.noPlayersAddedYet.push(req.body.nickname)
				moreInfoAdding.noSubscriptionOwnerYet = req.body.nicknameAdder
				await prisma.user.update({
					where: {
						nickname: req.body.nickname,
					},
					data: {
						noSubscriptionOwnerYet: req.body.nicknameAdder
					}
				})
				await prisma.user.update({
					where: {
						nickname: req.body.nicknameAdder,
					},
					data: {
						noPlayersAddedYet: moreInfoAdder.noPlayersAddedYet
					}
				})
				res.status(200).json({ "code": 1 });
			}
		} else if (req.query.action === "delete" || req.query.action === "cancelSub") {
			const moreInfoAdder = await prisma.user.findFirst({
				where: {
					nickname: req.body.nicknameAdder,
				},
				select: {
					subscription: true, addedPlayers: true, subscriptionOwner: true, noSubscriptionOwnerYet: true, noPlayersAddedYet: true
				}
			})
			const moreInfoDeleting = await prisma.user.findFirst({
				where: {
					nickname: req.body.nickname,
				},
				select: {
					subscription: true, addedPlayers: true, subscriptionOwner: true, noSubscriptionOwnerYet: true, noPlayersAddedYet: true
				}
			})
			if (!moreInfoAdder || !moreInfoDeleting) {
				res.status(200).json({ "code": 2 });
			} else {


				moreInfoAdder.addedPlayers.splice(moreInfoAdder.addedPlayers.indexOf(req.body.nickname), 1)
				moreInfoAdder.addedPlayers.map(async (item) => {

					await prisma.user.update({
						where: {
							nickname: item,
						},
						data: {
							addedPlayers: moreInfoAdder.addedPlayers
						}
					})
				})

				await prisma.user.update({
					where: {
						nickname: req.body.nicknameAdder,
					},
					data: {
						addedPlayers: moreInfoAdder.addedPlayers
					}
				})

				await prisma.user.update({
					where: {
						nickname: req.body.nickname,
					},
					data: {
						noSubscriptionOwnerYet: null,
						subscriptionOwner: null,
						subscription: "NO",
						noPlayersAddedYet: [],
						addedPlayers: [],
						expirydate: null
					}
				})

				res.status(200).json({ "code": 1 });
			}
		} else if (req.query.action === "cancle" || req.query.action === "decline") {
			const moreInfoAdder = await prisma.user.findFirst({
				where: {
					nickname: req.body.nicknameAdder,
				},
				select: {
					subscription: true, addedPlayers: true, subscriptionOwner: true, noSubscriptionOwnerYet: true, noPlayersAddedYet: true
				}
			})
			const moreInfoCanceling = await prisma.user.findFirst({
				where: {
					nickname: req.body.nickname,
				},
				select: {
					subscription: true
				}
			})
			if (!moreInfoAdder || !moreInfoCanceling) {
				res.status(200).json({ "code": 2 });
			} else {
				moreInfoAdder.noPlayersAddedYet.splice(moreInfoAdder.noPlayersAddedYet.indexOf(req.body.nickname), 1)
				await prisma.user.update({
					where: {
						nickname: req.body.nicknameAdder,
					},
					data: {
						noPlayersAddedYet: moreInfoAdder.noPlayersAddedYet
					}
				})
				await prisma.user.update({
					where: {
						nickname: req.body.nickname,
					},
					data: {
						noSubscriptionOwnerYet: null
					}
				})

				res.status(200).json({ "code": 1 });
			}
		} else if (req.query.action === "accept") {
			const moreInfoAdder = await prisma.user.findFirst({
				where: {
					nickname: req.body.nicknameAdder,
				},
				select: {
					subscription: true, addedPlayers: true, subscriptionOwner: true, noSubscriptionOwnerYet: true, noPlayersAddedYet: true, expirydate: true
				}
			})
			const moreInfoCanceling = await prisma.user.findFirst({
				where: {
					nickname: req.body.nickname,
				},
				select: {
					subscription: true
				}
			})
			if (!moreInfoAdder || !moreInfoCanceling) {
				res.status(200).json({ "code": 2 });
			} else {
				moreInfoAdder.noPlayersAddedYet.splice(moreInfoAdder.noPlayersAddedYet.indexOf(req.body.nickname), 1)
				moreInfoAdder.addedPlayers.push(req.body.nickname)
				moreInfoAdder.addedPlayers.map(async (item) => {

					await prisma.user.update({
						where: {
							nickname: item,
						},
						data: {
							addedPlayers: moreInfoAdder.addedPlayers,
						}
					})
				})
				await prisma.user.update({
					where: {
						nickname: req.body.nicknameAdder,
					},
					data: {
						addedPlayers: moreInfoAdder.addedPlayers,
						noPlayersAddedYet: moreInfoAdder.noPlayersAddedYet
					}
				})
				await prisma.user.update({
					where: {
						nickname: req.body.nickname,
					},
					data: {
						noSubscriptionOwnerYet: null,
						subscriptionOwner: req.body.nicknameAdder,
						subscription: "f" + moreInfoAdder.subscription as Subscription,
						expirydate: moreInfoAdder.expirydate,
					}
				})

				res.status(200).json({ "code": 1 });
			}
		} else if (req.query.action === "getMoneyUrl") {
			// console.log(req.body.nickname +"::"+ (new Date().toISOString()), req.body.amount,)
			// console.log(req.body.redirect)
			const request = await fetch(`http://82.97.243.67:8080/getUrlToPay?amount=${req.body.amount}&data=${req.body.nickname +"::"+ (new Date().toISOString())}&redirect=${req.body.redirect}`, { method: 'GET' })
			const url = await request.text()
			res.status(200).json({ "url": url });
		} else if (req.query.action === "moneywebhook") {
		}
	}
	catch (error) {
		res.json(error);
		res.status(500).end();
	}


}