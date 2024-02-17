import { promises } from 'fs'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(request: NextRequest) {
	const data = await request.formData()
	const type: string = data.get('type') as string
	if (type === "content") {
		console.log(1234567890)
		const picture: File | null = data.get('picture') as unknown as File
		const poster: File | null = data.get('poster') as unknown as File
		const postertext: File | null = data.get('postertext') as unknown as File

		if (!picture && !poster && !postertext) {
			return NextResponse.json({ success: false })
		}
		await promises.writeFile(process.cwd() + `/public/preview/${picture.name}`, Buffer.from(await picture.arrayBuffer()))
		await promises.writeFile(process.cwd() + `/public/preview/${poster.name}`, Buffer.from(await poster.arrayBuffer()))
		await promises.writeFile(process.cwd() + `/public/preview/${postertext.name}`, Buffer.from(await postertext.arrayBuffer()))
		console.log(`open ${process.cwd() + `/public/preview/${picture.name}`}, ${process.cwd() + `/public/preview/${poster.name}`} and ${process.cwd() + `/public/preview/${postertext.name}`} to see the uploaded files`)

		return NextResponse.json({ success: true })
	} else if (type === "news") {
		console.log(12345678901)
		const file: File | null = data.get('file') as unknown as File

		if (!file) {
			return NextResponse.json({ success: false })
		}

		await promises.writeFile(process.cwd() + `/public/news/${file.name}`, Buffer.from(await file.arrayBuffer()))
		console.log(`open ${process.cwd() + `/public/news/${file.name}`} to see the uploaded file`)

		return NextResponse.json({ success: true })
	}
}