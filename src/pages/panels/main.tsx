/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import newsimport from 'newsinfo.json';
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
// import fsPromises from 'fs/promises';
import { PrismaClient, type Management } from '@prisma/client'
import { useEffect } from "react";

interface filmmakers {
	show: number;
	name: string;
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
	youtube: string | null;
}
interface news {
	news: Array<{ text: string, img: string }>;
	newsVideo: Array<{ url: string, name: string, png: string }>;
	mainNews: { title: string, text: string, img: string }
}

export default function Home(props: { newContent: filmmakers[], management: Management }) {
	const { data: session } = useSession();
	const { data } = api.user.management.useQuery();
	const managementRole = props.management
	useEffect(() => {
		if (!data?.nickname || !session?.user.name) {
			setTimeout(() => {
				document.getElementById("sighoutredirect")?.classList.remove("hidden")
				document.getElementById("sighoutredirect")?.classList.add("block")
			}, 3000)
		}
	})
	if (!data?.nickname || !session?.user.name) {
		return (
			<div className="flex flex-col justify-center items-center align-middle h-screen w-screen">
				<svg className="animate-spin h-[50px] w-[50px] text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<button id="sighoutredirect" onClick={() => location.href = "/auth/signout"} className="hidden hover:cursor-pointer">Если долго грузит, нажми на текст</button>
			</div>
		);
	} else {
		const newsjson = newsimport as news
		return (
			<>
				<Head>
					<title>Панель управления</title>
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
						<a href="add" className="px-4 py-2 bg-[#ffbb00] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold m-2">Добавить контент</a>
						{managementRole === "CONTENT" || managementRole === "FULL" && props.newContent ?
							<>
								<div className="smltp:max-w-full tablet:max-w-[345px] max-w-full w-full h-[201px] tablet:h-[282px] pl-5 py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
									<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Весь контент</div>
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
											{props.newContent.map((item: filmmakers) => {
												return (
													<>
														<Link href={`/content/${item.code}`} className="relative flex-none px-[12px] last:pr-6">
															<Image width={150} height={200} src={`/preview/${item.imgID}_a.png`} className="tablet:h-[200px] tablet:w-[150px] h-[132px] w-[99px] object-cover rounded-[10px] bg-center" alt="" />
															{((data.subscription === "MAX" || data.subscription === "fMAX") ? 3 : (data.subscription === "MULTI" || data.subscription === "fMULTI") ? 2 : data.subscription === "ONE" ? 1 : 0) < item.subscription ?
																<Image width={150} height={200} src={`/subscriptions/only${item.subscription === 3 ? "Max" : item.subscription === 2 ? "Multi" : "One"}.svg`} className="absolute bottom-0 tablet:h-[200px] tablet:w-[150px] h-[20px] w-[99px] object-cover bg-center" alt="" />
																: null}
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

								<div className="w-screen pl-5  py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
									<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Весь контент(в тексте)</div>
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
											{props.newContent.map((item: filmmakers) => {
												return (
													<div className="relative flex-none px-[12px] last:pr-6 w-[300px]" key={"1"}>
														Показывается: {item.show}<hr />
														Название: {item.name}<hr />
														Код: {item.code}<hr />
														Контент: {item.content}<hr />
														Дата премьеры: {item.datePremiere}<hr />
														Описание: {item.describe}<hr />
														ID: {item.id}<hr />
														ID картинки: {item.imgID}<hr />
														Оценка: {item.mark}<hr />
														Подробнее: {item.more}<hr />
														Цена: {item.price}<hr />
														Студия: {item.studio}<hr />
														Подписка: {item.subscription === 3 ? "Max" : item.subscription === 2 ? "Multi" : item.subscription === 1 ? "One" : "никакой"}<hr />
														Время эпизода/фильма {item.timing}<hr />
														Жанр контенка: {item.types}<hr />
														Просмотры: {item.watched}<hr />
														Ссылка на youtube: {item.youtube ? item.youtube : "нету"}<hr />
														<button type="submit" className="text-red-500 font-extrabold" onClick={async (e) => {
															if (e.currentTarget.hasChildNodes()) {
																const input = e.currentTarget.children[0] as HTMLInputElement
																if (input.value) {
																	const fstdata = { "code": item.code, "key": input.value, "nickname": data.nickname }
																	await fetch("/api/private/content/delete", {
																		method: 'POST',
																		headers: {
																			'Content-Type': 'application/json'
																		},
																		body: JSON.stringify(fstdata)
																	}).then((response) => {
																		return response.json();
																	}).then((data: { code: number }) => {
																		if (data.code === 2) {
																			alert(`${item.name} удалён`)
																			location.reload()
																		} else if (data.code === 3) {
																			alert(`${input.value} не верен`)
																		} else if (data.code === 1) {
																			throw new Error("Invalid data")
																		} else {
																			throw new Error("Invalid request")
																		}
																	})
																} else {
																	alert(`Код не введён`)
																}
															}
														}}>УДАЛИТЬ <input autoComplete="off" required type="text" placeholder="Ключ безопасности" id="securityKey" /></button>
													</div>
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
							</> :
							<div className="text-black dark:text-white">No content</div>
						}
						{
							managementRole === "NEWS" || managementRole === "FULL" && newsjson ?
							<>
							{newsjson.news.length > 0 ?
								<div className="w-full pl-5 py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
									<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Новости</div>
									<div className="relative flex w-full group">
										<div
											onScroll={(e) => {
												if (e.currentTarget.scrollLeft > 12) {
													e.currentTarget.children[0]?.classList.replace("group-hover:opacity-0", "group-hover:opacity-100")
												} else {
													e.currentTarget.children[0]?.classList.replace("group-hover:opacity-100", "group-hover:opacity-0")
												}
												if (e.currentTarget.scrollLeft + e.currentTarget.offsetWidth < e.currentTarget.scrollWidth - 100) {
													e.currentTarget.children[e.currentTarget.children.length - 1]?.classList.replace("group-hover:opacity-0", "group-hover:opacity-100")
												} else {
													e.currentTarget.children[e.currentTarget.children.length - 1]?.classList.replace("group-hover:opacity-100", "group-hover:opacity-0")
												}
											}} className="no-scroll-line overflow-x-scroll flex scroll-smooth group ">
											<div onClick={(e) => {
												const parentEl = e.currentTarget.parentNode as HTMLDivElement
												if (parentEl.scrollLeft > 450)
													parentEl.scrollLeft -= 450
												else
													parentEl.scrollLeft = 0
											}} className="absolute w-[75px] h-full bg-gradient-to-r from-[#000000b2] to-[#ffffff00] flex items-center duration-300 ease-in-out group-hover:opacity-0 opacity-0">
												<div className="p-2">
													<svg className="w-[23px] h-[45px] hover:w-[26px]" viewBox="0 0 23 40" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M18.5105 38.9583L0.958446 21.4583C0.750113 21.25 0.602197 21.0243 0.514697 20.7812C0.427197 20.5382 0.384142 20.2777 0.385531 20C0.385531 19.7222 0.428586 19.4618 0.514697 19.2187C0.600808 18.9757 0.748724 18.75 0.958446 18.5416L18.5105 0.989542C18.9966 0.503431 19.6043 0.260376 20.3334 0.260376C21.0626 0.260376 21.6876 0.520793 22.2084 1.04163C22.7293 1.56246 22.9897 2.1701 22.9897 2.86454C22.9897 3.55899 22.7293 4.16663 22.2084 4.68746L6.89595 20L22.2084 35.3125C22.6946 35.7986 22.9376 36.3979 22.9376 37.1104C22.9376 37.8229 22.6772 38.4388 22.1564 38.9583C21.6355 39.4791 21.0279 39.7395 20.3334 39.7395C19.639 39.7395 19.0314 39.4791 18.5105 38.9583Z" fill="white" />
													</svg>
												</div>
											</div>
											{newsjson.news.map((item: { text: string, img: string }) => {
												return (
													<>
														<div className="flex-none px-[12px] first:pl-6 last:pr-6 ">
															<div className="flex flex-col items-center justify-center">
																<Image width={285} height={160} src={`/news/${item.img}`} className="dark:border-[1px] tablet:w-[285px] tablet:h-[160px] w-[160px] h-[90px] object-cover rounded-t-[10px] bg-center" alt="" />
																<div className="relative bottom-0 tablet:w-[285px] w-[160px] tablet:h-[60px] h-[33px] bg-[#0000007b] dark:bg-[#7a7a7a7b] rounded-b-[10px] flex flex-col justify-center items-center">
																	<div className="text-white font-['Montserrat'] font-medium tablet:text-[13px] text-[9px] w-auto tablet:p-3 p-1 h-auto">{item.text}</div>
																</div>
															</div>
														</div>
													</>
												)
											})}
											<div onClick={(e) => {
												const parentEl = e.currentTarget.parentNode as HTMLDivElement
												if (parentEl.scrollLeft + parentEl.offsetWidth < parentEl.scrollWidth - 450)
													parentEl.scrollLeft += 450
												else
													parentEl.scrollLeft = parentEl.scrollWidth - parentEl.offsetWidth
											}} className={`absolute float-right right-0 w-[75px] h-full bg-gradient-to-l from-[#000000b2] to-[#ffffff00] flex justify-end items-center duration-300 ease-in-out group-hover:opacity-100 opacity-0 `}>
												<div className="p-2">
													<svg className="w-[23px] h-[45px] hover:w-[26px]" viewBox="0 0 23 40" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M4.86472 1.04158L22.4168 18.5416C22.6251 18.7499 22.773 18.9756 22.8605 19.2187C22.948 19.4617 22.9911 19.7221 22.9897 19.9999C22.9897 20.2777 22.9467 20.5381 22.8605 20.7812C22.7744 21.0242 22.6265 21.2499 22.4168 21.4583L4.86472 39.0103C4.3786 39.4964 3.77097 39.7395 3.0418 39.7395C2.31263 39.7395 1.68763 39.4791 1.1668 38.9583C0.645966 38.4374 0.38555 37.8298 0.38555 37.1353C0.38555 36.4409 0.645967 35.8333 1.1668 35.3124L16.4793 19.9999L1.1668 4.68742C0.680692 4.20131 0.437635 3.602 0.437635 2.8895C0.437636 2.177 0.698052 1.56103 1.21889 1.04158C1.73972 0.52075 2.34736 0.260333 3.0418 0.260333C3.73625 0.260334 4.34389 0.52075 4.86472 1.04158Z" fill="white" />
													</svg>
												</div>
											</div>
										</div>
									</div>
								</div>
								: null}
							{newsjson.newsVideo.length > 0 ?
								<div className="w-full h-[201px] tablet:h-[282px] pl-5  py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
									<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Последние выпуски новостей</div>
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
											{newsjson.newsVideo.map((item: { url: string, name: string, png: string }) => {
												return (
													<Link href={`${item.url}`} key={""} className="flex-none px-[12px] last:pr-6">
														<div className="flex flex-col items-center justify-center gap-3">
															<Image width={285} height={180} src={`/news/${item.png}`} className="tablet:h-[180px] tablet:w-[285px] h-[100px] w-[160px] object-cover rounded-[10px] bg-center" alt="" />
														</div>
														<div className="text-black dark:text-white tablet:text-[16px] text-[12px]">{item.name}</div>
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
								: null}
							{newsjson.mainNews ? <>
								<div className="w-full h-auto tablet:h-[468px] pl-5  py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
									<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">Новость недели</div>
									<div className="flex laptop:flex-row flex-col gap-4">
										<Image alt="" src={`/news/${newsjson.mainNews.img}`} width={420} height={236} className=" laptop:w-[420px] w-[300px] laptop:h-[236px] h-[170px] object-cover rounded-[30px]" />
										<div className="flex flex-col justify-center gap-6">
											<span className="font-['Montserrat'] font-bold text-[20px] dark:text-white">{newsjson.mainNews.title}</span>
											<span className="font-['Montserrat'] font-light text-[16px] w-[70%] dark:text-white">{newsjson.mainNews.text}</span>
										</div>
									</div>
								</div>
							</>
								: null}
						</>
							: <div className="text-black dark:text-white">No news</div>} 
					</main>
					<footer className="relative z-10 left-0 bottom-0 w-full h-[105px] bg-[#272727] hidden tablet:block">
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
	const manageRole = await prisma.user.findFirst({
		where: {
			id: session.user.id,
		},
		select: {
			management: true
		},
	})
	if (manageRole) {
		const management = manageRole.management
		if (management === "NO") {
			return {
				redirect: { destination: "/main" },
				props: {}
			}
		} else if (management === "CONTENT") {
			const content = await prisma.film.findMany({})
			if (content.length > 0) {
				const newContent: filmmakers[] = new Array(content.length)
				for (let i = 0; i < content.length; i++) {
					if (content[i]) {
						newContent[i] = {
							show: content[i]?.show as number,
							id: content[i]?.id as number,
							name: content[i]?.name as string,
							imgID: content[i]?.imgID as string,
							content: content[i]?.content as string,
							describe: content[i]?.describe as string,
							mark: content[i]?.mark as number,
							watched: content[i]?.watched as number,
							types: content[i]?.types as string[],
							timing: content[i]?.timing as number[],
							studio: content[i]?.studio as string,
							subscription: content[i]?.subscription as number,
							datePremiere: content[i]?.datePremiere.toDateString() as string,
							price: content[i]?.price as number,
							more: content[i]?.more as string,
							code: content[i]?.code as string,
							youtube: content[i]?.youtube as string,
						}
					}
				};
				return {
					props: {
						newContent,
						management,
					}
				}
			}
			return {
				props: {
					management
				}
			}

		} else if (management === "NEWS") {
			return {
				props: {
					management
				}
			}
		} else if (management === "FULL") {
			const content = await prisma.film.findMany({})
			if (content.length > 0) {
				const newContent: filmmakers[] = new Array(content.length)
				for (let i = 0; i < content.length; i++) {
					if (content[i]) {
						newContent[i] = {
							show: content[i]?.show as number,
							id: content[i]?.id as number,
							name: content[i]?.name as string,
							imgID: content[i]?.imgID as string,
							content: content[i]?.content as string,
							describe: content[i]?.describe as string,
							mark: content[i]?.mark as number,
							watched: content[i]?.watched as number,
							types: content[i]?.types as string[],
							timing: content[i]?.timing as number[],
							studio: content[i]?.studio as string,
							subscription: content[i]?.subscription as number,
							datePremiere: content[i]?.datePremiere.toDateString() as string,
							price: content[i]?.price as number,
							more: content[i]?.more as string,
							code: content[i]?.code as string,
							youtube: content[i]?.youtube as string,
						}
					}
				};
				return {
					props: {
						newContent,
						management,
					}
				}

			} else {
				return {
					props: {
						management,
					}
				}
			}
		}
		return {
			redirect: { destination: "/auth/signin" },
			props: {}
		}
	} else {
		return {
			props: {}
		}
	}
}