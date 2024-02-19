import { readFileSync } from 'fs';
import path from 'path';

export function getStaticProps() {
  const file = path.join(process.cwd(), 'newsinfo.json');
  const data = readFileSync(file, 'utf8');

  return {
    props: {
      data,
    },
  };
}

export default function Home(props: { data: string }) {
  return <code>{props.data}</code>;
}