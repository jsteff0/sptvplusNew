import EasyYandexS3 from 'easy-yandex-s3'
import { GetServerSideProps } from 'next';
//import path from 'path';
import { env } from "~/env.mjs";

// Инициализация
interface news {
	news: Array<{ text: string, img: string }>;
	newsVideo: Array<{ url: string, name: string, png: string }>;
	mainNews: { title: string, text: string, img: string }
}
export default function Home() {
	return (
		<>
			<button className='text-white' onClick={async () => {
				
			}}>click</button>
			asdfghjkl
		</>
	)
}
export const getServerSideProps: GetServerSideProps = async () => {
	const s3 = new EasyYandexS3({
		auth: {
			accessKeyId: env.NEXT_PUBLIC_AWS_USER_KEY,
			secretAccessKey: env.NEXT_PUBLIC_AWS_USER_SECRET_KEY,
		},
		Bucket: 'sptv-storage', // например, "my-storage",
		debug: true, // Дебаг в консоли, потом можете удалить в релизе
	});
	const inf = await fetch("https://sptv-storage.storage.yandexcloud.net/newsinfo.json")
	const ans = await inf.text()
	const jsonans = JSON.parse(ans) as news
	jsonans.news.push({
		"text":"Телеканал СПtv открыл холдинг платформу для создателей контента","img":"cptvpreates.png"
	})
	const buf = Buffer.from(JSON.stringify(jsonans), 'utf8');
	await s3.Upload(
		{
			buffer: buf,
			name: "newsinfo.json"
		},
		'/'
	)
    .catch(error => console.error(error));
	const inf2 = await fetch("https://sptv-storage.storage.yandexcloud.net/newsinfo.json")
	const ans2 = await inf2.text()
	const jsonans2 = JSON.parse(ans2) as news
	console.log(jsonans2.news)
	return {
		props: {}
	}
}