import { stringToBytes32, getContract } from "../utils.js";

// 100コインミントする
async function charge () {
    const { contract } = getContract("PLMDealer");
    const sendMATICAmount = "1" + "0".repeat(20);
    const message = await contract.charge({ value: sendMATICAmount });
    console.log({ charge: message });
}

// const newTokenId = await gacha(characterName);
async function getGachaFee (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const message = await contract.getGachaFee();
    console.log({ getGachaFee: message });
    return message.toString();
}

async function approve (contractAddress, approvedCoin, addressIndex) {
    const { contract } = getContract("PLMCoin", addressIndex);
    const message = await contract.approve(contractAddress, approvedCoin);
    console.log({ approve: message });
}

async function gacha (name, addressIndex) {
    const { contractAddress, signer, contract } = getContract("PLMDealer", addressIndex);
    const coinForGacha = await getGachaFee(addressIndex);
    await approve(contractAddress, coinForGacha, addressIndex);
    
    const message = await contract.gacha(stringToBytes32(name));
    console.log({ gacha: message });

    const myAddress = await signer.getAddress();
    const rc = await message.wait();
    const event = rc.events.find(event => event.event === 'CharacterReceivedByUser' && event.args.account === myAddress);
    console.log(event);
    if (event !== undefined) {
        const [ account, tokenId, characterInfo ] = event.args;
        console.log(`${account} got token of ${tokenId}.`);
        console.log({ characterInfo: characterInfo });
        return tokenId.toString();
    }
}

async function testProposal(){
    const addressIndex = 2
    const thisUserChara1 = await gacha('hoge1', addressIndex)
    const thisUserChara2 = await gacha('hoge2', addressIndex)
    const thisUserChara3 = await gacha('hoge3', addressIndex)
    const thisUserChara4 = await gacha('hoge4', addressIndex)
    console.log({キャラ1: thisUserChara1, キャラ2: thisUserChara2,
        キャラ3: thisUserChara3, キャラ4: thisUserChara4
    })
}

export { testProposal };
