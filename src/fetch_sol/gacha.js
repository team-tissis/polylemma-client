import { ethers } from "ethers";
import artifact from "../abi/PLMGacha.sol/PLMGacha.json";
import contractFunctions from "../broadcast/PLMGachaScript.s.sol/31337/run-latest.json";

// スマコンのアドレスを定義
async function getContractAddress (contractName) {
    const contractAddress = contractFunctions.transactions.find((v) => v.contractName == contractName).contractAddress;
    return contractAddress;
}

async function mint() {
    const gachaContractAddress = getContractAddress("PLMCoin");
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    const { mint } = contractWithSigner.functions
}

async function approve() {
    const gachaContractAddress = getContractAddress("PLMCoin");
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    const { approve } = contractWithSigner.functions
}

async function playGacha () {
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const gachaContractAddress = getContractAddress("PLMGacha");
    console.log(gachaContractAddress);
    const contract = new ethers.Contract(gachaContractAddress, artifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    // taskCount, tasks, createTask, toggleIsCompleted はスマコンで定義されている関数だとする
    const { gacha } = contractWithSigner.functions
    const message = await gacha();
    console.log({テスト: message});
    return null
}

export { playGacha }
