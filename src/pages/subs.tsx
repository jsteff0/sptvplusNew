
import Head from "next/head";
import Footer from "../app/components/footer";
import Header from "../app/components/header";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { useEffect } from "react";

export default function Home() {

	const { data: session } = useSession();
	const { data } = api.user.main.useQuery();
	useEffect(() => {
		if (!data?.nickname || !session?.user.name) {
			setTimeout(() => {
				document.getElementById("sighoutredirect")?.classList.remove("hidden")
				document.getElementById("sighoutredirect")?.classList.add("block")
			}, 3000)
		}
		if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	})
	if (!data?.nickname || !session?.user.name) {
		return (
			<div className="flex justify-center items-center align-middle h-screen w-screen">
				<svg className="animate-spin h-[50px] w-[50px] text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			</div>
		);
	} else {
		return (
			<>
				<Head>
					<title>Подписки</title>
					<link rel="icon" href="/favicon.ico" />
					<meta name="description" content="Добро пожаловать на сайт СПTV+" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				</Head>
				<div className="min-h-screen flex flex-col bg-[#E1E1E1] dark:bg-[#000000]">
					<Header balance={data.balance} subscription={data.subscription} UUID={data.UUID ? `https://api.mineatar.io/face/${data.UUID}` : "/randomguy.png"} nickname={data.nickname}/>
					
					<section id="alert" className="fixed inset-0 overflow-y-auto z-20 hidden">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<div onClick={() => switchWind("alert")} className="fixed inset-0 bg-black bg-opacity-25"></div>
							<div className="w-full max-w-md transform  overflow-hidden rounded-2xl bg-[#272727] p-6 text-left align-middle shadow-xl transition-all z-22">
								<b id="alertTitle" className=" text-white text-[20px] font-['Montserrat']" ></b><br />
								<div id="alertContect" className="mt-4 text-white">

								</div>
								<div className="mt-4 flex justify-end gap-3">
									<button id="alertButton1" onClick={() => switchWind("alert")} className="px-4 py-2 bg-[#373737] rounded-[15px] text-[#ffb300] font-bold">Назад</button>
									<button id="accept" className="px-4 py-2 bg-[#ffb300] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold">Оплатить</button>
								</div>
							</div>
						</div>
					</section>
					<main className="flex flex-col justify-center items-center flex-auto dark:text-white mt-[55px]">
						<span className="font-['Montserrat'] laptop:text-[30px] text-[18px] font-bold  dark:text-white">Подписки СПTV+</span>
						<div className=" flex tablet:flex-row p-10 flex-col laptop:gap-[40px] gap-[15px] items-center ">
							<div className="font-['Montserrat'] laptop:w-[270px] laptop:h-[325px] w-[161px] h-[210px] bg-white dark:bg-[#0F0F0F] shadow-lg laptop:rounded-[40px] rounded-[22px] flex flex-col align-center items-center justify-between laptop:p-[40px]  p-[25px]">
								<span className="laptop:text-[25px] text-[16px] font-bold relative flex flex-col align-center items-center dark:text-white">One</span>
								<span className="laptop:text-[14px] text-[10px] font-light text-center dark:text-white">С этой подпиской, вам будет доступен католог фильмов, сериалов и шоу, раньше остальных</span>
								<button onClick={() => purchaseSub("ONE", data.nickname as string, data.balance, data.subscription as string)} className="text-white dark:text-black w-full py-2 laptop:text-[15px] text-[10px] bg-black dark:bg-white dark:hover:bg-[#ffd000] hover:bg-[#ffd000] dark:hover:text-[#000000] rounded-full transition-all duration-300 ease-in-out">Приобрести за 16АР</button>
							</div>
							<div className="font-['Montserrat'] laptop:w-[300px] laptop:h-[375px] w-[192px] h-[241px] bg-white dark:bg-[#0F0F0F] shadow-lg laptop:rounded-[40px] rounded-[22px] flex flex-col align-center items-center laptop:p-[40px] gap-1 p-[25px] justify-between">
								<span className="laptop:text-[30px] text-[19px] font-bold relative dark:text-white">Max</span>
								<span className="laptop:text-[17px] text-[11px] font-light text-center dark:text-white">Эксклюзивный контент, только в подписке. Вам будет доступен эксклюзивный контент и так же добавление 3 аккаунтов знакомых</span>
								<button onClick={() => purchaseSub("MAX", data.nickname as string, data.balance, data.subscription as string)} className="text-white dark:text-black w-full py-2 laptop:text-[16px] text-[10px] bg-black dark:bg-white dark:hover:bg-[#ffd000] hover:bg-[#ffd000] dark:hover:text-[#000000] rounded-full transition-all duration-300 ease-in-out">Приобрести за 32АР</button>
							</div>
							<div className="font-['Montserrat'] laptop:w-[270px] laptop:h-[325px] w-[161px] h-[210px] bg-white dark:bg-[#0F0F0F] shadow-lg laptop:rounded-[40px] rounded-[22px] flex flex-col align-center items-center laptop:p-[40px] gap-1 p-[25px] justify-between">
								<span className="laptop:text-[25px] text-[16px] font-bold relative flex flex-col align-center items-center dark:text-white">Multi</span>
								<span className="laptop:text-[14px] text-[9.5px] font-light text-center dark:text-white">Поделитесь эмоциями со своими друзьями. Подключите аккаунты своих 3 знакомых, и смотрите вместе</span>
								<button onClick={() => purchaseSub("MULTI", data.nickname as string, data.balance, data.subscription as string)} className=" text-white dark:text-black w-full py-2 laptop:text-[15px] text-[10px] bg-black dark:bg-white dark:hover:bg-[#ffd000] hover:bg-[#ffd000] dark:hover:text-[#000000] rounded-full transition-all duration-300 ease-in-out">Приобрести за 24АР</button>
							</div>
						</div>
						{/*  */}
					</main>
					<Footer/>
				</div>
			</>
		)
	}

}

