/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Types, PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto';
import { type NextApiRequest, type NextApiResponse } from 'next';
const prisma = new PrismaClient()
export interface NewApiRequest extends NextApiRequest {
	body: {
		imgID: string;
		show: number;
		nickname: string;
		code: string;
		price: number;
		tag: string;
		time: number;
		volume: number;
		watched: boolean;
		name: string;
		studio: string;
		genres: Types[],
		type: string,
		smdescribe: string,
		duration: number[],
		subscription: number,
		date: Date,
		prise: number,
		more: string,
		youtube: string | null,
		text: string | null,
		title: string | null,
		imgName: string | null,
		id: string,
		change: string,
		key: string,
		timing: string,
		rate: number,
		content: { code: string, show: number, imgID: string, subscription: number, price: number },
	};
}
export default async function Page(req: NewApiRequest, res: NextApiResponse) {
	try {
		console.log(req.query)
		if (req.query.action === "save") {
			const mrinf = await prisma.user.findUnique({
				where: {
					nickname: req.body.nickname,
				},
				select: {
					fav: true
				}
			})
			const code = req.body.code
			console.log(code, mrinf)
			if (code && mrinf) {
				if (!mrinf?.fav.includes(code)) {
					mrinf.fav.push(code)
					await prisma.user.update({
						where: {
							nickname: req.body.nickname
						},
						data: {
							fav: mrinf.fav
						},
					}).catch((_err) => res.status(200).json({ "code": 0 }))
					res.status(200).json({ "code": 2, "added": true });
				} else {
					mrinf.fav.splice(mrinf.fav.indexOf(code), 1)
					prisma.user.update({
						where: {
							nickname: req.body.nickname
						},
						data: {
							fav: mrinf.fav
						},
					}).catch((_err) => res.status(200).json({ "code": 0 }))
					res.status(200).json({ "code": 2, "added": false });
				}
			} else {
				res.status(200).json({ "code": 1 });
			}
		} else if (req.query.action === "buy") {
			const mrinf = await prisma.user.findUnique({
				where: {
					nickname: req.body.nickname,
				},
				select: {
					acq: true,
					balance: true,
				}
			})
			const code = req.body.code
			const price = req.body.price
			if (code && mrinf) {
				mrinf.acq.push(code)
				await prisma.user.update({
					where: {
						nickname: req.body.nickname
					},
					data: {
						balance: mrinf.balance - price,
						acq: mrinf.acq
					},
				})
				res.status(200).json({ "code": 2, "added": true });
			} else {
				res.status(200).json({ "code": 1 });
			}
		} else if (req.query.action === "startwatching") {
			if (!req.body.tag.includes("TLR")) {
				const code = req.body.code
				const newUUID = randomUUID();
				const tag = req.body.tag
				const content = await prisma.film.findFirst({
					where: {
						code: code,
					},
				})
				const duration = tag.includes("EPS") ? content?.timing[parseInt(tag.split("EPS")[1] as string)] : content?.timing[0]
				if (duration && content) {
					const upsertView = await prisma.view.upsert({
						where: {
							id: btoa(req.body.nickname + req.body.code + req.body.tag),
							tag: req.body.tag,
							nickname: req.body.nickname,
							contentcode: req.body.code
						},
						create: {
							id: btoa(req.body.nickname + req.body.code + req.body.tag),
							tag: req.body.tag,
							nickname: req.body.nickname,
							contentcode: req.body.code,
							key: newUUID,
							timeKey: 0,
							duration: duration,
						},
						update: {
							key: newUUID,
						},
						select: {
							timeKey: true,
						},
					})
					if (upsertView) {
						const playKey = btoa(JSON.stringify({ "tag": req.body.tag, "code": req.body.code, "nickname": req.body.nickname, "key": newUUID }))
						res.status(200).json({ "code": 2, "playKey": playKey, "timeKey": upsertView.timeKey });
					} else {
						res.status(200).json({ "code": 1 })
					}
				} else {
					res.status(200).json({ "code": 1 })
				}
			} else {
				const playKey = btoa(JSON.stringify({ "tag": req.body.tag, "code": req.body.code, "nickname": req.body.nickname, "key": "newUUID" }))
				res.status(200).json({ "code": 2, "playKey": playKey, "timeKey": 0 });
			}
		} else if (req.query.action === "savingupdata") {
			if (!req.body.tag.includes("TRL")) {
				await prisma.user.update({
					where: {
						nickname: req.body.nickname,
					},
					data: {
						volume: req.body.volume,
					}
				})
				if (req.body.watched) {
					await prisma.film.update({
						where: {
							code: req.body.code,
						},
						data: {
							watched: {
								increment: 1
							},
						}
					}).catch((err) => console.log(err))
				} else {
					await prisma.view.update({
						where: {
							id: btoa(req.body.nickname + req.body.code + req.body.tag),
						},
						data: {
							timeKey: req.body.time,
						}
					}).catch((err) => console.log(err))
				}
				res.status(200).json({ "code": 2 })
			}
		} else if (req.query.action === "mark") {
			if (req.body.rate && req.body.nickname && req.body.id) {
				await prisma.rating.upsert({
					where: {
						id: req.body.id,
						createdByNickname: req.body.nickname,
						idrating: req.body.id + req.body.nickname
					},
					update: {
						mark: req.body.rate,
					},
					create: {
						mark: req.body.rate,
						createdByNickname: req.body.nickname,
						id: req.body.id,
						idrating: req.body.id + req.body.nickname
					},
				})
				const aggregations = await prisma.rating.aggregate({
					where: {
						id: req.body.id
					},
					_avg: {
						mark: true,
					},
				})
				if (aggregations._avg.mark) {
					await prisma.film.update({
						where: {
							code: req.body.id
						},
						data: {
							mark: aggregations._avg.mark
						}
					})
					res.status(200).json({ "code": 2 })
				} else {
					res.status(200).json({ "code": 1 })
				}
			} else {
				res.status(200).json({ "code": 1 })
			}

		} else {
			res.status(200).json({ "code": 0 })
		}

	}
	catch (error) {
		res.json(error);
		res.status(500).end();
	}


}