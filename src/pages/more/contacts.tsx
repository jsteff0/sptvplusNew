import Link from "next/link";
import Head from "next/head";
import Footer from "../../app/components/footer"

export default function Home() {

	return (
		<>
			<div className="Home h-full">
				<Head>
					<title>СП Creators</title>
					<link rel="icon" href="/favicon.ico" />
					<meta name="description" content="Добро пожаловать на сайт СПTV+" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				</Head>
				<div className="min-h-screen flex flex-col">
					<header className="fixed flex justify-between items-center px-8 z-10 w-full h-[55px] bg-[#0f0f0f]">
						<Link href="/" className="w-auto h-auto">
							<span className=" text-[#FFE400] font-['Montserrat'] text-[20px] font-extrabold">СП</span>
							<span className=" text-white font-['Montserrat'] text-[20px] font-extrabold text italic">tv+</span>
						</Link>
					</header>
					<main className="flex flex-col items-center flex-auto pt-[75px] px-[25px] gap-4 ">
						<h1 className="dark:text-white text-[30px] font-['Montserrat'] font-extrabold">Контакты</h1>
						<div className="text-black dark:text-white text-wrap mb-[20px] font-['Montserrat']">
							<h1 className="text-[20px] font-medium mt-4">Директорский состав</h1>
							<ol className="list-disc m-4">
								<li>Генеральный Директор СПtv - rConidze<br />
									Дискорд - rconidze<br />
								</li><br />
								<li>Директор СПtv - re1ron<br />
									Дискорд - re1ron<br />
								</li><br />
								<li>Директор СПtv - Vikss_<br />
									Дискорд - viksyara<br />
								</li><br />
							</ol>
							<h1 className="text-[20px] font-medium mt-4">Разработчики</h1>
							<ol className="list-disc m-4">
								<li>Разработчик сайта - DrDro20<br />
									<a href="https://t.me/drdro20">Телеграм - @drdro20</a><br />
									Дискорд - drdro20<br />
								</li><br />
								<li>Дизайнер сайта - re1ron<br />
									Дискорд - re1ron<br />
								</li><br />
								<li>Дизайнер сайта - DrDro20<br />
									<a href="https://t.me/drdro20">Телеграм - @drdro20</a><br />
									Дискорд - drdro20<br />
								</li><br />
							</ol>
							<h1 className="text-[20px] font-medium mt-4">Ссылки</h1>
							<ol className="list-disc m-4">
								<li>
									<Link href="https://www.youtube.com/@sptelevisions">Youtube канал СПtv</Link><br />
								</li><br />
								<li>
									<Link href="https://discord.gg/sn4dgnH">Дискорд СПtv</Link><br />
								</li><br />
								<li>
									<Link href="https://spworlds.ru/">Сайт СП</Link><br />
								</li><br />
							</ol>
						</div>
					</main>
					<Footer />
				</div>

			</div>

		</>
	);


}

