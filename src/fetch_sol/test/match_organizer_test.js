import { getRandomBytes32, getSeedString, getCommitString, getContract } from '../../fetch_sol/utils.js';
import { charge } from '../../fetch_sol/dealer.js';
import { gacha } from '../../fetch_sol/gacha.js';
import { proposeBattle, getMatchState, isInProposal, isNonProposal, requestChallenge, cancelProposal } from '../../fetch_sol/match_organizer.js';
import { commitPlayerSeed, commitChoice, revealChoice } from '../../fetch_sol/battle_field.js';
import { MovingSharp } from '@mui/icons-material';


async function createCharacters (fixedSlotsOfChallengers) {
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        await charge(addressIndex);

        const fixedSlotsOfChallenger = [];
        for (let i = 0; i < 4; i++) {
            fixedSlotsOfChallenger.push(await gacha('hoge' + i.toString(), addressIndex));
        }
        fixedSlotsOfChallengers[addressIndex] = fixedSlotsOfChallenger;
    }
}

async function makeProposers (fixedSlotsOfChallengers) {
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

    const { signer } = getContract("PLMMatchOrganizer", 1);
    const myAddress = await signer.getAddress();
    await requestChallenge(myAddress, fixedSlotsOfChallenger, addressIndex);
}

async function defeatByFoul () {
    const playerId = 0;
    const addressIndex = 1;
    const addressIndex2 = 2;

    const seed = getRandomBytes32();
    await commitPlayerSeed(playerId, seed, addressIndex);

    // 相手の playerId と addressIndex が欲しい
    const seed2 = getRandomBytes32();
    await commitPlayerSeed(1 - playerId, seed2, addressIndex2);

    const levelPoint = 255;
    const choice = 1;
    const blindingFactor = getRandomBytes32();
    await commitChoice(playerId, levelPoint, choice, blindingFactor, addressIndex);

    const blindingFactor1 = getRandomBytes32();
    await commitChoice(1 - playerId, levelPoint, choice, blindingFactor1, addressIndex2);

    await revealChoice(playerId, levelPoint, choice, blindingFactor, addressIndex);

    // console.log(await getMatchState(addressIndex));
    // console.log(await getMatchState(addressIndex2));
}

export { createCharacters, makeProposers, cancelProposals, requestChallengeToMe, defeatByFoul };
