import { ethers } from "ethers";
import contractFunctions from "../broadcast/PLMGachaScript.s.sol/31337/run-latest.json";
import coinArtifact from "../abi/PLMCoin.sol/PLMCoin.json";
import tokenArtifact from "../abi/PLMToken.sol/PLMToken.json";
import gachaArtifact from "../abi/PLMGacha.sol/PLMGacha.json";

// スマコンのアドレスを取得
function getContractAddress (contractName) {
    const contractAddress = contractFunctions.transactions.find((v) => v.contractName == contractName).contractAddress;
    return contractAddress;
}

function getAbi (contractName) {
    if (contractName == "PLMCoin") return coinArtifact.abi;
    else if (contractName == "PLMToken") return tokenArtifact.abi;
    else if (contractName == "PLMGacha") return gachaArtifact.abi;
}
const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner(1);

function getSigner() {
    // (多分) MetaMask を経由しないで使う方法
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner(1);
    // MetaMask を使う方法 (うまくいかない)
    // const provider = new ethers.providers.Web3Provider(window.ethereum, 31337);
    // const signer = provider.getSigner();

    return signer;
}

function getContract(contractName) {
    const contractAddress = getContractAddress(contractName);
    const abi = getAbi(contractName);
    const signer = getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return { contractAddress, signer, contract };
}

async function handleApprove (contractAddress, approvedCoin) {
    // const coinContractAddress = getContractAddress("PLMCoin");
    // const contract = new ethers.Contract(coinContractAddress, coinArtifact.abi, signer);
    // const contractWithSigner = contract.connect(signer);
    // const { approve } = contractWithSigner.functions;
    const { contract } = getContract("PLMCoin");
    const message = await contract.approve(contractAddress, approvedCoin);
    console.log({ approve: message });
}

async function getBalance () {
    // const coinContractAddress = getContractAddress("PLMCoin");
    // const contract = new ethers.Contract(coinContractAddress, coinArtifact.abi, provider);
    // const contractWithSigner = contract.connect(signer);
    // const { balanceOf } = contractWithSigner.functions;

    const { signer, contract } = getContract("PLMCoin");
    const myAddress = await signer.getAddress();
    const message = await contract.balanceOf(myAddress);
    console.log({ balanceOf: message });
    return message.toString();
}

async function getTotalSupply () {
    // const tokenContractAddress = getContractAddress("PLMToken");
    // const contract = new ethers.Contract(tokenContractAddress, tokenArtifact.abi, provider);
    // const contractWithSigner = contract.connect(signer);
    // const { totalSupply } = contractWithSigner.functions;
    const { contract } = getContract("PLMToken");
    const message = await contract.totalSupply();
    console.log({ totalSupply: message });
    return message.toString();
}

async function firstCharacterInfo() {
    // const tokenContractAddress = getContractAddress("PLMToken");
    // const contract = new ethers.Contract(tokenContractAddress, tokenArtifact.abi, provider);
    // const contractWithSigner = contract.connect(signer);
    // const { tokenOfOwnerByIndex } = contractWithSigner.functions;
    const { signer, contract } = getContract("PLMToken");
    const myAddress = await signer.getAddress();
    const message = await contract.tokenOfOwnerByIndex(myAddress, 0);
    console.log({ firstCharacterInfo: message });
    return message.toString();
}

async function allCharacterInfo() {
    // const tokenContractAddress = getContractAddress("PLMToken");
    // const contract = new ethers.Contract(tokenContractAddress, tokenArtifact.abi, provider);
    // const contractWithSigner = contract.connect(signer);
    // const { getAllCharacterInfo } = contractWithSigner.functions;
    const { contract } = getContract("PLMToken");
    const message = await contract.getAllCharacterInfo();
    console.log({ getAllCharacterInfo: message });
    // return message.toString();
}

export { getContract, handleApprove, getBalance, getTotalSupply, firstCharacterInfo, allCharacterInfo };
