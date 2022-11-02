import { getSeedString, getCommitString, getContract } from "./utils.js";

async function commitPlayerSeed (playerId, seed, addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const commitString = getSeedString(myAddress, seed);
    const message = await contract.commitPlayerSeed(playerId, commitString);
    console.log({ commitPlayerSeed: message });
}

async function commitChoice (playerId, levelPoint, choice, blindingFactor, addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const commitString = getCommitString(myAddress, levelPoint, choice, blindingFactor);
    const message = await contract.commitChoice(playerId, commitString);
    console.log({ commitChoice: message });
}

async function revealChoice (playerId, levelPoint, choice, blindingFactor, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.revealChoice(playerId, levelPoint, choice, blindingFactor);
    console.log({ revealChoice: message });
}

async function getNonce (playerId, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.getNonce(playerId);
    console.log({ getNonce: message });
    return message;
}

async function getFixedSlotCharInfo (playerId, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.getFixedSlotCharInfo(playerId);
    console.log({ getFixedSlotCharInfo: message });
    return message;
}

async function getPlayerIdFromAddress (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.getPlayerIdFromAddress(myAddress);
    console.log({ getPlayerIdFromAddress: message });
    return message;
}


export { commitPlayerSeed, commitChoice, revealChoice, getNonce, getFixedSlotCharInfo, getPlayerIdFromAddress };
