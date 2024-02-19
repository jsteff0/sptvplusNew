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
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Header from "../../app/components/header";
import Footer from "../../app/components/footer";

interface filmmakers {
	id: number;
	name: string;
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
	youtube: string | null;
	show: number;
}
export default function Home(props: {
	content: filmmakers, isBeforePremier: boolean, encodedCode: string, timeKey: string, lastwatched: number, timeKeys: number[], startedwatch: { content: filmmakers }[], isFav: boolean, isAcq: boolean
}) {
	const { data: session } = useSession();
	const { data } = api.user.contentinfo.useQuery();
	const router = useRouter().query.id;
	useEffect(() => {
		Render({ idFilm: props.encodedCode + "::" + props.timeKey + "::" + (data ? data?.volume : 0.5) + "::" + (data ? data?.nickname : "DrDro20") })
	})

	const [formData, setFormData] = useState<{
		rate: number;
		nickname: string;
		id: string;
	}>(
		{
			rate: 5,
			nickname: "",
			id: typeof router === "string" ? router : ""
		}
	);
	const [rated, setRated] = useState<number>(5)
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
					<title>{props.content.name}</title>
					<link rel="icon" href="/favicon.ico" />
					<meta name="description" content={props.content.name} />
					<meta name="og:image" content={`/preview/${props.content.imgID}_a.png`} />
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
							onClick={() => { savingUpData(data.nickname as string, router as string, atob(props.encodedCode).split("::")[0] as string).then(() => location.href = location.origin + "/content/" + (typeof router === "string" ? router : null)).catch((err) => console.log(err)); }}
							src="/control/exitBtn.svg" width={30} height={30} className="m-10" alt="" />
					</div>


					<video className="z-10 h-screen w-screen" id="mainvideo"
						onEnded={() => savingUpData(data.nickname as string, router as string, atob(props.encodedCode).split("::")[0] as string)}
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
							if (sec % 15 === 0) {
								savingUpData(data.nickname as string, router as string, atob(props.encodedCode).split("::")[0] as string).catch((err) => console.log(err));
							}
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

		const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
			setFormData({
				...formData,
				rate: parseInt(e.target.value),
			});
		};
		async function subm(event: FormEvent<HTMLFormElement>) {
			event.preventDefault()
			const alertTitle = document.getElementById(`alertTitle`);
			const alertContect = document.getElementById(`alertContect`);
			if (data?.nickname && formData.rate && alertTitle && alertContect) {
				const fstdata = formData
				fstdata.nickname = data.nickname

				await fetch('/api/content/mark', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(fstdata),
				}).then((response) => {
					return response.json();
				}).then((data: { code: number }) => {
					if (data.code === 2) {
						alertTitle.innerHTML = "Спасибо"
						alertContect.innerHTML = `Спасибо что помогаете делать просмотр фильмов на диванчике лучше`
						switchWind("mark")
						switchWind("alert")
						setTimeout(() => {
							switchWind("alert")
						}, 3000)
					} else if (data.code === 1) {
						alertTitle.innerHTML = "Ошибка"
						alertContect.innerHTML = `Сообщите drdro20. Извините за неудобства`
						switchWind("mark")
						switchWind("alert")
						setTimeout(() => {
							switchWind("alert")
						}, 3000)
					} else {
						alertTitle.innerHTML = "Ошибка"
						alertContect.innerHTML = `Сообщите drdro20. Извините за неудобства`
						switchWind("mark")
						switchWind("alert")
						setTimeout(() => {
							switchWind("alert")
						}, 3000)
					}
				})

			}
		}
		const datePremiere = new Date(props.content.datePremiere)
		return (
			<>
				<Head>
					<title>{props.content.name}</title>
					<link rel="icon" href="/favicon.ico" />
					<meta name="description" content={props.content.name} />
					<meta name="og:image" content={`/preview/${props.content.imgID}_a.png`} />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				</Head>
				<div className="min-h-screen flex flex-col bg-[#E1E1E1] dark:bg-[#000000]">
					<Header balance={data.balance} subscription={data.subscription} UUID={data.UUID ? `https://api.mineatar.io/face/${data.UUID}` : "/randomguy.png"} nickname={data.nickname} />
					<section id="alert" className="fixed inset-0 overflow-y-auto z-20 hidden">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<div onClick={() => switchWind("alert")} className="fixed inset-0 bg-black bg-opacity-25"></div>
							<div className="w-full max-w-md transform  overflow-hidden rounded-2xl bg-[#272727] p-6 text-left align-middle shadow-xl transition-all z-22">
								<b id="alertTitle" className=" text-white text-[20px] font-['Montserrat']" ></b><br />
								<div id="alertContect" className="mt-4 text-white">

								</div>
							</div>
						</div>
					</section>

					<section id="more" className="fixed inset-0 overflow-y-auto z-30 hidden">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<div className="fixed inset-0 bg-black bg-opacity-25"></div>
							<div className="font-['Montserrat'] w-full max-w-md transform  overflow-hidden rounded-2xl bg-[#272727] p-6 text-left align-middle shadow-xl transition-all z-22">
								<b className=" text-white text-[20px] ">Подробнее</b><br />
								<div className="mt-4 text-white">
									{props.content.more}
									{!props.isBeforePremier ?
										<button onClick={() => { switchWind("more"); switchWind("mark") }}
											className="bg-[#373737] px-5 mt-6 text-white font-semibold text-[12px] hover:shadow-md h-[40px] rounded-[20px] flex items-center ease-out duration-300">
											<Image alt="Звезда" className="mr-2" width={12} height={12} src={"/buttons/star.png"} />
											Оценить
										</button>
										:
										null
									}
								</div>
								<div className="mt-4 flex justify-end gap-3">
									<button onClick={() => switchWind("more")} className="px-4 py-2 bg-[#373737] rounded-[15px]"><span className="text-[#FFE400] font-bold">Отмена</span></button>
								</div>
							</div>
						</div>
					</section>
					<section id="mark" className="fixed inset-0 overflow-y-auto z-30 hidden">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<div onClick={() => switchWind("mark")} className="fixed inset-0 bg-black bg-opacity-25"></div>
							<form onSubmit={subm}>
								<div className="w-full max-w-md transform  overflow-hidden rounded-2xl bg-[#272727] p-6 text-left align-middle shadow-xl transition-all">
									<b className=" text-white text-[20px] font-['Montserrat']">Оценка</b><br />

									<div className="flex m-4 font-['Montserrat'] text-white font-bold">
										<span className="opacity-40 m-2 text-[12px]">Ужастно</span>
										<label htmlFor="rt1" className="flex flex-col items-center">
											<input type="radio" name="rating" id="rt1" value={1} className="hidden peer" onChange={handleChange} />
											<Image src={`/icons/rating/1${rated === 1 ? "ch" : ""}.svg`} alt="1" width={40} height={40} className="peer-checked:animate-pulse" onClick={(e) => setRated(parseInt(e.currentTarget.alt))} />
											1
										</label>

										<label htmlFor="rt2" className="flex flex-col items-center">
											<input type="radio" name="rating" id="rt2" value={2} className="hidden peer" onChange={handleChange} />
											<Image src={`/icons/rating/2${rated === 2 ? "ch" : ""}.svg`} alt="2" width={40} height={40} className="peer-checked:animate-pulse" onClick={(e) => setRated(parseInt(e.currentTarget.alt))} />
											2
										</label>

										<label htmlFor="rt3" className="flex flex-col items-center">
											<input type="radio" name="rating" id="rt3" value={3} className="hidden peer" onChange={handleChange} />
											<Image src={`/icons/rating/3${rated === 3 ? "ch" : ""}.svg`} alt="3" width={40} height={40} className="peer-checked:animate-pulse" onClick={(e) => setRated(parseInt(e.currentTarget.alt))} />
											3
										</label>

										<label htmlFor="rt4" className="flex flex-col items-center">
											<input type="radio" name="rating" id="rt4" value={4} className="hidden peer" onChange={handleChange} />
											<Image src={`/icons/rating/4${rated === 4 ? "ch" : ""}.svg`} alt="4" width={40} height={40} className="peer-checked:animate-pulse" onClick={(e) => setRated(parseInt(e.currentTarget.alt))} />
											4
										</label>

										<label htmlFor="rt5" defaultChecked className="flex flex-col items-center">
											<input type="radio" name="rating" id="rt5" value={5} className="hidden peer" onChange={handleChange} />
											<Image src={`/icons/rating/5${rated === 5 ? "ch" : ""}.svg`} alt="5" width={40} height={40} className="peer-checked:animate-pulse" onClick={(e) => setRated(parseInt(e.currentTarget.alt))} />
											5
										</label>
										<span className="opacity-40 m-2 text-[12px]">Замечательно</span>

									</div>

									<div className="mt-4 flex justify-end gap-3">
										<button type="submit" className="px-4 py-2 bg-[#ffbb00] rounded-[15px]"><span className="text-white font-bold">Отправить</span></button>
										<button type="button" onClick={() => switchWind("mark")} className="px-4 py-2 bg-[#373737] rounded-[15px]"><span className="text-[#FFE400] font-bold">Отмена</span></button>
									</div>
								</div>
							</form>
						</div>
					</section >
					{!props.content.youtube && !props.isBeforePremier && ((data.subscription === "MAX" || data.subscription === "fMAX") ? 3 : (data.subscription === "MULTI" || data.subscription === "fMULTI") ? 2 : data.subscription === "ONE" ? 1 : 0) >= props.content.subscription || props.isAcq && props.content.timing.length > 1 ?
						<section id="chooseSeriaWind" className="fixed inset-0 overflow-y-auto z-30 hidden">
							<div className="flex min-h-full items-center justify-center p-4 text-center">
								<div className="fixed inset-0 bg-black bg-opacity-25"></div>
								<div className="w-full max-w-[200px] pt-5 transform overflow-hidden rounded-2xl bg-[#272727] text-left align-middle shadow-xl transition-all z-22">
									<b className="text-white text-[14px] font-['Montserrat'] m-6">Выбрать серию</b><br />
									<section className="flex my-6 h-[200px] flex-col items-center overflow-y-scroll no-scroll-line">
										{props.content.timing.map((item: number, i) => {
											return (
												<>
													<button onClick={() => startwatching(props.content.code, "EPS" + (i + 1), data.nickname as string)} className={`text-white flex-none w-full p-2 hover:bg-[#393939] hover:cursor-pointer`}>
														<b className="text-[18px]">{i + 1} эпизод</b>
														<br />
														<span className="text-[12px]">{`${Math.floor(item / 60)} минут${Math.floor(item / 60) % 10 === 1 && Math.floor(item / 60) !== 11 ? "a" : (Math.floor(item / 60) % 10 === 2 && Math.floor(item / 60) !== 12) || (Math.floor(item / 60) % 10 === 3 && Math.floor(item / 60) !== 13) || (Math.floor(item / 60) % 10 === 4 && Math.floor(item / 60) !== 14) ? "ы" : ""}`}</span>
														<br />
														<div className="mt-2 h-[3px] w-full bg-white rounded-full">
															<div id="progressed" className={`h-[3px] bg-[#e5d332] rounded-full`}></div>
														</div>
													</button>
												</>
											)
										})}
									</section>
									<div className="mt-4 flex justify-end gap-3 p-2">
										<button onClick={() => switchWind("chooseSeriaWind")} className="px-4 py-2 bg-[#373737] rounded-[15px]"><span className="text-[#FFE400] font-bold">Отмена</span></button>
									</div>
								</div>
							</div>
						</section>
						:
						null
					}

					<main className="flex align-middle relative justify-center flex-auto min-h-[630px]">

						<section
							className="z-10 laptop:bg-gradient-to-r min-h-[630px] relative bg-[#000000df] from-[#000000e8] from-[35%] to-transparent  w-full left-0 flex flex-col laptop:justify-normal justify-center">
							<div className="laptop:max-w-[40%] max-w-screen px-10 py-20 flex flex-col items-center">
								{/* <img src={`/preview/${props.content.imgID}_m.png`} className="laptop:w-auto tablet:w-[50%] w-auto" alt="" /> */}
								 <img src={`https://storage.yandexcloud.net/sptvplus/logoCBD.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YCAJEDAEuDdFxX7nnNR3EBkAC%2F20240217%2Fru-central1%2Fs3%2Faws4_request&X-Amz-Date=20240217T180051Z&X-Amz-Expires=10086400&X-Amz-Signature=37EA4A4AAB0F98187A9F0399934CABD3E870AF7298FC6516A7990E041A88CBEB&X-Amz-SignedHeaders=host`} className="laptop:w-auto tablet:w-[50%] w-auto" alt="" />
								<div className="font-medium smltp:text-[13px] text-[9px] text-[rgb(173,173,173)] flex smltp:gap-[8px] gap-[4px] justify-center font-['Montserrat']">
									<span onClick={() => switchWind("mark")} className={`${props.content.mark !== 0.0 ? props.content.mark >= 2.5 ? props.content.mark >= 3.9 ? "text-[#00760C]" : "text-[#766300]" : "text-[#761500]" : "text-[#7c7c7c]"} cursor-pointer`}>{props.content.mark !== 0.0 ? props.content.mark.toFixed(1) : `Оценить`}</span>
									<span>{props.content.watched >= 1000000 ? `${(props.content.watched / 1000000).toFixed(1)}M` : props.content.watched > 1000 ? `${(props.content.watched / 1000).toFixed(1)}K` : props.content.watched}</span>
									<span>{datePremiere.getFullYear()}</span>
									<span>{props.content.types.map((item: string) => {
										return <><span className="">{props.content.types[props.content.types.length - 1] === item ? item : `${item}, `}</span></>
									})}</span>
									<span>{props.content.timing.length > 1 ? `${props.content.timing.length} сери${(props.content.timing.length % 10 === 2 || props.content.timing.length % 10 === 3 || props.content.timing.length % 10 === 4) && (props.content.timing.length !== 12 && props.content.timing.length !== 13 && props.content.timing.length !== 14) ? "и " : "й"}` : `${Math.floor(props.content.timing[0] ? props.content.timing[0] / 60 : 0.1)} минут${props.content.timing[0] && (props.content.timing[0] / 60) % 10 === 1 && props.content.timing[0] !== 10 ? "a " : props.content.timing[0] && (((props.content.timing[0] / 60) % 10 === 2 && props.content.timing[0] !== 12) || ((props.content.timing[0] / 60) % 10 === 3 && props.content.timing[0] !== 13) || ((props.content.timing[0] / 60) % 10 === 4 && props.content.timing[0] !== 14)) ? "ы " : " "}`}</span>
									<span>{props.content.studio}</span>
								</div>
								<div className="flex justify-center font-normal text-white text-[20px] p-10 font-['Montserrat']">{props.content.describe}</div>
								<div className={`gap-2 font-['Montserrat'] flex`}>
									{!props.content.youtube ?
										!props.isBeforePremier ?
											((data.subscription === "MAX" || data.subscription === "fMAX") ? 3 : (data.subscription === "MULTI" || data.subscription === "fMULTI") ? 2 : data.subscription === "ONE" ? 1 : 0) >= props.content.subscription || data.acq.includes(props.content.code)
												?
												props.content.timing.length > 1
													?
													<button onClick={() => {
														if (props.lastwatched !== -1) {
															void startwatching(props.content.code, "EPS" + props.lastwatched, data.nickname as string)
														} else {
															switchWind("chooseSeriaWind")
														}
													}} className="peer-checked:hidden block flex-none px-4 py-2 bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold">{props.lastwatched !== -1 ? `Продолжить c ${props.lastwatched} серии` : "Выбрать эпизод"}</button>
													:
													<button onClick={() => startwatching(props.content.code, "FLM", data.nickname as string)} className="peer-checked:hidden block flex-none px-4 py-2 bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold">{!props.timeKeys.length || props.timeKeys[0] === 0 ? "Начать просмотр" : `Продолжить просмотр`}</button>
												:
												<div className="flex flex-col items-center gap-1">
													<Link href={"/subs"} className="px-4 py-2 bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold">Оформить подписку</Link>
													<p className="text-white text-[12px] opacity-75">или</p>
													<button id="buyButton" onClick={(e) => { buy(props.content.code, props.content.price , data.nickname as string, data.balance).catch((err) => { console.log(err) }); e.currentTarget.disabled = true }} className="text-white opacity-75 text-[14px] hover:underline">{props.content.price > 0 ? `Приобрести за ${props.content.price}АР` : `Бесплатный просмотр`}</button>
												</div>
											:
											<button onClick={() => startwatching(props.content.code, "TLR", data.nickname as string)} className="px-4 py-2 bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold">Смотреть трейлер</button>
										:
										<button onClick={() => location.href = props.content.youtube as string} className="px-4 py-2 bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold">Смотреть на YouTube</button>
									}
									<div className="flex">
										<input type="checkbox" checked={data.fav.includes(props.content.code)}  className="peer hidden" id="saveButton" />
										<label htmlFor="saveButton" onClick={() => save(props.content.code, data.nickname as string)}
											className="bg-[#171717] peer-checked:bg-[#ffb300] w-[40px] shadow h-[40px] rounded-[20px] mr-2 flex items-center justify-center ease-out duration-300 cursor-pointer disabled:cursor-default">
											<Image width={20} height={20} src="/buttons/saveICN.svg" alt="" className="absolute w-[20px] h-[20px]" />
										</label>
										<button id="moreButton" onClick={() => switchWind("more")}
											className="bg-[#171717] w-[40px] shadow h-[40px] rounded-[20px] mr-2 flex items-center justify-center ease-out duration-300 cursor-pointer disabled:cursor-default">
											<Image width={20} height={20} src="/buttons/moreICN.svg" alt="" className="absolute w-[20px] h-[20px]" />
										</button>


										{props.lastwatched !== -1 ?
											!props.content.youtube ?
												!props.isBeforePremier ?
													((data.subscription === "MAX" || data.subscription === "fMAX") ? 3 : (data.subscription === "MULTI" || data.subscription === "fMULTI") ? 2 : data.subscription === "ONE" ? 1 : 0) >= props.content.subscription || props.isAcq ?
														props.content.timing.length > 1 ?
															<button id="markContent" onClick={() => switchWind("chooseSeriaWind")}
																className="bg-[#171717] px-5 py-2 text-white font-semibold text-[12px] shadow h-[40px] rounded-[20px] flex items-center justify-center ease-out duration-300">
																<Image width={20} height={20} src="/buttons/episodes.svg" alt="" className="absolute w-[20px] h-[20px]" />

															</button>
															:
															null
														:
														null
													:
													null
												:
												null
											:
											null
										}

									</div>
								</div>
							</div>
							{props.startedwatch.length > 0 ? <div className="smltp:max-w-full tablet:max-w-[345px] max-w-full w-full h-[201px] tablet:h-[282px] pl-5 my-6 flex-col justify-start items-start gap-[25px] inline-flex">
								<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Продолжить просмотр</div>
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
										{props.startedwatch.map((item: { content: filmmakers }) => {
											if (item.content.show) {
												return (
													<>

														<Link href={`/content/${item.content.code}`} className="relative flex-none px-[12px] last:pr-6">
															<Image width={395} height={180} src={`/preview/${item.content.imgID}.png`} className="tablet:h-[180px] tablet:w-[310px] h-[100px] w-[160px] object-cover rounded-[10px] bg-center" alt="" />
														</Link>
													</>
												)
											} else {
												return
											}
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
							</div> : null}
						</section>
						{/* <video id="bgvideo" className="z-0 object-cover max-h-screen min-w-full" src={`/videos/${props.content.code}BG.mp4`} autoPlay muted loop playsInline></video> */}
						<img src={`/preview/${props.content.id}.png`} className="z-0 object-cover absolute max-h-screen min-h-[630px] min-w-full" alt="" />

					</main>

					<Footer />
				</div>
			</>
		)
	}
}

async function savingUpData(nickname: string, code: string, tag: string) {
	const video = document.getElementsByTagName('video')[0] as HTMLVideoElement;
	if (video) {
		const data = { "watched": (video.currentTime / video.duration) * 100 > 70, "volume": video.volume, "time": video.currentTime, "nickname": nickname, "code": code, "tag": tag }
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
				if ((video.currentTime / video.duration) * 100 > 70) {
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
		const video = document.getElementsByTagName('video')[0] as HTMLVideoElement;
		if (video && !video.currentSrc) {
			document.addEventListener("keypress", async (e) => {
				if (e.key === " ") {
					//console.log("sdasdas")
					if (video.paused) {
						await video.play()
					} else {
						video.pause()
					}
				}
			})
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
		}
		setTimeout(function () {
			if (!video) {
				Render(idFilm)
			}
		}, 3000)
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
		const data = { "code": code, "tag": tag, "nickname": nickname }
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
				button.disabled = false
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
			nickname: true,
			view: {
				select: {
					tag: true,
					contentcode: true,
					timeKey: true,
					content: {
						select: {
							imgID: true,
							code: true,
							subscription: true,
							show: true
						}
					},
				}
			},
			fav: true,
			acq: true,
		}
	})
	const newContent = await prisma.film.findUnique({
		where: {
			code: ctx.query.id as string
		},
	})

	if (newContent && nickname && nickname.view && typeof ctx.query.id === "string") {
		const content: filmmakers = {
			show: newContent.show,
			id: newContent.id,
			name: newContent.name,
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
			youtube: newContent.youtube,
		};
		const timeKeys = Array(newContent.timing.length - 1)
		let lastwatched = -1
		if (newContent.timing.length > 1) {
			for (let i = 0; i < nickname.view.length; i++) {
				const element = nickname.view[i];
				if (element?.contentcode === newContent.code) {
					timeKeys[newContent.id - 1] = element.timeKey
					lastwatched = newContent.id
				}
			}
		} else {
			for (let i = 0; i < nickname.view.length; i++) {
				const element = nickname.view[i];
				if (element?.contentcode === newContent.code) {
					timeKeys[0] = nickname.view[i]?.timeKey
					break
				}
			}
		}
		const startedwatch = nickname.view

		for (let i = 0; i < newContent.types.length; i++) {
			switch (newContent.types[i]) {
				case "comedy":
					content.types.push("комедия")
					break;
				case "horror":
					content.types.push("хорор")
					break;
				case "romance":
					content.types.push("романс")
					break;
				case "action":
					content.types.push("экшн")
					break;
				case "drama":
					content.types.push("драма")
					break;
				case "thriler":
					content.types.push("триллер")
					break;
				case "fantasy":
					content.types.push("фэнтэзи")
					break;
				case "historical":
					content.types.push("исторический")
					break;
				case "darkcomedy":
					content.types.push("чёрная комедия")
					break;
				case "musicals":
					content.types.push("мьюзикл")
					break;
				case "animated":
					content.types.push("анимационный")
					break;
			}
		}
		const datenow = new Date();
		const isBeforePremier = datenow < newContent.datePremiere
		if (ctx.query.watch && typeof ctx.query.watch === "string" && ctx.query.timeKey && typeof ctx.query.timeKey === "string") {
			const playKey = JSON.parse(atob(ctx.query.watch)) as { tag: string, code: string, nickname: string, key: string };
			const timeKey = ctx.query.timeKey
			const newUUID = randomUUID();
			const oldKey = await prisma.view.findUnique({
				where: {
					id: btoa(playKey.nickname + playKey.code + playKey.tag),
				},
				select: {
					key: true,
				}
			})
			if (oldKey?.key === playKey.key && playKey.tag !== "TLR") {
				await prisma.view.update({
					where: {
						id: btoa(playKey.nickname + playKey.code + playKey.tag),
					},
					data: {
						key: newUUID,
					}
				})
				const encodedCode = btoa(playKey.tag + "::" + playKey.code)
				return {
					props: {
						content,
						isBeforePremier,
						encodedCode,
						timeKey,
					}
				}
			} else if(playKey.tag === "TLR") {
				const encodedCode = btoa(playKey.tag + "::" + playKey.code)
				return {
					props: {
						content,
						isBeforePremier,
						encodedCode,
						timeKey,
					}
				}
			} else {
				return {
					redirect: { destination: "/content/" + playKey.code },
					props: {}
				}
			}
		} else {
			if (nickname?.fav && nickname?.acq) {
				let isFav = false
				let isAcq = false
				if(nickname?.fav.includes(content.code)){
					isFav = true
				}
				if(nickname?.acq.includes(content.code)){
					isAcq = true
				}
				return {
					props: {
						content,
						isBeforePremier,
						lastwatched,
						timeKeys,
						startedwatch,
						isFav,
						isAcq,
					}
				}
			} else {
				const isFav = false
				const isAcq = false
				return {
					props: {
						content,
						isBeforePremier,
						lastwatched,
						timeKeys,
						startedwatch,
						isFav,
						isAcq,
					}
				}
			}
		}

	} else {
		return {
			props: {}
		}
	}
}