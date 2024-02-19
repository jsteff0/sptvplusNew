import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
interface newsint {
	news: Array<{ text: string, img: string }>;
	newsVideo: Array<{ url: string, name: string, png: string }>;
	mainNews: { title: string, text: string, img: string }
}
export function getStaticProps() {
  const file = path.join(process.cwd(), 'newsinfo.json');
  const data = readFileSync(file, 'utf8');
  const parsedata = JSON.parse(data) as newsint
  parsedata.news.push({
	"text": "ЛЮБОВНИК ВЫПАЛ В ОКНО КОГДА... читать продолжение",
	"img": "image (2).png"
  })
  writeFileSync(file, JSON.stringify(parsedata));
  return {
    props: {
      data,
    },
  };
}

export default function Home(props: { data: string }) {
  return <code>{props.data}</code>;
}