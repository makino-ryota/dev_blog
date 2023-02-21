---
title: " 【ETH #2】フロントエンドとの接続　 "
date: "2023-2-20"
thumbnail: "/images/thumbnail04.jpg"
---

UNCHAIN の課題の備忘録です。
前回はこちらから。

# 1. 前準備　パターン 1

- 【ETH #1】で作成したスマコンもろもろを保存したフォルダと同階層にフロントエンドのプロジェクトを作成する
- `mkdir dApp-starter-project`
-

# 1. 前準備　パターン 2 git clone

- 【ETH #1】で作成したスマコンもろもろを保存したフォルダと同階層にフロントエンドのプロジェクトを作成する
- クローンした場合、Javascript ライブラリのインストール
- `npm install`
- 以下でフロントエンドの表示を確認
- `npm run start`
- メタマスク準備

---

# 2.本番環境準備

### 2-1. トランザクション

例えば以下の tx が発生する。

- 新規にスマコンをデプロイした情報をブロックチェーン上に書き込む
- web サイト上で送信されたスタンプの数をブロックチェーン上に書き込む

### 2-2. （仮想）マイナーの承認を得るための準備

- [Alchemy](https://www.alchemy.com/)の導入
- CREATE APP ボタンを押しテストネット Goerli 選択
- view details⇒view key で HTTP のリンクをコピー（API Key 取得）
- テストネット用 ETH 貰う[①](https://goerlifaucet.com/)、[②](https://faucets.chain.link/goerli)

### 2-3. `hardhat.config.js`ファイルの編集

- Alchemy の APIURL を入力
- Goerli の秘密鍵を入力

Git に上げる際は要注意。  
gitignore に hardhat.config.js を追記する

### 2-4. Goerli Test Network にコントラクトをデプロイ

- スマコンプロジェクトのディレクトリに移動
- `npx hardhat run scripts/deploy.js --network goerli`
- 出力されたコントラクトアドレスを保存。フロントエンド構築時に必要

### 2-5. [トランザクション履歴の確認](https://goerli.etherscan.io/)

コントラクトアドレスを貼り付ける

---

# 3. web アプリ化

ユーザーがイーサリアムネットワークと通信するためには、Web アプリケーションはユーザーのウォレット情報を取得する必要がある。開発した Web アプリケーションにウォレットを接続したユーザーに、スマートコントラクトを呼び出す権限を付与する機能を実装する必要がある。（web サイトへの認証機能と同等）

### 3-1. App.js の編集

フロントエンド部分(REact や Next.js)

- ユーザのウォレットへのアクセスが許可されているか確認
- ユーザーがウォレットに複数のアカウントを持っている場合でも、プログラムはユーザーの 1 つ目のアカウントアドレスを取得
- `const accounts = await ethereum.request({ method: "eth_requestAccounts" });`：持っている場合は、ユーザーに対してウォレットへのアクセス許可を求める。許可されれば、ユーザーの最初のウォレットアドレスを currentAccount に格納
- ウォレットコネクトボタン実装:currentAccount が存在しない場合は、「Connect Wallet」ボタンを実装,currentAccount が存在する場合は、「Wallet Connected」ボタンを実装

---

# 4. web アプリからスマコン呼び出す

### 4-1. import ethers

- [ethers 変数を使えるようにする](https://docs.ethers.org/v5/getting-started/)(web アプリからコントラクトを呼び出す際に必須の知 s 気)
- `import { ethers } from "ethers";`

### 4-2. 覚えておく概念

#### provider

- `const provider = new ethers.providers.Web3Provider(ethereum);`
- provider (= MetaMask) を設定。 **provider を介して、ユーザーはブロックチェーン上に存在するイーサリアムノードに接続可能**
- MetaMask が提供するイーサリアムノードを使用して、デプロイされたコントラクトからデータを送受信する

#### signer

- `const signer = provider.getSigner();`
- signer は、ユーザーのウォレットアドレスを抽象化したもの
- provider を作成し、**provider.getSigner()を呼び出すだけで、ユーザーはウォレットアドレスを使用してトランザクションに署名し、そのデータをイーサリアムネットワークに送信可能**
- provider.getSigner()は新しい signer インスタンスを返すので、それを使って署名付きトランザクションを送信することが可能

#### コントラクトインスタンス

- コントラクトへの接続を行う

```
const wavePortalContract = new ethers.Contract(
  contractAddress,
  contractABI,
  signer
);
```

- コントラクトの新しいインスタンス作成するために以下 3 つの変数を`ethers.Contract`関数に渡す必要がある
  1. コントラクトのデプロイ先のアドレス（ローカル、テストネット、またはイーサリアムメインネット）
  2. コントラクトの ABI
  3. provider、もしくは signer
- コントラクトインスタンスでは、コントラクトに格納されているすべての関数を呼び出すことが可能。
- もしこのコントラクトインスタンスに provider を渡すと、そのインスタンスは読み取り専用の機能しか実行
- 一方、signer を渡すと、そのインスタンスは読み取りと書き込みの両方の機能を実行できる

### 4-3. contractAddress と contractABI の設定

- contract アドレスを追加する

#### ABI ファイル

ABI（Application Binary Interface）はコントラクトの取り扱い説明書。**Web アプリケーションがコントラクトと通信するために必要な情報が、ABI ファイルに含まれている。**  
コントラクト一つ一つにユニークな ABI ファイルが紐づいており、その中には下記の情報が含まれている。

1. そのコントラクトに使用されている関数の名前
2. それぞれの関数にアクセスするため必要なパラメータとその型
3. 関数の実行結果に対して返るデータ型の種類

ABI ファイルは、**コントラクトがコンパイルされた時に生成**され、artifacts ディレクトリに自動的に格納

#### コントラクトにデータを書き込む、データを読み込む、について

主な違いはコントラクトに新しいデータを書き込むときは、マイナー（バリデータ）に通知が送られ、tx の承認が求められること。  
データ読込はその必要がなく、ガス代はかからない。

---

# 5. テスト実行

- `npm run start`
