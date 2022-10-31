import { ethers } from "ethers";
import contractFunctions from "../broadcast/PLMGachaScript.s.sol/31337/run-latest.json";
import coinArtifact from "../abi/PLMCoin.sol/PLMCoin.json";
import dealerArtifact from "../abi/PLMDealer.sol/PLMDealer.json";
import tokenArtifact from "../abi/PLMToken.sol/PLMToken.json";

function stringToBytes32 (str) {
    return ethers.utils.formatBytes32String(str);
}

// スマコンのアドレスを取得
function getContractAddress (contractName) {
    const contractAddress = contractFunctions.transactions.find((v) => v.contractName === contractName).contractAddress;
    return contractAddress;
}

function getAbi (contractName) {
    if (contractName === "PLMCoin") return coinArtifact.abi;
    else if (contractName === "PLMDealer") return dealerArtifact.abi;
    else if (contractName === "PLMToken") return tokenArtifact.abi;
}

function getSigner () {
    // (多分) MetaMask を経由しないで使う方法
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner(1);
    // MetaMask を使う方法 (うまくいかない)
    // const provider = new ethers.providers.Web3Provider(window.ethereum, 31337);
    // const signer = provider.getSigner();

    return signer;
}

function getContract (contractName) {
    const contractAddress = getContractAddress(contractName);
    const abi = getAbi(contractName);
    const signer = getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return { contractAddress, signer, contract };
}

async function approve (contractAddress, approvedCoin) {
    const { contract } = getContract("PLMCoin");
    const message = await contract.approve(contractAddress, approvedCoin);
    console.log({ approve: message });
}

async function balanceOf () {
    const { signer, contract } = getContract("PLMCoin");
    const myAddress = await signer.getAddress();
    const message = await contract.balanceOf(myAddress);
    console.log({ balanceOf: message });
    return message.toString();
}

async function getNecessaryExp (tokenId) {
    const { contract } = getContract("PLMToken");
    const message = await contract.getNecessaryExp(tokenId);
    console.log({ getNecessaryExp: message });
    return message.toString();
}

async function totalSupply () {
    const { contract } = getContract("PLMToken");
    const message = await contract.totalSupply();
    console.log({ totalSupply: message });
    return message.toString();
}

async function getAllTokenOwned () {
    const { signer, contract } = getContract("PLMToken");
    const myAddress = await signer.getAddress();
    const message = await contract.getAllTokenOwned(myAddress);
    console.log({ getAllTokenOwned: message });
    return message.toString();
}

async function getCurrentCharacterInfo (tokenId) {
    const { contract } = getContract("PLMToken");
    const message = await contract.getCurrentCharacterInfo(tokenId);
    console.log({ getCurrentCharacterInfo: message });
    return message;
}

async function firstCharacterInfo () {
    const { signer, contract } = getContract("PLMToken");
    const myAddress = await signer.getAddress();
    const message = await contract.tokenOfOwnerByIndex(myAddress, 0);
    console.log({ firstCharacterInfo: message });
    return message.toString();
}

async function getAllCharacterInfo () {
    const { contract } = getContract("PLMToken");
    const message = await contract.getAllCharacterInfo();
    console.log({ getAllCharacterInfo: message });
    return message;
}

// IDとキャラの内容を合体させて取得したいのでこの関数を追加お願いします
// battle.jsとtraining.jsの両方で使う予定です
async function getOwnedCharacterWithIDList (){
    const myTokens = await getAllTokenOwned();
    const myTokenIds = myTokens.split(',').map(myToken => Number(myToken));
    const ownedCharacterInfoList = await getAllCharacterInfo();
    const ownedCharacters = []
    if (myTokenIds.length > 1) {
        for (let i = 0; i < myTokenIds.length; i++) {
            ownedCharacters.push({
                id: myTokenIds[i],
                characterType: ownedCharacterInfoList[i]['characterType'],
                level: ownedCharacterInfoList[i]['level'],
                rarity: ownedCharacterInfoList[i]['rarity'],
                abilityIds: ownedCharacterInfoList[i]['abilityIds'],
            })
        }
    }
    return ownedCharacters;
}

export { stringToBytes32, getContract, approve, balanceOf, totalSupply, getNecessaryExp, getAllTokenOwned, getCurrentCharacterInfo, firstCharacterInfo, getAllCharacterInfo, getOwnedCharacterWithIDList };
