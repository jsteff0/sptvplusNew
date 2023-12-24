/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { useRouter } from "next/router";
import { PrismaClient } from '@prisma/client'

interface filmmakers {
	imgID: string;
	code: string;
	subscription: number;
}

export default function Home(props: { favorite: filmmakers[], acquired: filmmakers[] }) {
	const { data: session } = useSession();
	const { data } = api.user.me.useQuery();
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
		//const favoriteCODES = JSON.parse(data.favorite).codes as number[];
		//const favoriteFILMS: =
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
										<Image width={256} height={256} src={`https://visage.surgeplay.com/front/512/${data.UUID}`} className='laptop:w-[256px] w-[192px] relative pt-[24px] px-[12px] bg-[#ffffff] dark:bg-[#0f0f0f] rounded-[25px]' alt="" />
										<div className='flex flex-col'>
											<p className="dark:text-white text-black font-['Montserrat'] font-bold laptop:text-[32px] tablet:text-[18px] text-[16px] mt-[10px] ">{data.nickname}</p>
											<p className="dark:text-white text-black font-['Montserrat'] font-medium laptop:text-[22px] tablet:text-[16px] text-[14px] mt-[10px] ">Баланс: <b>{data.balance} <span className='text-[#FAC301]'>AP</span></b> </p>
											<div className="dark:text-white text-black font-['Montserrat'] font-medium laptop:text-[22px] tablet:text-[16px] text-[14px] mt-[10px]">
												{ }
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
											{props.favorite.length > 0 ?
												<div className="w-full bg-white dark:bg-[#0f0f0f] rounded-xl pl-5 mb-6 py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
													<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Избранное</div>
													<div className="relative flex w-full group">
														<div
															onScroll={(e) => {
																if (e.currentTarget.scrollLeft > 12) {
																	e.currentTarget.children[0]?.classList.replace("group-hover:opacity-0", "group-hover:opacity-100")
																	e.currentTarget.children[0]?.classList.replace("group-hover:w-0", "group-hover:w-[75px]")
																} else {
																	e.currentTarget.children[0]?.classList.replace("group-hover:opacity-100", "group-hover:opacity-0")
																	e.currentTarget.children[0]?.classList.replace("group-hover:w-[75px]", "group-hover:w-0")
																}
																if (e.currentTarget.scrollLeft + e.currentTarget.offsetWidth < e.currentTarget.scrollWidth - 100) {
																	e.currentTarget.children[e.currentTarget.children.length - 1]?.classList.replace("group-hover:opacity-0", "group-hover:opacity-100")
																	e.currentTarget.children[e.currentTarget.children.length - 1]?.classList.replace("group-hover:w-0", "group-hover:w-[75px]")
																} else {
																	e.currentTarget.children[e.currentTarget.children.length - 1]?.classList.replace("group-hover:opacity-100", "group-hover:opacity-0")
																	e.currentTarget.children[e.currentTarget.children.length - 1]?.classList.replace("group-hover:w-[75px]", "group-hover:w-0")
																}
															}} className="no-scroll-line overflow-x-scroll flex scroll-smooth group ">
															<div onClick={(e) => {
																const parentEl = e.currentTarget.parentNode as HTMLDivElement
																if (parentEl.scrollLeft > 450)
																	parentEl.scrollLeft -= 450
																else
																	parentEl.scrollLeft = 0
															}} className="absolute w-0 h-full bg-gradient-to-r from-[#000000b2] to-[#ffffff00] flex items-center duration-300 ease-in-out group-hover:opacity-0 group-hover:w-0 opacity-0">
																<div className="p-2">
																	<svg className="w-[23px] h-[45px] hover:w-[26px]" viewBox="0 0 23 40" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<path d="M18.5105 38.9583L0.958446 21.4583C0.750113 21.25 0.602197 21.0243 0.514697 20.7812C0.427197 20.5382 0.384142 20.2777 0.385531 20C0.385531 19.7222 0.428586 19.4618 0.514697 19.2187C0.600808 18.9757 0.748724 18.75 0.958446 18.5416L18.5105 0.989542C18.9966 0.503431 19.6043 0.260376 20.3334 0.260376C21.0626 0.260376 21.6876 0.520793 22.2084 1.04163C22.7293 1.56246 22.9897 2.1701 22.9897 2.86454C22.9897 3.55899 22.7293 4.16663 22.2084 4.68746L6.89595 20L22.2084 35.3125C22.6946 35.7986 22.9376 36.3979 22.9376 37.1104C22.9376 37.8229 22.6772 38.4388 22.1564 38.9583C21.6355 39.4791 21.0279 39.7395 20.3334 39.7395C19.639 39.7395 19.0314 39.4791 18.5105 38.9583Z" fill="white" />
																	</svg>
																</div>
															</div>
															{props.favorite.map((item: filmmakers) => {
																return (
																	<>
																		<Link href={`/content/${item.code}`} className="flex-none px-[12px] last:pr-6">
																			{((data.subscription === "MAX" || data.subscription === "fMAX") ? 3 : (data.subscription === "MULTI" || data.subscription === "fMULTI") ? 2 : data.subscription === "ONE" ? 1 : 0) < item.subscription ?
																				<>
																					<Image width={150} height={170} src={`/preview/${item.imgID}_a.png`} className="tablet:h-[170px] tablet:w-[150px] h-[112px] w-[99px] object-cover rounded-t-[10px] bg-center" alt="" />
																					<Link href={`subs`} className="">
																						<Image width={150} height={30} src={`/subscriptions/only${item.subscription === 3 ? "Max" : item.subscription === 2 ? "Multi" : "One"}.svg`} className="tablet:h-[30px] tablet:w-[150px] h-[20px] w-[99px] object-cover bg-center" alt="" />
																					</Link>
																				</>
																				:
																				<Image width={150} height={200} src={`/preview/${item.imgID}_a.png`} className="tablet:h-[200px] tablet:w-[150px] h-[132px] w-[99px] object-cover rounded-[10px] bg-center" alt="" />
																			}
																		</Link>
																	</>
																)
															})}

															<div onClick={(e) => {
																const parentEl = e.currentTarget.parentNode as HTMLDivElement
																if (parentEl.scrollLeft + parentEl.offsetWidth < parentEl.scrollWidth - 450)
																	parentEl.scrollLeft += 450
																else
																	parentEl.scrollLeft = parentEl.scrollWidth - parentEl.offsetWidth
															}} className={`absolute float-right right-0 w-0 h-full bg-gradient-to-l from-[#000000b2] to-[#ffffff00] flex justify-end items-center duration-300 ease-in-out group-hover:opacity-100 group-hover:w-[75px] opacity-0 `}>
																<div className="p-2">
																	<svg className="w-[23px] h-[45px] hover:w-[26px]" viewBox="0 0 23 40" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<path d="M4.86472 1.04158L22.4168 18.5416C22.6251 18.7499 22.773 18.9756 22.8605 19.2187C22.948 19.4617 22.9911 19.7221 22.9897 19.9999C22.9897 20.2777 22.9467 20.5381 22.8605 20.7812C22.7744 21.0242 22.6265 21.2499 22.4168 21.4583L4.86472 39.0103C4.3786 39.4964 3.77097 39.7395 3.0418 39.7395C2.31263 39.7395 1.68763 39.4791 1.1668 38.9583C0.645966 38.4374 0.38555 37.8298 0.38555 37.1353C0.38555 36.4409 0.645967 35.8333 1.1668 35.3124L16.4793 19.9999L1.1668 4.68742C0.680692 4.20131 0.437635 3.602 0.437635 2.8895C0.437636 2.177 0.698052 1.56103 1.21889 1.04158C1.73972 0.52075 2.34736 0.260333 3.0418 0.260333C3.73625 0.260334 4.34389 0.52075 4.86472 1.04158Z" fill="white" />
																	</svg>
																</div>
															</div>
														</div>

													</div>
												</div>
												:
												<div className="w-full  pl-5  py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
													<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Избранное</div>
													<span className="tablet:text-[18px] text-[14px]">Вы не откладывали в избранное наши проекты</span>
												</div>}

											{props.acquired.length > 0 ?
												<div className="w-full bg-white dark:bg-[#0f0f0f] rounded-xl pl-5  py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
													<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Преобретено</div>
													<div className="relative flex w-full group">
														<div
															onScroll={(e) => {
																if (e.currentTarget.scrollLeft > 12) {
																	e.currentTarget.children[0]?.classList.replace("group-hover:opacity-0", "group-hover:opacity-100")
																	e.currentTarget.children[0]?.classList.replace("group-hover:w-0", "group-hover:w-[75px]")
																} else {
																	e.currentTarget.children[0]?.classList.replace("group-hover:opacity-100", "group-hover:opacity-0")
																	e.currentTarget.children[0]?.classList.replace("group-hover:w-[75px]", "group-hover:w-0")
																}
																if (e.currentTarget.scrollLeft + e.currentTarget.offsetWidth < e.currentTarget.scrollWidth - 100) {
																	e.currentTarget.children[e.currentTarget.children.length - 1]?.classList.replace("group-hover:opacity-0", "group-hover:opacity-100")
																	e.currentTarget.children[e.currentTarget.children.length - 1]?.classList.replace("group-hover:w-0", "group-hover:w-[75px]")
																} else {
																	e.currentTarget.children[e.currentTarget.children.length - 1]?.classList.replace("group-hover:opacity-100", "group-hover:opacity-0")
																	e.currentTarget.children[e.currentTarget.children.length - 1]?.classList.replace("group-hover:w-[75px]", "group-hover:w-0")
																}
															}} className="no-scroll-line overflow-x-scroll flex scroll-smooth group ">
															<div onClick={(e) => {
																const parentEl = e.currentTarget.parentNode as HTMLDivElement
																if (parentEl.scrollLeft > 450)
																	parentEl.scrollLeft -= 450
																else
																	parentEl.scrollLeft = 0
															}} className="absolute w-0 h-full bg-gradient-to-r from-[#000000b2] to-[#ffffff00] flex items-center duration-300 ease-in-out group-hover:opacity-0 group-hover:w-0 opacity-0">
																<div className="p-2">
																	<svg className="w-[23px] h-[45px] hover:w-[26px]" viewBox="0 0 23 40" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<path d="M18.5105 38.9583L0.958446 21.4583C0.750113 21.25 0.602197 21.0243 0.514697 20.7812C0.427197 20.5382 0.384142 20.2777 0.385531 20C0.385531 19.7222 0.428586 19.4618 0.514697 19.2187C0.600808 18.9757 0.748724 18.75 0.958446 18.5416L18.5105 0.989542C18.9966 0.503431 19.6043 0.260376 20.3334 0.260376C21.0626 0.260376 21.6876 0.520793 22.2084 1.04163C22.7293 1.56246 22.9897 2.1701 22.9897 2.86454C22.9897 3.55899 22.7293 4.16663 22.2084 4.68746L6.89595 20L22.2084 35.3125C22.6946 35.7986 22.9376 36.3979 22.9376 37.1104C22.9376 37.8229 22.6772 38.4388 22.1564 38.9583C21.6355 39.4791 21.0279 39.7395 20.3334 39.7395C19.639 39.7395 19.0314 39.4791 18.5105 38.9583Z" fill="white" />
																	</svg>
																</div>
															</div>
															{props.acquired.map((item: filmmakers) => {
																return (
																	<>
																		<Link href={`/content/${item.code}`} className="flex-none px-[12px] last:pr-6">
																			{((data.subscription === "MAX" || data.subscription === "fMAX") ? 3 : (data.subscription === "MULTI" || data.subscription === "fMULTI") ? 2 : data.subscription === "ONE" ? 1 : 0) < item.subscription ?
																				<>
																					<Image width={150} height={170} src={`/preview/${item.imgID}_a.png`} className="tablet:h-[170px] tablet:w-[150px] h-[112px] w-[99px] object-cover rounded-t-[10px] bg-center" alt="" />
																					<Link href={`subs`} className="">
																						<Image width={150} height={30} src={`/subscriptions/only${item.subscription === 3 ? "Max" : item.subscription === 2 ? "Multi" : "One"}.svg`} className="tablet:h-[30px] tablet:w-[150px] h-[20px] w-[99px] object-cover bg-center" alt="" />
																					</Link>
																				</>
																				:
																				<Image width={150} height={200} src={`/preview/${item.imgID}_a.png`} className="tablet:h-[200px] tablet:w-[150px] h-[132px] w-[99px] object-cover rounded-[10px] bg-center" alt="" />
																			}
																		</Link>
																	</>
																)
															})}

															<div onClick={(e) => {
																const parentEl = e.currentTarget.parentNode as HTMLDivElement
																if (parentEl.scrollLeft + parentEl.offsetWidth < parentEl.scrollWidth - 450)
																	parentEl.scrollLeft += 450
																else
																	parentEl.scrollLeft = parentEl.scrollWidth - parentEl.offsetWidth
															}} className={`absolute float-right right-0 w-0 h-full bg-gradient-to-l from-[#000000b2] to-[#ffffff00] flex justify-end items-center duration-300 ease-in-out group-hover:opacity-100 group-hover:w-[75px] opacity-0 `}>
																<div className="p-2">
																	<svg className="w-[23px] h-[45px] hover:w-[26px]" viewBox="0 0 23 40" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<path d="M4.86472 1.04158L22.4168 18.5416C22.6251 18.7499 22.773 18.9756 22.8605 19.2187C22.948 19.4617 22.9911 19.7221 22.9897 19.9999C22.9897 20.2777 22.9467 20.5381 22.8605 20.7812C22.7744 21.0242 22.6265 21.2499 22.4168 21.4583L4.86472 39.0103C4.3786 39.4964 3.77097 39.7395 3.0418 39.7395C2.31263 39.7395 1.68763 39.4791 1.1668 38.9583C0.645966 38.4374 0.38555 37.8298 0.38555 37.1353C0.38555 36.4409 0.645967 35.8333 1.1668 35.3124L16.4793 19.9999L1.1668 4.68742C0.680692 4.20131 0.437635 3.602 0.437635 2.8895C0.437636 2.177 0.698052 1.56103 1.21889 1.04158C1.73972 0.52075 2.34736 0.260333 3.0418 0.260333C3.73625 0.260334 4.34389 0.52075 4.86472 1.04158Z" fill="white" />
																	</svg>
																</div>
															</div>
														</div>

													</div>
												</div>
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
							: data.subscription !== "ADMIN" ? <>
								Вы не имеете право смотреть чужие аккаунты
							</> : <>Дарова</>}
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
//TODO: доделать отмену игрока, удаление игрока, принятие, отклонение, выход из подписки
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
			favorite: true,
			acquired: true,
		},
	})
	if (ids) {
		const favorite = await prisma.film.findMany({
			where: {
				id: {
					in: ids.favorite,
				}
			},
			select: {
				imgID: true,
				code: true,
				subscription: true
			},
		})
		const acquired = await prisma.film.findMany({
			where: {
				id: {
					in: ids.acquired,
				}
			},
			select: {
				imgID: true,
				code: true,
				subscription: true
			},
		})
		return {
			props: { favorite, acquired }
		}
	}
	return {
		props: {}
	}
}