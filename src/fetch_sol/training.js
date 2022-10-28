import { ethers } from "ethers";
import tokenArtifact from "../abi/PLMToken.sol/PLMToken.json";
import { getContract, handleApprove, getBalance, getTotalSupply } from "./utils.js";

const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner(1);
// const provider = new ethers.providers.Web3Provider(window.ethereum, 31337);
// const signer = provider.getSigner();

async function handleLevelUp (tokenId) {
    // const tokenContractAddress = getContractAddress("PLMToken");
    // const contract = new ethers.Contract(tokenContractAddress, tokenArtifact.abi, provider);
    // const contractWithSigner = contract.connect(signer);
    // const { updateLevel } = contractWithSigner.functions;

    const { contractAddress, contract } = getContract("PLMToken");

    await handleApprove(contractAddress, 1000);
    const message = await contract.updateLevel(tokenId);
    console.log({ updateLevel: message });

    const myAddress = await signer.getAddress();
    const rc = await message.wait();
    const event = rc.events.find(event => event.event === 'levelUped' && event.args.user == myAddress);
    if (event != undefined) {
        const [ characterInfos , user ] = event.args;
        console.log(`${tokenId}'s level becomes ${characterInfos[tokenId].level}.`);
        return { characterInfos: characterInfos };
    }
}

export { handleLevelUp };
