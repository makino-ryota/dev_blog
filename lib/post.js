import path from "path";
import fs from "fs";
import matter from "gray-matter";

//process.cwd はカレントディレクトリ（ルートディレクトリ）を指し、postsフォルダのパスを取得
const postsDirectory = path.join(process.cwd(), "posts")

// mdファイルのデータを取り出す
export function getPostsData() {

    // const fetchData = await fetch("endpoint")

    // post内を配列として返す
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName)=>{
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