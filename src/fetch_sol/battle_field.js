import { bytes32ToString, getSeedString, getCommitString, calcRandomSlotId, getContract, poll } from "./utils.js";
import { getImgURI } from "./token.js";
import { getTypeName } from "./data.js";

//////////////////////////////
/// BATTLE FIELD FUNCTIONS ///
//////////////////////////////

async function commitPlayerSeed (playerId, playerSeed, addressIndex) {
    const { signer, contract } = getContract("PLMBattleField", addressIndex);
    const myAddress = await signer.getAddress();
    const commitString = getSeedString(myAddress, playerSeed);
    const response = await poll(() => {return contract.commitPlayerSeed(playerId, commitString);});
    console.log({ commitPlayerSeed: response });
    await response.wait();
}

async function revealPlayerSeed (playerId, playerSeed, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.revealPlayerSeed(playerId, playerSeed);});
    console.log({ revealPlayerSeed: response });
    await response.wait();
}

async function commitChoice (playerId, levelPoint, choice, blindingFactor, addressIndex) {
    const { signer, contract } = getContract("PLMBattleField", addressIndex);
    const myAddress = await signer.getAddress();
    const commitString = getCommitString(myAddress, levelPoint, choice, blindingFactor);
    const response = await poll(() => {return contract.commitChoice(playerId, commitString);});
    console.log({ commitChoice: response });
    await response.wait();
}

async function revealChoice (playerId, levelPoint, choice, blindingFactor, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.revealChoice(playerId, levelPoint, choice, blindingFactor);});
    console.log({ revealChoice: response });
    await response.wait();
}

async function reportLateReveal (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.reportLateReveal(playerId);});
    console.log({ reportLateReveal: response });
    await response.wait();
}

////////////////////////
///      GETTERS     ///
////////////////////////

async function getBattleState (addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getBattleState();});
    console.log({ getBattleState: response });
    return response;
}

async function getPlayerState (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getPlayerState(playerId);});
    console.log({ getPlayerState: response });
    return response;
}

async function getRemainingLevelPoint (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getRemainingLevelPoint(playerId);});
    console.log({ getRemainingLevelPoint: response });
    return Number(response);
}

async function getNonce (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getNonce(playerId);});
    console.log({ getNonce: response });
    return response;
}

async function getBondLevelAtBattleStart (char, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getBondLevelAtBattleStart(char['level'], char['fromBlock']);});
    console.log({ getBondLevelAtBattleStart: response });
    return response;
}

async function getTotalSupplyAtFromBlock (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getTotalSupplyAtFromBlock(playerId);});
    console.log({ getTotalSupplyAtFromBlock: response });
    return response;
}

async function getFixedSlotCharInfo (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getFixedSlotCharInfo(playerId);});
    console.log({ getFixedSlotCharInfo: response });
    const chars = [];
    for (let i = 0; i < response.length; i++) {
        chars.push({
            index: i,
            name: bytes32ToString(response[i].name),
            imgURI: await getImgURI(response[i].imgId, addressIndex),
            characterType: await getTypeName(response[i].characterTypeId, addressIndex),
            level: response[i].level,
            bondLevel: await getBondLevelAtBattleStart(response[i]),
            rarity: response[i].rarity,
            attributeIds: response[i].attributeIds,
            isRandomSlot: false
        })
    }
    return chars;
}

// 自分のランダムスロットの内容を取得する関数
async function getVirtualRandomSlotCharInfo (playerId, tokenId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getVirtualRandomSlotCharInfo(playerId, tokenId);});
    console.log({ getVirtualRandomSlotCharInfo: response });
    return response;
}

async function getMyRandomSlot (playerId, playerSeed, addressIndex) {
    const nonce = await getNonce(playerId, addressIndex);
    const mod = await getTotalSupplyAtFromBlock(playerId, addressIndex);
    const randomSlotId = calcRandomSlotId(nonce, playerSeed, mod);
    console.log({ randomSlotId: randomSlotId });
    const response = await getVirtualRandomSlotCharInfo(playerId, randomSlotId, addressIndex);
    return {
        index: 4,
        name: bytes32ToString(response.name),
        imgURI: await getImgURI(response.imgId, addressIndex),
        characterType: await getTypeName(response.characterTypeId, addressIndex),
        level: response.level,
        bondLevel: 0,
        rarity: response.rarity,
        attributeIds: response.attributeIds,
        isRandomSlot: true
    };
}

