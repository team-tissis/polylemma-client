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
- `http://localhost:3000/` にアクセスする（ポート 3000 番を既に使ってる場合は、3001 以降になる）
