import { getContract } from "./utils.js";

async function proposeBattle (fixedSlotsOfProposer, requestRange, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.proposeBattle(
        requestRange.min,
        requestRange.max,
        fixedSlotsOfProposer
    );
    console.log({ proposeBattle: message });
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
    return message;
}

async function isNonProposal (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.isNonProposal(myAddress);
    console.log({ isNonProposal: message });
    return message;
}

async function requestChallenge (toBattleAddress, fixedSlotsOfChallenger, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.requestChallenge(toBattleAddress, fixedSlotsOfChallenger);
    console.log({ requestChallenge: message });
}

async function cancelProposal (addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.cancelProposal();
    console.log({ cancelProposal: message });
}

export { proposeBattle, getProposalList, getMatchState,
         isInProposal, isInBattle, isNonProposal, requestChallenge,
         cancelProposal };
