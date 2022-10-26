import { ethers } from "ethers";
import gachaArtifact from "../abi/PLMGacha.sol/PLMGacha.json";
import coinArtifact from "../abi/PLMCoin.sol/PLMCoin.json";
import { getContractAddress, getBalance, getTotalSupply } from "./utils.js";

const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner();

async function mintCoin() {
    const coinContractAddress = getContractAddress("PLMCoin");
    const contract = new ethers.Contract(coinContractAddress, coinArtifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    const { mint } = contractWithSigner.functions;
    const message = await mint();
    console.log({mint: message});
    return {new_coin: await getBalance()};
}

async function handleApprove(gachaContractAddress) {
    const coinContractAddress = getContractAddress("PLMCoin");
    const contract = new ethers.Contract(coinContractAddress, coinArtifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    const { approve } = contractWithSigner.functions;
    const gachaCoin = 10000;
    const message = await approve(gachaContractAddress, gachaCoin);
    console.log({approve: message});
}

async function playGacha () {
    const gachaContractAddress = getContractAddress("PLMGacha");
    await handleApprove(gachaContractAddress);
    const contract = new ethers.Contract(gachaContractAddress, gachaArtifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    const { gacha } = contractWithSigner.functions;
    const message = await gacha();
    console.log({gacha: message});
    return {new_coin: await getBalance(), new_token: await getTotalSupply()};
}

export { mintCoin, playGacha };
