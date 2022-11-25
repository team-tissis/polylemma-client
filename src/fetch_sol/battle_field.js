import { bytes32ToString, getSeedString, getCommitString, calcRandomSlotId, getContract } from "./utils.js";
import { getImgURI } from "./token.js";

//////////////////////////////
/// BATTLE FIELD FUNCTIONS ///
//////////////////////////////

async function commitPlayerSeed (playerId, playerSeed, addressIndex) {
    const { signer, contract } = getContract("PLMBattleField", addressIndex);
    const myAddress = await signer.getAddress();
    const commitString = getSeedString(myAddress, playerSeed);
    const message = await contract.commitPlayerSeed(playerId, commitString);
    console.log({ commitPlayerSeed: message });
}

async function revealPlayerSeed (playerId, playerSeed, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.revealPlayerSeed(playerId, playerSeed);
    console.log({ revealPlayerSeed: message });
}

async function commitChoice (playerId, levelPoint, choice, blindingFactor, addressIndex) {
    const { signer, contract } = getContract("PLMBattleField", addressIndex);
    const myAddress = await signer.getAddress();
    const commitString = getCommitString(myAddress, levelPoint, choice, blindingFactor);
    const message = await contract.commitChoice(playerId, commitString);
    console.log({ commitChoice: message });
}

async function revealChoice (playerId, levelPoint, choice, blindingFactor, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.revealChoice(playerId, levelPoint, choice, blindingFactor);
    console.log({ revealChoice: message });
}

async function reportLateReveal (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.reportLateReveal(playerId);
    console.log({ reportLateReveal: message });
}

async function playerSeedIsRevealed (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.playerSeedIsRevealed(playerId);
    console.log({ playerSeedIsRevealed: message });
}

////////////////////////
///      GETTERS     ///
////////////////////////

async function getBattleState (addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getBattleState();
    console.log({ getBattleState: message });
}

async function getPlayerState (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getPlayerState(playerId);
    console.log({ getPlayerState: message });
}

async function getRemainingLevelPoint (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getRemainingLevelPoint(playerId);
    console.log({ getRemainingLevelPoint: message });
    return Number(message);
}

async function getNonce (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getNonce(playerId);
    console.log({ getNonce: message });
    return message;
}

async function getBondLevelAtBattleStart (char, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getBondLevelAtBattleStart(char['level'], char['fromBlock']);
    console.log({ getBondLevelAtBattleStart: message });
    return message;
}

async function getTotalSupplyAtFromBlock (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getTotalSupplyAtFromBlock(playerId);
    console.log({ getTotalSupplyAtFromBlock: message });
    return message;
}

async function getFixedSlotCharInfo (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getFixedSlotCharInfo(playerId);
    console.log({ getFixedSlotCharInfo: message });
    const response = [];
    message.forEach(async mes =>
        response.push({
            name: bytes32ToString(mes['name']),
            imgURI: await getImgURI(mes['imgId'], addressIndex),
            characterType: mes['characterType'],
            level: mes['level'],
            bondLevel: await getBondLevelAtBattleStart(mes),
            rarity: mes['rarity'],
            attributeIds: mes['attributeIds'],
            isRandomSlot: false, // reduxに保存用
            battleDone: false // reduxに保存用
        })
    );
    return response;
}

// 自分のランダムスロットの内容を取得する関数
async function getVirtualRandomSlotCharInfo (playerId, tokenId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getVirtualRandomSlotCharInfo(playerId, tokenId);
    console.log({ getVirtualRandomSlotCharInfo: message });
    return message;
}

async function getMyRandomSlot (playerId, playerSeed, addressIndex) {
    const nonce = await getNonce(playerId, addressIndex);
    const mod = await getTotalSupplyAtFromBlock(playerId, addressIndex);
    const randomSlotId = calcRandomSlotId(nonce, playerSeed, mod);
    console.log({ randomSlotId: randomSlotId });
    const message = await getVirtualRandomSlotCharInfo(playerId, randomSlotId, addressIndex);
    return {
        name: bytes32ToString(message['name']),
        imgURI: await getImgURI(message['imgId'], addressIndex),
        characterType: message['characterType'],
        level: message['level'],
        bondLevel: 0,
        rarity: message['rarity'],
        attributeIds: message['attributeIds'],
        isRandomSlot: true,
        battleDone: false,
        // index: 4
    };
}

