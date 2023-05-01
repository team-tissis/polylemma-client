import { bytes32ToString, getSeedString, getCommitString, calcRandomSlotId, getContract, poll } from "./utils.js";
import { getImgURI } from "./token.js";
import { getTypeName } from "./data.js";
// import battle from "slices/battle.js";

//////////////////////////////
/// BATTLE FIELD FUNCTIONS ///
//////////////////////////////

async function commitPlayerSeed (playerId, playerSeed, addressIndex) {
    const { signer, contract } = getContract("PLMBattlePlayerSeed", addressIndex);
    const myAddress = await signer.getAddress();
    const commitString = getSeedString(myAddress, playerSeed);
    const response = await poll(() => {return contract.commitPlayerSeed(playerId, commitString);});
    console.log({ commitPlayerSeed: response });
    await response.wait();
}

async function revealPlayerSeed (playerId, playerSeed, addressIndex) {
    const { contract } = getContract("PLMBattlePlayerSeed", addressIndex);
    const response = await poll(() => {return contract.revealPlayerSeed(playerId, playerSeed);});
    console.log({ revealPlayerSeed: response });
    await response.wait();
}

async function commitChoice (playerId, levelPoint, choice, blindingFactor, addressIndex) {
    const { signer, contract } = getContract("PLMBattleChoice", addressIndex);
    const myAddress = await signer.getAddress();
    const commitString = getCommitString(myAddress, levelPoint, choice, blindingFactor);
    const response = await poll(() => {return contract.commitChoice(playerId, commitString);});
    console.log({ commitChoice: response });
    await response.wait();
}

async function revealChoice (playerId, levelPoint, choice, blindingFactor, addressIndex) {
    const { contract } = getContract("PLMBattleChocie", addressIndex);
    const response = await poll(() => {return contract.revealChoice(playerId, levelPoint, choice, blindingFactor);});
    console.log({ revealChoice: response });
    await response.wait();
}

async function reportLateOperation (opponentId, addressIndex) {
    const { contract } = getContract("PLMBattleReporter", addressIndex);
    const opponentState = await getPlayerState(opponentId, addressIndex);
    const opponentRandomSlotState = await getRandomSlotState(opponentId, addressIndex);
    if (opponentRandomSlotState === 0) {
        const response = await poll(() => {return contract.reportLatePlayerSeedCommit(opponentId);});
        console.log({ reportLatePlayerSeedCommit: response });
        await response.wait();
    } else if (opponentState === 0) {
        const response = await poll(() => {return contract.reportLateChoiceCommit(opponentId);});
        console.log({ reportLateChoiceCommit: response });
        await response.wait();
    } else if (opponentState === 1) {
        const response = await poll(() => {return contract.reportLateReveal(opponentId);});
        console.log({ reportLateReveal: response });
        await response.wait();
    } else {
        alert("レポートするものがありません。");
        return false;
    }
    return true;
}

////////////////////////
///      GETTERS     ///
////////////////////////

async function getBattleState (addressIndex, battleId) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getBattleStateById(battleId);});
    console.log({ getBattleState: response });
    return response;
}

async function getPlayerState (battleId, playerId, addressIndex) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getPlayerInfoPlayerStateById(battleId, playerId);});
    console.log({ getPlayerState: response });
    return response;
}

async function getRemainingLevelPoint (battleId, playerId, addressIndex) {
    const { contract } = getContract("PLMBattleManger", addressIndex);
    const response = await poll(() => {return contract.getPlayerInfoRemainingLevelPointById(battleId, playerId);});
    console.log({ getRemainingLevelPoint: response });
    return Number(response);
}

async function getNonce (battleId, playerId, addressIndex) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getNonce(battleId, playerId);});
    console.log({ getNonce: response });
    return response;
}

async function getBondLevelAtBattleStart (battleId,playerId,char, addressIndex) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getBondLevelAtBattleStartById(battleId,playerId,char['level'], char['fromBlock']);});
    console.log({ getBondLevelAtBattleStart: response });
    return response;
}

async function getTotalSupplyAtFromBlock (battleId, playerId, addressIndex) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getTotalSupplyAtFromBlockById(battleId, playerId);});
    console.log({ getTotalSupplyAtFromBlock: response });
    return response;
}

