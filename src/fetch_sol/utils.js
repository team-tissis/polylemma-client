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

const provider = new ethers.providers.JsonRpcProvider();
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

export { getContractAddress, getBalance, getTotalSupply };
