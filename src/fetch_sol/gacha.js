import { approve } from "./coin.js";
import { stringToBytes32, bytes32ToString, getContract, poll } from "./utils.js";
import { getImgURI } from "./token.js";
import { getTypeName } from "./data.js";

/////////////////////////
///  GACHA FUNCTIONS  ///
/////////////////////////

async function gacha (name, addressIndex) {
    const { contractAddress, contract } = getContract("PLMDealer", addressIndex);
    const coinForGacha = await getGachaFee();
    await approve(contractAddress, coinForGacha, addressIndex);
    const response = await poll(() => {return contract.gacha(stringToBytes32(name));});
    console.log({ gacha: response });

    const rc = await response.wait();
    const event = rc.events.find(event => event.event === 'CharacterReceivedByUser');
    const { tokenId, characterInfo } = event.args;
    const res = {
        id: Number(tokenId),
        name: bytes32ToString(characterInfo.name),
        imgURI: await getImgURI(characterInfo.imgId, addressIndex),
        characterType: await getTypeName(characterInfo.characterTypeId, addressIndex),
        level: characterInfo.level,
        rarity: characterInfo.rarity,
        attributeIds: characterInfo.attributeIds,
    }
    return res;
}

/////////////////////////
///      GETTERS      ///
/////////////////////////

async function getGachaFee (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const response = await poll(() => {return contract.getGachaFee();});
    console.log({ getGachaFee: response });
    return Number(response);
}

export { getGachaFee, gacha };
