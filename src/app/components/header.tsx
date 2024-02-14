import Link from "next/link";
import Image from "next/image";

export default function Header({ balance, subscription, UUID, nickname }: {
	balance: number
	subscription: string;
	UUID: string;
	nickname: string;
}) {
	return (
		<header className="fixed flex justify-between items-center px-8 z-20 w-full h-[55px] bg-[#0f0f0f]">
			<Link href="/main" className="w-auto h-auto">
				<span className=" text-[#FFE400] font-['Montserrat'] text-[20px] font-extrabold">СП</span>
				<span className=" text-white font-['Montserrat'] text-[20px] font-extrabold text italic">tv+</span>
			</Link>
			<div className="float-right flex align-center gap-[14px]">
				{/* <div className="flex items-center tablet:gap-2 gap-1">
					<span className="font-['Montserrat'] font-normal tablet:text-[18px] text-[15px] text-white text-center">Баланс: <b>{balance}<span className="text-[#FFE400] font-bold"> AP</span></b></span>
					<button onClick={() => switchWind("addMoney")}>
						<Image alt="" src={`/buttons/addbtn.svg`} width={18} height={19}></Image>
					</button>
				</div> */}
				<span className="font-['Montserrat'] font-normal tablet:text-[18px] text-[15px] text-white text-center">Баланс: <b>{balance}<span className="text-[#FFE400] font-bold"> AP</span></b></span>
				<a href={`/users/${nickname}`}>
					{subscription === "MAX" || subscription === "fMAX" ? <>
						<Image alt="" src={`/subscriptions/subsmax.svg`} width={11} height={11} className="float-right right-6 top-[8px] rounded absolute "></Image>
					</> : subscription === "MULTI" || subscription === "fMULTI" ? <>
						<Image alt="" src={`/subscriptions/subsmulti.svg`} width={11} height={11} className="float-right right-6 top-[8px] rounded absolute "></Image>
					</> : subscription === "ONE" ? <>
						<Image alt="" src={`/subscriptions/subsone.svg`} width={11} height={11} className="float-right right-6 top-[8px] rounded absolute "></Image>
					</> : <></>}
					<Image width={30} height={30} className="rounded tablet:w-[30px] w-[25px] tablet:h-[30px] h-[25px]" src={UUID} alt="" />
				</a>
			</div>
		</header>
	)
}
// function switchWind(BlockId: string) {
// 	if (typeof window === "object") {
// 		const element = document.getElementById(`${BlockId}`);
// 		if (element) {
// 			if (element.className.includes("hidden")) {
// 				element.classList.remove("hidden");
// 			} else {
// 				element.classList.add("hidden");
// 			}
// 		}
// 	}
// }