// Reveal 後に相手のランダムスロットの内容を取得する関数
async function getRandomSlotCharInfo (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getRandomSlotCharInfo(playerId);
    console.log({ getRandomSlotCharInfo: message });

    return {
        index: 4, //RSは最後なので5になるはず
        name: bytes32ToString(message['name']),
        imgURI: await getImgURI(message['imgId'], addressIndex),
        characterType: message['characterType'],
        level: message['level'],
        bondLevel: 0,
        rarity: message['rarity'],
        attributeIds: message['attributeIds'],
        isRandomSlot: true,
        battleDone: true
    };
}

async function getCharsUsedRounds (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getCharsUsedRounds(playerId);
    console.log({ getCharsUsedRounds: message });
    return message;
}

async function getPlayerIdFromAddr (addressIndex) {
    const { signer, contract } = getContract("PLMBattleField", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.getPlayerIdFromAddr(myAddress);
    console.log({ getPlayerIdFromAddr: message });
    return message;
}

async function getCurrentRound (addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getCurrentRound();
    console.log({ getCurrentRound: message });
}

async function getMaxLevelPoint (playerId, addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getMaxLevelPoint(playerId);
    console.log({ getMaxLevelPoint: message });
    return message;
}

async function getRoundResults (addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getRoundResults();
    console.log({ getRoundResults: message });
}

async function getBattleResult (addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.getBattleResult();
    console.log({ getBattleResult: message });
}

//////////////////////////
/// FUNCTIONS FOR DEMO ///
//////////////////////////

async function forceInitBattle (addressIndex) {
    const { contract } = getContract("PLMBattleField", addressIndex);
    const message = await contract.forceInitBattle();
    console.log({ forceInitBattle: message });
    return message;
}

///////////////////////////////////////
/// FUNCTIONS ABOUT EVENT LISTENING ///
///////////////////////////////////////

function eventBattleStarted (myAddress, setMatched) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.BattleStarted(null, null);
    contract.on(filter, (aliceAddr, bobAddr) => {
        console.log(`Battle Between ${aliceAddr} and ${bobAddr} has started.`);
        if (aliceAddr === myAddress) {
            setMatched(true);
        }
    });
}

function eventPlayerSeedCommitted (opponentPlayerId) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.PlayerSeedCommitted(null);
    contract.on(filter, (playerId) => {
        console.log(`Player${playerId} has committed.`);
    });
}

function eventPlayerSeedRevealed (opponentPlayerId) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.PlayerSeedRevealed(null, null, null);
    contract.on(filter, (numRounds, playerId, playerSeed) => {
        console.log(`Round ${numRounds+1}: Player${playerId}'s seed has revealed.`);
    });
}

function eventChoiceCommitted (opponentPlayerId, currentRound, setCommit) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.ChoiceCommitted(null, null);
    contract.on(filter, (numRounds, playerId) => {
        console.log(`Round ${numRounds+1}: Player${playerId} has committed.`);
        if (playerId === opponentPlayerId && currentRound === numRounds) {
            setCommit(true);
        }
    });
}

function eventChoiceRevealed (opponentPlayerId, setOpponentRevealed) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.ChoiceRevealed(null, null, null, null);
    contract.on(filter, (numRounds, playerId, levelPoint, choice) => {
        if(playerId === opponentPlayerId){
            const response = {
                numRounds: numRounds,
                playerId: playerId,
                levelPoint: levelPoint,
                choice: choice
            }
            setOpponentRevealed(response);
        }
        // console.log(`Round ${numRounds+1}: Player${playerId}'s choice has revealed (levelPoint, choice) = (${levelPoint}, ${choice}).`);
    });
}

