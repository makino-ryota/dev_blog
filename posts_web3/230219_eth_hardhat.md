---
title: " 【ETH #1】Hardhatによるスマコン基礎 "
date: "2023-2-19"
thumbnail: "/images/thumbnail04.jpg"
---

- ユーザのウォレットを開発した DApp に接続
- Web アプリケーションを通して、ユーザーがスマートコントラクトとやりとりとりできる機能を実装
- Solidity でバックエンドを実装し、React でフロントエンドを構築

### 目次

1. Hardhat 準備
2. Solidity でスマートコントラクト作成
3. コントラクトをローカル環境でコンパイルし実行
4. スマコンにデータを保存する

---

# 1. Hardhat 準備

### 1-1. インストール

```
mkdir ETH-dApp
cd ETH-dApp
mkdir project1
cd project1
npm init -y
npm install --save-dev hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

### 1-2. プロジェクト起動

- `npx hardhat`  
  言語、gitignore などの設定し次へ。

### 1-3. 実行

- ` npx hardhat compile`
- `npx hardhat test`

---

# 2. Solidity でスマートコントラクト作成

### 2-1. sol ファイル作成

- contracts 直下に project1.sol 作成

コンソールログ出力用。デバッグ時に必要。

- `import "hardhat/console.sol";`
- solidity の contract は class のようなもの
- contract 初期化時に constructor 実行される
- constructor はスマコン作成時に一度だけ実行
- constructor が実行された後、コードがブロックチェーンにデプロイされる

---

# 3. コントラクトをローカル環境でコンパイルし実行

project1.sol をコンパイルするための run.js 作成する

### 3-1. コントラクトを実行するためのプログラムを作成

- scripts ディレクトリに`run.js`を作成
- `async`と`await`は、コードの上から順に実行するための非同期処理。awit が先頭についてる処理が終わるまで main 関数の他の処理は行われない。
- hardhat のデバッグ方法としてイーサリアムローカルネットワークを立ち上げ、更新するたびにローカルネットワークが破棄され、毎回ローカルサーバを更新するかのように、コントラクト実行するたびにブロックチェーンが新しくなるようにする。常にゼロリセットとなるのでエラーのデバッグがしやすい

#### ハードハット補足

- run.js の中で、hre.ethers が登場.hre はどこにもインポートされていない。
- Hardhat が Hardhat Runtime Environment（HRE）を呼び出している
- HRE は、Hardhat が用意したすべての機能を含むオブジェクト
- **hardhat で始まるターミナルコマンドを実行するたびに、HRE にアクセスしている**ので、**hre を run.js にインポートする必要はない。**

### 3-2. 実行

- `npx hardhat run scripts/run.js`  
  コンパイル成功したら、コントラクトアドレスが表示される

---

# 4. スマコンにデータを保存する

- ブロックチェーンは、AWS のようなクラウド上にデータを保存できるサーバーのようなもの
- しかし、誰もそのデータを所有していない
- ブロックチェーン上にデータを保存する作業を行う「マイナー」にガス代を払って分散管理
- イーサリアムのブロックチェーン上にデータを書き込む場合、私たちは代金として$ETH を「マイナー」に支払う

### 4-1. solidity の書き方

#### 状態変数

自動的に 0 に初期化される状態変数。コントラクトのストレージに永続的に保存される。

#### solidity のアクセス修飾子

- public  
  public で定義された関数や変数は、それらが定義されているコントラクト、そのコントラクトが継承された別のコントラクト、それらコントラクトの外部と、基本的にどこからでも呼び出すことができる。Solidity では、アクセス修飾子がついてない関数を、自動的に public として扱う。
- private  
  private で定義された関数や変数は、それらが定義されたコントラクトでのみ呼び出すことができる
- internal  
  internal で定義された関数や変数は、それらが定義されたコントラクトと、そのコントラクトが継承された別のコントラクトの両方から呼び出すことができる。Solidity では、アクセス修飾子がついてない変数を、自動的に internal として扱う。
- external  
  external で定義された関数や変数は、外部からのみ呼び出すことができる

#### msg.sender

msg.sender に入る値は、関数を呼び出した人のウォレットアドレス。ユーザ認証のようなもの

#### solidity の関数修飾子（重要）

pure や view 関数を使用するとガス代を削減可能。同時にブロックチェーンにデータを書き込まないことで処理速度も向上。

**Solidity 開発では関数修飾子を意識しておかないとデータを記録する際のコスト（＝ガス代）が跳ね上がってしまうので注意**  
ブロックチェーンに値を書き込むにはガス代を払う必要があること、そしてブロックチェーンから値を参照するだけなら、ガス代を払う必要がないこと。

- view  
  view 関数は、読み取り専用の関数であり、呼び出した後に関数の中で定義された状態変数が変更されないようにする
- pure
  pure 関数は、関数の中で定義された状態変数を読み込んだり変更したりせず、関数に渡されたパラメータや関数に存在するローカル変数のみを使用して値を返す

### 4-2. run.js を更新して関数呼び出す

sol ファイルの中で、public と指定した関数はブロックチェーン上に呼び出すことができる。  
run.js ではそれらの関数を呼び出していく。  
通常の API と同じように関数を手動で呼び出す。

- `npx hardhat run scripts/run.js`

## hardhat 関数

- `await hre.ethers.getSigners();`: Hardhat が提供する任意のアドレスを返す関数
- `const ContractFactory = await hre.ethers.getContractFactory("xx");`: l コントラクトがコンパイル ⇒artifacts ディレクトリ直下にコントラクト扱うのに必要なファイル生成。デプロイをサポートするライブラリのアドレスと Project1 コントラクトの連携をしている。
- `const Contract = await ContractFactory.deploy();`: ローカルの eth ネットワークをコントラクトのために作成。スクリプト実行完了後、そのローカルネットワークを破棄する.コントラクト実行するたびローカルサーバ更新するような挙動。
- `const Project1 = await Contract.deployed();`: ローカルのブロックチェーンにデプロイされるまで待つ処理.Hardhat は実際にあなたのマシン上に「マイナー」を作成し、ブロックチェーンを構築.
- `let Txn = await Contract.connect(randomPerson).functionX();`: randomPerson には、Hardhat が取得したランダムなアドレスが格納
-

## スマコンの基本

- 関数を読み込む。
- 関数を書き込む。
- 状態変数を変更する。

---

# 5. ローカル環境でスマコンをデプロイ

今までの流れは以下。

1. ローカル環境でイーサリアムネットワークを新規に作成する。
2. ローカル環境でコントラクトをデプロイする。
3. プログラムが終了すると、Hardhat は自動的にそのイーサリアムネットワークを削除する。

本項目ではイーサリアムネットワークを削除せず存続させる方法。

### 5-1. 準備

ローカルネットワークでイーサリアムネットワークを立ち上げる

- `npx hardhat node`
- Hardhat から 20 個のアカウントが提供され、それぞれに 10000ETH が付与
- このネットワークでデプロイしていく
- `deploy.js`を編集

### 5-2. deploy.js 編集(中身は run.js とほぼ同じ)

これから構築するフロントエンドとスマコン（XX.sol）を結びつける役割。`run.js`がテスト用のプログラムなら、`deploy.js`は本番用

### 5-3. デプロイ

以下コマンドでデプロイ

- `npx hardhat run scripts/deploy.js --network localhost`
