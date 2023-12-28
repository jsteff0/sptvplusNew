import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
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

				</header>

				<main className="flex flex-col align-middle items-center flex-auto p-2">
				<section
							className="z-10  laptop:bg-gradient-to-r bg-[#000000df] from-[#000000e8] from-[35%] to-transparent absolute h-screen w-full left-0 flex laptop:justify-normal justify-center">
							<div className="laptop:max-w-[40%] max-w-screen px-10 py-20 flex flex-col items-center">
								<img src={`/preview/${props.content.imgID}_m.png`} className="" alt="" />
								<div className="font-medium smltp:text-[13px] text-[9px] text-[rgb(173,173,173)] flex smltp:gap-[8px] gap-[4px] justify-center font-['Montserrat']">
									<span className={`${props.content.mark >= 2.5 ? props.content.mark >= 3.9 ? "text-[#00760C]" : "text-[#766300]" : "text-[#761500]"}`}>{(props.content.mark.toString().includes('.')) ? props.content.mark : `${props.content.mark}.0`}</span>
									<span>{props.content.watched >= 1000000 ? `${(props.content.watched / 1000000).toFixed(1)}M` : props.content.watched > 1000 ? `${(props.content.watched / 1000).toFixed(1)}K` : props.content.watched}</span>
									<span>{datePremiere.getFullYear()}</span>
									<span>{props.content.types.map((item: string) => {
										return <><span className="">{props.content.types[props.content.types.length - 1] === item ? item : `${item}, `}</span></>
									})}</span>
									<span>{props.content.timing.length > 1 ? `${props.content.timing.length} сери${(props.content.timing.length % 10 === 2 || props.content.timing.length % 10 === 3 || props.content.timing.length % 10 === 4) && (props.content.timing.length !== 12 && props.content.timing.length !== 13 && props.content.timing.length !== 14) ? "и " : "й"}` : `${Math.floor(props.content.timing[0] ? props.content.timing[0] / 60 : 0.1)} минут${props.content.timing[0] && (props.content.timing[0] / 60) % 10 === 1 && props.content.timing[0] !== 10 ? "a " : props.content.timing[0] && (((props.content.timing[0] / 60) % 10 === 2 && props.content.timing[0] !== 12) || ((props.content.timing[0] / 60) % 10 === 3 && props.content.timing[0] !== 13) || ((props.content.timing[0] / 60) % 10 === 4 && props.content.timing[0] !== 14)) ? "ы " : " "}`}</span>
									<span>{props.content.studio}</span>
								</div>
								<div className="flex justify-center font-normal text-white text-[20px] p-10 font-['Montserrat']">{props.content.describe}</div>
								<div className="flex gap-2 h-full font-['Montserrat']">
									{!props.content.youtube ?
										!props.isBeforePremier ?
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
																			{props.watched.includes((i + 1).toString()) ? <i className="text-[12px] ">Просмотренно</i> : <></>}
																		</button>
																	</>
																)
															})}
														</section>
													</>
													:
													<button onClick={() => startwatching(props.content.code, "FLM", data.nickname as string)} className="px-4 py-2 bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold flex items-center gap-2">Начать просмотр</button>
												:
												<div className="flex flex-col items-center gap-1">
													<Link href={"/subs"} className="px-4 py-2 bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold">Оформить подписку</Link>
													<p className="text-white text-[12px] opacity-75">или</p>
													<button id="buyButton" onClick={() => buy(props.content.code, props.content.price, data.nickname as string, data.balance)} className="text-white opacity-75 text-[14px] hover:underline">Приобрести за {props.content.price}АР</button>
												</div>
											:
											<button onClick={() => startwatching(props.content.code, "TLR", data.nickname as string)} className="px-4 py-2 bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold">Смотреть трейлер</button>
										:
										<button onClick={() => location.href = props.content.youtube as string} className="px-4 py-2 bg-[#ffb300] text-white hover:bg-white hover:text-[#ffb300] ease-out duration-300 rounded-full text-[14px] font-bold">Смотреть на YouTube</button>
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
					<video id="bgvideo" className="z-0 object-cover min-h-screen min-w-full" src={`/videos/${props.content.code}.mp4`} autoPlay muted loop playsInline></video>

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