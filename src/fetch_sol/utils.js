import { ethers } from "ethers";
import contractFunctions from "../broadcast/PLMGachaScript.s.sol/31337/run-latest.json";
import gachaArtifact from "../abi/PLMGacha.sol/PLMGacha.json";
import coinArtifact from "../abi/PLMCoin.sol/PLMCoin.json";
import tokenArtifact from "../abi/PLMToken.sol/PLMToken.json";

// スマコンのアドレスを取得
async function getContractAddress (contractName) {
    const contractAddress = contractFunctions.transactions.find((v) => v.contractName == contractName).contractAddress;
    return contractAddress;
}

// const provider = new ethers.providers.JsonRpcProvider();
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

async function getBalance () {
    const coinContractAddress = getContractAddress("PLMCoin");
    const contract = new ethers.Contract(coinContractAddress, coinArtifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    const { balanceOf } = contractWithSigner.functions;
    const myAddress = await signer.getAddress();
    const message = await balanceOf(myAddress);
    console.log({ balanceOf: message });
    return message.toString();
}

async function getTotalSupply () {
    const tokenContractAddress = getContractAddress("PLMToken");
    const contract = new ethers.Contract(tokenContractAddress, tokenArtifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    const { totalSupply } = contractWithSigner.functions;
    const message = await totalSupply();
    console.log({ totalSupply: message });
    return message.toString();
}

async function firstCharacterInfo() {
    const tokenContractAddress = getContractAddress("PLMToken");
    const contract = new ethers.Contract(tokenContractAddress, tokenArtifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    const myAddress = await signer.getAddress();
    const { tokenOfOwnerByIndex } = contractWithSigner.functions;
    const message = await tokenOfOwnerByIndex(myAddress, 0);
    console.log({ firstCharacterInfo: message });
    return message.toString();
}

async function allCharacterInfo() {
    const tokenContractAddress = getContractAddress("PLMToken");
    const contract = new ethers.Contract(tokenContractAddress, tokenArtifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    const { getAllCharacterInfo } = contractWithSigner.functions;
    const message = await getAllCharacterInfo();
    console.log({ getAllCharacterInfo: message });
    // return message.toString();
}

export { getContractAddress, getBalance, getTotalSupply, firstCharacterInfo, allCharacterInfo };
