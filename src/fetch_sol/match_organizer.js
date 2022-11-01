import { getContract } from "./utils.js";


async function proposeBattle () {
    const { signer, contract } = getContract("PLMMatchOrganizer");
    const message = await contract.proposeBattle(
        // uint16 lowerBound,
        // uint16 upperBound,
        // uint256[4] calldata partyProposed
    );
    console.log({ proposeBattle: message });
    return message.toString();
}

async function getProposalList () {
    const { signer, contract } = getContract("PLMMatchOrganizer");
    const message = await contract.getProposalList();
    console.log({ getProposalList: message });
    return message.toString();
}

async function getMatchState () {
    const { signer, contract } = getContract("PLMMatchOrganizer");
    const myAddress = await signer.getAddress();
    const message = await contract.getMatchState(myAddress);
    console.log({ getMatchState: message });
    return message.toString();
}

async function isInProposal () {
    const { signer, contract } = getContract("PLMMatchOrganizer");
    const myAddress = await signer.getAddress();
    const message = await contract.isInProposal(myAddress);
    console.log({ isInProposal: message });
    return message.toString();
}

async function isInBattle () {
    const { signer, contract } = getContract("PLMMatchOrganizer");
    const myAddress = await signer.getAddress();
    const message = await contract.isInBattle(myAddress);
    console.log({ isInBattle: message });
    return message.toString();
}

async function isNonProposal () {
    const { signer, contract } = getContract("PLMMatchOrganizer");
    const myAddress = await signer.getAddress();
    const message = await contract.isNonProposal(myAddress);
    console.log({ isNonProposal: message });
    return message.toString();
}

async function requestChallenge () {
    const { signer, contract } = getContract("PLMMatchOrganizer");
    const message = await contract.requestChallenge(
        // address proposer,
        // uint256[4] calldata partyChallenger
    );
    console.log({ requestChallenge: message });
    return message.toString();
}

async function settleBattle () {
    const { signer, contract } = getContract("PLMMatchOrganizer");
    const message = await contract.settleBattle();
    console.log({ settleBattle: message });
    return message.toString();
}

export { getProposalList };
