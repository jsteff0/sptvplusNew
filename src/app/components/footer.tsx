import Link from "next/link";
import Image from "next/image";

export default function Footer() {

	return (
		<footer className="z-10 w-screen px-[15px] py-5 bg-[#0F0F0F] justify-between items-start hidden tablet:inline-flex relative">
			<section className="h-full w-full smltp:max-w-[570px] smltp:min-w-[453px] mtablet:min-w-[320px] min-w-[258px] mtablet:px-[15px] px-[10px] justify-between items-start flex text-[#797979] smltp:text-[16px] mtablet:text-[12px] text-[10px] font-normal font-['Montserrat'] ">
				<div className="smltp:w-[66px] flex-col justify-start items-start gap-[25px] inline-flex">
					<Link href={"/media/news"} className="hover:text-white ease-out duration-100">Новости</Link>
					<Link href={"/media/series"} className="hover:text-white ease-out duration-100">Сериалы</Link>
					<Link href={"/media/movies"} className="hover:text-white ease-out duration-100">Фильмы</Link>
					<Link href={"/media/show"} className="hover:text-white ease-out duration-100">Шоу</Link>
				</div>
				<div className="smltp:w-[183px] flex-col justify-start items-start gap-[25px] inline-flex">
					<Link href={"/more/aboutus"} className="hover:text-white ease-out duration-100">О нас</Link>
					<Link href={"/more/contacts"} className="hover:text-white ease-out duration-100">Контакты</Link>
					<Link href={"/more/termsofuse"} className="hover:text-white ease-out duration-100">Пользовательское соглашение</Link>
					<Link href={"/more/QA"} className="hover:text-white ease-out duration-100">Вопросы и ответы</Link>
					<Link href={"/more/partners"} className="hover:text-white ease-out duration-100">Партнёрам</Link>
				</div>
				<div className="h-[143px] flex-col justify-start items-start gap-[25px] inline-flex">
					<Link href={"/spcreates"} className="hover:text-white ease-out duration-100">СПtv Creators</Link>
					<Link href={"https://discord.gg/sn4dgnH"} className="hover:text-white ease-out duration-100">Дискорд</Link>
					<div className="justify-start items-start gap-3 inline-flex">
						<Link href={"https://discord.gg/sn4dgnH"} className="w-[29px] h-[29px] relative">
							<picture className="w-[29px] h-[29px] flex justify-center items-center bg-white bg-opacity-10 rounded-full">
								<Image width={16} height={12} src="/icons/Discord.svg" alt="Иконка дискорд" />
							</picture>
						</Link>
						<Link href={"https://www.youtube.com/@sptelevisions"} className="w-[29px] h-[29px] relative">
							<picture className="w-[29px] h-[29px] flex justify-center items-center bg-white bg-opacity-10 rounded-full">
								<Image width={15} height={10} src="/icons/YouTube.svg" alt="Иконка ютуб" />
							</picture>
						</Link>
					</div>
				</div>
			</section>
			<section className="h-[220px] mtablet:px-[15px] px-[10px] flex-col justify-between items-end inline-flex">
				<div className="w-full justify-between items-start mtablet:gap-[19px] gap-[8px] inline-flex text-right text-white font-normal font-['Montserrat']">
					<p className="mtablet:text-[12px] text-[10px]">Ген. Директор: rConidze</p>
					<p className="mtablet:text-[12px] text-[10px]">Директора: Vikss_, re1ron</p>
					<p className="mtablet:text-[12px] text-[10px]">Разработчик: Dro20</p>
				</div>
				<div className="text-right text-white mtablet:text-xs text-[10px] opacity-60 font-['Montserrat']">© Все права защищены 2023-2024. <br />Проект компании СПTV</div>
				<picture className="w-[121px] h-[93px] relative">
					<Image width={87} height={59} src="/SPtv.svg" alt="" />
				</picture>
			</section>
		</footer>
	)
}
