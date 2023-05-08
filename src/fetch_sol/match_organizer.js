import { getContract, poll } from "./utils.js";

/////////////////////////////////
/// MATCH ORGANIZER FUNCTIONS ///
/////////////////////////////////

async function proposeBattle (requestRange, fixedSlotsOfProposer, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const response = await poll(() => {return contract.proposeBattle(
        requestRange.min,
        requestRange.max,
        fixedSlotsOfProposer
    );});
    console.log({ proposeBattle: response });
    await response.wait();
}

async function isProposed (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const response = await poll(() => {return contract.isProposed(myAddress);});
    console.log({ isProposed: response });
    return response;
}

async function isInBattle (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const response = await poll(() => {return contract.isInBattle(myAddress);});
    console.log({ isInBattle: response });
    return response;
}

async function isNotInvolved (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const response = await poll(() => {return contract.isNotInvolved(myAddress);});
    console.log({ isNotInvolved: response });
    return response;
}

async function requestChallenge (toBattleAddress, fixedSlotsOfChallenger, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const response = await poll(() => {return contract.requestChallenge(toBattleAddress, fixedSlotsOfChallenger);});
    console.log({ requestChallenge: response });
    return
    await response.wait();
}

async function cancelProposal (addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const response = await poll(() => {return contract.cancelProposal();});
    console.log({ cancelProposal: response });
    await response.wait();
}

/////////////////////////
///      GETTERS      ///
/////////////////////////

async function getProposalList (addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const response = await poll(() => {return contract.getProposalList();});
    console.log({ getProposalList: response });
    return response;
}

async function getMatchState (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const response = await poll(() => {return contract.getMatchState(myAddress);});
    console.log({ getMatchState: response });
    return response.toString();
}

export { proposeBattle, isProposed, isInBattle, isNotInvolved, requestChallenge, cancelProposal,
         getProposalList, getMatchState };
