import { NextRequest, NextResponse } from 'next/server'
import EasyYandexS3 from 'easy-yandex-s3'
import { env } from "~/env.mjs";


export async function POST(request: NextRequest) {
	const data = await request.formData()
	const type: string = data.get('type') as string
	const s3 = new EasyYandexS3({
		auth: {
			accessKeyId: env.AWS_USER_KEY,
			secretAccessKey: env.AWS_USER_SECRET_KEY,
		},
		Bucket: 'sptv-storage', // например, "my-storage",
		debug: true, // Дебаг в консоли, потом можете удалить в релизе
	});
	if (type === "content") {
		const picture: File = data.get('picture') as unknown as File
		const poster: File = data.get('poster') as unknown as File
		const postertext: File = data.get('postertext') as unknown as File

		if (!picture && !poster && !postertext) {
			return NextResponse.json({ success: false })
		}
		const pictureBuf = Buffer.from(await picture.arrayBuffer())
		const posterBuf = Buffer.from(await poster.arrayBuffer())
		const postertextBuf = Buffer.from(await postertext.arrayBuffer())
		const Upload = await s3.Upload(
			[
				{
					buffer: pictureBuf,
					name: picture.name
				},
				{
					buffer: posterBuf,
					name: poster.name
				},
				{
					buffer: postertextBuf,
					name: postertext.name
				},
			],
			'/images/preview/'
		)
		// await promises.writeFile(process.cwd() + `/public/preview/${picture.name}`, Buffer.from(await picture.arrayBuffer()))
		// await promises.writeFile(process.cwd() + `/public/preview/${poster.name}`, Buffer.from(await poster.arrayBuffer()))
		// await promises.writeFile(process.cwd() + `/public/preview/${postertext.name}`, Buffer.from(await postertext.arrayBuffer()))
		console.log(Upload)

		return NextResponse.json({ success: true })
	} else if (type === "news") {
		const file: File = data.get('file') as unknown as File

		if (!file) {
			return NextResponse.json({ success: false })
		}
		const fileBuf = Buffer.from(await file.arrayBuffer())
		const Upload = await s3.Upload(
			{
				buffer: fileBuf,
				name: file.name
			},
			'/images/news/'
		)
		// await promises.writeFile(process.cwd() + `/public/news/${file.name}`, Buffer.from(await file.arrayBuffer()))
		console.log(Upload)

		return NextResponse.json({ success: true })
	}
}