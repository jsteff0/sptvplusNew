import Head from "next/head";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import Header from "../../app/components/header";
import Footer from "../../app/components/footer";
import { getServerAuthSession } from "~/server/auth";
import { PrismaClient } from '@prisma/client'


export default function Home(props: {
	contents: {
		name: string;
		timing: number[];
	}[]
}) {
	const episodesContent: {
		name: string;
	}[] = []
	for (let i = 0; i < props.contents.length; i++) {
		const el = props.contents[i]
		if (el && el.timing.length > 1) {
			episodesContent.push(el)
		}
	}
	const [file, setFile] = useState<File>()
	const [isEpisods, setIsEpisods] = useState<boolean>(false)
	const [picture, setPicture] = useState<File>()
	const [poster, setPoster] = useState<File>()
	const [genreCheck, setgenreCheck] = useState<string[]>([])
	const [durations, setDurations] = useState<number[]>([])
	const [postertext, setPostertext] = useState<File>()
	function checking(e: ChangeEvent<HTMLInputElement>) {
		if (e.currentTarget.checked) {
			const genreCheck2 = genreCheck
			genreCheck2.push(e.currentTarget.name)
			setgenreCheck(genreCheck2)
			//console.log(genreCheck)
		} else {
			const genreCheck2 = genreCheck
			genreCheck2.splice(genreCheck2.indexOf(e.currentTarget.name), 1)
			setgenreCheck(genreCheck2)
			//console.log(genreCheck)
		}

	}
	const { data: session } = useSession();
	const { data } = api.user.management.useQuery();
	//console.log(data?.nickname)
	const [formData, setFormData] = useState<{
		nickname: string;
		name: string;
		type: string,
		genres: string[],
		studio: string,
		smdescribe: string,
		duration: number[],
		subscription: number,
		date: Date,
		prise: number,
		more: string,
		youtube: string | null,
	}>(
		{
			nickname: data?.nickname as string,
			name: '',
			type: '',
			genres: ["1"],
			studio: '',
			smdescribe: '',
			duration: [1],
			subscription: 0,
			date: new Date,
			prise: 0,
			more: '',
			youtube: null,
		}
	);
	const [formDataNews, setFormDataNews] = useState<{
		nickname: string;
		text: string | null
		title: string | null
		name: string
		youtube: string | null
		imgName: string
	}>(
		{
			nickname: data?.nickname as string,
			text: '',
			title: '',
			name: '',
			youtube: null,
			imgName: '',
		}
	);
	const [formDataShow, setFormDataShow] = useState<{ nickname: string, name: string, isshow: number }>(
		{
			nickname: data?.nickname as string,
			name: "",
			isshow: 1,
		}
	);
	const [formDataNewEps, setFormDataNewEps] = useState<{ nickname: string, name: string, timing: number }>(
		{
			nickname: data?.nickname as string,
			name: "",
			timing: 1,
		}
	);

	const handleChangeNews = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (e.target.name !== "date") {
			setFormDataNews({
				...formDataNews,
				[e.target.name]: e.target.value,
			});
		} else {
			const date = new Date(e.target.value)
			setFormDataNews({
				...formDataNews,
				name: "Выпуст от " + date.getDay() + "." + date.getMonth() + "." + date.getFullYear(),
			});
		}
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		if (e.target.name !== "date") {
			setFormData({
				...formData,
				[e.target.name]: e.target.value,
			});
		} else {
			setFormData({
				...formData,
				date: new Date(e.target.value),
			});
		}
	};
	const handleChangeShow = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormDataShow({
			...formDataShow,
			[e.target.name]: e.target.value,
		});
	};
	const handleChangeEps = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormDataNewEps({
			...formDataNewEps,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmitNews = async (e: FormEvent) => {
		e.preventDefault();
		const dataForm = new FormData()
		dataForm.set('type', "news")

		if (file) {
			dataForm.set('file', file)
			formDataNews.imgName = file.name
		}

		const fstdata = formDataNews
		fstdata.nickname = data?.nickname as string
		await fetch("/api/private/content/addNews", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(fstdata)
		}).then((response) => {
			return response.json();
		}).then((data: { code: number }) => {
			if (data.code === 2) {
				alert("Добавлено")
			} else if (data.code === 1) {
				alert("Ошибка")
				location.reload()
			} else {
				alert("Ошибка")
				location.reload()
			}
		})


		const res2 = await fetch('/api/upload', {
			method: 'POST',
			body: dataForm
		})
		if (!res2.ok) throw new Error(await res2.text())
		setFormDataNews({
			nickname: data?.nickname as string,
			text: '',
			title: '',
			name: '',
			youtube: null,
			imgName: '',
		})
		alert("Контент успешно добавлен")
	}

	const handleSubmitContent = async (e: FormEvent) => {
		e.preventDefault();
		if (genreCheck.length === 0) {
			console.log(formData)
			alert("Выберите хотя бы один жанр")
		} else {
			if (isEpisods && durations.length === 0) {
				const elDur = document.getElementById("durations")
				if (elDur && elDur.childElementCount) {
					for (let i = 0; i < elDur.childElementCount - 1; i++) {
						const element = elDur.children[i + 1] as HTMLInputElement;
						console.log(element, element.value)
						if (element.name.includes("duration")) {
							const duration = durations
							duration.push(parseInt(element.value))
							setDurations(duration)
						}
					}
				}
			}
			console.log(durations)
			setFormData({
				...formData,
			});
			const fstdata = formData
			let ID = "0"
			fstdata.duration = durations
			fstdata.genres = genreCheck
			fstdata.nickname = data?.nickname as string
			await fetch("/api/private/content/add", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(fstdata)
			}).then((response) => {
				return response.json();
			}).then((data: { code: number, filename: string }) => {
				if (data.code === 2) {
					ID = data.filename
				} else if (data.code === 1) {
					throw new Error(data.filename)
				} else {
					throw new Error("Invalid request")
				}
			})
			const dataForm = new FormData()
			if (picture) {
				const blob = picture.slice(0, picture.size, 'image/png');
				const newFile = new File([blob], ID + '.png', { type: 'image/png' });
				dataForm.set('picture', newFile)
			}
			if (poster) {
				const blob = poster.slice(0, poster.size, 'image/png');
				const newFile = new File([blob], ID + '_a.png', { type: 'image/png' });
				dataForm.set('poster', newFile)
			}
			if (postertext) {
				const blob = postertext.slice(0, postertext.size, 'image/png');
				const newFile = new File([blob], ID + '_m.png', { type: 'image/png' });
				dataForm.set('postertext', newFile)
			}

			dataForm.set('type', "content")

			const res2 = await fetch('/api/upload', {
				method: 'POST',
				body: dataForm
			})
			if (!res2.ok) throw new Error(await res2.text())
			alert("Контент успешно добавлен")
			setDurations([])
		};
	}
	const handleSubmitNewEps = async (e: FormEvent) => {
		e.preventDefault();
		const fstdata = { "timing": formDataNewEps.timing, "name": formDataNewEps.name, "nickname": data?.nickname as string }
		await fetch("/api/private/content/addEps", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(fstdata)
		}).then((response) => {
			return response.json();
		}).then((data: { code: number }) => {
			if (data.code === 2) {
				alert(`В ${formDataNewEps.name} успешно добавлена серия`)
			} else if (data.code === 1) {
				throw new Error("Invalid data")
			} else {
				throw new Error("Invalid request")
			}
		})
	}
	const handleSubmitShow = async (e: FormEvent) => {
		e.preventDefault();
		const fstdata = { "change": formDataShow.isshow, "name": formDataShow.name, "nickname": data?.nickname as string }
		await fetch("/api/private/content/isShows", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(fstdata)
		}).then((response) => {
			return response.json();
		}).then((data: { code: number }) => {
			if (data.code === 2) {
				alert(`${formDataShow.name} успешно показывается пользователям`)
			} else if (data.code === 3) {
				alert(`${formDataShow.name} успешно скрыт от пользователей`)
			} else if (data.code === 1) {
				throw new Error("Invalid data")
			} else {
				throw new Error("Invalid request")
			}
		})
	}


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
					<Header balance={data.balance} subscription={data.subscription} UUID={data.UUID ? `https://api.mineatar.io/face/${data.UUID}` : "/randomguy.png"} nickname={data.nickname} />

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
						<a href="main" className="px-4 py-2 bg-[#ffbb00] rounded-[15px] text-white font-bold m-8">Назад</a>
						{
							data.management === "CONTENT" || data.management === "FULL" ?
								<div className="w-[400px] flex flex-col items-center m-6 gap-6">
									<div className="bg-[#1c1c1c] p-4 rounded-[15px]">
										<p className=" text-white text-[20px] font-bold">Добавить контент</p>

										<form className="text-white" onSubmit={handleSubmitContent}>
											<div className="flex flex-col">
												<input onChange={handleChange} type="text" placeholder="Название" maxLength={50} className="w-full h-[40px] bg-[#313131] p-6 my-4 rounded-[15px]" name="name" required />

												<label className="text-white my-4">Картинка <input onChange={(e) => setPicture(e.target.files?.[0])} type="file" name="picture" required /></label>
												<label className="text-white my-4">Постер <input onChange={(e) => setPoster(e.target.files?.[0])} type="file" name="poster" required /></label>
												<label className="text-white my-4">Текст <input onChange={(e) => setPostertext(e.target.files?.[0])} type="file" name="postertext" required /></label>

												<input onChange={handleChange} type="text" placeholder="Студия производства" className="w-full h-[40px] bg-[#313131] p-6 my-4 rounded-[15px]" name="studio" required />


												<select onChange={handleChange} className="w-full bg-[#313131] p-2 my-4 rounded-[15px]" name="type" required >
													<option disabled selected>Выберите тип загружаемого контента</option>
													<option value={"movies"}>Фильм</option>
													<option value={"series"}>Сериал</option>
													<option value={"shows"}>Шоу</option>
												</select>

												<textarea onChange={handleChange} className="w-full h-[160px] bg-[#313131] p-6 my-4 rounded-[15px] " name="smdescribe" placeholder="Не большое описание" cols={30} rows={10} required ></textarea>

												<div className="text-[18px]">Выберите хотя бы один жанр</div>
												<label htmlFor="comedy">Комедия <input type="checkbox" name="comedy" onChange={(e) => checking(e)} /></label>
												<label htmlFor="drama">Драма <input type="checkbox" name="drama" onChange={(e) => checking(e)} /></label>
												<label htmlFor="thriler">Триллер <input type="checkbox" name="thriler" onChange={(e) => checking(e)} /></label>
												<label htmlFor="romance">Романс <input type="checkbox" name="romance" onChange={(e) => checking(e)} /></label>
												<label htmlFor="horror">Хорор <input type="checkbox" name="horror" onChange={(e) => checking(e)} /></label>
												<label htmlFor="fantasy">Фэнтэзи <input type="checkbox" name="fantasy" onChange={(e) => checking(e)} /></label>
												<label htmlFor="historical">Исторический <input type="checkbox" name="historical" onChange={(e) => checking(e)} /></label>
												<label htmlFor="darkcomedy">Чёрная комедия <input type="checkbox" name="darkcomedy" onChange={(e) => checking(e)} /></label>
												<label htmlFor="musicals">Мьюзикл <input type="checkbox" name="musicals" onChange={(e) => checking(e)} /></label>
												<label htmlFor="action">Экшн <input type="checkbox" name="action" onChange={(e) => checking(e)} /></label>
												<label htmlFor="animated">Анимационный <input type="checkbox" name="animated" onChange={(e) => checking(e)} /></label>
												<label className="text-white">Много серийный контент </label><input type="checkbox" className="peer" onChange={(e) => {
													if (e.currentTarget.checked)
														setIsEpisods(true)
													else
														setIsEpisods(false)
												}} />
												{isEpisods ?
													<div id="durations" className="peer-checked:block hidden">
														<input type="number" className="w-full h-[40px] bg-[#313131] p-6 my-4 rounded-[15px]" min={1} name="cntEps" placeholder="Количество эпизодов" required onChange={(e) => {
															const parentNode = e.currentTarget.parentElement as HTMLDivElement
															const value = !e.currentTarget.value || parseInt(e.currentTarget.value) < 0 ? 0 : parseInt(e.currentTarget.value)
															if (value < parentNode.children.length - 1) {
																for (let i = parentNode.children.length - 1; i > value; i--) {
																	const el = parentNode.children[i];
																	if (el) {
																		el.remove()
																	}
																}
															} else {
																for (let i = value - (parentNode.children.length - 1); i > 0; i--) {
																	const newInput = document.createElement("input")
																	newInput.type = "number"
																	newInput.className = "w-full h-[40px] bg-[#313131] p-6 my-4 rounded-[15px]"
																	newInput.placeholder = "Длительность в секундах " + (value - i + 1)
																	newInput.required = true
																	newInput.name = (value - i + 1) + "duration"
																	parentNode.appendChild(newInput)
																}
															}
														}} />
													</div> :
													<input onChange={(e) => setDurations([parseInt(e.currentTarget.value)])} type="number" placeholder="Длительность контента в секундах" className="peer-checked:hidden block w-full h-[40px] bg-[#313131] p-6 my-4 rounded-[15px]" name="1duration" />

												}


												<select onChange={handleChange} className="w-full bg-[#313131] p-2 my-4 rounded-[15px]" name="subscription" required>
													<option disabled selected>Выберите подписку</option>
													<option value={3}>Max</option>
													<option value={2}>Multi</option>
													<option value={1}>One</option>
													<option value={0}>Никакой</option>
												</select>

												<label htmlFor="date" className="text-white ">Дата премьеры <br /><input onChange={handleChange} className="text-white w-full h-[40px] bg-[#313131] p-6 my-4 rounded-[15px]" type="date" name="date" id="date" /></label><br />

												<input onChange={handleChange} type="number" placeholder="Цена" className="w-full h-[40px] bg-[#313131] p-6 my-4 rounded-[15px]" name="prise" required />

												<textarea onChange={handleChange} className="w-full h-[160px] bg-[#313131] p-6 my-4 rounded-[15px] " name="more" placeholder="Подробнее" cols={30} rows={10} required></textarea>

												<input onChange={handleChange} type="text" placeholder="Ссылка на YouTube" name="youtube" className="w-full h-[40px] bg-[#313131] p-6 my-4 rounded-[15px]" />
											</div>
											<input type="submit" className="hover:cursor-pointer px-4 py-2 bg-[#ffbb00] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold m-2" />
										</form>
									</div>
									<div className="bg-[#1c1c1c] p-4 rounded-[15px]">
										<p className=" text-white text-[20px] font-bold">Добавить серию</p>
										<form className="text-white" onSubmit={handleSubmitNewEps}>
											<div className="flex flex-col">
												<select className="w-full bg-[#313131] p-2 my-4 rounded-[15px]" onChange={handleChangeEps} name="name" required>
													<option label="Выберете контент" disabled selected></option>
													{props.contents.map((item: { name: string }) => {
														return (
															<><option value={item.name}>{item.name}</option></>
														)
													})}
												</select>
												Время в секундах
												<input onChange={handleChangeEps} type="number" placeholder="Длительность контента в секундах" className="peer-checked:hidden block w-full h-[40px] bg-[#313131] p-6 my-4 rounded-[15px]" name="timing" />

											</div>
											<input type="submit" className="hover:cursor-pointer px-4 py-2 bg-[#ffbb00] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold m-2" />
										</form>
									</div>
									{data.management === "FULL" ?
										<div className="bg-[#1c1c1c] p-4 rounded-[15px]">
											<p className=" text-white text-[20px] font-bold">Отоброзить контент</p>
											<form className="text-white" onSubmit={handleSubmitShow}>
												<div className="flex flex-col">
													<select className="w-full bg-[#313131] p-2 my-4 rounded-[15px]" onChange={handleChangeShow} name="name" required>
														<option label="Выберете контент" disabled selected></option>
														{props.contents.map((item: { name: string }) => {
															return (
																<><option value={item.name}>{item.name}</option></>
															)
														})}
													</select>
													Показывать контент
													<select className="w-full bg-[#313131] p-2 my-4 rounded-[15px]" onChange={handleChangeShow} name="isshow" id="">
														<option value="1">Да</option>
														<option value="0">Нет</option>
													</select>
												</div>
												<input type="submit" className="hover:cursor-pointer px-4 py-2 bg-[#ffbb00] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold m-2" />
											</form>
										</div>
										: null}
								</div>
								:
								null
						}
						{
							data.management === "NEWS" || data.management === "FULL" ?
								<div className="w-[400px] flex flex-col items-center m-6 gap-6">
									<div className="bg-[#1c1c1c] p-4 rounded-[15px]">
										<p className=" text-white text-[20px] font-bold">Добавить новость</p>
										<form className="text-white" onSubmit={handleSubmitNews}>
											<div className="flex flex-col">
												{/* Текст */}
												<input name="text" type="text" placeholder="Текст" maxLength={64} className="w-full h-[40px] bg-[#313131] p-6 my-4 rounded-[15px] " onChange={handleChangeNews} />
												{/* Картинка */}
												<label className="text-white">Картинка <input name="picture" onChange={(e) => setFile(e.target.files?.[0])} type="file" /></label>
											</div>
											<input type="submit" className="hover:cursor-pointer px-4 py-2 bg-[#ffbb00] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold m-2" />
										</form>
									</div>
									<div className="bg-[#1c1c1c] p-4 rounded-[15px]">
										<p className="text-white text-[20px] font-bold">Добавить видео</p>
										<form className="text-white" onSubmit={handleSubmitNews}>
											<div className="flex flex-col">
												{/* Ссылка */}
												<input type="text" name="youtube" placeholder="Ссылка" className="w-full h-[40px] bg-[#313131] p-6 my-4 rounded-[15px]" onChange={handleChangeNews} />
												{/* Дата */}
												<label htmlFor="date" className="text-white ">Дата выпуска <br /><input className="text-white w-full h-[40px] bg-[#313131] p-6 my-4 rounded-[15px]" type="date" name="date" id="date" onChange={handleChangeNews} /></label><br />
												{/* Картинка */}
												<label className="text-white">Картинка <input name="picture" onChange={(e) => setFile(e.target.files?.[0])} type="file" /></label>
											</div>
											<input type="submit" className="hover:cursor-pointer px-4 py-2 bg-[#ffbb00] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold m-2" />
										</form>
									</div>
									<div className="bg-[#1c1c1c] p-4 rounded-[15px]">
										<p className="text-white text-[20px] font-bold">Изменить новость недели</p>
										<form className="text-white" onSubmit={handleSubmitNews}>
											<div className="flex flex-col">
												{/* Заголовок */}
												<input name="title" type="text" placeholder="Заголовок" className="w-full h-[40px] bg-[#313131] p-6 my-4 rounded-[15px]" required onChange={handleChangeNews} />
												{/* Текст */}
												<textarea onChange={handleChangeNews} className="w-full h-[160px] bg-[#313131] p-6 my-4 rounded-[15px]" name="text" placeholder="Подробнее" cols={30} rows={10} required></textarea>
												{/* Картинка */}
												<label htmlFor="" className="text-white">Картинка <input name="picture" onChange={(e) => setFile(e.target.files?.[0])} required type="file" /></label>
											</div>
											<input type="submit" className="hover:cursor-pointer px-4 py-2 bg-[#ffbb00] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold m-2" />

										</form>
									</div>
								</div>
								:
								null
						}
					</main >
					<Footer />
				</div >
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
		} else {
			const contents = await prisma.film.findMany({ select: { name: true, content: true, timing: true } })
			return {
				props: { contents }
			}
		}
	} else {
		return {
			props: {}
		}
	}
}
