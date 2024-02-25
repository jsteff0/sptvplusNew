import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signOut } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "~/server/auth";
import Head from "next/head";

export default function SignIn({  }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  return (
    <>
      <Head>
				<title>СПtv+</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="description" content="Онлайн кинотеатр СПtv+" />
				<meta name="og:image" content={"/logoold.png"} />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
			</Head>
      <main className="w-full h-full min-h-screen bg-[#272727]">
        <div className="container mx-auto relative top-[300px]">
          <div className="flex flex-col justify-center content-center align-bottom items-center relative w-auto gap-[10px]">
            <div className="font-normal font-['Montserrat'] text-xl not-italic text-white w-auto h-auto py-0">Вы точно хотите выйти из системы?</div>
            <a className="font-normal font-['Montserrat'] text-xl not-italic text-[#e4d900] hover:underline hover:cursor-pointer w-auto h-auto" onClick={() => signOut()}>Выйти</a>
          </div>
        </div>
      </main>
    </>
  );

}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    
    return { redirect: { destination: "/auth/signin" } };

  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  }
}