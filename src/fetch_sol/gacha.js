import { ethers } from "ethers";
import artifact from "../abi/PLMGacha.sol/PLMGacha.json";
// スマコンのアドレスを定義
const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"

async function playGacha() {
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    // taskCount, tasks, createTask, toggleIsCompleted はスマコンで定義されている関数だとする
    const { gacha } = contractWithSigner.functions
    const messsage = await gacha()
    console.log({テスト: messsage})
}

export { playGacha }
