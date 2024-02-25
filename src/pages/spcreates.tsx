import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import Footer from "../app/components/footer"

export default function Home() {
	return (
		<>
			<div className="Home h-full">
				<Head>
					<title>СПtv+</title>
					<link rel="icon" href="/favicon.ico" />
					<meta name="description" content="Онлайн кинотеатр СПtv+" />
					<meta name="og:image" content={"logoold.png"} />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				</Head>
				<div className="min-h-screen flex flex-col bg-[#E1E1E1] dark:bg-[#000000]">
					<header className="fixed flex justify-between items-center px-8 z-10 w-full h-[55px] bg-[#0f0f0f] ">
						<Link href="/" className="w-auto h-auto">
							<span className=" text-[#FFE400] font-['Montserrat'] text-[20px] font-extrabold">СП</span>
							<span className=" text-white font-['Montserrat'] text-[20px] font-extrabold text italic">tv+</span>
						</Link>
					</header>
					<main className="flex flex-col items-center flex-auto pt-[75px] px-[25px] gap-4 ">
						<Image alt="" src={`/icons/creators.svg`} width={292} height={66} />
						<div className="text-black dark:text-white text-wrap mb-[20px] font-['Montserrat']">
							<p>
								СПtv Creators - это партнёрская программа для авторов, призванная обеспечить техническую и финансовую поддержку. Участники Партнерской программы СПtv Creators могут пользоваться нашими дополнительными ресурсами, монетизировать контент и обращаться за помощью к команде поддержки авторов. Кроме того, партнеры получают долю дохода от показа их контента. Ниже вы найдете подробную информацию о возможностях программы, критериях допуска, а также о том, как подать заявку.<br />
								<br />
								Что нужно, чтобы стать участником?<br />
								Вы должны соблюдать Правила сообщества #СП Чтобы заключить партнерское соглашение, вам необходимо следовать нашим правилам и требованиям, касающимся получения дохода от контента на СПtv+.<br />
							</p>
							<br />
							<ol className="list-disc list-inside">
								<li>Вам нужно проживать в стране подписчиков, где действует Партнерская программа СПtv Creators</li>
								<br />
								<li>Запрещается использование оскорбительных выражений, призывов к действию в сторону реальных игроков/организаций/сообществ.</li>
								<br />
								<li>Вы можете рекламировать в вашем контенте какой либо товар/услугу/объект. Запрещается рекламировать не государственные теллеграм-каналы, YouTube каналы и различные медиа площадки в том случае если эти площадки не относятся непосредственно к участникам вашего проекта. Так же, запрещено рекламировать любые продукты не связанные с СП5 и проекты за настоящую валюту.</li>
							</ol>
						</div>
					</main>
					<Footer />
				</div>

			</div>

		</>
	);


}

