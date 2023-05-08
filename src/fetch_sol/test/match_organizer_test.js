import { stringToBytes32, getContract } from '../utils.js';
import { extendSubscPeriod, getPLMCoin } from '../dealer.js';
import { gacha } from '../gacha.js';
import { proposeBattle, isProposed, isNotInvolved, requestChallenge, cancelProposal } from '../match_organizer.js';
import { balanceOf } from 'fetch_sol/coin.js';

function randomName () {
    const str = Math.random().toString(32);
    return str.substring(str.length - 3);
}

async function prepareForBattle () {
    const currentCoin = await balanceOf();
    if(currentCoin == 0) {
        await getPLMCoin(220, 400);
        await extendSubscPeriod();
    }

    const fixedSlots = [];
    for (let i = 0; i < 4; i++) {
        fixedSlots.push((await gacha(randomName()))['id']);
        console.log(`new charactor id is coming`)
    }
    return fixedSlots;
}

async function createCharacters (fixedSlotsOfChallengers) {
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        const currentCoin = await balanceOf(addressIndex);
        if (currentCoin == 0){
            await getPLMCoin(220, 400, addressIndex);
            await extendSubscPeriod(addressIndex);
        }

        const fixedSlotsOfChallenger = [];
        for (let i = 0; i < 4; i++) {
            fixedSlotsOfChallenger.push((await gacha(randomName(), addressIndex))['id']);
        }
        fixedSlotsOfChallengers[addressIndex] = fixedSlotsOfChallenger;
    }
}

async function makeProposers (fixedSlotsOfChallengers) {
    if (fixedSlotsOfChallengers.length !== 4) {
        await createCharacters(fixedSlotsOfChallengers);
    }
    for (let addressIndex = 3; addressIndex < 7; addressIndex++) {
        if (isNotInvolved(addressIndex)) {
            await proposeBattle({min: 4, max: 1020}, fixedSlotsOfChallengers[addressIndex], addressIndex);
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

async function requestChallengeToMe (setLoadingStatus) {
    setLoadingStatus({isLoading: true, message: 'コンピュータを自分に対戦させています'})
    let addressIndex = 2;
    const currentCOMCoin = await balanceOf(addressIndex);
    if(currentCOMCoin == 0){
        await getPLMCoin(220, 400, addressIndex);
        await extendSubscPeriod(addressIndex);
    }

    const fixedSlotsOfChallenger = [];
    for (let i = 0; i < 4; i++) {
        fixedSlotsOfChallenger.push((await gacha(randomName(), addressIndex))['id']);
    }

    const { signer } = getContract("PLMMatchOrganizer", 1);
    const myAddress = await signer.getAddress();
    await requestChallenge(myAddress, fixedSlotsOfChallenger, addressIndex);
    setLoadingStatus({isLoading: false, message: null})
}

export { prepareForBattle, createCharacters, makeProposers, cancelProposals, requestChallengeToMe };
