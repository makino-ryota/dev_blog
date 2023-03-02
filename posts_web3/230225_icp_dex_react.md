---
title: " 【ICP #4】DEX作る_React　 "
date: "2023-2-25"
thumbnail: "/images/thumbnail04.jpg"
---

# React.js の準備

# 1. パッケージのインストール

- `npm install --save react react-dom`
- `npm install --save-dev @babel/core babel-loader @babel/preset-react style-loader css-loader`

### 1-1. index.js の編集

### 1-2. App.jsx, App.css 作成

### 1-3. index.html（root）　ブラウザに反映させる

### 1-4.webpack.config.js の編集

- インストールしたパッケージが使用できるよう、必要なデータを環境変数としてフロントエンド側で受け取れるように修正

### 1-5. package.json ファイルの編集

- フロントエンドの環境構築時に実行される generate コマンドを編集
- このコマンドは、dfx.json ファイルに定義したキャニスターのインタフェースを生成
- 生成されたファイルをフロントエンドのキャニスターが読み込むことで、バックエンド側のキャニスターとやり取りすることが可能

### 1-6. IC のためのパッケージインストール

- dfinity が提供する、パッケージをインストール
- IC 上のキャニスターとやり取りを行うフロントエンドの機能を実装するために使われる
- `npm install --save @dfinity/agent @dfinity/auth-client`

#### *エラー*発生

@dfinity/agent パッケージのバージョン 0.15.4 と@dfinity/candid パッケージのバージョン 0.15.4 をインストールしようとした。@dfinity/principal パッケージのバージョン 0.15.3 が見つかったため、競合が発生。全てアップグレードすることで解決した。

- npm cache をクリアする
- `npm cache clean --force`
- `npm install --save @dfinity/candid@0.15.4`
- `npm install --save @dfinity/agent@0.15.4`
- `npm install --save @dfinity/principal@0.15.4`
- `npm install --save @dfinity/auth-client@0.15.4`

# 2. ユーザ認証機能の実装（II）

