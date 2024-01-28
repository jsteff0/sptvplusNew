import Head from "next/head";
const Home = () => {

	return (
		<>
			<Head>
				<title>Error404</title>
				<meta name="description" content="Ошибка, не правильный url" />
				<link rel="icon" href="/logo.png" />
			</Head>
			<main className="w-full h-full min-h-screen bg-[#272727]">
				<div className="container mx-auto relative top-[300px]">
					<div className="flex flex-col justify-center content-center align-bottom items-center relative  w-auto gap-[10px]">
						<div className="font-normal font-['Montserrat'] text-xl not-italic text-white w-auto h-auto py-0">Такой страницы не существует</div>
						<a className="font-normal font-['Montserrat'] text-xl not-italic text-[#e4d900] hover:underline w-auto h-auto" href="../main">На главную страницу</a>
					</div>

				</div>
			</main>

		</>
	);
};

export default Home;