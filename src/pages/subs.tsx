import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";

export default function Home() {

	const { data: session } = useSession();
	const { data } = api.user.me.useQuery();
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
					<title>Главная</title>
					<link rel="icon" href="/favicon.ico" />
					<meta name="description" content="Добро пожаловать на сайт СПTV+" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				</Head>
				<div className="min-h-screen flex flex-col bg-[#E1E1E1] dark:bg-[#000000]">
					<header className="fixed flex justify-between items-center px-8 z-10 w-full h-[55px] bg-[#272727]">
						<Link href="/main" className="w-auto h-auto">
							<span className=" text-[#FFE400] font-['Montserrat'] text-[20px] font-extrabold">СП</span>
							<span className=" text-white font-['Montserrat'] text-[20px] font-extrabold text italic">tv+</span>
						</Link>
						<div className="float-right flex align-center gap-[14px]">
							<div className="flex items-center tablet:gap-2 gap-1">
								<span className="font-['Montserrat'] font-normal tablet:text-[18px] text-[15px] text-white text-center">Баланс: <b>{data.balance}<span className="text-[#FFE400] font-bold"> AP</span></b></span>
								<button onClick={() => switchWind("addMoney")}>
									<Image alt="" src={`/buttons/addbtn.svg`} width={18} height={19}></Image>
								</button>
							</div>
							<a href={`/users/${data.nickname}`}>
								{data.subscription === "MAX" || data.subscription === "fMAX" ? <>
									<Image alt="" src={`/subscriptions/subsmax.svg`} width={11} height={11} className="float-right right-6 top-[8px] rounded absolute "></Image>
								</> : data.subscription === "MULTI" || data.subscription === "fMULTI" ? <>
									<Image alt="" src={`/subscriptions/subsmulti.svg`} width={11} height={11} className="float-right right-6 top-[8px] rounded absolute "></Image>
								</> : data.subscription === "ONE" ? <>
									<Image alt="" src={`/subscriptions/subsone.svg`} width={11} height={11} className="float-right right-6 top-[8px] rounded absolute "></Image>
								</> : <></>}
								<Image width={30} height={30} className="rounded tablet:w-[30px] w-[25px] tablet:h-[30px] h-[25px]" src={data.UUID ? `https://api.mineatar.io/face/${data.UUID}` : "/randomguy.png"} alt="" />
							</a>
						</div>
					</header>
					<section id="addMoney" className="fixed inset-0 overflow-y-auto z-20 hidden">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<div onClick={() => switchWind("alert")} className="fixed inset-0 bg-black bg-opacity-25"></div>
							<div className="w-full max-w-md transform  overflow-hidden rounded-2xl bg-[#272727] p-6 text-left align-middle shadow-xl transition-all z-22">
								<b className=" text-white text-[20px] font-['Montserrat']">Пополнить баланс</b><br />
								<div className="mt-2"><span className="text-white font-['Montserrat']">Баланс: <b>{data.balance} <span className="text-[#FFE400]">AP</span></b></span></div>
								<div className="mt-4">
									<label htmlFor="money" className="text-white font-['Montserrat']">Добавить на баланс:</label><br />
									<input pattern="[0-9]+" type="number" id="money" onChange={(e) => {
										const val = e.currentTarget.value;
										if (parseInt(val) > 500)
											e.currentTarget.value = "500"
										if (!parseInt(val))
											e.currentTarget.value = "0"
										if (val[0] === "0" && val.length > 1 && val[1] !== undefined)
											e.currentTarget.value = val[1]
									}} className="mt-2 rounded-[15px] bg-[#373737] text-white w-full h-[40px] p-4" />
								</div>
								<div className="mt-4 flex justify-end gap-3">
									<button onClick={() => switchWind("addMoney")} className="px-4 py-2 bg-[#373737] rounded-[15px]"><span className="text-[#FFE400] font-bold">Отмена</span></button>
									{/* <button onClick={() => { const element2: HTMLInputElement | null = document.querySelector("#money"); element2 !== null ? AddMoney(parseInt(element2.value), User.nickname) : console.log("noElement2") }} className="w-[100px] h-[40px] bg-[#FFE400] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold" id="mbtn" > Оплатить</button> */}
								</div>
							</div>
						</div>
					</section>
					<section id="alert" className="fixed inset-0 overflow-y-auto z-20 hidden">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<div onClick={() => switchWind("alert")} className="fixed inset-0 bg-black bg-opacity-25"></div>
							<div className="w-full max-w-md transform  overflow-hidden rounded-2xl bg-[#272727] p-6 text-left align-middle shadow-xl transition-all z-22">
								<b id="alertTitle" className=" text-white text-[20px] font-['Montserrat']" ></b><br />
								<div id="alertContect" className="mt-4 text-white">

								</div>
								<div className="mt-4 flex justify-end gap-3">
									<button id="alertButton1" onClick={() => switchWind("alert")} className="px-4 py-2 bg-[#373737] rounded-[15px] text-[#FFE400] font-bold">Отмена</button>
									<button id="alertButton2" className="px-4 py-2 bg-[#FFE400] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold hidden">Оплатить</button>
								</div>
							</div>
						</div>
					</section>
					<main className="flex flex-col justify-center items-center flex-auto dark:text-white mt-[55px]">
						<span className="font-['Montserrat'] laptop:text-[30px] text-[18px] font-bold  dark:text-white">Подписки СПTV+</span>
						<div className=" flex tablet:flex-row p-10 flex-col laptop:gap-[40px] gap-[15px] items-center ">
							<div className="laptop:w-[250px] laptop:h-[325px] w-[161px] h-[210px] bg-white dark:bg-[#0F0F0F] shadow-lg laptop:rounded-[40px] rounded-[22px] flex flex-col align-center items-center justify-between laptop:p-[40px]  p-[25px]">
								<span className="font-['Montserrat'] laptop:text-[25px] text-[16px] font-bold relative flex flex-col align-center items-center dark:text-white">One</span>
								<span className="font-['Montserrat'] laptop:text-[14px] text-[10px] font-light text-center dark:text-white">С этой подпиской, вам будет доступен католог фильмов, сериалов и шоу, раньше остальных</span>
								<button onClick={() => purchaseSub("ONE", data.nickname as string, data.balance, data.subscription as string)} className="text-white dark:text-black laptop:px-[25px] px-[15px] laptop:py-[10px] py-[7.5px] laptop:text-[16px] text-[10px] bg-black dark:bg-white hover:bg-[#ffd000] dark:hover:text-white laptop:hover:px-[30px] hover:px-[17.5px] rounded-full transition-all duration-300 ease-in-out">Приобрести</button>
							</div>
							<div className="laptop:w-[300px] laptop:h-[375px] w-[192px] h-[241px] bg-white dark:bg-[#0F0F0F] shadow-lg laptop:rounded-[40px] rounded-[22px] flex flex-col align-center items-center laptop:p-[40px] gap-1 p-[25px] justify-between">
								<span className="font-['Montserrat'] laptop:text-[30px] text-[19px] font-bold relative dark:text-white">Max</span>
								<span className="font-['Montserrat'] laptop:text-[17px] text-[11px] font-light text-center dark:text-white">Эксклюзивный контент, только в подписке. Вам будет доступен эксклюзивный контент и так же добавление 3 аккаунтов знакомых</span>
								<button onClick={() => purchaseSub("MAX", data.nickname as string, data.balance, data.subscription as string)} className="text-white dark:text-black laptop:px-[25px] px-[15px] laptop:py-[10px] py-[7.5px] laptop:text-[16px] text-[10px] bg-black dark:bg-white hover:bg-[#ffd000] dark:hover:text-white laptop:hover:px-[30px] hover:px-[17.5px] rounded-full transition-all duration-300 ease-in-out">Приобрести</button>
							</div>
							<div className="laptop:w-[250px] laptop:h-[325px] w-[161px] h-[210px] bg-white dark:bg-[#0F0F0F] shadow-lg laptop:rounded-[40px] rounded-[22px] flex flex-col align-center items-center laptop:p-[40px] gap-1 p-[25px] justify-between">
								<span className="font-['Montserrat'] laptop:text-[25px] text-[16px] font-bold relative flex flex-col align-center items-center dark:text-white">Multi</span>
								<span className="font-['Montserrat'] laptop:text-[14px] text-[9.5px] font-light text-center dark:text-white">Поделитесь эмоциями со своими друзьями. Подключите аккаунты своих 3 знакомых, и смотрите вместе</span>
								<button onClick={() => purchaseSub("MULTI", data.nickname as string, data.balance, data.subscription as string)} className=" text-white dark:text-black laptop:px-[25px] px-[15px] laptop:py-[10px] py-[7.5px] laptop:text-[16px] text-[10px] bg-black dark:bg-white hover:bg-[#ffd000] dark:hover:text-white laptop:hover:px-[30px] hover:px-[17.5px] rounded-full transition-all duration-300 ease-in-out">Приобрести</button>
							</div>
						</div>
					</main>
					<footer className="relative z-10 left-0 bottom-0 w-full h-[105px] bg-[#272727] ">
						<div className="flex justify-between ">
							<div className="relative left-[21px] top-[11px] grid grid-flow-col grid-cols-2 grid-rows-4 h-[60px] tablet:h-[83px] w-[130px] tablet:w-[187px]">
								<Link href={`/news`} className="font-['Montserrat'] font-normal text-[10px] tablet:text-[14px] text-white w-auto">Новости</Link>
								<Link href={`/series`} className="font-['Montserrat'] font-normal text-[10px] tablet:text-[14px] text-white w-auto">Сериалы</Link>
								<Link href={`/movies`} className="font-['Montserrat'] font-normal text-[10px] tablet:text-[14px] text-white w-auto">Фильмы</Link>
								<Link href={`/shows`} className="font-['Montserrat'] font-normal text-[10px] tablet:text-[14px] text-white w-auto">Шоу</Link>
								<Link href={`https://discord.gg/ea9ue92MmZ`} className="font-['Montserrat'] font-normal text-[10px] tablet:text-[14px] text-white w-auto">Дискорд</Link>
								<Link href={`https://docs.google.com/forms/d/e/1FAIpQLSelqiT10IZYGwVL6nOucPWnHi7WaVYZCnKdJ8YqXZThQlfwJg/viewform?usp=sf_link`} className="font-['Montserrat'] font-normal text-[10px] tablet:text-[14px] text-white w-auto">СПtvCreators</Link>
							</div>
							<Image src="/logo.svg" width={`100`} height={`100`} className="w-0 tablet:w-[100px] h-0 tablet:h-[100px] mt-[2px]" alt="" />
							<div className="relative right-[21px] top-[21px] grid grid-flow-col grid-cols-1 grid-rows-4 h-[52px] tablet:h-[83px] w-auto">
								<Link href={``} className="font-['Montserrat'] font-normal text-[10px] tablet:text-[14px] text-white w-auto text-right">Ген. Директор: rConidze</Link>
								<Link href={``} className="font-['Montserrat'] font-normal text-[10px] tablet:text-[14px] text-white w-auto text-right">Директора: Vikss_, re1ron</Link>
								<Link href={`https://t.me/DrDroDev`} className="font-['Montserrat'] font-normal text-[10px] tablet:text-[14px] text-white w-auto text-right">Разработчик: Dro20</Link>
							</div>
						</div>
						<span className="absolute font-['Montserrat'] font-bold text-[8px] tablet:text-[12px] text-[#ffffff20] w-auto float-right right-5 top-[85px]">© Все права защищены  2023 СПTV</span>

					</footer>
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
		const alertButton2 = document.getElementById(`alertButton2`) as HTMLButtonElement;
		if (alertTitle && alertContect && alertButton1 && alertButton2) {
			if(balance < (sub === "ONE" ? 16 : sub === "MULTI" ? 24 : 32)){
				alertTitle.innerHTML = "Недостаточно средств"
				alertContect.innerHTML = `Недостаточно средств, пополните баланс`
				switchWind("alert")
				setTimeout(() => switchWind("alert"), 3000)
			} else if (subNow.includes(sub)) {
				alertTitle.innerHTML = "Уведомление"
				alertContect.innerHTML = `Вы уже имеете подписку ${sub}`
				switchWind("alert")
				setTimeout(() => switchWind("alert"), 3000)
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
							alertButton1.disabled = false
							alertTitle.innerHTML = "Ошибка"
							alertContect.innerHTML = `Сообщите drdro20. Извините за неудобства`

							setTimeout(() => switchWind("alert"), 3000)
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
			redirect: { destination: "/signin" },
			props: {}
		}
	}


	return {
		props: {  }
	}
}