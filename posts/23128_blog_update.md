---
title: "Next.jsにおけるメディアクエリの設定方法"
date: "2023-1-28"
thumbnail: ""
---

# 1. ブログアップデート。
- ナビゲーションバーを追加しました  
メディアクエリの仕様がReactだと癖があったんですね...
- ジャンル別に記事？投稿できるようにした
- 細かいレイアウト変更しました
---
# 2.ナビゲーションバーに対してメディアクエリの設定
試行錯誤した。Next.jsだと色んな方法があったので備忘録として残す。  
今回採用したのは2-2の**画面幅に応じてReactのstateを変更し、それに応じてCSSを適用する方法**である。

## 2-1. CSS
```
.navbar {
  width: 100%;
}

@media only screen and (min-width: 768px) {
  .navbar {
    width: 80%;
  }
}
```
## 2-2. stateを指定して適用するclassNameを変更
```
import React, { useState, useEffect } from 'react'

function Navbar() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <nav className={isMobile ? 'mobile' : 'desktop'}>
      {/* ナビゲーションバーのコンテンツ */}
    </nav>
  )
}

export default Navbar

```
## 2-3. コンポーネントごと入れ替える
画面幅が狭いときには、mobileクラスのコンポーネントを、画面幅が大きいときには、desktopクラスのコンポーネントを表示するように設定することができます。  

```
import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {width < 768 ? <MobileNavbar /> : <DesktopNavbar />}
    </>
  );
};

const MobileNavbar = () => {
  return <div className="navbar mobile"></div>;
};

const DesktopNavbar = () => {
  return <div className="navbar desktop"></div>;
};

export default Navbar;

```  
コンポーネントベースの開発であるが故に上記の考え方ができるの目から鱗でした。   
フロントエンドの設計だけでもかなり奥深そうで、、、  
集中と選択って難しい。


# 今後のブログ改修予定項目（見栄えにこだわるのはほどほどにはしたい...）
- 「ホームへ戻る」は、ジャンル別にアドレス先変更
- HOMEは、また別個で作り、各ページの最新記事3記事ずつピックアップし表示する
- レイアウト変更
- SNS共有機能
- 独自の機能付けたい。ウォレット接続してなんか遊べたり、、、  
機能もりもりのブログにしていきたいです