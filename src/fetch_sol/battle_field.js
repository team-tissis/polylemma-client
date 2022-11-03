import { getSeedString, getCommitString, calcRandomSlotId, getContract } from "./utils.js";
import { getCurrentCharacterInfo } from "./token.js";

async function commitPlayerSeed (playerId, playerSeed, addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const commitString = getSeedString(myAddress, playerSeed);
    const message = await contract.commitPlayerSeed(playerId, commitString);
    console.log({ commitPlayerSeed: message });
}

async function revealPlayerSeed (playerId, playerSeed, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.revealPlayerSeed(playerId, playerSeed);
    console.log({ revealPlayerSeed: message });
}

async function commitChoice (playerId, levelPoint, choice, blindingFactor, addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const commitString = getCommitString(myAddress, levelPoint, choice, blindingFactor);
    const message = await contract.commitChoice(playerId, commitString);
    console.log({ commitChoice: message });
}

async function revealChoice (playerId, levelPoint, choice, blindingFactor, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.revealChoice(playerId, levelPoint, choice, blindingFactor);
    console.log({ revealChoice: message });
}

async function getNonce (playerId, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.getNonce(playerId);
    console.log({ getNonce: message });
    return message;
}

async function getRandomSlot (nonce, seed, mod) {
    const randomSlotId = calcRandomSlotId(nonce, seed, mod);
    console.log({ randomSlotId: randomSlotId });
    const message = await getCurrentCharacterInfo(randomSlotId);
    return {
        id: randomSlotId,
        characterType: message['characterType'],
        level: message['level'],
        rarity: message['rarity'],
        abilityIds: message['abilityIds'],
    };
}

async function getFixedSlotCharInfo (playerId, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const message = await contract.getFixedSlotCharInfo(playerId);
    console.log({ getFixedSlotCharInfo: message });
    return message;
}

async function getPlayerIdFromAddress (addressIndex) {
    const { signer, contract } = getContract("PLMMatchOrganizer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.getPlayerIdFromAddress(myAddress);
    console.log({ getPlayerIdFromAddress: message });
    return message;
}

function battleStarted (myAddress, setMatched, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const filter = contract.filters.BattleStarted(null, null);
    contract.on(filter, (aliceAddr, bobAddr) => {
        console.log(`Battle Between ${aliceAddr} and ${bobAddr} has started.`);
        if (aliceAddr === myAddress) {
            setMatched(true);
        }
    });
}

function playerSeedCommitted (opponentPlayerId, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const filter = contract.filters.PlayerSeedCommitted(null);
    contract.on(filter, (playerId) => {
        console.log(`Player${playerId} has committed.`);
    });
}

function playerSeedRevealed (opponentPlayerId, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const filter = contract.filters.PlayerSeedRevealed(null, null, null);
    contract.on(filter, (numRounds, playerId, playerSeed) => {
        console.log(`Round ${numRounds+1}: Player${playerId}'s seed has revealed.`);
    });
}

function choiceCommitted (opponentPlayerId, currentRound, setCommitted, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const filter = contract.filters.ChoiceCommitted(null, null);
    contract.on(filter, (numRounds, playerId) => {
        console.log(`Round ${numRounds+1}: Player${playerId} has committed.`);
        console.log(playerId, opponentPlayerId);
        console.log(currentRound, numRounds);
        if (playerId === opponentPlayerId && currentRound == numRounds) {
            setCommitted(true);
        }
    });
}

function choiceRevealed (opponentPlayerId, addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const filter = contract.filters.ChoiceRevealed(null, null, null, null);
    contract.on(filter, (numRounds, playerId, levelPoint, choice) => {
        console.log(`Round ${numRounds+1}: Player${playerId}'s choice has revealed (levelPoint, choice) = (${levelPoint}, ${choice}).`);
    });
}

function roundResult (addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const filter = contract.filters.RoundResult(null, null, null, null, null, null);
    contract.on(filter, (numRounds, isDraw, winner, loser, winnerDamage, loserDamage) => {
        if (isDraw) {
            console.log(`${numRounds+1} Round: Draw (${winnerDamage}).`);
        } else {
            console.log(`${numRounds+1} Round: Winner ${winner} ${winnerDamage} vs Loser ${loser} ${loserDamage}.`);
        }
    });
}

function battleResult (addressIndex) {
    const { contract } = getContract("PLMMatchOrganizer", addressIndex);
    const filter = contract.filters.BattleResult(null, null, null, null, null, null);
    contract.on(filter, (numRounds, isDraw, winner, loser, winnerCount, loserCount) => {
        if (isDraw) {
            console.log(`Battle Result (${numRounds+1} Rounds): Draw (${winnerCount} - ${loserCount}).`);
        } else {
            console.log(`Battle Result (${numRounds+1} Rounds): Winner ${winner} (${winnerCount} - ${loserCount}).`);
        }
    });
}

export { commitPlayerSeed, revealPlayerSeed, commitChoice, revealChoice, getNonce, getRandomSlot, getFixedSlotCharInfo, getPlayerIdFromAddress,
         battleStarted, playerSeedCommitted, playerSeedRevealed, choiceCommitted, choiceRevealed, roundResult, battleResult };
