import Head from "next/head";
import Link from "next/link";

export default function Home() {

  return (
    <>
      <Head>
        <title>Error</title>
        <meta name="description" content="Добро пожаловать на сайт СПTV+" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full h-full min-h-screen bg-[#272727]">
        <div className="container mx-auto relative top-[300px]">
          <div className="flex flex-col justify-center content-center align-bottom items-center relative  w-auto gap-[10px]">
            <div className="font-normal font-['Montserrat'] text-xl not-italic text-white w-auto h-auto py-0">Произошла ошибка регистрации, попробуйте позже</div>
            <Link className="font-normal font-['Montserrat'] text-xl not-italic text-[#e4d900] hover:underline hover:cursor-pointer w-auto h-auto" href="/">Программист криворукий</Link>
          </div>
        </div>
      </main>
    </>
  );

}
