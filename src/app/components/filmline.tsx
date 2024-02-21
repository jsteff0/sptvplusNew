import Link from "next/link";
import Image from "next/image";

interface filmmakers {
	imgID: string;
	code: string;
	subscription: number;
	show: number;
}
export default function Films({ items, sub, name }: {
	items: filmmakers[];
	sub: number;
	name: string;
}) {
	return (
		<div className=" max-w-full w-full h-[201px] tablet:h-[282px] pl-5 py-2.5 flex-col justify-start items-start gap-[25px] inline-flex">
			<div className="laptop:text-[32px] tablet:text-[24px] font-['Montserrat'] font-bold dark:text-white">{name}</div>
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
					{items.map((item: filmmakers) => {
						if (item.show) {
							return (
								<>
									<Link href={`/content/${item.code}`} className="relative flex-none px-[12px] last:pr-6">
										<Image width={150} height={200} src={`https://sptv-storage.storage.yandexcloud.net/images/preview/${item.imgID}_a.png`} className="tablet:h-[200px] tablet:w-[150px] h-[132px] w-[99px] object-cover peer rounded-[10px] bg-center" alt="" />
										{sub < item.subscription ?
											<Image width={150} height={200} src={`/subscriptions/only${item.subscription === 3 ? "Max" : item.subscription === 2 ? "Multi" : "One"}.svg`} className={`absolute bottom-0 tablet:h-[200px] tablet:w-[150px] h-[132px] w-[99px] object-cover bg-center`} alt="" />
											: null}
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
		</div>
	)
}