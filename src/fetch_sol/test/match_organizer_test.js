import { getContract } from '../../fetch_sol/utils.js';
import { extendSubscPeriod, getPLMCoin } from '../../fetch_sol/dealer.js';
import { gacha } from '../../fetch_sol/gacha.js';
import { proposeBattle, isProposed, isNotInvolved, requestChallenge, cancelProposal } from '../../fetch_sol/match_organizer.js';

function randomName () {
    const str = Math.random().toString(32);
    return str.substring(str.length - 3);
}

async function prepareForBattle () {
    await getPLMCoin(220, 400);
    await extendSubscPeriod();

    const fixedSlots = [];
    for (let i = 0; i < 4; i++) {
        fixedSlots.push((await gacha(randomName()))['id']);
    }
    return fixedSlots;
}

async function createCharacters (fixedSlotsOfChallengers) {
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        await getPLMCoin(220, 400, addressIndex);
        await extendSubscPeriod(addressIndex);

        const fixedSlotsOfChallenger = [];
        for (let i = 0; i < 4; i++) {
            fixedSlotsOfChallenger.push((await gacha(randomName(), addressIndex))['id']);
        }
        fixedSlotsOfChallengers[addressIndex] = fixedSlotsOfChallenger;
    }
}

async function makeProposers (fixedSlotsOfChallengers) {
    if (fixedSlotsOfChallengers.length !== 4) {
        createCharacters(fixedSlotsOfChallengers);
    }
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        if (isNotInvolved(addressIndex)) {
            await proposeBattle(fixedSlotsOfChallengers[addressIndex], {min: 4, max: 1020}, addressIndex);
        } else {
            console.log(addressIndex.toString() + " is proposed or in battle.");
        }
    }
}

async function cancelProposals () {
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        if (isProposed(addressIndex)) {
            console.log('cancel...')
            await cancelProposal(addressIndex);
        } else {
            console.log(addressIndex.toString() + " is not involved.");
        }
    }
}

async function requestChallengeToMe () {
    let addressIndex = 2;
    for (let i = 0; i < 2; i++) {
        await getPLMCoin(220, 400, addressIndex);
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

export { prepareForBattle, createCharacters, makeProposers, cancelProposals, requestChallengeToMe };
