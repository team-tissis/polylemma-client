import { getContract } from "./utils.js";
import { approve } from "./coin.js";

async function totalSupply (addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const message = await contract.totalSupply();
    console.log({ totalSupply: message });
    return message.toString();
}

async function getAllTokenOwned (addressIndex) {
    const { signer, contract } = getContract("PLMToken", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.getAllTokenOwned(myAddress);
    console.log({ getAllTokenOwned: message });
    return message;
}

async function getNumberOfOwnedTokens (addressIndex) {
    const myTokens = await getAllTokenOwned(addressIndex);
    return myTokens.length;
}

async function getAllCharacterInfo (addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const message = await contract.getAllCharacterInfo();
    console.log({ getAllCharacterInfo: message });
    return message;
}

async function updateLevel (tokenId, addressIndex) {
    const { contractAddress, signer, contract } = getContract("PLMToken", addressIndex);
    const coinForLevelUp = getNecessaryExp(tokenId);
    await approve(contractAddress, coinForLevelUp, addressIndex);
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

async function getNecessaryExp (tokenId, addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const message = await contract.getNecessaryExp(tokenId);
    console.log({ getNecessaryExp: message });
    return message.toString();
}

async function getCurrentCharacterInfo (tokenId, addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const message = await contract.getCurrentCharacterInfo(tokenId);
    console.log({ getCurrentCharacterInfo: message });
    return message;
}

async function getOwnedCharacterWithIDList (addressIndex) {
    const myTokens = await getAllTokenOwned(addressIndex);
    const myTokenIds = myTokens.map(myToken => Number(myToken));
    const ownedCharacterInfoList = await getAllCharacterInfo(addressIndex);
    const ownedCharacters = []
    if (myTokenIds.length > 1) {
        for (let i = 0; i < myTokenIds.length; i++) {
            ownedCharacters.push({
                id: myTokenIds[i],
                characterType: ownedCharacterInfoList[i]['characterType'],
                level: ownedCharacterInfoList[i]['level'],
                rarity: ownedCharacterInfoList[i]['rarity'],
                abilityIds: ownedCharacterInfoList[i]['abilityIds'],
            });
        }
    }
    return ownedCharacters;
}

export { totalSupply, getAllCharacterInfo, getNumberOfOwnedTokens, updateLevel, getNecessaryExp, getCurrentCharacterInfo, getOwnedCharacterWithIDList };
