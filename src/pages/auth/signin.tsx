import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "~/server/auth";
import Head from "next/head";
import { db } from "~/server/db";

export default function SignIn({ }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  return (
    <>
       <Head>
				<title>СПtv+</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="description" content="Онлайн кинотеатр СПtv+" />
				<meta name="og:image" content={"logoold.png"} />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
			</Head>
      <main className="w-full h-full min-h-screen bg-[#272727]">
        <div className="container mx-auto relative top-[300px]">
          <div className="flex flex-col justify-center content-center align-bottom items-center relative  w-auto gap-[10px]">
            <div className="font-normal font-['Montserrat'] text-xl not-italic text-white w-auto h-auto py-0">Вы не зарегистрированы</div>
            <a className="font-normal font-['Montserrat'] text-xl not-italic text-[#e4d900] hover:underline hover:cursor-pointer w-auto h-auto" onClick={() => signIn("discord")}>Зарегистрироваться</a>
          </div>
        </div>
      </main>
    </>
  );

}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // if(context.query.error === "Callback"){
  //   return { redirect: { destination: "/auth/error" } };
  // }
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    const check = await db.user.findFirst({
      where: {
        id: session.user.id
      },
      select: {
        nickname: true,
      },
    })
    if (!check?.nickname) {
      const dsID = session.user.image?.split("/")[4] ?? ""
      const fetchNick = await fetch("http://82.97.243.67:8080/getNick?id="+dsID).then((responde) => {return responde.text()})
      const nick = fetchNick
      console.log(nick)
      const URL = `https://api.mojang.com/users/profiles/minecraft/${nick}`
      const fetchUUID = await fetch(URL)
      const UUID = await fetchUUID.json() as { id: string, name: string }
      await db.user.update({
        where: {
          id: session.user.id
        },
        data: {
          nickname: UUID.name,
          UUID: UUID.id
        },
      })
    }
    return { redirect: { destination: "/main" } };

  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  }
}