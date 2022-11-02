import { getSigner } from '../../fetch_sol/utils.js';
import { charge } from '../../fetch_sol/dealer.js';
import { gacha } from '../../fetch_sol/gacha.js';
import { proposeBattle, getProposalList, isInProposal, isNonProposal, requestChallenge, cancelProposal } from '../../fetch_sol/match_organizer.js';

const fixedSlotsOfChallengers = Array();

async function createCharacters () {
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        await charge(addressIndex);

        const fixedSlotsOfChallenger = [];
        for (let i = 0; i < 4; i++) {
            fixedSlotsOfChallenger.push(await gacha('hoge' + i.toString(), addressIndex));
        }
        fixedSlotsOfChallengers[addressIndex] = fixedSlotsOfChallenger;
    }
}

async function makeProposers () {
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        if (isNonProposal(addressIndex)) {
            await proposeBattle(fixedSlotsOfChallengers[addressIndex], addressIndex);
        } else {
            console.log(addressIndex.toString() + " is in proposal or battle.")
        }
    }
}

async function cancelProposals () {
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        if (isInProposal(addressIndex)) {
            console.log('cancel...')
            await cancelProposal(addressIndex);
        } else {
            console.log(addressIndex.toString() + " is not in proposal.")
        }
    }
}

async function requestChallengeToMe () {
    let addressIndex = 2;
    for (let i = 0; i < 2; i++) {
        await charge(addressIndex);
    }

    const fixedSlotsOfChallenger = [];
    for (let i = 0; i < 4; i++) {
        fixedSlotsOfChallenger.push(await gacha('hoge' + i.toString(), addressIndex));
    }

    const signer = getSigner();
    const myAddress = await signer.getAddress();
    await requestChallenge(myAddress, fixedSlotsOfChallenger, addressIndex);
}

export { createCharacters, makeProposers, cancelProposals, requestChallengeToMe };
