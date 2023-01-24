import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

//process.cwd はカレントディレクトリ（ルートディレクトリ）を指し、postsフォルダのパスを取得
const postsDirectory = path.join(process.cwd(), "posts_life")

// mdファイルのデータを取り出す
export function getPostsData() {

    // const fetchData = await fetch("endpoint")

    // post内を配列として返す
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        // 拡張子は除去しファイル名(id)を取得
        const id = fileName.replace(/\.md$/, "");

        // マークダウンファイルを文字列として読み取る
        const fullPath = path.join(postsDirectory, fileName);
        // 中身を読み取る 
        const fileContents = fs.readFileSync(fullPath, "utf-8");

        // fileContents内のメタデータ解析開始, title ,data などが配列
        const matterResult = matter(fileContents);

        // idとデータを返す matter resultはスプレッド構文で展開
        // allPostsDataにデータいれるだけ
        return {
            id,
            ...matterResult.data,
        };
    });
    return allPostsData;
}

//getStaticPathでreturn で使うpathを取得
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ""),
            },
        };
    });
    /* オブジェクトとして返される
    [
        {
            params: {
                id: "ssg-ssr"
            }
        }.
        {
            params:{
                id: "next-react"
            }
        }
    ]*/
}

// idに基づいてブログ投稿データを返す
export async function getPostData(id) {
    // マークダウンファイルを文字列として読み取る
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContent = fs.readFileSync(fullPath, "utf8"); //文字列として認識

    const matterResult = matter(fileContent); //metaデータ解析

    //filecontent解析 remarkはマークダウンのメタデータを読込む、matter関数や、ブログの本文をhtmlとしてそのまま出力するremark関数
    const blogContent = await remark()
        .use(html)
        .process(matterResult.content); // ブログの本文がcontent processをいれると、

    const blogContentHTML = blogContent.toString();

    return {
        // idに対応したblog, matterrusult（メタデータ）を返すことができる
        id,
        blogContentHTML,
        ...matterResult.data,
    };
}