// Reveal 後に相手のランダムスロットの内容を取得する関数
async function getRandomSlotCharInfo (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getRandomSlotCharInfo(playerId);});
    console.log({ getRandomSlotCharInfo: response });

    return {
        index: 4,
        name: bytes32ToString(response.name),
        imgURI: await getImgURI(response.imgId, addressIndex),
        characterType: await getTypeName(response.characterTypeId, addressIndex),
        level: response.level,
        bondLevel: 0,
        rarity: response.rarity,
        attributeIds: response.attributeIds,
        isRandomSlot: true
    };
}

async function getCharsUsedRounds (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getCharsUsedRounds(playerId);});
    console.log({ getCharsUsedRounds: response });
    return response;
}

async function getPlayerIdFromAddr (addressIndex) {
    const { signer, contract } = getContract("PLMBattleField", addressIndex);
    const myAddress = await signer.getAddress();
    const response = await poll(() => {return contract.getPlayerIdFromAddr(myAddress);});
    console.log({ getPlayerIdFromAddr: response });
    return response;
}

async function getCurrentRound (addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getCurrentRound();});
    console.log({ getCurrentRound: response });
    return response;
}

async function getMaxLevelPoint (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getMaxLevelPoint(playerId);});
    console.log({ getMaxLevelPoint: response });
    return response;
}

async function getRoundResults (addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getRoundResults();});
    console.log({ getRoundResults: response });
    return response;
}

async function getBattleResult (addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getBattleResult();});
    console.log({ getBattleResult: response });
    return response;
}

async function getRandomSlotState (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getRandomSlotState(playerId);});
    console.log({ getRandomSlotState: response });
    return response;
}

async function getRandomSlotLevel (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.getRandomSlotLevel(playerId);});
    console.log({ getRandomSlotLevel: response });
    return response;
}

//////////////////////////
/// FUNCTIONS FOR DEMO ///
//////////////////////////

async function forceInitBattle (addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const response = await poll(() => {return contract.forceInitBattle();});
    console.log({ forceInitBattle: response });
    await response.wait();
}

///////////////////////////////////////
/// FUNCTIONS ABOUT EVENT LISTENING ///
///////////////////////////////////////

function eventBattleStarted (myAddress, setMatched, isHome) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.BattleStarted(isHome ? myAddress : null, isHome ? null : myAddress);
    contract.on(filter, (aliceAddr, bobAddr) => {
        setMatched(true);
        console.log(`Battle Between ${aliceAddr} and ${bobAddr} has started.`);
    });
}

function eventPlayerSeedCommitted (opponentPlayerId, setIsWaiting) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.PlayerSeedCommitted(opponentPlayerId);
    let isUsed = false;
    contract.on(filter, (playerId) => {
        if (!isUsed) {
            isUsed = true;
            setIsWaiting(false);
            console.log(`Player${playerId} has committed.`);
        }
    });
}

function eventPlayerSeedRevealed (currentRound, opponentPlayerId) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.PlayerSeedRevealed(currentRound, opponentPlayerId, null);
    contract.on(filter, (numRounds, playerId, playerSeed) => {
        console.log(`Round ${numRounds+1}: Player${playerId}'s seed has revealed.`);
    });
}

function eventChoiceCommitted (currentRound, opponentPlayerId, setIsWaiting) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.ChoiceCommitted(currentRound, opponentPlayerId);
    let isUsed = false;
    contract.on(filter, (numRounds, playerId) => {
        if (!isUsed) {
            isUsed = true;
            setIsWaiting(false);
            console.log(`Round ${numRounds+1}: Player${playerId} has committed.`);
        }
    });
}

function eventChoiceRevealed (currentRound, opponentPlayerId, setIsWaiting) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.ChoiceRevealed(currentRound, opponentPlayerId, null, null);
    let isUsed = false;
    contract.on(filter, (numRounds, playerId, levelPoint, choice) => {
        if (!isUsed) {
            isUsed = true;
            setIsWaiting(false);
            console.log(`Round ${numRounds+1}: Player${playerId}'s choice has revealed (levelPoint, choice) = (${levelPoint}, ${choice}).`);
        }
    });
}

function eventRoundCompleted (currentRound, setCompletedNumRounds) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.RoundCompleted(currentRound, null, null, null, null, null);
    let isUsed = false;
    contract.on(filter, (numRounds, isDraw, winner, loser, winnerDamage, loserDamage) => {
        if (!isUsed) {
            isUsed = true;
            setCompletedNumRounds((round) => Math.max(round, numRounds+1));
            if (isDraw) {
                console.log(`Round ${numRounds+1}: Draw (${winnerDamage}).`);
            } else {
                console.log(`Round ${numRounds+1}: Winner ${winner} ${winnerDamage} vs Loser ${loser} ${loserDamage}.`);
            }
        }
    });
}

