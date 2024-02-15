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
						<h1 className="dark:text-white text-[30px] font-['Montserrat'] font-extrabold">Пользовательское соглашение</h1>
						<div className="text-black dark:text-white text-wrap mb-[20px] font-['Montserrat']">
							ДЕНЬГИ НЕ ВЕРНЁМ
						</div>
					</main>
					<Footer />
				</div>

			</div>

		</>
	);


}
