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
import { PrismaClient } from '@prisma/client'
import { randomUUID } from "crypto";
import Hls, { TimelineController } from "hls.js";
import { useRouter } from "next/router";


interface filmmakers {
	id: number;
	imgID: string;
	content: string;
	describe: string;
	mark: number;
	watched: number;
	types: string[];
	timing: number[];
	studio: string;
	subscription: number;
	datePremiere: string;
	price: number;
	more: string;
	code: string;
}
export default function Home(props: {
	content: filmmakers, isBeforePremier: boolean, encodedCode: string, timeKey: string, watched: string[]
}) {

	const { data: session } = useSession();
	const { data } = api.user.me.useQuery();
	const router = useRouter().query.id;
	if (!data?.nickname || !session?.user.name) {
		return (
			<div className="flex justify-center items-center align-middle h-screen w-screen">
				<svg className="animate-spin h-[50px] w-[50px] text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			</div>
		);
	} else if (props.encodedCode) {
		let isHover = false;
		return (
			<>
				<Head>
					<title>Главная</title>
					<link rel="icon" href="/favicon.ico" />
					<meta name="description" content="Добро пожаловать на сайт СПTV+" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				</Head>
				<div className="min-h-screen flex items-center bg-[#000000]">
					<div id="up" onMouseEnter={() => { isHover = true; }} onMouseLeave={() => {

						const upper = document.getElementById('up') as HTMLDivElement;
						const downer = document.getElementById('down') as HTMLDivElement;
						isHover = false;
						upper.classList.replace("opacity-100", "opacity-0")
						downer.classList.replace("opacity-100", "opacity-0")
					}} className="z-20 opacity-0 duration-300 уease-in-out absolute top-0 w-screen h-[200px] bg-gradient-to-b from-black to-transparent">
						<Image
							onClick={() => { savingUpData(data.nickname as string, props.encodedCode).then(() => location.href = location.origin + "/content/" + (typeof router === "string" ? router : null)).catch((err) => console.log(err)); }}
							src="/control/exitBtn.svg" width={30} height={30} className="m-10" alt="" />
					</div>


					<video className="z-10 h-screen w-screen" id="mainvideo"
						onEnded={() => savingUpData(data.nickname as string, props.encodedCode)}
						onMouseMove={() => {
							const upper = document.getElementById('up') as HTMLDivElement;
							const downer = document.getElementById('down') as HTMLDivElement;
							if (upper.classList.item(0) !== "opacity-100" && downer.classList.item(0) !== "opacity-100") {

								upper.classList.replace("opacity-0", "opacity-100")
								downer.classList.replace("opacity-0", "opacity-100")

								setTimeout(() => {
									if (!isHover) {
										upper.classList.replace("opacity-100", "opacity-0")
										downer.classList.replace("opacity-100", "opacity-0")
									}
								}, 3000)
							}
						}}
						onTimeUpdate={(e) => {
							const progressed = document.getElementById('progressed') as HTMLDivElement;
							const timeBar = document.getElementById('textTime') as HTMLSpanElement;
							progressed.style.width = (100 * e.currentTarget.currentTime / e.currentTarget.duration).toString() + "%";
							const hr = Math.floor(e.currentTarget.currentTime / 60 / 60);
							const min = Math.floor(e.currentTarget.currentTime / 60) - hr * 60;
							const sec = Math.floor(e.currentTarget.currentTime) - (min + (hr * 60)) * 60;
							timeBar.innerHTML = `${hr}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
						}}
						onClick={async (e) => {
							const image = document.getElementById("playbuttons") as HTMLImageElement;
							if (e.currentTarget.paused) {
								image.src = "/control/pauseBtn.svg"
								await e.currentTarget.play();
							} else {
								e.currentTarget.pause();
								image.src = "/control/playBtn.svg"
							}
						}}>
					</video>
					<Render idFilm={props.encodedCode + "::" + props.timeKey + "::" + data.volume + "::" + data.nickname} />
					<div id="down" onMouseEnter={() => { isHover = true; }} onMouseLeave={() => {
						const upper = document.getElementById('up') as HTMLDivElement;
						const downer = document.getElementById('down') as HTMLDivElement;
						isHover = false;
						upper.classList.replace("opacity-100", "opacity-0")
						downer.classList.replace("opacity-100", "opacity-0")
					}} className="z-20 opacity-0 duration-300 ease-in-out absolute bottom-0 w-screen h-[300px] bg-gradient-to-t from-black to-transparent">
						<div id="controlPanel" className="absolute w-screen h-[20px] flex gap-6 bottom-10 duration-300 ease-in-out">
							<div id="playbutton" onClick={async (e) => {
								const video = document.getElementById("mainvideo") as HTMLVideoElement;
								const image = e.target as HTMLImageElement;
								if (video.paused) {
									await video.play();
									image.src = "/control/pauseBtn.svg"
								} else {
									video.pause();
									image.src = "/control/playBtn.svg"
								}
							}} className="ml-12 text-14">
								<Image id="playbuttons" width={18} height={24} src="/control/playBtn.svg" alt="" />
							</div>
							<section className="flex gap-3">
								<div id="mins10btn" onClick={() => {
									const video = document.getElementById("mainvideo") as HTMLVideoElement;
									video.currentTime -= 10;

								}} className="">
									<Image id="mins10" width={30} height={25} src="/control/back10sec.svg" alt="" />
								</div>
								<div onClick={() => {
									const video = document.getElementById("mainvideo") as HTMLVideoElement;
									video.currentTime += 10;

								}} id="pls10btn" className="">
									<Image id="pls10" width={30} height={25} src="/control/forwr10sec.svg" alt="" />
								</div>
							</section>
							<div id="time" className="flex items-center align-middle gap-4 text-white h-[24px] w-full">
								<span id="textTime">0:00:00</span>
								<div id="progressBar" onClick={(e) => {
									const video = document.getElementById("mainvideo") as HTMLMediaElement;
									const progressBar = document.getElementById("progressBar") as HTMLDivElement;
									video.currentTime = (e.nativeEvent.offsetX / progressBar.offsetWidth) * video.duration
								}} className="h-[10px] w-full bg-white rounded-full">
									<div id="progressed" className={`h-[10px] bg-[#e5d332] w-0 rounded-full ease-out duration-300`}></div>
								</div>
							</div>
							<div id="volume" className="mr-4 group flex items-center align-middle gap-2" >
								<div className="bg-[url('/control/volumeBtn.svg')] bg-cover group w-[25px] h-[22.5px]"></div>
								<div id="volumeVal" onClick={(e) => {
									const video = document.getElementById("mainvideo") as HTMLVideoElement;
									const volumeValLne = document.getElementById("volumeValLne") as HTMLDivElement;
									video.volume = (e.nativeEvent.offsetX / e.currentTarget.offsetWidth)
									volumeValLne.style.width = Math.floor(video.volume * 100).toString() + "%"
								}} className="group w-[78px] bg-white h-[7px] mt-[4px] rounded-full ease-out duration-300">
									<div id="volumeValLne" className={`rounded h-[7px] bg-[#e5d332] w-[${data.volume * 100}%] relative`}></div>
								</div>
							</div>
							<div id="fullscreen" className="mr-12 group  flex items-center align-middle gap-2" onClick={async () => {
								const video = document.getElementById("mainvideo") as HTMLVideoElement;
								if (video.requestFullscreen) {
									await video.requestFullscreen();
								}
							}}>
								<Image width={30} height={25} id="fullsmall" src="/control/full.svg" alt="" />
							</div>
						</div>
					</div>
				</div>
			</>
		)
	} else {
		const datePremiere = new Date(props.content.datePremiere)
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
					<header className="fixed flex justify-between items-center px-8 z-20 w-full h-[55px] bg-[#272727]">
						<Link href="/main" className="w-auto h-auto">
							<span className=" text-[#FFE400] font-['Montserrat'] text-[20px] font-extrabold">СП</span>
							<span className=" text-white font-['Montserrat'] text-[20px] font-extrabold text italic">tv+</span>
						</Link>
						<div className="float-right flex align-center gap-[14px]">
							<div className="flex items-center tablet:gap-2 gap-1">
								<span className="font-['Montserrat'] font-normal tablet:text-[18px] text-[15px] text-white text-center">Баланс: <b>{data.balance}<span className="text-[#FFE400] font-bold"> AP</span></b></span>
								<button onClick={() => switchWind("addMoney")}>
									<Image alt="" src={`/buttons/addbtn.svg`} width={18} height={19} />
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
					<section id="addMoney" className="fixed inset-0 overflow-y-auto z-30 hidden">
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
									<button onClick={() => switchWind("addMoney")} className="px-4 py-2 bg-[#373737] rounded-[15px]"><span className="text-[#FFE400] font-bold">Отмена</span></button>
									{/* <button onClick={() => { const element2: HTMLInputElement | null = document.querySelector("#money"); element2 !== null ? AddMoney(parseInt(element2.value), User.nickname) : console.log("noElement2") }} className="w-[100px] h-[40px] bg-[#FFE400] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold" id="mbtn" > Оплатить</button> */}
								</div>
							</div>
						</div>
					</section>
					<section id="more" className="fixed inset-0 overflow-y-auto z-30 hidden">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<div className="fixed inset-0 bg-black bg-opacity-25"></div>
							<div className="w-full max-w-md transform  overflow-hidden rounded-2xl bg-[#272727] p-6 text-left align-middle shadow-xl transition-all z-22">
								<b className=" text-white text-[20px] font-['Montserrat']">Подробнее</b><br />
								<div className="mt-4 text-white">
									{props.content.more}
								</div>
								<div className="mt-4 flex justify-end gap-3">
									<button onClick={() => switchWind("more")} className="px-4 py-2 bg-[#373737] rounded-[15px]"><span className="text-[#FFE400] font-bold">Отмена</span></button>
								</div>
							</div>
						</div>
					</section>
					<main className="flex align-middle justify-center flex-auto">
						<section
							className="z-10 laptop:bg-gradient-to-r bg-[#000000df] from-[#000000e8] from-[35%] to-transparent absolute h-screen w-full left-0 flex laptop:justify-normal justify-center">
							<div className="laptop:max-w-[40%] max-w-screen h-screen px-10 py-20 flex flex-col items-center">
								<img src={`/preview/${props.content.imgID}_m.png`} className="" alt="" />
								<div className="font-medium smltp:text-[13px] text-[9px] text-[rgb(173,173,173)] flex smltp:gap-[8px] gap-[4px] justify-center font-['Montserrat']">
									<span className={`${props.content.mark >= 3.5 ? props.content.mark >= 7 ? "text-[#00760C]" : "text-[#766300]" : props.content.mark >= 0 && props.content.mark <= 10 ? "text-[#761500]" : "text-"}`}>{(props.content.mark.toString().includes('.')) ? props.content.mark : `${props.content.mark}.0`}</span>
									<span>{props.content.watched >= 1000000 ? `${(props.content.watched / 1000000).toFixed(1)}M` : props.content.watched > 1000 ? `${(props.content.watched / 1000).toFixed(1)}K` : props.content.watched}</span>
									<span>{datePremiere.getFullYear()}</span>
									<span>{props.content.types.map((item: string) => {
										return <><span className="">{props.content.types[props.content.types.length - 1] === item ? item : `${item}, `}</span></>
									})}</span>
									<span>{props.content.timing.length > 1 ? `${props.content.timing.length} сери${(props.content.timing.length % 10 === 2 || props.content.timing.length % 10 === 3 || props.content.timing.length % 10 === 4) && (props.content.timing.length !== 12 && props.content.timing.length !== 13 && props.content.timing.length !== 14) ? "и " : "й"}` : `${Math.floor(props.content.timing[0] ? props.content.timing[0] : 60 / 60)} минут${props.content.timing[0] ? props.content.timing[0] : 60 % 10 === 1 && props.content.timing[0] !== 10 ? "a " : (props.content.timing[0] ? props.content.timing[0] : 60 % 10 === 2 || props.content.timing[0] ? props.content.timing[0] : 60 % 10 === 3 ||props.content.timing[0] ? props.content.timing[0] : 60 % 10 === 4) && (props.content.timing[0] !== 12 && props.content.timing[0] !== 13 && props.content.timing[0] !== 14) ? "ы " : " "}`}</span>
									<span>{props.content.studio}</span>
								</div>
								<div className="flex justify-center font-normal text-white text-[20px] p-10 font-['Montserrat']">{props.content.describe}</div>
								<div className="flex gap-2 font-['Montserrat']">
									{!props.isBeforePremier ?
										((data.subscription === "MAX" || data.subscription === "fMAX") ? 3 : (data.subscription === "MULTI" || data.subscription === "fMULTI") ? 2 : data.subscription === "ONE" ? 1 : 0) >= props.content.subscription || data.acquired.includes(props.content.id)
											?
											props.content.timing.length > 1
												?
												<>
													<input type="checkbox" id="chooseSeria" className="hidden peer" />
													<label htmlFor="chooseSeria" className="peer-checked:hidden block flex-none px-4 py-2 bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold">Выбрать эпизод</label>
													<section className="peer-checked:flex hidden bg-[#303030] w-full h-[220px] flex-col overflow-y-scroll no-scroll-line rounded ">
														<label htmlFor="chooseSeria" className=""><Image width={10} height={10} src="/buttons/exitBtn.svg" className="mt-2 ml-2" alt="" /></label>
														{props.content.timing.map((item: number, i) => {
															return (
																<>
																	<button onClick={() => startwatching(props.content.code, "EPS" + (i + 1), data.nickname as string)} className={`text-white flex-none p-2 m-[10px] first:mt-[12px] last:mb-[12px] hover:bg-[#393939] hover:cursor-pointer`}>
																		<b className="text-[18px]">{i + 1} эпизод</b>
																		<br />
																		<span className="text-[12px]">{`${Math.floor(item / 60)} минут${Math.floor(item / 60) % 10 === 1 && Math.floor(item / 60) !== 11 ? "a" : (Math.floor(item / 60) % 10 === 2 && Math.floor(item / 60) !== 12) || (Math.floor(item / 60) % 10 === 3 && Math.floor(item / 60) !== 13) || (Math.floor(item / 60) % 10 === 4 && Math.floor(item / 60) !== 14) ? "ы" : ""}`}</span>
																		<br />
																		{props.watched.includes((i+1).toString()) ? <i className="text-[12px] ">Просмотренно</i> : <></>}
																	</button>
																</>
															)
														})}
													</section>
												</>
												:
												<button onClick={() => startwatching(props.content.code, "FLM", data.nickname as string)} className="px-4 py-2 bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold flex items-center gap-2">Начать просмотр</button>
											:
											<button id="buyButton" onClick={() => buy(props.content.code, props.content.price, data.nickname as string, data.balance)} className="px-4 py-2 bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold">Приобрести за {props.content.price}АР</button>
										:
										<button onClick={() => startwatching(props.content.code, "TLR", data.nickname as string)} className="px-4 py-2 bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold">Смотреть трейлер</button>
									}
									<div className="flex">
										<input type="checkbox" checked={data.favorite.includes(props.content.id)} className="peer hidden" id="saveButton" />
										<label htmlFor="saveButton" onClick={() => save(props.content.code, data.nickname as string)}
											className="bg-[#171717] peer-checked:bg-[#ffb300] w-[40px] shadow h-[40px] rounded-[20px] mr-2 flex items-center justify-center ease-out duration-300 ">
											<img src="/buttons/saveICN.svg" alt="" className="absolute w-[20px] h-[20px]" />
										</label>
										<button id="moreButton" onClick={() => switchWind("more")}
											className="bg-[#171717] w-[40px] shadow h-[40px] rounded-[20px] mr-2 flex items-center justify-center ease-out duration-300">
											<img src="/buttons/moreICN.svg" alt="" className="absolute w-[20px] h-[20px]" />
										</button>
									</div>
								</div>
							</div>
						</section>
						<video id="upperSection" className="z-0 object-cover min-h-screen min-w-full" src={`/videos/${props.content.code}.mp4`} autoPlay muted loop playsInline></video>

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

async function savingUpData(nickname: string, code: string) {
	const video = document.getElementsByTagName('video')[0] as HTMLVideoElement;
	if (video) {
		const data = { "watched": (video.currentTime / video.duration) * 100 > 97, "volume": video.volume, "time": video.currentTime, "nickname": nickname, "codetag": code }
		console.log(data)
		await fetch("/api/content/savingupdata", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then((response) => {
			return response.json();
		}).then((data: { code: number }) => {
			if (data.code === 2) {
				if ((video.currentTime / video.duration) * 100 > 97) {
					return true;
				}
			} else if (data.code === 1) {
				console.log("Invalid data")
			} else {
				console.log("Invalid request")
			}
		})

	}
	return false;
}
function Render(idFilm: { idFilm: string; }) {
	if (Hls.isSupported()) {
		const id = idFilm.idFilm.split("::")[0]
		const time = parseInt(idFilm.idFilm.split("::")[1] as string)
		const volume = parseFloat(idFilm.idFilm.split("::")[2] as string)
		const nickname = idFilm.idFilm.split("::")[3]
		const video = document.getElementsByTagName('video')[0] as HTMLVideoElement;
		if (video && !video.currentSrc) {
			const config = {
				autoStartLoad: true,
				timelineController: TimelineController,
			};
			const hls = new Hls(config);
			hls.on(Hls.Events.MEDIA_ATTACHED, function () {
				console.log('video and hls.js are now bound together !');
			});
			hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
				console.log(data);
				console.log(
					'manifest loaded, found ' + data.levels.length.toString() + ' quality level',
				);
			});
			hls.loadSource(`/manifests/${id}/${id}.m3u8`); //`/manifests/${props.posts["res"][0] as string}/${props.posts["res"][0] as string}.m3u8`
			hls.attachMedia(video);

			video.volume = volume;
			video.onloadedmetadata = function () {
				video.currentTime = time;
			}
			setInterval(() => savingUpData(nickname as string, id as string), 10000);
		}
		return <></>
	} else {
		return <></>
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
async function startwatching(code: string, tag: string, nickname: string) {
	if (typeof window === "object") {
		const id = atob(code).replace("rebmuNtnetnoC", "")
		const data = { "codetag": btoa(id + "::" + tag), "nickname": nickname }
		await fetch("/api/content/startwatching", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then((response) => {
			return response.json();
		}).then((data: { code: number, playKey: string, timeKey: string }) => {
			if (data.code === 2) {
				location.href = location.pathname + "?watch=" + data.playKey + "&timeKey=" + data.timeKey;
			} else if (data.code === 1) {
				console.log("Invalid data")
			} else {
				console.log("Invalid request")
			}
		})
	}
}
async function save(code: string, nickname: string) {
	if (typeof window === "object") {
		const button = document.getElementById("saveButton") as HTMLInputElement;
		const data = { "code": code, "nickname": nickname }
		await fetch("/api/content/save", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then((response) => {
			return response.json();
		}).then((data: { code: number, added: boolean }) => {
			if (data.code === 2) {
				button.checked = data.added
			} else if (data.code === 1) {
				console.log("Invalid nickname")
			} else {
				console.log("Invalid request")
			}
		})
	}
}
async function buy(code: string, price: number, nickname: string, balance: number) {
	if (typeof window === "object") {
		const btn = document.getElementById("buyButton") as HTMLButtonElement;
		if (price > balance) {
			btn.innerHTML = "Недостаточно средств"
			btn.disabled = true;
			setTimeout(() => {
				btn.innerHTML = `Приобрести за ${price}АР`;
				btn.disabled = false;
			}, 3000)
		} else {
			const data = { "code": code, "price": price, "nickname": nickname }
			await fetch("/api/content/buy", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			}).then((response) => {
				return response.json();
			}).then((data: { code: number }) => {
				if (data.code === 2) {
					location.reload()
				} else if (data.code === 1) {
					console.log("Invalid nickname")
				} else {
					console.log("Invalid request")
				}
			})
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
	const nickname = await prisma.user.findUnique({
		where: {
			id: session.user.id
		},
		select: {
			nickname: true
		}
	})
	const newContent = await prisma.film.findUnique({
		where: {
			code: ctx.query.id as string
		},
		select: {
			id: true,
			imgID: true,
			content: true,
			describe: true,
			mark: true,
			watched: true,
			types: true,
			timing: true,
			studio: true,
			subscription: true,
			price: true,
			more: true,
			code: true,
			datePremiere: true,
		},
	})

	if (newContent && nickname && typeof ctx.query.id === "string") {
		const id = atob(ctx.query.id).replace("rebmuNtnetnoC", "")
		const watchedo = await prisma.view.findMany({
			where: {
				nickname: nickname.nickname,
				watched: true,
			},
			select: {
				codetag: true,
			}
		})
		const content: filmmakers = {
			id: newContent.id,
			imgID: newContent.imgID,
			content: newContent.content,
			describe: newContent.describe,
			mark: newContent.mark,
			watched: newContent.watched,
			types: [],
			timing: newContent.timing,
			studio: newContent.studio,
			subscription: newContent.subscription,
			datePremiere: newContent.datePremiere.toDateString(),
			price: newContent.price,
			more: newContent.more,
			code: newContent.code,
		};
		const watched = []
		if (watchedo && watchedo[0] && atob(watchedo[0].codetag as string).includes("EPS")) {
			for (let i = 0; i < watchedo.length; i++) {
				if (atob(watchedo[i]?.codetag as string).split("::")[0]?.includes(id)) {
					watched.push(atob(watchedo[i]?.codetag as string).split("::EPS")[1])
				}
			}
		}
		for (let i = 0; i < newContent.types.length; i++) {
			if (newContent.types[i] === "comedy")
				content.types.push("комедия")
			else if (newContent.types[i] === "horror")
				content.types.push("хорор")
			else if (newContent.types[i] === "romance")
				content.types.push("романс")
			else if (newContent.types[i] === "action")
				content.types.push("экшн")
			else if (newContent.types[i] === "drama")
				content.types.push("драма")
			else if (newContent.types[i] === "thriler")
				content.types.push("триллер")
			else if (newContent.types[i] === "fantasy")
				content.types.push("фэнтэзи")
			else if (newContent.types[i] === "historical")
				content.types.push("исторический")
			else if (newContent.types[i] === "darkcomedy")
				content.types.push("чёрная комедия")
			else if (newContent.types[i] === "musicals")
				content.types.push("мьюзикл")
			else if (newContent.types[i] === "animated")
				content.types.push("анимационный")
		}
		const datenow = new Date();
		const isBeforePremier = datenow < newContent.datePremiere ? true : false;
		if (ctx.query.watch && typeof ctx.query.watch === "string" && ctx.query.timeKey && typeof ctx.query.timeKey === "string") {
			const playKey = ctx.query.watch;
			const decodePlayKey = atob(playKey).split("::")
			const nickname = decodePlayKey[1]
			const key = decodePlayKey[2]
			const newCode = atob(decodePlayKey[0] as string)
			const timeKey = ctx.query.timeKey
			const newUUID = randomUUID();
			const oldKey = await prisma.view.findUnique({
				where: {
					codetag: btoa(newCode),
					nickname: nickname
				},
				select: {
					key: true
				}
			})
			if (oldKey?.key === key) {
				await prisma.view.update({
					where: {
						codetag: btoa(newCode),
						nickname: nickname,
					},
					data: {
						key: newUUID,
					}
				})
				const encodedCode = btoa(newCode)
				return {
					props: {
						content,
						isBeforePremier,
						encodedCode,
						timeKey,
						watched
					}
				}
			} else {
				return {
					redirect: { destination: "/main" },
					props: {
					}
				}
			}
		} else {
			return {
				props: {
					content,
					isBeforePremier,
					watched

				}
			}
		}

	} else {
		return {
			props: {}
		}
	}
}