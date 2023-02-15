import { getContract, poll } from "./utils.js";

/////////////////////////////////
/// MATCH ORGANIZER FUNCTIONS ///
/////////////////////////////////

async function proposeBattle (requestRange, fixedSlotsOfProposer, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await poll(() => {return contract.proposeBattle(
        requestRange.min,
        requestRange.max,
        fixedSlotsOfProposer
    );});
    console.log({ proposeBattle: message });
    await message.wait();
}

async function isProposed (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await poll(() => {return contract.isProposed(myAddress);});
    console.log({ isProposed: message });
    return message;
}

async function isInBattle (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await poll(() => {return contract.isInBattle(myAddress);});
    console.log({ isInBattle: message });
    return message;
}

async function isNotInvolved (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await poll(() => {return contract.isNotInvolved(myAddress);});
    console.log({ isNotInvolved: message });
    return message;
}

async function requestChallenge (toBattleAddress, fixedSlotsOfChallenger, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await poll(() => {return contract.requestChallenge(toBattleAddress, fixedSlotsOfChallenger);});
    console.log({ requestChallenge: message });
    await message.wait();
}

async function cancelProposal (addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await poll(() => {return contract.cancelProposal();});
    console.log({ cancelProposal: message });
    await message.wait();
}

/////////////////////////
///      GETTERS      ///
/////////////////////////

async function getProposalList (addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await poll(() => {return contract.getProposalList();});
    console.log({ getProposalList: message });
    return message;
}

async function getMatchState (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await poll(() => {return contract.getMatchState(myAddress);});
    console.log({ getMatchState: message });
    return message.toString();
}

export { proposeBattle, isProposed, isInBattle, isNotInvolved, requestChallenge, cancelProposal,
         getProposalList, getMatchState };
