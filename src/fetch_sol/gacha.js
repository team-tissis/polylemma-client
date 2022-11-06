import { approve } from "./coin.js";
import { stringToBytes32, bytes32ToString, getSeedString, getCommitString, calcRandomSlotId, getContract } from "./utils.js";
import { getImgURI } from "./token.js";

async function getGachaFee (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const message = await contract.getGachaFee();
    console.log({ getGachaFee: message });
    return message.toNumber();
}

async function gacha (name, addressIndex) {
    const { contractAddress, signer, contract } = getContract("PLMDealer", addressIndex);
    const coinForGacha = await getGachaFee();
    await approve(contractAddress, coinForGacha, addressIndex);
    const message = await contract.gacha(stringToBytes32(name));
    console.log({ gacha: message });

    // contract.on は非同期(?)だから return する段階で、tokenId の値が入ってくれない
    // /home の方で書く必要があるかも
    // let newTokenId;
    // const myAddress = await signer.getAddress();
    // const filter = contract.filters.CharacterReceivedByUser(myAddress, null, null);
    // contract.on(filter, (account, tokenId, characterInfo) => {
    //     newTokenId = tokenId.toString();
    //     console.log(`${account} got token of ${tokenId}.`);
    //     console.log({ characterInfo: characterInfo })
    // });

    const myAddress = await signer.getAddress();
    const rc = await message.wait();
    const event = rc.events.find(event => event.event === 'CharacterReceivedByUser' && event.args.account === myAddress);
    if (event !== undefined) {
        const [ account, tokenId, characterInfo ] = event.args;
        const res = {
            // name: bytes32ToString(message['name']),
            // imgURI: await getImgURI(message['imgId'], addressIndex),
            id: tokenId.toNumber(),
            attributeIds: characterInfo['attributeIds'],
            characterType: characterInfo['characterType'],
            imgURI: await getImgURI(characterInfo['imgId'], addressIndex),
            level: characterInfo['level'],
            name: bytes32ToString(characterInfo['name']),
            rarity: characterInfo['rarity'],
        }
        return res
        // return tokenId.toNumber();
    }
}

export { gacha, getGachaFee };
