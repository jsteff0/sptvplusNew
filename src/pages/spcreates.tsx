import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import Footer from "../app/components/footer";

export default function Home() {


	return (
		<>
			<div className="Home bg-[#101010] h-full">
				<Head>
					<title>СП Creators</title>
					<link rel="icon" href="/favicon.ico" />
					<meta name="description" content="Добро пожаловать на сайт СПTV+" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				</Head>
				<div className="min-h-screen flex flex-col">
					<header className="fixed flex justify-between items-center px-8 z-10 w-full h-[55px] bg-[#272727]">
						<Link href="/" className="w-auto h-auto">
							<span className=" text-[#FFE400] font-['Montserrat'] text-[20px] font-extrabold">СП</span>
							<span className=" text-white font-['Montserrat'] text-[20px] font-extrabold text italic">tv+</span>
						</Link>
					</header>
					<main className=" mt-[75px] pb-[20px] flex flex-col items-center align-middle flex-auto gap-4">

						<Image alt="" src={`/icons/creators.svg`} width={292} height={66} />
						<div className="no-scroll-line tablet:w-[360px] tablet:h-[540px] tablet:m-0 m-4 text-black dark:text-white bg-white dark:bg-[#272727] p-8 overflow-scroll rounded-[35px] shadow-lg flex-none ">
							СПtv Creators - это партнёрская программа для авторов, призванная обеспечить техническую и финансовую поддержку. Участники Партнерской программы СПtv Creators могут пользоваться нашими дополнительными ресурсами, монетизировать контент и обращаться за помощью к команде поддержки авторов. Кроме того, партнеры получают долю дохода от показа их контента. Ниже вы найдете подробную информацию о возможностях программы, критериях допуска, а также о том, как подать заявку.<br />
							<br />
							Что нужно, чтобы стать участником?<br />
							Вы должны соблюдать Правила сообщества #СП Чтобы заключить партнерское соглашение, вам необходимо следовать нашим правилам и требованиям, касающимся получения дохода от контента на СПtv+.<br />
							1. Вам нужно проживать в стране подписчиков, где действует Партнерская программа СПtv Creators<br />
							2. Запрещается использование оскорбительных выражений, призывов к действию в сторону реальных игроков/организаций/сообществ.<br />
							3. Вы можете рекламировать в вашем контенте какой либо товар/услугу/объект. Запрещается рекламировать не государственные теллеграм-каналы, YouTube каналы и различные медиа площадки в том случае если эти площадки не относятся непосредственно к участникам вашего проекта. Так же, запрещено рекламировать любые продукты не связанные с СП5 и проекты за настоящую валюту.<br />
						</div>
						<a href="https://docs.google.com/forms/d/e/1FAIpQLSelqiT10IZYGwVL6nOucPWnHi7WaVYZCnKdJ8YqXZThQlfwJg/viewform?usp=sf_link" className="px-7 py-[14px] tablet:px-10 tablet:py-[18px] bg-black dark:bg-white rounded-[40px] justify-center items-center gap-[10px] inline-flex ">
							<div className="text-white dark:text-black text-[16px] tablet:text-[24px] font-medium" >Оставить заявку</div>
						</a>
					</main>
					<Footer/>
				</div>

			</div>

		</>
	);


}

