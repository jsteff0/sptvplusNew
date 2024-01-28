/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import Films from "../components/filmline";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { useRouter } from "next/router";
import { PrismaClient } from '@prisma/client'
import Footer from "../components/footer";
import Header from "../components/header";

interface filmmakers {
	imgID: string;
	code: string;
	subscription: number;
	show: number;
}

export default function Home(props: { favorite: filmmakers[], acquired: filmmakers[] }) {
	const { data: session } = useSession();
	const { data } = api.user.fulluserinfo.useQuery();
	const router = useRouter().query.nick;
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
		console.log(props.favorite)
		return (
			<>
				<Head>
					<title>{router}</title>
					<link rel="icon" href="/favicon.ico" />
					<meta name="description" content="Добро пожаловать на сайт СПTV+" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				</Head>
				<div className="min-h-screen flex flex-col bg-[#E1E1E1] dark:bg-[#000000]">
					<Header balance={data.balance} subscription={data.subscription} UUID={data.UUID ? `https://api.mineatar.io/face/${data.UUID}` : "/randomguy.png"} nickname={data.nickname} />

					<section id="addMoney" className="fixed inset-0 overflow-y-auto z-20 hidden">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<div className="fixed inset-0 bg-black bg-opacity-25"></div>
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
									<button onClick={() => switchWind("addMoney")} className="px-4 py-2 bg-[#373737] rounded-[15px]"><span className="text-[#ffe600d9] font-bold">Отмена</span></button>
									{/* <button onClick={() => { const element2: HTMLInputElement | null = document.querySelector("#money"); element2 !== null ? AddMoney(parseInt(element2.value), User.nickname) : console.log("noElement2") }} className="w-[100px] h-[40px] bg-[#FFE400] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold" id="mbtn" > Оплатить</button> */}
								</div>
							</div>
						</div>
					</section>
					<section id="addPlayer" className="fixed inset-0 overflow-y-auto z-20 hidden">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<div onClick={() => switchWind("addPlayer")} className="fixed inset-0 bg-black bg-opacity-25"></div>
							<div className="w-full max-w-md transform  overflow-hidden rounded-2xl bg-[#272727] p-6 text-left align-middle shadow-xl transition-all z-22">
								<b id="addPlayerTitle" className=" text-white text-[20px] font-['Montserrat']" >Введите ник</b><br />
								<div id="addPlayerContect" className="mt-4 text-white">
									<input type="text" id="nicknameToAdd" placeholder="Ник" onKeyDown={(e) => {
										if (e.key === "Enter" && e.currentTarget.value) {
											addPlayer(data.nickname as string).catch(err => console.log(err));
										}
									}} className="w-full h-[40px] bg-[#313131] p-4 rounded-[15px]" />
								</div>
								<div className="mt-4 flex justify-end gap-3">
									<button id="addPlayerButton1" onClick={() => switchWind("addPlayer")} className="px-4 py-2 bg-[#373737] rounded-[15px] text-[#ffe600d9] font-bold">Отмена</button>
									<button id="addPlayerButton2" onClick={() => {
										addPlayer(data.nickname as string).catch(err => console.log(err));
									}} className="px-4 py-2 bg-[#ffe600d9] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold">Добавить</button>
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

								</div>
							</div>
						</div>
					</section>
					<main className="flex align-middle justify-center flex-auto flex-col items-center dark:text-white mt-[55px]">
						{router === data.nickname ?
							<>
								<div className=' laptop:p-[90px] tablet:p-[30px] p-[0px] pt-[50px]'>
									<div className='flex tablet:flex-row flex-col tablet:items-start items-center gap-6'>
										<Image width={256} height={256} src={`https://visage.surgeplay.com/front/512/${data.UUID}`} className='laptop:w-[256px] w-[192px] relative pt-[24px] px-[12px] bg-[#eeeeee] dark:bg-[#0f0f0f] rounded-[25px]' alt="" />
										<div className='flex flex-col'>
											<p className="dark:text-white text-black font-['Montserrat'] font-bold laptop:text-[32px] tablet:text-[18px] text-[16px] mt-[10px] ">{data.nickname}</p>
											<p className="dark:text-white text-black font-['Montserrat'] font-medium laptop:text-[22px] tablet:text-[16px] text-[14px] mt-[10px] ">Баланс: <b>{data.balance} <span className='text-[#FAC301]'>AP</span></b> </p>
											<div className="dark:text-white text-black font-['Montserrat'] font-medium laptop:text-[22px] tablet:text-[16px] text-[14px] mt-[10px]">
												{data.subscription === "MAX" ? <>
													Ваша подписка: <b>Max</b><br />
													Добавленные игроки в подписку:<br />
													<div className='flex flex-row gap-2 mt-[4px]'>
														{data.noPlayersAddedYet.length > 0 ?
															data.noPlayersAddedYet.map((item) => {
																return (
																	<>
																		<div className="group cursor-pointer mb-5" onClick={() => cancelPlayer(item, data.nickname as string)}>
																			<div className="opacity-30 peer peer-hover:opacity-100">{item}</div>
																			<div className="text-[8px] text-white dark:text-black peer absolute py-1 px-2 bg-[#373737] z-10 opacity-0 peer-hover:opacity-75 ease-in-out duration-300 rounded-full">Данный игрок пока не принял запрос. При нажатии на ник, вы отклоните запрос</div>
																		</div>
																	</>
																)
															})
															: null
														}
														{data.addedPlayers.length > 0 ?
															data.addedPlayers.map((item) => {
																return (
																	<>
																		<div className="group cursor-pointer mb-5" onClick={() => deletePlayer(item, data.nickname as string)}>
																			<div className="peer">{item}</div>
																			<div className="text-[8px] text-white dark:text-black peer absolute py-1 px-2 bg-[#373737] z-10 opacity-0 peer-hover:opacity-75 ease-in-out duration-300 rounded-full">Вы точно хотите удалить данного игрока из подписки?</div>
																		</div>
																	</>
																)
															})
															: null
														}
														{
															Array.from({ length: 3 - data.addedPlayers.length - data.noPlayersAddedYet.length }, (_, _i) => <><button onClick={() => switchWind("addPlayer")}><Image alt="" src={`/buttons/addPlayer.svg`} width={30} height={30} className="ease-out duration-200 opacity-50 hover:opacity-100 rounded" /></button></>)
														}
													</div>
												</> : data.subscription === "MULTI" ? <>
													Ваша подписка: <b>Multi</b><br />
													<span className='text-[16px]'>Добавленые игроки в подписку:</span><br />
													<div className='flex flex-row gap-2 mt-[4px]'>
														{data.noPlayersAddedYet.length > 0 ?
															data.noPlayersAddedYet.map((item) => {
																return (
																	<>
																		<div className="group cursor-pointer mb-5" onClick={() => cancelPlayer(item, data.nickname as string)}>
																			<div className="opacity-30 peer peer-hover:opacity-100">{item}</div>
																			<div className="text-[8px] text-white dark:text-black peer absolute py-1 px-2 bg-[#373737] z-10 opacity-0 peer-hover:opacity-75 ease-in-out duration-300 rounded-full">Данный игрок пока не принял запрос. При нажатии на ник, вы отклоните запрос</div>
																		</div>
																	</>
																)
															})
															: null
														}
														{data.addedPlayers.length > 0 ?
															data.addedPlayers.map((item) => {
																return (
																	<>
																		<div className="group cursor-pointer mb-5" onClick={() => deletePlayer(item, data.nickname as string)}>
																			<div className="peer">{item}</div>
																			<div className="text-[8px] text-white dark:text-black peer absolute py-1 px-2 bg-[#373737] z-10 opacity-0 peer-hover:opacity-75 ease-in-out duration-300 rounded-full">Вы точно хотите удалить данного игрока из подписки?</div>
																		</div>
																	</>
																)
															})
															: null
														}
														{
															Array.from({ length: 3 - data.addedPlayers.length - data.noPlayersAddedYet.length }, (_, _i) => <><button onClick={() => switchWind("addPlayer")}><Image alt="" src={`/buttons/addPlayer.svg`} width={30} height={30} className="ease-out duration-200 opacity-50 hover:opacity-100 rounded" /></button></>)
														}
													</div>
												</> : data.subscription === "ONE" ? <>
													Ваша подписка: <b>One</b><br />
												</> : data.subscription === "fMAX" ? <>
													С вами поделились подпиской: <b>Max</b><br /><button className=' text-red-900 opacity-30 hover:opacity-100' onClick={() => cancelSub(data.nickname as string, data.subscriptionOwner as string)}>Выйти из подписки</button><br />
												</> : data.subscription === "fMULTI" ? <>
													С вами поделились подпиской: <b>Multi</b><br /><button className=' text-red-900 opacity-30 hover:opacity-100' onClick={() => cancelSub(data.nickname as string, data.subscriptionOwner as string)}>Выйти из подписки</button><br />
												</> : <>
													У вас нет <Link className='text-[#FAC301] hover:underline' href={"/subs"}>подписки</Link> на СПTV+
												</>
												}
											</div>
										</div>
									</div>

									<span className="dark:text-white text-black font-['Montserrat'] font-normal text-[20px]">
										<br />
										{data.noSubscriptionOwnerYet && data.subscription === "NO" ?
											<div>
												<b className="dark:text-white text-black text-[24px] font-['Montserrat']">Вам пришло уведомление</b> <br />
												<span className='mt-4 text-[18px] dark:text-white text-black'>Игрок {data.noSubscriptionOwnerYet}, хочет добавить вас в его подписку. Вам будет доступен весь контент, который доступен этой подписке</span>
												<br />
												<div className='mt-4 flex justify-start gap-3'>
													<button onClick={() => decline(data.nickname as string, data.noSubscriptionOwnerYet as string)} className="px-4 py-2 bg-[#373737] rounded-[15px] text-[#ffe600d9] text-[14px] font-bold">Отклонить</button>
													<button onClick={() =>
														accept(data.nickname as string, data.noSubscriptionOwnerYet as string)
													} className="px-4 py-2 dark:bg-[#ffe600d9] bg-[#ffd900] rounded-[15px] text-white text-[14px] font-bold">Принять</button>
												</div>
											</div>
											:
											null
										}
										<>
											{props.favorite && props.favorite.length > 0 ?
												<Films items={props.favorite} sub={((data.subscription === "MAX" || data.subscription === "fMAX") ? 3 : (data.subscription === "MULTI" || data.subscription === "fMULTI") ? 2 : data.subscription === "ONE" ? 1 : 0)} name={"Избранное"} />
												:
												<div className="w-full  pl-5  py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
													<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Избранное</div>
													<span className="tablet:text-[18px] text-[14px]">Вы не откладывали в избранное наши проекты</span>
												</div>
											}
											{props.acquired && props.acquired.length > 0 ?
												<Films items={props.acquired} sub={((data.subscription === "MAX" || data.subscription === "fMAX") ? 3 : (data.subscription === "MULTI" || data.subscription === "fMULTI") ? 2 : data.subscription === "ONE" ? 1 : 0)} name={"Приобретено"} />
												:
												<div className="w-full  pl-5  py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
													<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Преобретено</div>
													<span className="tablet:text-[18px] text-[14px]">Вы не покупали наши проекты</span>
												</div>
											}
										</>

									</span>
								</div>
							</>
							: <>Вы не имеете право смотреть чужие аккаунты</>}
					</main>
					<Footer />

				</div>
			</>
		)
	}

}
async function addPlayer(nicknameAdder: string) {
	if (typeof window === "object") {
		const inputnickname = document.getElementById("nicknameToAdd") as HTMLInputElement;
		const addPlayerSection = document.getElementById(`addPlayer`);
		const alertTitle = document.getElementById(`alertTitle`);
		const alertContect = document.getElementById(`alertContect`);
		if (alertTitle && alertContect && inputnickname && addPlayerSection) {
			if (inputnickname.value === nicknameAdder) {
				switchWind("addPlayer")
				alertTitle.innerHTML = "Ошибка"
				alertContect.innerHTML = `Вы не можете добавить самого себя`
				switchWind("alert")
				setTimeout(() => switchWind("alert"), 2000)
			} else {
				const data = { "nickname": inputnickname.value, "nicknameAdder": nicknameAdder }
				await fetch("/api/player/add", {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				}).then((response) => {
					return response.json();
				}).then((data: { code: number }) => {
					if (data.code === 4) {
						switchWind("addPlayer")
						alertTitle.innerHTML = "Ошибка"
						alertContect.innerHTML = `У пользователя ${inputnickname.value} уже есть подписка`
						switchWind("alert")
						setTimeout(() => switchWind("alert"), 2000)
					} else if (data.code === 3) {
						switchWind("addPlayer")
						alertTitle.innerHTML = "Ошибка"
						alertContect.innerHTML = `У пользователя ${inputnickname.value} уже есть приглашение`
						switchWind("alert")
						setTimeout(() => switchWind("alert"), 2000)
					} else if (data.code === 2) {
						switchWind("addPlayer")
						alertTitle.innerHTML = "Ошибка"
						alertContect.innerHTML = `Пользователя ${inputnickname.value} не существует`
						switchWind("alert")
						setTimeout(() => switchWind("alert"), 2000)
					} else if (data.code === 1) {

						switchWind("addPlayer")
						alertTitle.innerHTML = "Успешно"
						alertContect.innerHTML = `Пользователю ${inputnickname.value} успешно отправлен запрос на добавление в подписку`
						switchWind("alert")
						setTimeout(() => {
							switchWind("alert")
							location.reload()
						}, 2000)
					} else {
						switchWind("addPlayer")
						alertTitle.innerHTML = "Ошибка"
						alertContect.innerHTML = `Сообщите drdro20. Извините за неудобства`
						switchWind("alert")
						setTimeout(() => switchWind("alert"), 3000)
					}
				})
			}
		}
	}
}
async function cancelPlayer(nickname: string, nicknameAdder: string) {
	if (typeof window === "object") {
		const addPlayerSection = document.getElementById(`addPlayer`);
		const alertTitle = document.getElementById(`alertTitle`);
		const alertContect = document.getElementById(`alertContect`);
		if (alertTitle && alertContect && addPlayerSection) {

			const data = { "nickname": nickname, "nicknameAdder": nicknameAdder }
			await fetch("/api/player/cancle", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			}).then((response) => {
				return response.json();
			}).then((data: { code: number }) => {
				console.log(data.code)
				if (data.code === 2) {
					alertTitle.innerHTML = "Ошибка"
					alertContect.innerHTML = `Пользователя ${nickname} не существует`
					switchWind("alert")
					setTimeout(() => switchWind("alert"), 2000)
				} else if (data.code === 1) {
					alertTitle.innerHTML = "Успешно"
					alertContect.innerHTML = `Вы удалили пользователя ${nickname} из подписки`
					switchWind("alert")
					setTimeout(() => {
						switchWind("alert")
						location.reload()
					}, 2000)
				} else {
					alertTitle.innerHTML = "Ошибка"
					alertContect.innerHTML = `Сообщите drdro20. Извините за неудобства`
					switchWind("alert")
					setTimeout(() => switchWind("alert"), 3000)
				}
			})
		}
	}
}
async function deletePlayer(nickname: string, nicknameAdder: string) {
	if (typeof window === "object") {
		const addPlayerSection = document.getElementById(`addPlayer`);
		const alertTitle = document.getElementById(`alertTitle`);
		const alertContect = document.getElementById(`alertContect`);
		if (alertTitle && alertContect && addPlayerSection) {

			const data = { "nickname": nickname, "nicknameAdder": nicknameAdder }
			await fetch("/api/player/delete", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			}).then((response) => {
				return response.json();
			}).then((data: { code: number }) => {
				console.log(data.code)
				if (data.code === 2) {
					alertTitle.innerHTML = "Ошибка"
					alertContect.innerHTML = `Пользователя ${nickname} не существует`
					switchWind("alert")
					setTimeout(() => switchWind("alert"), 2000)
				} else if (data.code === 1) {
					alertTitle.innerHTML = "Успешно"
					alertContect.innerHTML = `Пользователь ${nickname} успешно удалён из подписки`
					switchWind("alert")
					setTimeout(() => {
						switchWind("alert")
						location.reload()
					}, 2000)
				} else {
					alertTitle.innerHTML = "Ошибка"
					alertContect.innerHTML = `Сообщите drdro20. Извините за неудобства`
					switchWind("alert")
					setTimeout(() => switchWind("alert"), 3000)
				}
			})
		}
	}
}
async function accept(nickname: string, nicknameAdder: string) {
	if (typeof window === "object") {
		const addPlayerSection = document.getElementById(`addPlayer`);
		const alertTitle = document.getElementById(`alertTitle`);
		const alertContect = document.getElementById(`alertContect`);
		if (alertTitle && alertContect && addPlayerSection) {

			const data = { "nickname": nickname, "nicknameAdder": nicknameAdder }
			await fetch("/api/player/accept", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			}).then((response) => {
				return response.json();
			}).then((data: { code: number }) => {
				console.log(data.code)
				if (data.code === 2) {
					alertTitle.innerHTML = "Ошибка"
					alertContect.innerHTML = `Пользователя ${nickname} не существует`
					switchWind("alert")
					setTimeout(() => switchWind("alert"), 2000)
				} else if (data.code === 1) {
					alertTitle.innerHTML = "Успешно"
					alertContect.innerHTML = `С вами успешно поделились подпиской`
					switchWind("alert")
					setTimeout(() => {
						switchWind("alert")
						location.reload()
					}, 2000)
				} else {
					alertTitle.innerHTML = "Ошибка"
					alertContect.innerHTML = `Сообщите drdro20. Извините за неудобства`
					switchWind("alert")
					setTimeout(() => switchWind("alert"), 3000)
				}
			})
		}
	}
}
async function decline(nickname: string, nicknameAdder: string) {
	if (typeof window === "object") {
		const addPlayerSection = document.getElementById(`addPlayer`);
		const alertTitle = document.getElementById(`alertTitle`);
		const alertContect = document.getElementById(`alertContect`);
		if (alertTitle && alertContect && addPlayerSection) {

			const data = { "nickname": nickname, "nicknameAdder": nicknameAdder }
			await fetch("/api/player/decline", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			}).then((response) => {
				return response.json();
			}).then((data: { code: number }) => {
				console.log(data.code)
				if (data.code === 2) {
					alertTitle.innerHTML = "Ошибка"
					alertContect.innerHTML = `Пользователя ${nickname} не существует`
					switchWind("alert")
					setTimeout(() => switchWind("alert"), 2000)
				} else if (data.code === 1) {
					alertTitle.innerHTML = "Успешно"
					alertContect.innerHTML = `Вы отказались от подписки`
					switchWind("alert")
					setTimeout(() => {
						switchWind("alert")
						location.reload()
					}, 2000)
				} else {
					alertTitle.innerHTML = "Ошибка"
					alertContect.innerHTML = `Сообщите drdro20. Извините за неудобства`
					switchWind("alert")
					setTimeout(() => switchWind("alert"), 3000)
				}
			})
		}
	}
}
async function cancelSub(nickname: string, nicknameAdder: string) {
	if (typeof window === "object") {
		const addPlayerSection = document.getElementById(`addPlayer`);
		const alertTitle = document.getElementById(`alertTitle`);
		const alertContect = document.getElementById(`alertContect`);
		if (alertTitle && alertContect && addPlayerSection) {

			const data = { "nickname": nickname, "nicknameAdder": nicknameAdder }
			await fetch("/api/player/cancelSub", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			}).then((response) => {
				return response.json();
			}).then((data: { code: number }) => {
				console.log(data.code)
				if (data.code === 2) {
					alertTitle.innerHTML = "Ошибка"
					alertContect.innerHTML = `Пользователя ${nickname} не существует`
					switchWind("alert")
					setTimeout(() => switchWind("alert"), 2000)
				} else if (data.code === 1) {
					alertTitle.innerHTML = "Успешно"
					alertContect.innerHTML = `Вы отказались от подписки`
					switchWind("alert")
					setTimeout(() => {
						switchWind("alert")
						location.reload()
					}, 2000)
				} else {
					alertTitle.innerHTML = "Ошибка"
					alertContect.innerHTML = `Сообщите drdro20. Извините за неудобства`
					switchWind("alert")
					setTimeout(() => switchWind("alert"), 3000)
				}
			})
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
	const prisma = new PrismaClient()
	const ids = await prisma.user.findFirst({
		where: {
			id: session.user.id,
		},
		select: {
			acquired: true,
			fav: true,
			acq: true
		},
	})
	if (ids) {
		const favorite = ids.fav
		const acquired = ids.acq
		return {
			props: { favorite, acquired }
		}
	}
	return {
		props: {}
	}
}