[II](https://internetcomputer.org/docs/current/tokenomics/identity-auth/what-is-ic-identity) は認証にラップトップの指紋センサーや顔認証システムなどのデバイスと**アンカー（Anchor）**と呼ばれる数字を紐付けることができる

- II 用のキャニスターを [github](https://github.com/dfinity/internet-identity/releases) から取得できる
- dfx.json ファイル内にモジュールへのパスを指定し、II キャニスターをデプロイする

### 2-1. dfx.json を編集し、II キャニスター読み込む

- `internet_identity_div`に書き込む

### 2-2. 認証ボタンの実装(Header.jsx 作成)

- ボタンを押したときに II キャニスター呼び出す
- 認証したユーザの ID を取得
- 実装したら header.jsx 呼び出す**App.jsx**のファイル編集

### 2-3. handleLogin 関数

- 最初にデプロイを行った絵っとワークに応じてアクセスｓるＵＲＬを指定
  - local ならデプロイした II を指定
  - ic ならメインネット専用の認証 URL を指定
  - 上記以外は dfinity のサイト指定
- URL を指定したら AuthClient 実行
  - @dfinity/auth-client から提供される、web アプリケーションを Internet Identity Service で認証させるためのシンプルなインタフェース
  - login 関数、成功・失敗した時の処理をそれぞれ指定可能

### 2-4. ローカルでデプロイ

シェルスクリプト作成

- touch ./scripts/deploy_local.sh
- 全てのキャニスターがデプロイされると、各キャニスターにアクセスするための URL 一覧が出力される

---

# 3. ユーザーボードの作成

ユーザが保有するトークンの情報を一覧表示するボードを作成

- ユーザーの principal を表示
- トークンの保有量を表示
- 各トークに対して facet, deposit, withdraw が行えるボタン表示

### 3-1. ファイル作成

- `UserBoard.jsx`
- DEX で扱うトークン情報をまとめる`src/utils/token.js`

### 3-2. tokens.js

### 3-3. UserBoard.jsx

- ユーザボードの機能＋トークン一覧表示
- `handleFaucet`関数
  - ユーザーの principal が必要な関数をコールする際は、ログイン認証後に作成した agent を用い、キャニスターの関数をコールする必要がある
  - ここでは faucet キャニスターの`getToken`関数を実行する際にユーザ principal が必要
  - 入金を行う`handleDeposit`関数や出金を行う handleWithdraw 関数でも同様に agent を使用する

#### 3-3-1. updateUserToken 関数

- ユーザが保有するトークンの残高、ユーザが DEX に預けたトークンの残高を取得。
- `setUserTokens`は React の useState フックで管理された userTokens ステート変数を更新するための関数で、更新されたトークン情報は UserBoard コンポーネント内で再レンダリングされる
- updateUserToken 関数は非同期関数であるため、await キーワードを用いて非同期処理の完了を待っている。したがって、updateUserToken 関数の呼び出し元である handleWithdraw 関数も async/await を使用している。

#### 3-3-2. handleWithdraw 関数

- トークンの種類を特定するために、updateIndex を引数
- DEXCreateActor 関数を使用して、DEX のアクターを作成.DEXCreateActor 関数には、DEX の Canister ID と、オプションとしてエージェントが含まれる.
- DEXActor.withdraw 関数を使用して、トークンを出金.withdraw 関数には、出金するトークンの Canister ID と、出金するトークンの量を含む。ここでは TOKEN_AMOUNT 変数を使用して、出金するトークンの量を指定。
- 出金が成功した場合は、updateUserToken 関数を呼び出して、ユーザボード上のトークンデータを更新。出金が失敗した場合は、エラーアラートを表示。出金が失敗した場合は、エラーアラートを表示。

#### 3-3-3. handleFaucet 関数

- Faucet の Actor を作成
- createActor 関数は options オブジェクトを引数
- options オブジェクトにはユーザアクションを行うために必要な情報が含まれている
- Actor っを作成後、getToken 関数コールし、トークンを取得する canister の Id を取得。resultFaucet には getToken 関数からの戻り値が格納。戻り値が正常なら setUserTokens 関数を呼び出し、ユーザのトークン情報を更新。

#### Actor とは？

Faucet の Actor は、Canister ID と呼ばれる一意のアドレスを持ち、このアドレスを使用して他のアプリケーションからトークンを受け取ることが可能。Faucet の Actor は、トークンの供給元であり、Canister に格納されたトークンを他のユーザーに配布するために使用。

### 3-4. Header.jsx を編集しログイン時にユーザが保有するトークン情報を取得

- props の更新/ トークンの情報を更新する関数、ユーザの情報を保存するための関数を追加で渡す
- handleSuccess 関数に追加。props で渡された関数をコールしてデータの保存・更新を行う。

#### 3-4-1. handleSuccess 関数

認証に成功した場合に実行される。認証されたユーザの identity を取得し、その identity を使用して新しい agent を作成。identity は IC 上でユーザを一意に識別するためのものであり、principal と呼ばれる ID と共に提供される。この principal は IC 上でのユーザのアドレスのようなもので、オブジェクトを更新するために必要な情報を提供する。生成された agent は IC 上でトランザクションを実行するために使用される。またオーダーブックの取得にも。agent あ HTTP エンドポイントに対してリクエストを送信することで IC とのやり取りを行う

- **fetchRootKey**とは
  - ログイン認証後に取得したユーザの情報を用いて IC と対話する agent を作成。
  -
- サブネットとは？
  - 分散したネットワーク上で機能する複数のサブネットが存在する。II のプロトコルを実行したり、スマコンを実行可能。一部のサブネットは異なるサブネット間での通信を可能にするための相互接続機能を提供することがある。各佐武ネットはそれぞれ独自のコンセンサスアルゴリズムで動作。サブネットはパブリックにもプライベートなネットワーク上でも動作する
- HttpAgent
  - キャニスターの機能をコールするための関数や必要なデータがさまざま定義されてるクラス
  - ローカル環境の agent は IC の公開鍵を持ってないため、このままでは関数をコールできない、そのために fetchRootKey()で鍵を取得する必要あり。

### 3-5. App.jsx の編集

- `UserBoard.jsx`をインポートしてユーザーボード表示
- 画面のリロード時にユーザの情報を再取得
- `Header.jsx`に渡す props を更新

- `npm start`
- エラー発生!!!
  ERROR in ./src/icp_basic_dex_frontend/src/App.jsx 9:0-40
  Module not found: Error: Can't resolve './utils/tokens' in '/home/ponsan/dev/ICP/icp_basic_dex/src/icp_basic_dex_frontend/src'
  resolve './utils/tokens' in '/home/ponsan/dev/ICP/icp_basic_dex/src/icp_basic_dex_frontend/src'
  using description file: /home/ponsan/dev/ICP/icp_basic_dex/package.json (relative path: ./src/icp_basic_dex_frontend/src)
  Field 'browser' doesn't contain a valid alias configuration
  using description file: /home/ponsan/dev/ICP/icp_basic_dex/package.json (relative path: ./src/icp_basic_dex_frontend/src/utils/tokens)
- `npm cache clean -f`もしなくてよくて
- utils フォルダが src フォルダ内に入ってなかった....パス注意！！！！

### 3-6. オーダー機能

**オーダーを入力するフォーム**を作成。

- トークンの種類と量を入力
- ボタンを押してオーダーを登録

#### 3-6-1. PlaceOrder.jsx

1. フォームに入力されたオーダーのデータを保存
2. フォームに入力されたデータを取得して、order に保存
3. ユーザーが入力したオーダーを DEX に登録
   - ログインしているユーザが DEX とやり取りを行うためにアクターを作成
   - `from`に入力されたトークンシンボルに一致するトークンデータを'token[]'から取得

#### 3-6-2. ListOrder.jsx

**オーダー一覧表示する部分**を作成

- 登録されたオーダーを一覧表示
- 各オーダーに対する操作（Buy/ Cancel）のボタン表示

#### 3-6-3. 機能の実装完了したので、App.jsx 編集

## 3-7. キャニスターの永続化

現状では、バックエンド側のコードを編集・再デプロイしたときに、データが全てリセットされてしまう。オーダー及びユーザが DEX に預けたトークン残高が失われる

### 3-7-1. Stable というメモリ領域

通常のキャニスター・メモリと異なり、stable に保存されたデータはアップグレード（データを保持するバックエンドキャニスターの再デプロイ等）を超えて保持される特徴がある。データを損失することなくアップグレードに対応するには stable に保存したいデータをプログラマ自身が定義する必要がある。

- 変数の宣言に`stable`を使用することで、その変数をステーブルなメモリ領域に保存することを指示
- HashMap は対象外のため、Motoko では、ユーザ定義のアップグレードフックをサポートしている。
- `preupgrade`と`postupgrade`という system 関数として宣言される
- アップグレード前にステーブルを定義できない変数からステーブル変数へデータを保存し、アップグレード後に元の型へ戻すというフックを定義する

### 3-7-2.Faucet キャニスターのデータ永続化

## 3-8. メインネットへデプロイ

- ローカルでデプロイした II キャニスターは開発用。これは IC のメインネットに既にデプロイされている II キャニスターに接続するため自分でデプロイする必要がない

### 3-8-1 手順

- メインネットへデプロイするユーザのプリンシパルを変数に登録  
  `export ROOT_PRINCIPAL=$(dfx identity get-principal)`
- キャニスターをデプロイ
- `GoldDIP20`, `SilverDIP20`,`faucet`, ``
- `faucet`キャニスターにトークンをプールする。先に変数へ ID を保存。
- `mint`メソッドを実行して gold, silver トークンをプール。
- `icp_basic_dex_backend`キャニスターをデプロイ
- `icp_basic_dex_frontend`キャニスターをデプロイ
- デプロイしたら 5 つの URL が表示される
- デプロイしたキャニスターに関する情報は以下コマンドで確認  
  `dfx canister status --network ic icp_basic_dex_backend`

## [デプロイ完了](https://qrrbf-ziaaa-aaaao-ahu5a-cai.ic0.app/)

- URL には ic0 とついてる
- 最近 DNS が取得できるようになった
