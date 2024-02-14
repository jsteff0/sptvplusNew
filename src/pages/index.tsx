import Link from "next/link";
import Head from "next/head"; Image
import Image from "next/image";
let flag = 1
import Footer from "../app/components/footer";
export default function Home() {
  return (
    <>
      <Head>
        <title>Главная</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Добро пожаловать на сайт СПTV+" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <header className="fixed flex justify-between items-center px-8 z-30 w-full h-[55px] bg-[#0f0f0f]">
          <Link href="/" className="w-auto h-auto">
            <span className=" text-[#FFE400] font-['Montserrat'] text-[20px] font-extrabold">СП</span>
            <span className=" text-white font-['Montserrat'] text-[20px] font-extrabold text italic">tv+</span>
          </Link>
          <Link href="/main" className=" bg-white py-[4px] px-[15px] rounded-full text-[11px] font-['Montserrat'] font-normal">Начать</Link>
        </header>
        <div className="w-[466px] h-[466px] fixed bg-[#FA9601] blur-[933px] top-6 opacity-25 z-0"></div>
        <div className="w-[466px] h-[466px] fixed bg-[#FAD201] blur-[933px] float-right bottom-10 right-4 opacity-10 z-0"></div>
        <main className="flex-auto mt-[55px] pb-[55px] flex flex-col justify-center align-middle gap-[100px] z-10 bg-[#101010]">
          <section className="h-screen w-screen flex flex-col tablet:items-start items-center">
            <video className="tablet:block hidden relative object-cover z-0 min-h-screen min-w-full" src="/videos/index.mp4" autoPlay muted loop playsInline></video>
            <span className="text-white absolute z-10 font-['Montserrat'] laptop:text-[65px] tablet:text-[37px] text-[26px] font-bold tablet:ml-24 mt-32 ">Новая эра<br /> киноиндустрии<br /> на СП</span>
          </section>
          <section className=" flex flex-row laptop:flex-row tablet:flex-col items-start tablet:items-center justify-center gap-6">
            <Image height={357} width={521} src={`/logo.svg`} className="laptop:w-[521px] laptop:h-[357px] w-[120px] h-[82px]" alt="" />
            <span className="text-white font-['Montserrat'] laptop:text-[60px] tablet:text-[39px] text-[12px] text-start tablet:text-center  font-bold">Главный<br /> телеканал<br /> Страны<br /> Подписчиков</span>
          </section>
          <section className="relative flex flex-col w-full h-auto group">
            <div id="scroll" className="no-scroll-line overflow-x-scroll flex scroll-smooth">
              <div className="flex-none px-2">
                <Image height={200} width={350} src={`/preview/1.png`} className="h-[200px] w-[350px] px-1 object-contain" alt="" />
              </div>
              <div className="flex-none px-2">
                <Image height={200} width={350} src={`/preview/2.png`} className="h-[200px] w-[350px] px-1 object-contain" alt="" />
              </div>
              <div className="flex-none px-2">
                <Image height={200} width={350} src={`/preview/3.png`} className="h-[200px] w-[350px] px-1 object-contain" alt="" />
              </div>
              <div className="flex-none px-2">
                <Image height={200} width={350} src={`/preview/4.png`} className="h-[200px] w-[350px] px-1 object-contain" alt="" />
              </div>
              <div className="flex-none px-2">
                <Image height={200} width={350} src={`/preview/5.png`} className="h-[200px] w-[350px] px-1 object-contain" alt="" />
              </div>
              <div className="flex-none px-2">
                <Image height={200} width={350} src={`/preview/1.png`} className="h-[200px] w-[350px] px-1 object-contain" alt="" />
              </div>
              <div className="flex-none px-2">
                <Image height={200} width={350} src={`/preview/2.png`} className="h-[200px] w-[350px] px-1 object-contain" alt="" />
              </div>
              <div className="flex-none px-2">
                <Image height={200} width={350} src={`/preview/3.png`} className="h-[200px] w-[350px] px-1 object-contain" alt="" />
              </div>
              <div className="flex-none px-2">
                <Image height={200} width={350} src={`/preview/4.png`} className="h-[200px] w-[350px] px-1 object-contain" alt="" />
              </div>
              <div className="flex-none px-2">
                <Image height={200} width={350} src={`/preview/5.png`} className="h-[200px] w-[350px] px-1 object-contain" alt="" />
              </div>

            </div>
            <p className="text-white font-['Montserrat'] font-semibold tablet:text-[24px] text-[20px] my-2 ml-4">Вас ждут эксклюзивные шоу и фильмы собственного производства</p>
          </section>
          <section className="flex laptop:flex-row flex-col justify-center align-middle laptop:gap-20 gap-6">


            <div className="flex flex-col items-center gap-6 group/oneSub cursor-default">
              <span className="text-white text-[20px] font-['Montserrat'] font-medium">Раньше всех</span>
              <div className="border-0 hover:border-[2px] flex flex-col items-center border-[#01BEFA] transition-all duration-500 bg-gradient-to-t via-[#00000000] from-[#01c0fa91] bg-size-200 bg-pos-0 hover:bg-pos-100 z-10">
                <div className="text-white text-[26px] font-['Montserrat'] mt-2 font-bold z-10">16 АР/месяц</div>
                <div className="h-4 w-0 group-hover/oneSub:w-[200px] bg-[#01BEFA] absolute z-0 mt-[20.5px] ease-out duration-150"></div>
                <div className="text-white text-[16px] font-['Montserrat'] font-normal w-[200px] text-center pt-2 mx-4 mb-8">Доступ к каталогу фильмов, сериалов и шоу, а также к новым видео раньше всех.</div>
              </div>
              <div className="group/oneSubB">
                <Link href="/subs" className="text-[#01BEFA] group/oneSubB cursor-pointer text-[0px] font-['Montserrat'] font-bold  z-10 ease-out duration-300  group-hover/oneSub:text-[20px] group-hover/oneSub:block">Подключить</Link>
                <div className="h-[4px] w-0 hover bg-white group/oneSubB group-hover/oneSubB:w-[136px] relative bottom-2 ease-out z-0 duration-150"></div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-6 group/multiSub cursor-default">
              <span className="text-white text-[20px] font-['Montserrat'] font-medium">Делись подпиской</span>
              <div className="border-0 hover:border-[2px] flex flex-col items-center border-[#FAC301] transition-all duration-500 bg-gradient-to-t via-[#00000000] from-[#fac40192] bg-size-200 bg-pos-0 hover:bg-pos-100 z-10">
                <div className="text-white text-[26px] font-['Montserrat'] mt-2 font-bold z-10">24 АР/месяц</div>
                <div className="h-4 w-0 group-hover/multiSub:w-[200px] bg-[#FAC301] absolute z-0 mt-[20.5px] ease-out duration-150"></div>
                <div className="text-white text-[16px] font-['Montserrat'] font-normal w-[200px] text-center pt-2 mx-4 mb-8">Поделитесь эмоциями со своими друзьями. Подключите аккаунты своих 3-х знакомых, и смотрите вместе.</div>
              </div>
              <div className="group/multiSubB">
                <Link href="/subs" className="text-[#FAC301] group/multiSubB cursor-pointer text-[0px] font-['Montserrat'] font-bold  z-10 ease-out duration-300  group-hover/multiSub:text-[20px] group-hover/multiSub:block">Подключить</Link>
                <div className="h-[4px] w-0 hover bg-white group/multiSubB group-hover/multiSubB:w-[136px] relative bottom-2 ease-out z-0 duration-150"></div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-6 group/maxSub cursor-default">
              <span className="text-white text-[20px] font-['Montserrat'] font-medium">Эксклюзивы</span>
              <div className="border-0 hover:border-[2px] flex flex-col items-center border-[#FA7801] transition-all duration-500 bg-gradient-to-t via-[#00000000] from-[#fa790190] bg-size-200 bg-pos-0 hover:bg-pos-100 z-10">
                <div className="text-white text-[26px] font-['Montserrat'] mt-2 font-bold z-10">32 АР/месяц</div>
                <div className="h-4 w-0 group-hover/maxSub:w-[200px] bg-[#FA7801] absolute z-0 mt-[20.5px] ease-out duration-150"></div>
                <div className="text-white text-[16px] font-['Montserrat'] font-normal w-[200px] text-center pt-2 mx-4 mb-8">Все функции предыдущих подписок, а также эксклюзивы со съёмок и моменты невошедшие в видео.</div>
              </div>
              <div className="group/maxSubB">
                <Link href="/subs" className="text-[#FA7801] group/maxSubB cursor-pointer text-[0px] font-['Montserrat'] font-bold  z-10 ease-out duration-300  group-hover/maxSub:text-[20px] group-hover/maxSub:block">Подключить</Link>
                <div className="h-[4px] w-0 hover bg-white group/maxSubB group-hover/maxSubB:w-[136px] relative bottom-2 ease-out z-0 duration-150"></div>
              </div>
            </div>

          </section>
          <section className="flex flex-col items-center group">
            <label htmlFor="QAB" className="text-white peer/QAB font-['Montserrat'] font-bold cursor-pointer">Ответы на вопросы</label>
            <input type="checkbox" className="hidden peer/QAB" id="QAB" />
            <div className="h-[4px] w-0 peer-hover/QAB:w-[100px] peer-checked/QAB:w-[100px] bg-[#FAC301] ease-out duration-200"></div>
            <div className="text-white font-['Montserrat'] w-screen h-0 overflow-hidden group peer/QAB smltp:peer-checked/QAB:h-[800px] tablet:peer-checked/QAB:h-[1200px] peer-checked/QAB:h-[1500px] ease-in-out duration-700 px-10 mt-20">
              <span className="font-medium tablet:text-[20px] text-[14px] "><span className="text-[#FAC301]">{">"}</span> Зачем нужно платить за контент, если можно посмотреть на YouTube?</span><br />
              <span className="font-extralight tablet:text-[16px] text-[12px]">– В первую очередь подписка на наш сервис даёт возможность монетизировать
                контент авторов в рамках СП5. Некоторые проекты на СПtv+ станут эксклюзивами, которые никогда не
                появятся на YouTube. Так же будет вариант гибридного релиза, когда проект попадает в открытый
                доступ для всех через определённое время после премьеры на нашем сервисе. Оплачивая одну из трёх
                подписок на выбор, вы так же помогаете развитию других проектов различных студий и самого
                стримингового сервиса.
              </span>
              <br />
              <br />
              <span className="font-medium tablet:text-[20px] text-[14px] "><span className="text-[#FAC301]">{">"}</span> Как начать пользоваться сервисом?</span><br />
              <span className="font-extralight tablet:text-[16px] text-[12px]">– Для того что бы начать, вам необходимо авторизоваться через ваш Discord
                аккаунт, (ВАЖНО: Вы должны быть игроком #СП5 и иметь доступ к spworlds.ru) после успешной
                авторизации вам предложат доступ к бесплатному контенту. Что бы получить доктуп к эксклюзивному контенту, вам нужно оформить подписку
              </span>
              <br />
              <br />
              <span className="font-medium tablet:text-[20px] text-[14px] "><span className="text-[#FAC301]">{">"}</span> Как оформить подписку?</span><br />
              <span className="font-extralight tablet:text-[16px] text-[12px]">– Во время приобритения подписки, вам предложат пополнить баланс, после пополнения баланса вы сможете преобрести подписку, если баланс будет при нуле когда наступит время оплаты, у вас закроется доступ ко всему платному контенту если баланс будет на нуле
              </span>
              <br />
              <br />
              <span className="font-medium tablet:text-[20px] text-[14px] "><span className="text-[#FAC301]">{">"}</span> Зачем нужно платить за контент, если можно посмотреть на YouTube?</span><br />
              <span className="font-extralight tablet:text-[16px] text-[12px]">– В первую очередь подписка на наш сервис даёт возможность монетизировать
                контент авторов в рамках СП5. Некоторые проекты на СПtv+ станут эксклюзивами, которые никогда не
                появятся на YouTube. Так же будет вариант гибридного релиза, когда проект попадает в открытый
                доступ для всех через определённое время после премьеры на нашем сервисе. Оплачивая одну из трёх
                подписок на выбор, вы так же помогаете развитию других проектов различных студий и самого
                стримингового сервиса.
              </span>
            </div>
          </section>
          <section className="flex flex-col items-center font-['Montserrat']">
            <Image height={70} width={300} src={`/icons/creators.svg`} className="tablet:w-[300px] tablet:h-[70px] w-[120px] h-[28px]" alt="" />

            <p className="tablet:text-[20px] text-[14px] text-white font-semibold w-[250px] text-center py-6">Присоединяйся в нашу команду</p>
            <a className="hover:bg-[#FAD201] hover:border-[#FAD201] hover:text-black text-white tablet:text-[24px] text-[16px] ease-out duration-200 px-8 border-2" href="https://docs.google.com/forms/d/e/1FAIpQLSelqiT10IZYGwVL6nOucPWnHi7WaVYZCnKdJ8YqXZThQlfwJg/viewform?usp=sf_link">Отправить заявку</a>
            <Link className="text-white font-extralight py-1 peer/readmore" href="/SPCrt">Читать больше</Link>
            <div className="peer/readmore h-[2px] w-0 relative top-[-8px] peer-hover/readmore:w-[120px] ease-out duration-100 bg-[#FAD201]"></div>
          </section>
          <section className="flex laptop:flex-row flex-col justify-center gap-[300px]">
            <a href="https://www.youtube.com/@sptelevisions">
              <div className="border-0 hover:border-[2px] border-[#FF0000] transition-all duration-500 bg-gradient-to-t via-[#00000000] from-[#ff000090] bg-size-200 bg-pos-0 hover:bg-pos-100 z-10">
                <div className="flex flex-col items-center px-10">
                  <div className="text-white text-[26px] font-['Montserrat'] mt-2 font-semibold z-10">Подписывайся</div>
                  <Image height={43.4} width={62} src={`/icons/YouTubeIcon.svg`} className="w-[62px] h-[43.4px] my-6" alt="" />
                </div>
              </div>
            </a>
            <a href="https://discord.com/invite/sn4dgnH">
              <div className="border-0 hover:border-[2px] border-[#5865F2] transition-all duration-500 bg-gradient-to-t via-[#00000000] from-[#5865f28d] bg-size-200 bg-pos-0 hover:bg-pos-100 z-10">
                <div className="flex flex-col items-center px-10">
                  <div className="text-white text-[26px] font-['Montserrat'] mt-2 font-semibold z-10">Присоединяйся</div>
                  <Image height={43.4} width={62} src={`/icons/DiscordIcon.svg`} className="w-[62px] h-[43.4px] my-6" alt="" />
                </div>
              </div>
            </a>
          </section>
        </main>
        <Footer />
      </div>

    </>
  );

}

setInterval(() => {
  if (typeof window === "object") {
    const el1 = document.getElementById("scrollT1");
    if (el1) {
      if (flag) {
        el1.scrollLeft = el1.scrollLeft + 350
      } else {
        el1.scrollLeft = el1.scrollLeft - 350
      }

      if (el1.scrollWidth - (el1.scrollLeft + window.innerWidth) == 0) {
        flag = 0
      } else if (el1.scrollLeft == 0) {
        flag = 1
      }

    }
  }

}, 1500)