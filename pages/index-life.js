import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from "next/link"
import Layout, { siteTitle } from '../components/Layout'
import Navbar from '../components/Navbar'

import utilStyle from "../styles/utils.module.css";
import { getPostsData } from "../lib/postlife";

// SSGの場合 非同期　getStaticPropsはnextjsが用意した関数
// 外部から一度だけデータを取ってくる
export async function getStaticProps() {
    // idとメタデータ各種格納
    const allPostsData = getPostsData(); //id, title, date, thumbnail
    console.log(allPostsData);

    return {
        props: {
            allPostsData,
        },
    };
}

// SSRの場合
// export async function getServerSideProps(context){
//   return {
//     props:{
//       //コンポーネントに渡すためのprops
//     },
//   };
// }

// homeコンポーネントが受取、レンダリング
export default function Home({ allPostsData }) {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section className={utilStyle.headingMd}>
                <p>
                    人生
                </p>
            </section>

            <section>
                <h2>📝ひとりごと</h2>
                <div className={styles.articleLine}>
                    {allPostsData.map(({ id_life, title, date, thumbnail }) => (
                        <article key={id_life} className={utilStyle.articleDiv}>
                            {/* <Link href={`/posts_life/${id_life}`}>
                                <img
                                    src={`${thumbnail}`}
                                    className={styles.thumbnailImage}
                                />
                            </Link> */}
                            <Link href={`/posts_life/${id_life}`} className={utilStyle.articleTitle}>
                                <p className={utilStyle.boldText}>{title}</p>
                            </Link>
                            <br />
                            <small className={utilStyle.lightText}>
                                {date}
                            </small>
                        </article>
                    ))}
                </div>
            </section>
        </Layout>
    );
}