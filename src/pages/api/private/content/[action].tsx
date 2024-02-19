/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ContentTypes, Types, PrismaClient } from '@prisma/client'

import { writeFile } from 'fs/promises' //readFile,
import newsimport from 'newsinfo.json';
import { type NextApiRequest, type NextApiResponse } from 'next';
const prisma = new PrismaClient()
interface newsint {
	news: Array<{ text: string, img: string }>;
	newsVideo: Array<{ url: string, name: string, png: string }>;
	mainNews: { title: string, text: string, img: string }
}
export interface NewApiRequest extends NextApiRequest {
	body: {
		nickname: string;
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
		id: number,
		change: string,
		key: string,
		timing: string,
		rate: number,
		code: string,
	};
}
export default async function Page(req: NewApiRequest, res: NextApiResponse) {
	try {
		console.log(req.query)
		if (req.body.nickname) {

			await prisma.user.findFirst({
				where: {
					nickname: req.body.nickname,
				},
				select: {
					management: true,
				}
			}).then((resp) => {
				console.log(resp)
				if (resp?.management === "NO") {
					res.status(200).json({ "code": 0 })
				}
			})
			if (req.query.action === "add") {
				const moreInfo = await prisma.film.findMany({})
				if (moreInfo) {
					moreInfo.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
					const alreadyLoadedFilm = await prisma.film.findFirst({
						where: {
							name: req.body.name
						}
					})
					if (!alreadyLoadedFilm) {
						let forgottenID = moreInfo.length + 1
						for (let i = 0; i < moreInfo.length; i++) {
							console.log(moreInfo[i]?.id)
							if (moreInfo[i]?.id !== i + 1) {
								forgottenID = i + 1
								break
							}
						}
						console.log(req.body.duration, req.body.genres)
						await prisma.film.create({
							data: {
								id: forgottenID,
								name: req.body.name,
								imgID: (moreInfo.length + 1).toString(),
								content: req.body.type as ContentTypes,
								describe: req.body.smdescribe,
								types: req.body.genres,
								timing: req.body.duration,
								studio: req.body.studio,
								code: btoa(forgottenID + "rebmuNtnetnoC"),
								subscription: parseInt(req.body.subscription.toString()),
								datePremiere: req.body.date,
								price: parseInt(req.body.prise.toString()),
								more: req.body.more,
								youtube: req.body.youtube,
							}
						}).catch((err) => {
							console.log(err);
							res.status(200).json({ "code": 1, "filename": err })
						})
						res.status(200).json({ "code": 2, "filename": forgottenID })
					} else {
						res.status(200).json({ "code": 1, "filename": "name already set up in db" })
					}

				}

				res.status(200).json({ "code": 2 })
			} else if (req.query.action === "addNews") {
				const news = newsimport as newsint

				if (req.body.title && req.body.imgName && req.body.text) {
					news.mainNews.img = req.body.imgName
					news.mainNews.text = req.body.text
					news.mainNews.title = req.body.title
				} else if (req.body.youtube && req.body.imgName) {
					news.newsVideo.push({ url: req.body.youtube, name: req.body.name, png: req.body.imgName })
				} else if (req.body.text && req.body.imgName) {
					news.news.push({ text: req.body.text, img: req.body.imgName })
				} else {
					res.status(200).json({ "code": 1 })
				}
				await writeFile("newsinfo.json", JSON.stringify(news, null, 2))
				res.status(200).json({ "code": 2 })
			} else if (req.query.action === "isShows") {
				if (req.body.name && req.body.change) {
					await prisma.film.update({
						where: {
							name: req.body.name
						},
						data: {
							show: parseInt(req.body.change)
						}
					}).catch((err) => {
						console.log(err);
						res.status(200).json({ "code": 1 })
					})
					res.status(200).json({ "code": req.body.change ? 2 : 3 })
				} else {
					res.status(200).json({ "code": 1 })
				}

			} else if (req.query.action === "addEps") {
				console.log(req.body.name, req.body.timing)
				if (req.body.name && req.body.timing) {
					await prisma.film.update({
						where: {
							name: req.body.name
						},
						data: {
							timing: {
								push: parseInt(req.body.timing),
							}
						}
					}).catch((err) => {
						console.log(err);
						res.status(200).json({ "code": 1 })
					})
					res.status(200).json({ "code": 2 })
				} else {
					res.status(200).json({ "code": 1 })
				}

			} else if (req.query.action === "delete") {

				if (req.body.code && req.body.key) {

					if (atob(req.body.key) === "IASASALBIGBIGCHILEN") {
						console.log(req.body.code)
						await prisma.view.deleteMany({
							where: {
								contentcode: req.body.code
							},
						}).catch((err) => {
							console.log(err);
							res.status(200).json({ "code": 1 })
						})
						await prisma.film.delete({
							where: {
								code: req.body.code
							},
						}).catch((err) => {
							console.log(err);
							res.status(200).json({ "code": 1 })
						})
						res.status(200).json({ "code": 2 })
					} else {
						res.status(200).json({ "code": 3 })
					}
				} else {
					res.status(200).json({ "code": 1 })
				}
			} else if (req.query.action === "loadmainpage") {
				const shows = await prisma.film.findMany({
					where: {
						content: "shows",
						show: 1
					},
					select: {
						imgID: true,
						code: true,
						subscription: true,
						show: true
					},
				})
				const recomendtosee = await prisma.film.findMany({
					where: {
						OR: [
							{
								mark: {
									gte: 3.8,
								},
							},
							{
								mark: {
									equals: 0,
								},
							},
						],
						datePremiere: {
							lte: new Date()
						},
						show: 1,
					},
					select: {
						imgID: true,
						code: true,
						subscription: true,
						show: true,
						describe: true,
					},
				})

				const comingOut = await prisma.film.findMany({
					where: {
						datePremiere: {
							gt: new Date()
						},
						show: 1
					},
					select: {
						imgID: true,
						code: true,
						subscription: true,
						show: true
					},
				})
				const day21before = new Date()
				day21before.setDate(day21before.getDay() - 21)
				const newest = await prisma.film.findMany({
					where: {
						AND: [
							{
								datePremiere: {
									lte: new Date()
								},
							},
							{
								datePremiere: {
									gt: day21before
								},
							},
						],
						show: 1
					},
					select: {
						imgID: true,
						code: true,
						subscription: true,
						show: true
					},
				})
				res.status(200).json({ "newest": newest, "comingOut": comingOut, "recomendtosee": recomendtosee, "shows": shows })
			} else {
				res.status(200).json({ "code": 0 })
			}
		}
	}
	catch (error) {
		res.json(error);
		res.status(500).end();
	}


}