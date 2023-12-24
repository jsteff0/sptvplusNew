/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { PrismaClient } from '@prisma/client'
import { getServerAuthSession } from "~/server/auth";
import Hls, { TimelineController } from "hls.js";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { randomUUID } from "crypto";
import React from "react";

export default function Home(props: { encodedCode: string, timeKey: string }) {
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
							onClick={() => {savingUpData(data.nickname as string, props.encodedCode).then(() => location.reload()).catch((err) => console.log(err)); }}
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
								<Image id="playbuttons" width={18} height={24} src="/control/playBtn.svg" alt=""  />
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
									<div id="volumeValLne" className={`rounded h-[7px] bg-[#e5d332] w-[${data.volume*100}%] relative`}></div>
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
				if((video.currentTime / video.duration) * 100 > 97){
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
	if (ctx.query.id && typeof ctx.query.id === "string" && ctx.query.timeKey && typeof ctx.query.timeKey === "string") {
		const playKey = ctx.query.id;
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
					encodedCode,
					timeKey
				}
			}
		} else {
			return {
				redirect: { destination: "/main" },
				props: {
				}
			}
		}
	}
	return {
		props: {

		}
	}
}