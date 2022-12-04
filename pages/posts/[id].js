import Head from "next/head";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/post";
import utilStyles from "../../styles/utils.module.css";

//指定したパスを事前に静的生成（SSG)
export async function getStaticPaths() {
    const paths = getAllPostIds();

    return {
        paths,
        // pathsに含まれていなかったら404エラー
        fallback: false,
    };
}

//SSG idを基に記事の内容を変える プリレンダリングするときに外部からデータもってきて
export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id);

    return {
        props: {
            postData,
        },
    };
}

//外部からひっぱてきたpostdataをコンポーネントに渡してあげて表示する
export default function Post({ postData }) {
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingX1}>{postData.title}</h1>
                <div className={utilStyles.lightText}>{postData.date}</div>
                <div dangerouslySetInnerHTML={{ __html: postData.blogContentHTML }} />
            </article>
        </Layout>
    );
}