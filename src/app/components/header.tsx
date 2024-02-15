import Link from "next/link";
import Image from "next/image";

export default function Header({ balance, subscription, UUID, nickname }: {
	balance: number
	subscription: string;
	UUID: string;
	nickname: string;
}) {
	if (localStorage.getItem('dark-mode') === 'true' || (!('dark-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
	return (
		<>
			<header className="fixed flex justify-between items-center px-8 z-20 w-full h-[55px] bg-[#0f0f0f]">
				<Link href="/main" className="w-auto h-auto">
					<span className=" text-[#FFE400] font-['Montserrat'] text-[20px] font-extrabold">СП</span>
					<span className=" text-white font-['Montserrat'] text-[20px] font-extrabold text italic">tv+</span>
				</Link>

				<div className="float-right flex align-center gap-[14px]">
					<button onClick={() => switchDark()} id="theme-toggle" type="button" className="text-white hover:bg-[#151515] hover:shadow-xl shadow-inner rounded-lg text-sm p-1.5 ease-out duration-100">
						<svg id="theme-toggle-dark-icon" className={`${localStorage.getItem('dark-mode') === 'true' || (!('dark-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) ? "hidden" : ""} w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
						<svg id="theme-toggle-light-icon" className={`${localStorage.getItem('dark-mode') === 'true' || (!('dark-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) ? "" : "hidden"} w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
					</button>
					<div className="flex items-center tablet:gap-2 gap-1">
						<span className="font-['Montserrat'] font-normal tablet:text-[18px] text-[15px] text-white text-center">Баланс: <b>{balance}<span className="text-[#ffb300] font-bold"> AP</span></b></span>
						<button onClick={() => switchWind("addMoney")}>
							<Image alt="" src={`/buttons/addbtn.svg`} width={18} height={19}></Image>
						</button>
					</div>
					{/* <span className="font-['Montserrat'] font-normal tablet:text-[18px] text-[15px] text-white text-center mt-[2px]">Баланс: <b>{balance}<span className="text-[#FFE400] font-bold"> AP</span></b></span> */}

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
			<section id="addMoney" className="fixed inset-0 overflow-y-auto z-20 hidden">
				<div className="flex min-h-full items-center justify-center p-4 text-center">
					<div onClick={() => switchWind("addMoney")} className="fixed inset-0 bg-black bg-opacity-25"></div>
					<div className="w-full max-w-md transform  overflow-hidden rounded-2xl bg-[#272727] p-6 text-left align-middle shadow-xl transition-all z-22">
						<b className=" text-white text-[20px] ">Пополнить баланс</b><br />
						<div className="mt-2"><span className="text-white font-['Montserrat']">Баланс: <b>{balance} <span className="text-[#ffb300]">AP</span></b></span></div>
						<div className="mt-4">
							<label htmlFor="money" className="text-white font-['Montserrat']">Добавить на баланс:</label><br />
							<input pattern="[0-9]+" type="number" id="money" required onChange={(e) => {
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
							<button onClick={() => switchWind("addMoney")} className="px-4 py-2 bg-[#373737] rounded-[15px]"><span className="text-[#ffb300] font-bold">Отмена</span></button>
							<button onClick={() => {
								const money = document.getElementById("money") as HTMLInputElement;
								const moneyVal = parseInt(money.value);
								if (moneyVal > 0) {
									addMoney(moneyVal, nickname,).catch((err) => console.log(err));
								}
							}} id="alertButton2" className="px-4 py-2 bg-[#ffb300] rounded-[15px] disabled:text-[#c6c6c6] text-white font-bold">Оплатить</button>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
async function addMoney(_amount: number, _nickname: string) {
	const data = { "amount": _amount, "nickname": _nickname, "redirect": location.href }
	await fetch("/api/player/getMoneyUrl", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then((response) => {
		return response.json();
	}).then((data: { url: string }) => {
		location.href = data.url
	})
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

function switchDark() {
	if (typeof window === "object") {

		const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
		const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
		if (themeToggleDarkIcon && themeToggleLightIcon) {
			if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
				themeToggleLightIcon.classList.add('hidden');
				themeToggleDarkIcon.classList.remove('hidden');
			} else {
				themeToggleDarkIcon.classList.add('hidden');
				themeToggleLightIcon.classList.remove('hidden');
			}
			const themeToggleBtn = document.getElementById('theme-toggle');
			if (themeToggleBtn) {
				if (localStorage.getItem('color-theme')) {
					if (localStorage.getItem('color-theme') === 'light') {
						document.documentElement.classList.add('dark');
						localStorage.setItem('color-theme', 'dark');
					} else {
						document.documentElement.classList.remove('dark');
						localStorage.setItem('color-theme', 'light');
					}
				} else {
					if (document.documentElement.classList.contains('dark')) {
						document.documentElement.classList.remove('dark');
						localStorage.setItem('color-theme', 'light');
					} else {
						document.documentElement.classList.add('dark');
						localStorage.setItem('color-theme', 'dark');
					}
				}
			}
		}
	}
}