function eventBattleCompleted (setBattleCompleted) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.BattleCompleted();
    let isUsed = false;
    contract.on(filter, (numRounds, isDraw, winner, loser, winnerCount, loserCount) => {
        if (!isUsed) {
            isUsed = true;
            setBattleCompleted(true);
            if (isDraw) {
                console.log(`Battle Result (${numRounds+1} Rounds): Draw (${winnerCount} - ${loserCount}).`);
            } else {
                console.log(`Battle Result (${numRounds+1} Rounds): Winner ${winner} (${winnerCount} - ${loserCount}).`);
            }
        }
    });
}

function eventExceedingLevelPointCheatDetected (playerId, isCancelling) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.ExceedingLevelPointCheatDetected(playerId, null, null);
    let isUsed = false;
    contract.on(filter, (cheater, remainingLevelPoint, cheaterLevelPoint) => {
        if (!isUsed) {
            isUsed = true;
            console.log(`Player${cheater} committed ${cheaterLevelPoint} level points, but ${remainingLevelPoint} points remain.`);
            alert(`Player${cheater} committed ${cheaterLevelPoint} level points, but ${remainingLevelPoint} points remain.`);
            isCancelling(true);
        }
    });
}

function eventReusingUsedSlotCheatDetected (playerId, isCancelling) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.ReusingUsedSlotCheatDetected(playerId, null);
    let isUsed = false;
    contract.on(filter, (cheater, targetSlot) => {
        if (!isUsed) {
            isUsed = true;
            console.log(`Player${cheater} reused slot ${targetSlot}.`);
            alert(`Player${cheater} reused slot ${targetSlot}.`);
            isCancelling(true);
        }
    });
}

function eventLatePlayerSeedCommitDetected (playerId, isCancelling) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.LatePlayerSeedCommitDetected(playerId);
    let isUsed = false;
    contract.on(filter, (delayer) => {
        if (!isUsed) {
            isUsed = true;
            console.log(`Player${delayer}'s seed commit was too late.`);
            alert(`Player${delayer}'s seed commit was too late.`);
            isCancelling(true);
        }
    });
}

function eventLateChoiceCommitDetected (playerId, isCancelling) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.LateChoiceCommitDetected(null, playerId);
    let isUsed = false;
    contract.on(filter, (numRounds, delayer) => {
        if (!isUsed) {
            isUsed = true;
            console.log(`Round ${numRounds}: Player${delayer}'s choice commit was too late.`);
            alert(`Round ${numRounds}: Player${delayer}'s choice commit was too late.`);
            isCancelling(true);
        }
    });
}

function eventLateChoiceRevealDetected (playerId, isCancelling) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.LateChoiceRevealDetected(null, playerId);
    let isUsed = false;
    contract.on(filter, (numRounds, delayer) => {
        if (!isUsed) {
            isUsed = true;
            console.log(`Round ${numRounds}: Player${delayer}'s choice reveal was too late.`);
            alert(`Round ${numRounds}: Player${delayer}'s choice reveal was too late.`);
            isCancelling(true);
        }
    });
}

function eventBattleCanceled (isCancelled) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.BattleCanceled();
    let isUsed = false;
    contract.on(filter, () => {
        if (!isUsed) {
            isUsed = true;
            console.log(`Battle has been canceled.`);
            isCancelled(true);
        }
    });
}

export { commitPlayerSeed, revealPlayerSeed, commitChoice, revealChoice, reportLateReveal,
         getBattleState, getPlayerState, getRemainingLevelPoint, getFixedSlotCharInfo, getMyRandomSlot, getRandomSlotCharInfo,
         getCharsUsedRounds, getPlayerIdFromAddr, getCurrentRound, getMaxLevelPoint, getRoundResults, getBattleResult, getRandomSlotState, getRandomSlotLevel,
         forceInitBattle,
         eventBattleStarted, eventPlayerSeedCommitted, eventPlayerSeedRevealed, eventChoiceCommitted, eventChoiceRevealed,
         eventRoundCompleted, eventBattleCompleted,
         eventExceedingLevelPointCheatDetected, eventReusingUsedSlotCheatDetected,
         eventLatePlayerSeedCommitDetected, eventLateChoiceCommitDetected, eventLateChoiceRevealDetected,
         eventBattleCanceled };
