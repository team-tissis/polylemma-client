# polylemma-client

# 環境

```bash
$ node -v
v14.20.0
$ npm -v
6.14.17
```


# インストール（Mac のみ）

## node, npm

```bash
$ brew install nodebrew
$ mkdir -p ~/.nodebrew/src
$ nodebrew install-binary v14.20.0 # M1 Mac 以外
$ nodebrew compile v14.20.0 # M1 Mac 以外（30 分程度かかります）
$ nodebrew use v14.20.0
$ vim .bashrc # その他のシェルの場合も適切に設定してください
# export PATH=$HOME/.nodebrew/current/bin:$PATH を書き込む
$ source ~/.bashrc
```


## polylemma-client

```bash
$ git clone git@github.com:team-tissis/polylemma-client.git
$ npm install
$ npm start
```


## エラー対応

もし以下のエラーが出た場合は、

```bash
Failed to load parser '@typescript-eslint/parser' declared in 'package.json » eslint-config-react-app#overrides[0]': Cannot find module 'typescript'
```

解決策

```bash
$ npm install --save typescript
```


# 起動

- [`utils.js`](./src/utils.js) の `env` 変数の値を `local` / `mumbai` に設定
    - ローカルのテストネットに繋ぐ場合は `local`、Mumbai 上のテストネット `mumbai`
- http://localhost:3000/ にアクセスする（ポート 3000 番を既に使ってる場合は、3001 以降になる）

# 画面イメージ
<img width="868" alt="スクリーンショット 2022-11-06 23 13 21" src="https://user-images.githubusercontent.com/42636663/200175789-a5012f08-0125-440d-a997-dd0be11a155c.png">


## メインページ（バトル開始）
![スクリーンショット 2022-11-06 22 35 53](https://user-images.githubusercontent.com/42636663/200174233-d66451b8-3a7c-4528-8a42-6384474c3798.png)

## サイドバー
![スクリーンショット 2022-11-06 22 44 42](https://user-images.githubusercontent.com/42636663/200174319-c10cfa13-4730-413f-aa09-bbbed195bc76.png)

## ガチャ画面
![スクリーンショット 2022-11-06 22 35 28](https://user-images.githubusercontent.com/42636663/200174286-1d0ab5a7-c69f-4c51-9239-575c86c3db70.png)

## 育成画面
![スクリーンショット 2022-11-06 22 45 10](https://user-images.githubusercontent.com/42636663/200174344-6ccbd076-1ee9-4391-8370-fe40424e4daa.png)

## マッチメイク
![スクリーンショット 2022-11-06 22 48 32](https://user-images.githubusercontent.com/42636663/200174546-190b6a65-435b-4b25-8810-123a3843ae4a.png)

## バトル
![スクリーンショット 2022-11-06 22 37 19](https://user-images.githubusercontent.com/42636663/200174410-92822b44-1cec-4a8d-89ab-18d30b675b86.png)

## 図鑑
![スクリーンショット 2022-11-06 22 45 54](https://user-images.githubusercontent.com/42636663/200174397-6ef073c4-a43f-4d16-8f2b-258c30b17b21.png)


# OpenSea（testnet） で取引

- 自分のウォレットアドレスで検索すると以下のように画像が表示される
    - https://testnets.opensea.io/assets/mumbai/0xcf8d3345dd90b218b9f428562fe5985dc4acdd56/1
- これを取引することが可能
    - **取引すると絆ポイントがリセットされるので注意**
- キャラができるとここに一覧表示される
    - https://testnets.opensea.io/collection/polylemma-v4
