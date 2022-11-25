import { getContract } from '../../fetch_sol/utils.js';
import { extendSubscPeriod } from '../../fetch_sol/dealer.js';
import { faucet } from '../../fetch_sol/coin.js';
import { gacha } from '../../fetch_sol/gacha.js';
import { proposeBattle, isProposed, isNotInvolved, requestChallenge, cancelProposal } from '../../fetch_sol/match_organizer.js';

async function createCharacters (fixedSlotsOfChallengers) {
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        // await charge(addressIndex);
        await faucet(300, addressIndex);
        await extendSubscPeriod(addressIndex);

        const fixedSlotsOfChallenger = [];
        for (let i = 0; i < 4; i++) {
            fixedSlotsOfChallenger.push((await gacha('hoge' + i.toString(), addressIndex))['id']);
        }
        fixedSlotsOfChallengers[addressIndex] = fixedSlotsOfChallenger;
    }
}

async function makeProposers (fixedSlotsOfChallengers) {
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        if (isNotInvolved(addressIndex)) {
            await proposeBattle(fixedSlotsOfChallengers[addressIndex], {min: 4, max: 1020}, addressIndex);
        } else {
            console.log(addressIndex.toString() + " is proposed or in battle.")
        }
    }
}

async function cancelProposals () {
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        if (isProposed(addressIndex)) {
            console.log('cancel...')
            await cancelProposal(addressIndex);
        } else {
            console.log(addressIndex.toString() + " is not involved.")
        }
    }
}

async function requestChallengeToMe () {
    let addressIndex = 2;
    for (let i = 0; i < 2; i++) {
        // await charge(addressIndex);
        await faucet(100, addressIndex);
        await extendSubscPeriod(addressIndex);
    }

    const fixedSlotsOfChallenger = [];
    for (let i = 0; i < 4; i++) {
        fixedSlotsOfChallenger.push((await gacha('hoge' + i.toString(), addressIndex))['id']);
    }

    const { signer } = getContract("PLMMatchOrganizer", 1);
    const myAddress = await signer.getAddress();
    await requestChallenge(myAddress, fixedSlotsOfChallenger, addressIndex);
}

export { createCharacters, makeProposers, cancelProposals, requestChallengeToMe };
