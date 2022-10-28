import { ethers } from "ethers";
import contractFunctions from "../broadcast/PLMGachaScript.s.sol/31337/run-latest.json";
import coinArtifact from "../abi/PLMCoin.sol/PLMCoin.json";
import tokenArtifact from "../abi/PLMToken.sol/PLMToken.json";

// スマコンのアドレスを取得
async function getContractAddress (contractName) {
    const contractAddress = contractFunctions.transactions.find((v) => v.contractName == contractName).contractAddress;
    return contractAddress;
}

// (多分) MetaMask を経由しないで使う方法
const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner(1);
// MetaMask を使う方法 (うまくいかない)
// const provider = new ethers.providers.Web3Provider(window.ethereum, 31337);
// const signer = provider.getSigner();

async function handleApprove (contractAddress, approvedCoin) {
    const coinContractAddress = getContractAddress("PLMCoin");
    const contract = new ethers.Contract(coinContractAddress, coinArtifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    const { approve } = contractWithSigner.functions;
    const message = await approve(contractAddress, approvedCoin);
    console.log({ approve: message });
}

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

export { handleApprove, getContractAddress, getBalance, getTotalSupply, firstCharacterInfo, allCharacterInfo };
