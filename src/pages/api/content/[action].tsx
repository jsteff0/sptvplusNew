/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto';
import { type NextApiRequest, type NextApiResponse } from 'next';
const prisma = new PrismaClient()
export interface NewApiRequest extends NextApiRequest {
	body: {
		nickname: string;
		code: string;
		price: number;
		codetag: string;
		time: number;
		volume: number;
		watched: boolean;
	};
}
export default async function Page(req: NewApiRequest, res: NextApiResponse) {
	try {
		console.log(req.query)
		if (req.query.action === "save") {
			const moreInfo = await prisma.user.findFirst({
				where: {
					nickname: req.body.nickname,
				},
				select: {
					favorite: true,
				}
			})
			if (moreInfo?.favorite) {
				const id = atob(req.body.code).replace("rebmuNtnetnoC", "")
				if (!moreInfo.favorite.includes(parseInt(id))) {
					moreInfo.favorite.push(parseInt(id))
					await prisma.user.update({
						where: {
							nickname: req.body.nickname,
						},
						data: {
							favorite: moreInfo.favorite
						}
					}).then(() => res.status(200).json({ "code": 2, "added": true }))
				} else {
					moreInfo.favorite.splice(moreInfo.favorite.indexOf(parseInt(id), 1))
					await prisma.user.update({
						where: {
							nickname: req.body.nickname,
						},
						data: {
							favorite: moreInfo.favorite
						}
					}).then(() => res.status(200).json({ "code": 2, "added": false }))
				}

			} else {
				res.status(200).json({ "code": 1 });
			}
		} else if (req.query.action === "buy") {
			const moreInfo = await prisma.user.findFirst({
				where: {
					nickname: req.body.nickname,
				},
				select: {
					acquired: true,
					balance: true,
				}
			})
			if (moreInfo?.acquired && moreInfo?.balance) {
				const id = atob(req.body.code).replace("rebmuNtnetnoC", "")
				if (!moreInfo.acquired.includes(parseInt(id))) {
					moreInfo.acquired.push(parseInt(id))
					await prisma.user.update({
						where: {
							nickname: req.body.nickname,
						},
						data: {
							acquired: moreInfo.acquired,
							balance: moreInfo.balance - req.body.price
						}
					}).then(() => res.status(200).json({ "code": 2 }))
				} else {
					res.status(200).json({ "code": 2 })
				}
			} else {
				res.status(200).json({ "code": 1 });
			}
		} else if (req.query.action === "startwatching") {

			const newUUID = randomUUID();
			const upsertView = await prisma.view.upsert({
				where: {
					codetag: req.body.codetag,
					nickname: req.body.nickname,
				},
				create: {
					codetag: req.body.codetag,
					nickname: req.body.nickname,
					key: newUUID,
				},
				update: {
					key: newUUID,
				},
				select: {
					timeKey: true,
				},
			})

			if (upsertView) {
				const playKey = btoa(req.body.codetag + "::" + req.body.nickname + "::" + newUUID);
				res.status(200).json({ "code": 2, "playKey": playKey, "timeKey": upsertView.timeKey });
			} else {
				res.status(200).json({ "code": 1 })
			}
		} else if (req.query.action === "savingupdata") {

			await prisma.user.update({
				where: {
					nickname: req.body.nickname,
				},
				data: {
					volume: req.body.volume,
				}
			})
			if (req.body.watched) {
				// const id = parseInt(atob(req.body.codetag).split("::")[0] as string)
				// await prisma.film.update({
				// 	where: {
				// 		id: id,
				// 	},
				// 	data: {
				// 		watched: ,
				// 	}
				// })
				await prisma.view.update({
					where: {
						codetag: req.body.codetag,
						nickname: req.body.nickname,
					},
					data: {
						timeKey: 0,
						watched: true,
					}
				})
			} else {
				await prisma.view.update({
					where: {
						codetag: req.body.codetag,
						nickname: req.body.nickname,
					},
					data: {
						timeKey: req.body.time,
						watched: false,
					}
				})
			}
			res.status(200).json({ "code": 2 })
		} else {
			res.status(200).json({ "code": 0 })
		}

	}
	catch (error) {
		res.json(error);
		res.status(500).end();
	}


}