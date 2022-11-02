import { getSigner, getContract } from "./utils.js";

const CAHARCTER_MIN_LV = 1
const CAHARCTER_MAX_LV = 255
const CAHARCTER_NUM = 4

async function proposeBattle (fixedSlotsOfProposer, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.proposeBattle(
        CAHARCTER_MIN_LV * CAHARCTER_NUM,
        CAHARCTER_MAX_LV * CAHARCTER_NUM,
        fixedSlotsOfProposer
    );
    console.log({ proposeBattle: message });
    return message.toString();
}

async function getProposalList (addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.getProposalList();
    console.log({ getProposalList: message });
    return message;
}

async function getMatchState (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.getMatchState(myAddress);
    console.log({ getMatchState: message });
    return message.toString();
}

async function isInProposal (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.isInProposal(myAddress);
    console.log({ isInProposal: message });
    return message;
}

async function isInBattle (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.isInBattle(myAddress);
    console.log({ isInBattle: message });
    return message.toString();
}

async function isNonProposal (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.isNonProposal(myAddress);
    console.log({ isNonProposal: message });
    return message.toString();
}

async function requestChallenge (toBattleAddress, fixedSlotsOfChallenger, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.requestChallenge(toBattleAddress, fixedSlotsOfChallenger);
    console.log({ requestChallenge: message });
    return message.toString();
}

async function settleBattle (addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.settleBattle();
    console.log({ settleBattle: message });
    return message.toString();
}

async function cancelProposal (addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.cancelProposal();
    console.log({ cancelProposal: message });
    return message.toString();
}

export { proposeBattle, getProposalList, getMatchState,
        isInProposal, isInBattle, isNonProposal, requestChallenge,
        settleBattle, cancelProposal };
