import Head from "next/head";
import Link from "next/Link";

export default function FirstPost(){
    return (
        <div>
            <Head>
                <title>最初の投稿</title>
            </Head>
            <h1>再hその投稿</h1>
            <Link href="/">ホームへ戻る</Link>
        </div>
    );
}