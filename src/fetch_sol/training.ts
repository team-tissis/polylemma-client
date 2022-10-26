// スマコンを叩く例：このファイルは例
import React, { useEffect, useState, VFC } from "react";
import { ethers } from "ethers";

// スマコンのアドレスを定義
const contractAddress = ""

interface ICharactor {
    address: String;
    level: Number;    
}

// getNewToken関数
// 引数 => charactor 
// 戻り値 => charactor
export default function getNewToken(charactor: ICharactor){
  const provider = new ethers.providers.JsonRpcProvider();
  const levelUpedCharactor: ICharactor = {address: 'hogehoge', level: 10};
  return levelUpedCharactor
}
