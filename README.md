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

スクショしていっぱい貼る

## メインページ（バトル開始）

## サイドバー

## ガチャ画面

## 育成画面

## マッチメイク

## バトル

## 図鑑


# OpenSea（testnet） で取引

- 自分のウォレットアドレスで検索すると以下のように画像が表示される
    - https://testnets.opensea.io/ja/assets/mumbai/0xb26c1c4f3943632c5320e81154dede5f70541f8d/1
- これを取引することが可能
    - **取引すると絆ポイントがリセットされるので注意**
