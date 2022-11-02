import { charge } from '../../fetch_sol/dealer.js';
import { gacha } from '../../fetch_sol/gacha.js';
import { proposeBattle, getProposalList, isInProposal, isNonProposal, requestChallenge, cancelProposal } from '../../fetch_sol/match_organizer.js';

async function makeProposers () {
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        if (isNonProposal(addressIndex)) {
            for (let i = 0; i < 2; i++) {
                await charge(addressIndex);
            }

            const fixedSlotsOfChallenger = [];
            for (let i = 0; i < 4; i++) {
                fixedSlotsOfChallenger.push(await gacha('hoge' + i.toString(), addressIndex));
            }

            proposeBattle(fixedSlotsOfChallenger, addressIndex);
        } else {
            console.log(addressIndex.toString() + " is in proposal or battle.")
        }
    }
}

async function cancelProposals () {
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        if (isInProposal(addressIndex)) {
            console.log('cancel...')
            cancelProposal(addressIndex);
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

    requestChallenge(1, fixedSlotsOfChallenger, addressIndex);
}

export { makeProposers, cancelProposals, requestChallengeToMe };