async function getFixedSlotCharInfo (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleStarter", addressIndex);
    // callした関数内でbattleIdを取得しているので引数に不要
    const response = await poll(() => {return contract.getFixedSlotsCharInfo(playerId);});
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
async function getVirtualRandomSlotCharInfo (battleId, playerId, tokenId, addressIndex) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getVirtualRandomSlotCharInfoById(battleId, playerId, tokenId);});
    console.log({ getVirtualRandomSlotCharInfo: response });
    return response;
}

async function getMyRandomSlot (battleId, playerId, playerSeed, addressIndex) {
    const nonce = await getNonce(battleId, playerId, addressIndex);
    const mod = await getTotalSupplyAtFromBlock(battleId, playerId, addressIndex);
    const randomSlotId = calcRandomSlotId(nonce, playerSeed, mod);
    console.log({ randomSlotId: randomSlotId });
    const response = await getVirtualRandomSlotCharInfo(battleId, playerId, randomSlotId, addressIndex);
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
async function getRandomSlotCharInfo (battleId, playerId, addressIndex) {
    const { managerContract } = getContract("PLMBattleManager", addressIndex);
    const { fieldContract } = getContract("PLMBattleStarter", addressIndex);
    const addr = await poll(() => {return managerContract.getPlayerAddressById(battleId, playerId);});
    const response = await poll(() => {return fieldContract.getRandomSlotCharInfo(addr);});
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

async function getCharsUsedRounds (battleId, playerId, addressIndex) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getPlayerInfoFiexedSlotsUsedRoundsById(battleId, playerId);});
    console.log({ getCharsUsedRounds: response });
    return response;
}

async function getPlayerIdFromAddr (addressIndex) {
    const { signer, contract } = getContract("PLMBattleManager", addressIndex);
    const myAddress = await signer.getAddress();
    const response = await poll(() => {return contract.getPlayerId(myAddress);});
    console.log({ getPlayerId: response });
    return response;
}

async function getAddrFromPlayerId (battleId, playerId, addressIndex) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getPlayerAddressById(battleId, playerId);});
    console.log({ getRandomSlotLevel: response });
    return response;
}

async function getCurrentRound (battleId, addressIndex) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getNumRoundsById(battleId);});
    console.log({ getCurrentRound: response });
    return response;
}

async function getMaxLevelPoint (battleId,playerId, addressIndex) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getPlayerInfoMaxLevelPointById(battleId,playerId);});
    console.log({ getMaxLevelPoint: response });
    return response;
}

async function getRoundResults (battleId, addressIndex) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getRoundResultsById(battleId);});
    console.log({ getRoundResults: response });
    return response;
}

async function getBattleResult (battleId, addressIndex) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getBattleResultById(battleId);});
    console.log({ getBattleResult: response });
    return response;
}

async function getRandomSlotState (battleId, playerId, addressIndex) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getPlayerInfoRandomSlotStateById(battleId, playerId);});
    console.log({ getRandomSlotState: response });
    return response;
}

async function getRandomSlotLevel (battleId, playerId, addressIndex) {
    const { contract } = getContract("PLMBattleManager", addressIndex);
    const response = await poll(() => {return contract.getRandomSlotLevelById(battleId, playerId);});
    console.log({ getRandomSlotLevel: response });
    return response;
}

async function getLatestBattleFromAddr (addressIndex) {
    const { signer, contract } = getContract("PLMBattleManager", addressIndex);
    const myAddress = await signer.getAddress();
    const response = await poll(() => {return contract.getLatestBattle(myAddress);});
    console.log({ getLatestBattle: response });
    return response;
}
// async function getRandomSlotLevel (battleId, playerId, addressIndex) {
//     const { contract } = getContract("PLMBattleManager", addressIndex);
//     const response = await poll(() => {return contract.getRandomSlotLevelById(battleId, playerId);});
//     console.log({ getRandomSlotLevel: response });
//     return response;
// }




//////////////////////////
/// FUNCTIONS FOR DEMO ///
//////////////////////////

async function forceInitBattle (addressIndex) {
    const { contract } = getContract("PLMBattleStarter", addressIndex);
    const response = await poll(() => {return contract.forceInitBattle();});
    console.log({ forceInitBattle: response });
    await response.wait();
}

///////////////////////////////////////
/// FUNCTIONS ABOUT EVENT LISTENING ///
///////////////////////////////////////

function eventBattleStarted (myAddress, setMatched, isHome) {
    const { contract } = getContract("PLMBattleStarter");
    const filter = contract.filters.BattleStarted(null, isHome ? myAddress : null, isHome ? null : myAddress);
    contract.on(filter, (battleId, aliceAddr, bobAddr) => {
        setMatched(true);
        console.log(`BattleID ${battleId} was created. / Battle Between ${aliceAddr} and ${bobAddr} has started.`);
    });
}