function purchaseSub(sub: string, nickname: string, balance: number, subNow: string) {
	if (typeof window === "object") {
		
		const alertTitle = document.getElementById(`alertTitle`);
		const alertContect = document.getElementById(`alertContect`);
		const alertButton1 = document.getElementById(`alertButton1`) as HTMLButtonElement;
		const alertButton2 = document.getElementById(`accept`) as HTMLButtonElement;

		//console.log(alertButton2)
		if (alertTitle && alertContect && alertButton1 && alertButton2) {
			if(balance < (sub === "ONE" ? 16 : sub === "MULTI" ? 24 : 32)){
				alertButton2.classList.add("hidden")
				alertTitle.innerHTML = "Недостаточно средств"
				alertContect.innerHTML = `Недостаточно средств, пополните баланс`
				
				switchWind("alert")
				//setTimeout(() => switchWind("alert"), 3000)
			} else if (subNow.includes(sub)) {
				alertTitle.innerHTML = "Уведомление"
				alertContect.innerHTML = `Вы уже имеете подписку ${sub}`
				if(!alertButton2.classList.contains("hidden")){
					alertButton2.classList.add("hidden")
				}
				switchWind("alert")
				//setTimeout(() => switchWind("alert"), 3000)
			} else {
				alertTitle.innerHTML = "Уведомление"
				alertContect.innerHTML = `Вы уверены что хотите приобрести подписку ${sub}</br>После покупки подписки с вашего баланса снимутся ${sub === "ONE" ? 16 : sub === "MULTI" ? 24 : 32} АР`
				alertButton2.classList.remove("hidden")
				alertButton2.onclick = async function () {
					const data = { "nickname": nickname, "subscriprion": sub, "balance": balance }
					alertButton2.disabled = true
					alertButton1.disabled = true
					alertButton2.innerText = "Обработка"
					await fetch("/api/subscriprion/buy", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(data)
					}).then((response) => {
						return response.json();
					}).then((data: { code: number }) => {
						if (data.code === 1) {
							location.reload()
						} else {
							//alertButton1.disabled = false
							alertTitle.innerHTML = "Ошибка"
							alertContect.innerHTML = `Сообщите drdro20. Извините за неудобства`

							//setTimeout(() => switchWind("alert"), 3000)
						}
					})
				}
				switchWind("alert")
			}
		}
	}
}
function switchWind(BlockId: string) {
	if (typeof window === "object") {
		const element = document.getElementById(`${BlockId}`);
		if (element) {
			if (element.className.includes("hidden")) {
				element.classList.remove("hidden");
			} else {
				element.classList.add("hidden");
			}
		}
	}
}
export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {

	const session = await getServerAuthSession(ctx);

	if (!session) {
		return {
			redirect: { destination: "/auth/signin" },
			props: {}
		}
	}


	return {
		props: {  }
	}
}