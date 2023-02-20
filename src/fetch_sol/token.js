import { bytes32ToString, getContract, poll } from "./utils.js";
import { approve } from "./coin.js";
import { getCurrentBondLevel, getTypeName } from "./data.js";

async function updateLevel (tokenId, addressIndex) {
    const { contractAddress, contract } = getContract("PLMToken", addressIndex);
    const coinForLevelUp = getNecessaryExp(tokenId);
    await approve(contractAddress, coinForLevelUp, addressIndex);
    const response = await poll(() => {return contract.updateLevel(tokenId);});
    console.log({ updateLevel: response });

    const rc = await response.wait();
    const event = rc.events.find(event => event.event === 'LevelUped');
    const { newLevel } = event.args;
    console.log(`Token ${tokenId}'s level becomes ${newLevel}.`);
    return newLevel;
}

////////////////////////
///      GETTERS     ///
////////////////////////

async function totalSupply (addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const response = await poll(() => {return contract.totalSupply();});
    console.log({ totalSupply: response });
    return Number(response);
}

async function getAllTokenOwned (addressIndex) {
    const { signer, contract } = getContract("PLMToken", addressIndex);
    const myAddress = await signer.getAddress();
    const response = await poll(() => {return contract.getAllTokenOwned(myAddress);});
    console.log({ getAllTokenOwned: response });
    return response.map(myToken => myToken.toNumber());
}

async function getNumberOfOwnedTokens (addressIndex) {
    const myTokens = await getAllTokenOwned(addressIndex);
    return myTokens.length;
}

async function getAllCharacterInfo (addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const response = await poll(() => {return contract.getAllCharacterInfo();});
    const allCharacterInfo = [];
    for (let i = 0; i < response.length; i++) {
        allCharacterInfo.push({
            id: i + 1,
            name: bytes32ToString(response[i].name),
            imgURI: await getImgURI(response[i].imgId, addressIndex),
            characterType: await getTypeName(response[i].characterTypeId, addressIndex),
            level: response[i].level,
            bondLevel: await getCurrentBondLevel(response[i]),
            rarity: response[i].rarity,
            attributeIds: response[i].attributeIds
        });
    }
    console.log({ allCharacterInfo: allCharacterInfo });
    return allCharacterInfo;
}

async function getNecessaryExp (tokenId, addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const response = await poll(() => {return contract.getNecessaryExp(tokenId);});
    console.log({ getNecessaryExp: response });
    return Number(response);
}

async function getCurrentCharacterInfo (tokenId, addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const response = await poll(() => {return contract.getCurrentCharacterInfo(tokenId);});
    // console.log({ getCurrentCharacterInfo: response });
    return response;
}

async function getImgURI (imgId, addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const response = await poll(() => {return contract.getImgURI(imgId);});
    // console.log({ getImgURI: response });
    return response;
}

async function getOwnedCharacterWithIDList (addressIndex) {
    const myTokenIds = await getAllTokenOwned(addressIndex);
    const ownedCharacters = []
    for (let i = 0; i < myTokenIds.length; i++) {
        const characterInfo = await getCurrentCharacterInfo(myTokenIds[i], addressIndex);
        ownedCharacters.push({
            id: myTokenIds[i],
            name: bytes32ToString(characterInfo.name),
            imgURI: await getImgURI(characterInfo.imgId, addressIndex),
            characterType: await getTypeName(characterInfo.characterTypeId, addressIndex),
            level: characterInfo.level,
            bondLevel: await getCurrentBondLevel(characterInfo),
            rarity: characterInfo.rarity,
            attributeIds: characterInfo.attributeIds
        });
    }
    console.log({ ownedCharacters: ownedCharacters });
    return ownedCharacters;
}

export { updateLevel, totalSupply, getAllTokenOwned, getAllCharacterInfo, getNumberOfOwnedTokens, getNecessaryExp,
         getCurrentCharacterInfo, getImgURI, getOwnedCharacterWithIDList };
