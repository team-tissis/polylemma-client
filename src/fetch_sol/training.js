import { getContract, handleApprove, getCoinForLevelUp } from "./utils.js";

async function handleLevelUp (tokenId) {
    const { contractAddress, signer, contract } = getContract("PLMToken");
    const coinForLevelUp = getCoinForLevelUp(tokenId);
    await handleApprove(contractAddress, coinForLevelUp);
    const message = await contract.updateLevel(tokenId);
    console.log({ updateLevel: message });

    // const myAddress = await signer.getAddress();
    // const rc = await message.wait();
    // const event = rc.events.find(event => event.event === 'levelUped' && event.args.user == myAddress);
    // if (event != undefined) {
    //     const [ characterInfos , user ] = event.args;
    //     console.log(`${tokenId}'s level becomes ${characterInfos[tokenId].level}.`);
    //     return { characterInfos: characterInfos };
    // }
}

export { handleLevelUp };
