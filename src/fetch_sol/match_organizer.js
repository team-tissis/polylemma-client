import { getContract } from "./utils.js";

/////////////////////////////////
/// MATCH ORGANIZER FUNCTIONS ///
/////////////////////////////////

async function proposeBattle (requestRange, fixedSlotsOfProposer, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.proposeBattle(
        requestRange.min,
        requestRange.max,
        fixedSlotsOfProposer
    );
    console.log({ proposeBattle: message });
}

async function isProposed (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.isProposed(myAddress);
    console.log({ isProposed: message });
    return message;
}

async function isInBattle (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.isInBattle(myAddress);
    console.log({ isInBattle: message });
    return message;
}

async function isNotInvolved (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.isNotInvolved(myAddress);
    console.log({ isNotInvolved: message });
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

/////////////////////////
///      GETTERS      ///
/////////////////////////

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

export { proposeBattle, isProposed, isInBattle, isNotInvolved, requestChallenge, cancelProposal,
         getProposalList, getMatchState };
