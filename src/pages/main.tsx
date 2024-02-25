/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import Films from "../app/components/filmline"
// import newsimport from 'newsinfo.json';
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
// import fsPromises from 'fs/promises';
// import { PrismaClient } from '@prisma/client'
// import { env } from "~/env.mjs";
// import { SPWorlds } from 'spworlds';
import Header from "../app/components/header";
import Footer from "../app/components/footer";
import { useEffect, useState } from "react";
// const apiSP = new SPWorlds(env.NEXT_PUBLIC_CARD_ID, env.NEXT_PUBLIC_CARD_TOKEN);


interface filmmakers {
	imgID: string;
	code: string;
	subscription: number;
	show: number;
	describe: string | null;
}

export default function Home() {
	const { data: session } = useSession();
	const { data } = api.user.main.useQuery();
	const [newest, setNewest] = useState<filmmakers[] | null>(null)
	const [recomendtosee, setRecomendtosee] = useState<filmmakers[] | null>(null)
	const [shows, setShows] = useState<filmmakers[] | null>(null)
	const [comingOut, setComingOut] = useState<filmmakers[] | null>(null)
	const [newsVideos, setnewsVideos] = useState<{ url: string, name: string, png: string }[] | null>(null)
	useEffect(() => {
		if (!data?.nickname || !session?.user.name) {
			setTimeout(() => {
				document.getElementById("sighoutredirect")?.classList.remove("hidden")
				document.getElementById("sighoutredirect")?.classList.add("block")
			}, 3000)
		} else if (!newest && !recomendtosee && !shows && !comingOut) {

			const fetchData = async () => {
				const response = await fetch("/api/private/content/loadmainpage", {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ nickname: "DrDro20" })
				}
				)
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				const result = await response.json() as { newest: filmmakers[], recomendtosee: filmmakers[], shows: filmmakers[], comingOut: filmmakers[], news: { newsVideo: Array<{ url: string, name: string, png: string }> } }
				setNewest(result.newest)
				setRecomendtosee(result.recomendtosee)
				setShows(result.shows)
				setComingOut(result.comingOut)
				setnewsVideos(result.news.newsVideo)
			}

			fetchData().catch((e) => {
				throw new Error(e as string)
			})
		}
		if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	})
	if (!data?.nickname || !session?.user.name) {
		return (<>
			<Head>
				<title>СПtv+</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="description" content="Онлайн кинотеатр СПtv+" />
				<meta name="og:image" content={"/logoold.png"} />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
			</Head>
			<div className="flex flex-col justify-center items-center align-middle h-screen w-screen">
				<svg className="animate-spin h-[50px] w-[50px] text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<button id="sighoutredirect" onClick={() => location.href = "/auth/signout"} className="hidden hover:cursor-pointer">Если долго грузит, нажми на текст</button>
			</div>
		</>
		);
	} else {

		const randomMainPageNum = 1
		const newsjson = newsVideos
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
					<Header balance={data.balance} subscription={data.subscription} UUID={data.UUID ? `https://api.mineatar.io/face/${data.UUID}` : "/randomguy.png"} nickname={data.nickname} />


					<main className="flex align-middle justify-center flex-auto">
						<div className="flex tablet:flex-row flex-col-reverse w-screen ">
							<nav className="fixed bottom-0 tablet:z-0 z-10 flex justify-center tablet:w-[190px] w-screen tablet:min-h-screen h-[62px] bg-white dark:bg-[#0a0a0a] dark:border-[#383838] tablet:border-r-[1px] border-[#E1E1E1] transition-all duration-500 ease-in-out">
								<div className="flex tablet:flex-col flex-row tablet:items-start items-center tablet:justify-normal justify-between tablet:mt-[105px] w-screen px-6 tablet:px-10 tablet:gap-3 tablet:text-[16px] text-[11px] font-['Montserrat'] leading-[20px] font-bold">
									<Link className="group flex tablet:flex-row flex-col tablet:gap-2 gap-0 items-center " href="/main">
										<div>
											<div className="tablet:w-[20px] tablet:h-[20px] h-[18px] w-[18px] bg-[url(/nav/homeicon.svg)] dark:bg-[url(/nav/homeiconWT.svg)] bg-cover"></div>
											<div className="tablet:h-[3px] h-0 bg-[#FFE400] tablet:w-[20px]"></div>
										</div>
										<span className=" tablet:dark:text-[#FFE400] dark:text-white">Главная</span>
									</Link>
									<Link className="group flex tablet:flex-row flex-col tablet:gap-2 gap-0 items-center opacity-[0.6] hover:opacity-[1] ease-out duration-300" href="/media/news">
										<div>
											<div className="tablet:w-[20px] tablet:h-[20px] h-[18px] w-[18px] bg-[url(/nav/newsicon.svg)] dark:bg-[url(/nav/newsiconWT.svg)] bg-cover ease-out duration-300"></div>
											<div className="w-0 tablet:h-[3px] h-0 bg-[#FFE400] group-hover:tablet:w-[20px] ease-out duration-300"></div>
										</div>
										<span className=" tablet:dark:text-white dark:text-white ease-out duration-300">Новости</span>
									</Link>
									<Link className="group flex tablet:flex-row flex-col tablet:gap-2 gap-0 items-center opacity-[0.6] hover:opacity-[1] ease-out duration-300" href="/media/movies">
										<div>
											<div className="tablet:w-[20px] tablet:h-[16px] tablet:mt-0 mt-[3.6px] h-[14.4px] w-[18px] bg-[url(/nav/movieicon.svg)] dark:bg-[url(/nav/movieiconWT.svg)] bg-cover ease-out duration-300"></div>
											<div className="w-0 tablet:h-[3px] h-0 bg-[#FFE400] group-hover:tablet:w-[20px] ease-out duration-300 mt-[2px]"></div>
										</div>
										<span className="tablet:dark:text-white dark:text-white ease-out duration-300">Фильмы</span>
									</Link>
									<Link className="group flex tablet:flex-row flex-col tablet:gap-2 gap-0 items-center opacity-[0.6] hover:opacity-[1] ease-out duration-300" href="/media/series">
										<div>
											<div className="tablet:w-[20px] tablet:h-[16px] tablet:mt-0 mt-[3.6px] h-[14.4px] w-[18px] bg-[url(/nav/serialicon.svg)] dark:bg-[url(/nav/serialiconWT.svg)] bg-cover ease-out duration-300"></div>
											<div className="w-0 tablet:h-[3px] h-0 bg-[#FFE400] group-hover:tablet:w-[20px] ease-out duration-300 mt-[2px]"></div>
										</div>
										<span className="tablet:dark:text-white dark:text-white ease-out duration-300 ">Сериалы</span>
									</Link>
									<Link className="group flex tablet:flex-row flex-col tablet:gap-2 gap-0 items-center opacity-[0.6] hover:opacity-[1] ease-out duration-300" href="/media/shows">
										<div>
											<div className="tablet:w-[20px] tablet:h-[16px] h-[18px] w-[18px] bg-[url(/nav/showicon.svg)] dark:bg-[url(/nav/showiconWT.svg)] bg-cover ease-out duration-300"></div>
											<div className="w-0 tablet:h-[3px] h-0 bg-[#FFE400] group-hover:tablet:w-[20px] ease-out duration-300 mt-[2px]"></div>
										</div>
										<span className="tablet:dark:text-white dark:text-white ease-out duration-300">Шоу</span>
									</Link>
									{
										data.management !== "NO" ?
											<Link className="group flex tablet:flex-row flex-col tablet:gap-2 gap-0 items-center opacity-[0.6] hover:opacity-[1] ease-out duration-300" href="/panels/main">
												<div>
													<div className="tablet:w-[20px] tablet:h-[20px] h-[18px] w-[18px] bg-[url(/nav/addicon.svg)] dark:bg-[url(/nav/addiconWT.svg)] bg-cover  ease-out duration-300"></div>
													<div className="w-0 tablet:h-[3px] h-0 bg-[#FFE400] group-hover:tablet:w-[20px] ease-out duration-300 mt-[2px]"></div>
												</div>
												<span className="tablet:dark:text-white dark:text-white ease-out duration-300">Добавить контент</span>
											</Link>
											: null
									}
								</div>
							</nav>
							<section id="leftcontent" className="tablet:ml-[190px] ml-0 w-full transition-all duration-500 ease-in-out">
								<div className="py-20 bg-white dark:bg-[#0a0a0a] flex flex-col min-h-screen items-center gap-[40px]">
									{recomendtosee ?
										<div className="m-4 hidden smltp:flex">

											<section className="flex flex-col justify-center gap-12 p-8 absolute bg-gradient-to-r from-[#000000f7] from-40% to-[#fff0] smltp:w-[560px] smltp:h-[315px] w-[255px] h-[143px] rounded-[20px]  ">

												<Image width={168} height={0} src={`https://sptv-storage.storage.yandexcloud.net/images/preview/${recomendtosee[randomMainPageNum]?.imgID}_m.png`} className="rounded-[20px] object-cover" alt="" />


												<section className="flex flex-col gap-4 w-[35%]">
													<p className="text-white font-['Montserrat'] font-light text-[12px]">{recomendtosee[randomMainPageNum]?.describe}</p>
													<a className="px-4 py-2 w-[102px] bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold" href={`/content/${recomendtosee[randomMainPageNum]?.code}`}>Смотреть</a>
												</section>
											</section>
											<Image width={560} height={315} src={`https://sptv-storage.storage.yandexcloud.net/images/preview/${recomendtosee[randomMainPageNum]?.imgID}.png`} className="rounded-[20px] object-cover smltp:w-[560px] smltp:h-[315px] w-[255px] h-[143px]" alt="" />

										</div>
										:
										<svg className="animate-spin h-[30px] w-[30px] text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
									}
									<div className="m-4 flex smltp:hidden">
										<video src={`/videos/index.mp4`} className="rounded-[10px] object-cover w-full" autoPlay muted loop playsInline />
									</div>

									{newest ?
										newest.length > 0 ? <Films items={newest} sub={((data.subscription === "MAX" || data.subscription === "fMAX") ? 3 : (data.subscription === "MULTI" || data.subscription === "fMULTI") ? 2 : data.subscription === "ONE" ? 1 : 0)} name={"Новинки"} /> : null
										:
										<div className=" max-w-full w-full h-[201px] tablet:h-[282px] pl-5 py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
											<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Новинки</div>
											<svg className="animate-spin h-[30px] w-[30px] text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										</div>
									}
									{recomendtosee ?
										recomendtosee.length > 0 ? <Films items={recomendtosee} sub={((data.subscription === "MAX" || data.subscription === "fMAX") ? 3 : (data.subscription === "MULTI" || data.subscription === "fMULTI") ? 2 : data.subscription === "ONE" ? 1 : 0)} name={"Что посмотреть"} /> : null
										:
										<div className=" max-w-full w-full h-[201px] tablet:h-[282px] pl-5 py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
											<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Что посмотреть</div>
											<svg className="animate-spin h-[30px] w-[30px] text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										</div>
									}
									{comingOut ?
										comingOut.length > 0 ? <Films items={comingOut} sub={((data.subscription === "MAX" || data.subscription === "fMAX") ? 3 : (data.subscription === "MULTI" || data.subscription === "fMULTI") ? 2 : data.subscription === "ONE" ? 1 : 0)} name={"Будущие проекты"} /> : null
										:
										<div className=" max-w-full w-full h-[201px] tablet:h-[282px] pl-5 py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
											<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Будущие проекты</div>
											<svg className="animate-spin h-[30px] w-[30px] text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										</div>
									}
									{shows ?
										shows.length > 0 ? <Films items={shows} sub={((data.subscription === "MAX" || data.subscription === "fMAX") ? 3 : (data.subscription === "MULTI" || data.subscription === "fMULTI") ? 2 : data.subscription === "ONE" ? 1 : 0)} name={"Шоу"} /> : null
										:
										<div className=" max-w-full w-full h-[201px] tablet:h-[282px] pl-5 py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
											<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Шоу</div>
											<svg className="animate-spin h-[30px] w-[30px] text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										</div>
									}
									{newsjson ?
										newsjson.length > 0 ?
											<div className="max-w-full w-full pl-5 py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
												<div className="tablet:text-[32px] font-['Montserrat'] font-bold dark:text-white">Последние выпуски новостей</div>
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
														{newsjson.map((item: { url: string, name: string, png: string }) => {
															return (
																<Link href={`${item.url}`} key={item.url} className="flex-none px-[12px] last:pr-6">
																	<div className="flex flex-col items-center justify-center gap-3">
																		<Image width={285} height={180} src={`https://sptv-storage.storage.yandexcloud.net/images/news/${item.png}`} className="tablet:h-[180px] tablet:w-[285px] h-[100px] w-[160px] object-cover rounded-[10px] bg-center" alt="" />
																	</div>
																	<div className="text-black dark:text-white tablet:text-[18px] text-[14px] font-['Montserrat'] font-semibold mt-2">{item.name}</div>
																</Link>
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
											: null
										: <div className=" max-w-full w-full h-[201px] tablet:h-[282px] pl-5 py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
											<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Последние выпуски новостей</div>
											<svg className="animate-spin h-[30px] w-[30px] text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										</div>}
									<div className="tablet:hidden relation left-0 bottom-0 w-full tablet:h-[40px] bg-white dark:bg-[#272727] ">
									</div>
								</div>

							</section>
						</div>

					</main>

					<Footer />
				</div>
			</>
		)
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
		props: {}
	}
}