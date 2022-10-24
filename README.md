# Nodeのバージョン
- v14.20.0

# アプリの起動方法
- `npm start`
- `http://localhost:3000/` にアクセスする (3000番を使ってる場合は、3001、3002になる)


### エラー対応

もし以下のエラーが出た場合は、

```
Failed to load parser '@typescript-eslint/parser' declared in 'package.json » eslint-config-react-app#overrides[0]': Cannot find module 'typescript'
```

解決策

```
npm install --save typescript
```