function eventPlayerSeedCommitted (battleId, opponentPlayerId, setIsWaiting) {
    const { contract } = getContract("PLMBattlePlayerSeed");
    const filter = contract.filters.PlayerSeedCommitted(battleId, opponentPlayerId);
    let isUsed = false;
    contract.on(filter, (battleId, playerId) => {
        if (!isUsed) {
            isUsed = true;
            setIsWaiting(false);
            console.log(`BattleID ${battleId}: Player${playerId} has committed.`);
        }
    });
}

// TODO BattleMain.jsxを修正
function eventPlayerSeedRevealed (battleId, currentRound, opponentPlayerId) {
    const { contract } = getContract("PLMBattlePlayerSeed");
    const filter = contract.filters.PlayerSeedRevealed(battleId, currentRound, opponentPlayerId, null);
    contract.on(filter, (battleId, numRounds, playerId, playerSeed) => {
        console.log(`BattleID ${battleId}: Round ${numRounds+1}: Player${playerId}'s seed has revealed.`);
    });
}

function eventChoiceCommitted (battleId, currentRound, opponentPlayerId, setIsWaiting) {
    const { contract } = getContract("PLMBattleChoice");
    const filter = contract.filters.ChoiceCommitted(battleId, currentRound, opponentPlayerId);
    let isUsed = false;
    contract.on(filter, (battleId, numRounds, playerId) => {
        if (!isUsed) {
            isUsed = true;
            setIsWaiting(false);
            console.log(`BattleID ${battleId}: Round ${numRounds+1}: Player${playerId} has committed.`);
        }
    });
}

function eventChoiceRevealed (battleId, currentRound, opponentPlayerId, setIsWaiting) {
    const { contract } = getContract("PLMBattleChoice");
    const filter = contract.filters.ChoiceRevealed(battleId, currentRound, opponentPlayerId, null, null);
    let isUsed = false;
    contract.on(filter, (battleId, numRounds, playerId, levelPoint, choice) => {
        if (!isUsed) {
            isUsed = true;
            setIsWaiting(false);
            console.log(`BattleID ${battleId}: Round ${numRounds+1}: Player${playerId}'s choice has revealed (levelPoint, choice) = (${levelPoint}, ${choice}).`);
        }
    });
}

function eventRoundCompleted (battleId, currentRound, setCompletedNumRounds) {
    const { contract } = getContract("PLMBattleChoice");
    const filter = contract.filters.RoundCompleted(battleId, currentRound, null, null, null, null, null);
    let isUsed = false;
    contract.on(filter, (battleId, numRounds, isDraw, winner, loser, winnerDamage, loserDamage) => {
        if (!isUsed) {
            isUsed = true;
            setCompletedNumRounds((round) => Math.max(round, numRounds+1));
            if (isDraw) {
                console.log(`BattleID ${battleId}: Round ${numRounds+1}: Draw (${winnerDamage}).`);
            } else {
                console.log(`BattleID ${battleId}: Round ${numRounds+1}: Winner ${winner} ${winnerDamage} vs Loser ${loser} ${loserDamage}.`);
            }
        }
    });
}

function eventBattleCompleted (battleId, setBattleCompleted) {
    const { contract } = getContract("PLMBattleChoice");
    const filter = contract.filters.BattleCompleted(battleId);
    let isUsed = false;
    contract.on(filter, (battleId, numRounds, isDraw, winner, loser, winnerCount, loserCount) => {
        if (!isUsed) {
            isUsed = true;
            setBattleCompleted(true);
            if (isDraw) {
                console.log(`BattleID ${battleId}: Battle Result (${numRounds+1} Rounds): Draw (${winnerCount} - ${loserCount}).`);
            } else {
                console.log(`BattleID ${battleId}: Battle Result (${numRounds+1} Rounds): Winner ${winner} (${winnerCount} - ${loserCount}).`);
            }
        }
    });
}