function eventRoundCompleted (currentRound, nextIndex, setListenToRoundRes, setChoice, setRoundDetail) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.RoundCompleted(null, null, null, null, null, null);
    contract.on(filter, (numRounds, isDraw, winner, loser, winnerDamage, loserDamage) => {
        if (currentRound === numRounds && nextIndex !== null) {
            console.log(`choiceを${nextIndex}に変更`);
            setChoice(nextIndex);

            if (isDraw) {
                console.log(`${numRounds+1} Round: Draw (${winnerDamage}).`);
            } else {
                console.log(`${numRounds+1} Round: Winner ${winner} ${winnerDamage} vs Loser ${loser} ${loserDamage}.`);
            }

            setRoundDetail({
                numRounds: numRounds,
                isDraw: isDraw,
                winner: winner,
                loser: loser,
                winnerDamage: winnerDamage,
                loserDamage: loserDamage
            });
            setListenToRoundRes('can_choice');
        }
    });
}

function eventBattleCompleted (setBattleDetail) {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.BattleCompleted(null, null, null, null, null, null);
    contract.on(filter, (numRounds, isDraw, winner, loser, winnerCount, loserCount) => {
        if (isDraw) {
            console.log(`Battle Result (${numRounds+1} Rounds): Draw (${winnerCount} - ${loserCount}).`);
        } else {
            console.log(`Battle Result (${numRounds+1} Rounds): Winner ${winner} (${winnerCount} - ${loserCount}).`);
        }
        setBattleDetail({
            numRounds: numRounds,
            isDraw: isDraw,
            winner: winner,
            loser: loser,
            winnerCount: winnerCount,
            loserCount: loserCount
        });
    });
}

function eventExceedingLevelPointCheatDetected () {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.ExceedingLevelPointCheatDetected();
    contract.on(filter, (cheater, remainingLevelPoint, cheaterLevelPoint) => {
        console.log(`Player${cheater} committed ${cheaterLevelPoint} level points, but ${remainingLevelPoint} points remain.`);
    });
}

function eventReusingUsedSlotCheatDetected () {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.ReusingUsedSlotCheatDetected();
    contract.on(filter, (cheater, targetSlot) => {
        console.log(`Player${cheater} reused slot ${targetSlot}.`);
    });
}

function eventLatePlayerSeedCommitDetected () {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.LatePlayerSeedCommitDetected();
    contract.on(filter, (delayer) => {
        console.log(`Player${delayer}'s seed commit was too late.`);
    });
}

function eventLateChoiceCommitDetected () {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.LateChoiceCommitDetected();
    contract.on(filter, (numRounds, delayer) => {
        console.log(`Round ${numRounds}: Player${delayer}'s choice commit was too late.`);
    });
}

function eventLateChoiceRevealDetected () {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.LateChoiceRevealDetected();
    contract.on(filter, (numRounds, delayer) => {
        console.log(`Round ${numRounds}: Player${delayer}'s choice reveal was too late.`);
    });
}

function eventBattleCanceled () {
    const { contract } = getContract("PLMBattleField");
    const filter = contract.filters.BattleCanceled();
    contract.on(filter, () => {
        console.log(`Battle has been canceled.`);
    });
}

export { commitPlayerSeed, revealPlayerSeed, commitChoice, revealChoice, reportLateReveal, playerSeedIsRevealed,
         getBattleState, getPlayerState, getRemainingLevelPoint, getFixedSlotCharInfo, getMyRandomSlot, getRandomSlotCharInfo,
         getCharsUsedRounds, getPlayerIdFromAddr, getCurrentRound, getMaxLevelPoint, getRoundResults, getBattleResult,
         forceInitBattle,
         eventBattleStarted, eventPlayerSeedCommitted, eventPlayerSeedRevealed, eventChoiceCommitted, eventChoiceRevealed,
         eventRoundCompleted, eventBattleCompleted,
         eventExceedingLevelPointCheatDetected, eventReusingUsedSlotCheatDetected,
         eventLatePlayerSeedCommitDetected, eventLateChoiceCommitDetected, eventLateChoiceRevealDetected,
         eventBattleCanceled };
