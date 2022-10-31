import { getContract } from "./utils.js";
import { approve } from "./coin.js";

async function totalSupply () {
    const { contract } = getContract("PLMToken");
    const message = await contract.totalSupply();
    console.log({ totalSupply: message });
    return message.toString();
}

async function getAllTokenOwned () {
    const { signer, contract } = getContract("PLMToken");
    const myAddress = await signer.getAddress();
    const message = await contract.getAllTokenOwned(myAddress);
    console.log({ getAllTokenOwned: message });
    return message.toString();
}

async function getAllCharacterInfo () {
    const { contract } = getContract("PLMToken");
    const message = await contract.getAllCharacterInfo();
    console.log({ getAllCharacterInfo: message });
    return message;
}

async function updateLevel (tokenId) {
    const { contractAddress, signer, contract } = getContract("PLMToken");
    const coinForLevelUp = getNecessaryExp(tokenId);
    await approve(contractAddress, coinForLevelUp);
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

async function getNecessaryExp (tokenId) {
    const { contract } = getContract("PLMToken");
    const message = await contract.getNecessaryExp(tokenId);
    console.log({ getNecessaryExp: message });
    return message.toString();
}

async function getCurrentCharacterInfo (tokenId) {
    const { contract } = getContract("PLMToken");
    const message = await contract.getCurrentCharacterInfo(tokenId);
    console.log({ getCurrentCharacterInfo: message });
    return message;
}

async function getOwnedCharacterWithIDList (){
    const myTokens = await getAllTokenOwned();
    const myTokenIds = myTokens.split(',').map(myToken => Number(myToken));
    const ownedCharacterInfoList = await getAllCharacterInfo();
    const ownedCharacters = []
    if (myTokenIds.length > 1) {
        for (let i = 0; i < myTokenIds.length; i++) {
            ownedCharacters.push({
                id: myTokenIds[i],
                characterType: ownedCharacterInfoList[i]['characterType'],
                level: ownedCharacterInfoList[i]['level'],
                rarity: ownedCharacterInfoList[i]['rarity'],
                abilityIds: ownedCharacterInfoList[i]['abilityIds'],
            })
        }
    }
    return ownedCharacters;
}

export { totalSupply, updateLevel, getNecessaryExp, getCurrentCharacterInfo, getOwnedCharacterWithIDList };
