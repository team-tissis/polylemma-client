import { bytes32ToString, getContract } from "./utils.js";
import { approve } from "./coin.js";

async function updateLevel (tokenId, addressIndex) {
    const { contractAddress, signer, contract } = getContract("PLMToken", addressIndex);
    const coinForLevelUp = getNecessaryExp(tokenId);
    await approve(contractAddress, coinForLevelUp, addressIndex);
    const message = await contract.updateLevel(tokenId);
    console.log({ updateLevel: message });

    const myAddress = await signer.getAddress();
    const rc = await message.wait();
    const event = rc.events.find(event => event.event === 'levelUped' && event.args.user === myAddress);
    if (event !== undefined) {
        // const [ characterInfos , user ] = event.args;
        // console.log(`${tokenId}'s level becomes ${characterInfos[tokenId].level}.`);
        // return { characterInfos: characterInfos };
    }
    return 0; // 後で消す
}

////////////////////////
///      GETTERS     ///
////////////////////////

async function totalSupply (addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const message = await contract.totalSupply();
    console.log({ totalSupply: message });
    return Number(message);
}

async function getCurrentBondLevel (char, addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const message = await contract.getCurrentBondLevel(char['level'], char['fromBlock']);
    console.log({ getCurrentBondLevel: message });
    return message;
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
    const allCharacterInfo = [];
    for (let i = 0; i < message.length; i++) {
        allCharacterInfo.push({
            id: i + 1,
            name: bytes32ToString(message[i]['name']),
            imgURI: await getImgURI(message[i]['imgId'], addressIndex),
            characterType: message[i]['characterType'],
            level: message[i]['level'],
            bondLevel: await getCurrentBondLevel(message[i]),
            rarity: message[i]['rarity'],
            attributeIds: message[i]['attributeIds'],
            isRandomSlot: false
        });
    }
    console.log({ allCharacterInfo: allCharacterInfo });
    return allCharacterInfo;
}

async function getNecessaryExp (tokenId, addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const message = await contract.getNecessaryExp(tokenId);
    console.log({ getNecessaryExp: message });
    return Number(message);
}

async function getCurrentCharacterInfo (tokenId, addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const message = await contract.getCurrentCharacterInfo(tokenId);
    // console.log({ getCurrentCharacterInfo: message });
    return message;
}

async function getImgURI (imgId, addressIndex) {
    const { contract } = getContract("PLMToken", addressIndex);
    const message = await contract.getImgURI(imgId);
    // console.log({ getImgURI: message });
    return message;
}

async function getOwnedCharacterWithIDList (addressIndex) {
    const myTokenIds = (await getAllTokenOwned(addressIndex)).map(myToken => myToken.toNumber());
    const ownedCharacters = []
    for (let i = 0; i < myTokenIds.length; i++) {
        const characterInfo = await getCurrentCharacterInfo(myTokenIds[i], addressIndex);
        ownedCharacters.push({
            id: myTokenIds[i],
            name: bytes32ToString(characterInfo['name']),
            imgURI: await getImgURI(characterInfo['imgId'], addressIndex),
            characterType: characterInfo['characterType'],
            level: characterInfo['level'],
            bondLevel: await getCurrentBondLevel(characterInfo),
            rarity: characterInfo['rarity'],
            attributeIds: characterInfo['attributeIds']
        });
    }
    console.log({ ownedCharacters: ownedCharacters });
    return ownedCharacters;
}

export { updateLevel, totalSupply, getAllTokenOwned, getAllCharacterInfo, getNumberOfOwnedTokens, getNecessaryExp,
         getCurrentCharacterInfo, getImgURI, getOwnedCharacterWithIDList };
