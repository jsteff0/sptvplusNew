import Link from "next/link";
import Head from "next/head";
import Footer from "../../app/components/footer"
import { useEffect } from "react";

export default function Home() {
	useEffect(() => {
		if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	})
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
					<header className="fixed flex justify-between items-center px-8 z-10 w-full h-[55px] bg-[#0f0f0f]">
						<Link href="/" className="w-auto h-auto">
							<span className=" text-[#FFE400] font-['Montserrat'] text-[20px] font-extrabold">СП</span>
							<span className=" text-white font-['Montserrat'] text-[20px] font-extrabold text italic">tv+</span>
						</Link>
					</header>
					<main className="flex flex-col items-center flex-auto pt-[75px] px-[25px] gap-4 ">
						<h1 className="dark:text-white text-[30px] font-['Montserrat'] font-extrabold">Вопросы и ответы</h1>
						<div className="text-black dark:text-white text-wrap mb-[20px] font-['Montserrat']">
							<h1 className="font-medium tablet:text-[20px] text-[14px] "><span className="text-[#FAC301]">{">"}</span> Зачем нужно платить за контент, если можно посмотреть на YouTube?</h1><br />
							<p className="font-extralight tablet:text-[16px] text-[12px]">– В первую очередь подписка на наш сервис даёт возможность монетизировать
								контент авторов в рамках СП5. Некоторые проекты на СПtv+ станут эксклюзивами, которые никогда не
								появятся на YouTube. Так же будет вариант гибридного релиза, когда проект попадает в открытый
								доступ для всех через определённое время после премьеры на нашем сервисе. Оплачивая одну из трёх
								подписок на выбор, вы так же помогаете развитию других проектов различных студий и самого
								стримингового сервиса.
							</p>
							<br />
							<br />
							<h1 className="font-medium tablet:text-[20px] text-[14px] "><span className="text-[#FAC301]">{">"}</span> Как начать пользоваться сервисом?</h1><br />
							<p className="font-extralight tablet:text-[16px] text-[12px]">– Для того что бы начать, вам необходимо авторизоваться через ваш Discord
								аккаунт, (ВАЖНО: Вы должны быть игроком #СП5 и иметь доступ к spworlds.ru) после успешной
								авторизации вам предложат доступ к бесплатному контенту. Что бы получить доктуп к эксклюзивному контенту, вам нужно оформить подписку
							</p>
							<br />
							<br />
							<h1 className="font-medium tablet:text-[20px] text-[14px] "><span className="text-[#FAC301]">{">"}</span> Как оформить подписку?</h1><br />
							<p className="font-extralight tablet:text-[16px] text-[12px]">– Во время приобритения подписки, вам предложат пополнить баланс, после пополнения баланса вы сможете преобрести подписку, если баланс будет при нуле когда наступит время оплаты, у вас закроется доступ ко всему платному контенту если баланс будет на нуле
							</p>
							<br />
							<br />
							<h1 className="font-medium tablet:text-[20px] text-[14px] "><span className="text-[#FAC301]">{">"}</span> Зачем нужно платить за контент, если можно посмотреть на YouTube?</h1><br />
							<p className="font-extralight tablet:text-[16px] text-[12px]">– В первую очередь подписка на наш сервис даёт возможность монетизировать
								контент авторов в рамках СП5. Некоторые проекты на СПtv+ станут эксклюзивами, которые никогда не
								появятся на YouTube. Так же будет вариант гибридного релиза, когда проект попадает в открытый
								доступ для всех через определённое время после премьеры на нашем сервисе. Оплачивая одну из трёх
								подписок на выбор, вы так же помогаете развитию других проектов различных студий и самого
								стримингового сервиса.
							</p>
						</div>
					</main>
					<Footer />
				</div>

			</div>

		</>
	);


}

