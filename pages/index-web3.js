import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from "next/link"
import Layout, { siteTitle } from '../components/Layout'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import utilStyle from "../styles/utils.module.css";
import { getPostsData } from "../lib/postweb3";
import Navbar from '../components/Navbar'

// SSGの場合 非同期　getStaticPropsはnextjsが用意した関数
// 外部から一度だけデータを取ってくる
export async function getStaticProps() {
  // id_web3とメタデータ各種格納
  const allPostsData = getPostsData(); //id_web3, title, date, thumbnail
  console.log(allPostsData);

  return {
    props: {
      allPostsData,
    },
  };
}

// SSRの場合
// export async function getServerSid_web3eProps(context){
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
          ICP, BTC, Lightning Network, zkプロダクトetc
        </p>
      </section>

      <section>
        <h2>📝ブロックチェーン関連</h2>
        <div className={styles.grid}>
          {allPostsData.map(({ id_web3, title, date, thumbnail }) => (
            <article key={id_web3}>
              {/* <Link href={`/posts_web3/${id_web3}`}>
                <img
                  src={`${thumbnail}`}
                  className={styles.thumbnailImage}
                />
              </Link> */}
              <Link href={`/posts_web3/${id_web3}`} className={utilStyle.articleDiv}>
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