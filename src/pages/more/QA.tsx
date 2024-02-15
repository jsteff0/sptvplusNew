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
						<button onClick={() => switchDark()} id="theme-toggle" type="button" className="text-white hover:bg-[#151515] hover:shadow-xl shadow-inner rounded-lg text-sm p-1.5 ease-out duration-100">
							<svg id="theme-toggle-dark-icon" className={`${localStorage.getItem('dark-mode') === 'true' || (!('dark-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) ? "hidden" : ""} w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
							<svg id="theme-toggle-light-icon" className={`${localStorage.getItem('dark-mode') === 'true' || (!('dark-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) ? "" : "hidden"} w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
						</button>
					</header>
					<main className="flex flex-col items-center flex-auto pt-[75px] px-[25px] gap-4 bg-white dark:bg-[#0a0a0a]">
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

function switchDark() {
	if (typeof window === "object") {

		const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
		const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
		if (themeToggleDarkIcon && themeToggleLightIcon) {
			if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
				themeToggleLightIcon.classList.add('hidden');
				themeToggleDarkIcon.classList.remove('hidden');
			} else {
				themeToggleDarkIcon.classList.add('hidden');
				themeToggleLightIcon.classList.remove('hidden');
			}
			const themeToggleBtn = document.getElementById('theme-toggle');
			if (themeToggleBtn) {
				if (localStorage.getItem('color-theme')) {
					if (localStorage.getItem('color-theme') === 'light') {
						document.documentElement.classList.add('dark');
						localStorage.setItem('color-theme', 'dark');
					} else {
						document.documentElement.classList.remove('dark');
						localStorage.setItem('color-theme', 'light');
					}
				} else {
					if (document.documentElement.classList.contains('dark')) {
						document.documentElement.classList.remove('dark');
						localStorage.setItem('color-theme', 'light');
					} else {
						document.documentElement.classList.add('dark');
						localStorage.setItem('color-theme', 'dark');
					}
				}
			}
		}
	}
}