function eventExceedingLevelPointCheatDetected (battleId, playerId, isCancelling) {
    const { contract } = getContract("PLMBattleChoice");
    const filter = contract.filters.ExceedingLevelPointCheatDetected(battleId, playerId, null, null);
    let isUsed = false;
    contract.on(filter, (battleId, cheater, remainingLevelPoint, cheaterLevelPoint) => {
        if (!isUsed) {
            isUsed = true;
            console.log(`BattleID ${battleId}: Player${cheater} committed ${cheaterLevelPoint} level points, but ${remainingLevelPoint} points remain.`);
            alert(`BattleID ${battleId}: Player${cheater} committed ${cheaterLevelPoint} level points, but ${remainingLevelPoint} points remain.`);
            isCancelling(true);
        }
    });
}

function eventReusingUsedSlotCheatDetected (battleId, playerId, isCancelling) {
    const { contract } = getContract("PLMBattleChoice");
    const filter = contract.filters.ReusingUsedSlotCheatDetected(battleId, playerId, null);
    let isUsed = false;
    contract.on(filter, (battleId, cheater, targetSlot) => {
        if (!isUsed) {
            isUsed = true;
            console.log(`BattleID ${battleId}: Player${cheater} reused slot ${targetSlot}.`);
            alert(`BattleID ${battleId}: Player${cheater} reused slot ${targetSlot}.`);
            isCancelling(true);
        }
    });
}

// TODO: ChoiceとReporterの2つに存在する
function eventLatePlayerSeedCommitDetected (battleId, playerId, isCancelling) {
    const { contract } = getContract("PLMBattlePlayerSeed");
    const filter = contract.filters.LatePlayerSeedCommitDetected(battleId, playerId);
    let isUsed = false;
    contract.on(filter, (battleId, delayer) => {
        if (!isUsed) {
            isUsed = true;
            console.log(`BattleID ${battleId}: Player${delayer}'s seed commit was too late.`);
            alert(`BattleID ${battleId}: Player${delayer}'s seed commit was too late.`);
            isCancelling(true);
        }
    });
}


// TODO: ChoiceとReporterの2つに存在する
function eventLateChoiceCommitDetected (battleId, playerId, isCancelling) {
    const { contract } = getContract("PLMBattleChoice");
    const filter = contract.filters.LateChoiceCommitDetected(battleId, null, playerId);
    let isUsed = false;
    contract.on(filter, (battleId, numRounds, delayer) => {
        if (!isUsed) {
            isUsed = true;
            console.log(`BattleID ${battleId}: Round ${numRounds}: Player${delayer}'s choice commit was too late.`);
            alert(`BattleID ${battleId}: Round ${numRounds}: Player${delayer}'s choice commit was too late.`);
            isCancelling(true);
        }
    });
}

// TODO: ChoiceとReporterの2つに存在する
function eventLateChoiceRevealDetected (battleId, playerId, isCancelling) {
    const { contract } = getContract("PLMBattleChoice");
    const filter = contract.filters.LateChoiceRevealDetected(null, playerId);
    let isUsed = false;
    contract.on(filter, (numRounds, delayer) => {
        if (!isUsed) {
            isUsed = true;
            console.log(`BattleID ${battleId}: Round ${numRounds}: Player${delayer}'s choice reveal was too late.`);
            alert(`BattleID ${battleId}: Round ${numRounds}: Player${delayer}'s choice reveal was too late.`);
            isCancelling(true);
        }
    });
}

// BattleCanceled も2つある(全部説)
function eventBattleCanceled (isCancelled) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.BattleCanceled();
    let isUsed = false;
    contract.on(filter, () => {
        if (!isUsed) {
            isUsed = true;
            // console.log(`BattleID ${battleId}: Battle has been canceled.`);
            isCancelled(true);
        }
    });
}

export { commitPlayerSeed, revealPlayerSeed, commitChoice, revealChoice, reportLateOperation,
         getBattleState, getPlayerState, getRemainingLevelPoint, getFixedSlotCharInfo, getMyRandomSlot, getRandomSlotCharInfo,
         getCharsUsedRounds, getPlayerIdFromAddr, getCurrentRound, getMaxLevelPoint, getRoundResults, getBattleResult, getRandomSlotState, getRandomSlotLevel,
         forceInitBattle,getLatestBattleFromAddr, 
         eventBattleStarted, eventPlayerSeedCommitted, eventPlayerSeedRevealed, eventChoiceCommitted, eventChoiceRevealed,
         eventRoundCompleted, eventBattleCompleted,
         eventExceedingLevelPointCheatDetected, eventReusingUsedSlotCheatDetected,
         eventLatePlayerSeedCommitDetected, eventLateChoiceCommitDetected, eventLateChoiceRevealDetected,
         eventBattleCanceled };
