import { bytes32ToString, getSeedString, getCommitString, calcRandomSlotId, getContract } from "./utils.js";
import { getImgURI } from "./token.js";

async function commitPlayerSeed (playerId, playerSeed, addressIndex) {
    const { signer, contract } = await getContract("PLMBattleField", addressIndex);
    const myAddress = await signer.getAddress();
    const commitString = getSeedString(myAddress, playerSeed);
    const message = await contract.commitPlayerSeed(playerId, commitString);
    console.log({ commitPlayerSeed: message });
}

async function revealPlayerSeed (playerId, playerSeed, addressIndex) {
    const { contract } = await getContract("PLMBattleField", addressIndex);
    const message = await contract.revealPlayerSeed(playerId, playerSeed);
    console.log({ revealPlayerSeed: message });
}

async function commitChoice (playerId, levelPoint, choice, blindingFactor, addressIndex) {
    const { signer, contract } = await getContract("PLMBattleField", addressIndex);
    const myAddress = await signer.getAddress();
    const commitString = getCommitString(myAddress, levelPoint, choice, blindingFactor);
    const message = await contract.commitChoice(playerId, commitString);
    console.log({ commitChoice: message });
}

async function revealChoice (playerId, levelPoint, choice, blindingFactor, addressIndex) {
    const { contract } = await getContract("PLMBattleField", addressIndex);
    const message = await contract.revealChoice(playerId, levelPoint, choice, blindingFactor);
    console.log({ revealChoice: message });
}

async function getNonce (playerId, addressIndex) {
    const { contract } = await getContract("PLMBattleField", addressIndex);
    const message = await contract.getNonce(playerId);
    console.log({ getNonce: message });
    return message;
}

async function getBondLevelAtBattleStart (char, addressIndex) {
    const { contract } = await getContract("PLMBattleField", addressIndex);
    const message = await contract.getBondLevelAtBattleStart(char['level'], char['fromBlock']);
    console.log({ getBondLevelAtBattleStart: message });
    return message;
}

async function getFixedSlotCharInfo (playerId, addressIndex) {
    const { contract } = await getContract("PLMBattleField", addressIndex);
    const message = await contract.getFixedSlotCharInfo(playerId);
    console.log({ getFixedSlotCharInfo: message });
    const response = [];
    message.forEach(async mes =>
        response.push({
            name: bytes32ToString(mes['name']),
            imgURI: await getImgURI(mes['imgId'], addressIndex),
            // fromBlock: mes['fromBlock'],
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
    console.log({問題のIDを確認: tokenId, プレイヤーID: playerId})
    const { contract } = await getContract("PLMBattleField", addressIndex);
    const message = await contract.getVirtualRandomSlotCharInfo(playerId, tokenId);
    console.log({ getVirtualRandomSlotCharInfo: message });
    return message;
}

// Reveal 後に相手のランダムスロットの内容を取得する関数
async function getRandomSlotCharInfo (playerId, addressIndex) {
    const { contract } = await getContract("PLMBattleField", addressIndex);
    const message = await contract.getRandomSlotCharInfo(playerId);
    console.log({ getRandomSlotCharInfo: message });
    return {
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

async function getPlayerIdFromAddress (addressIndex) {
    const { signer, contract } = await getContract("PLMBattleField", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.getPlayerIdFromAddress(myAddress);
    console.log({ getPlayerIdFromAddress: message });
    return message;
}

async function getTotalSupplyAtBattleStart (playerId, addressIndex) {
    const { contract } = await getContract("PLMBattleField", addressIndex);
    const message = await contract.getTotalSupplyAtBattleStart(playerId);
    console.log({ getTotalSupplyAtBattleStart: message });
    return message;
}

async function getMyRandomSlot (playerId, playerSeed, addressIndex) {
    const nonce = await getNonce(playerId);
    const mod = await getTotalSupplyAtBattleStart(playerId);
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

async function getRemainingLevelPoint (playerId, addressIndex) {
    const { contract } = await getContract("PLMBattleField", addressIndex);
    const message = await contract.getRemainingLevelPoint(playerId);
    console.log({ getRemainingLevelPoint: message });
    return message;
}

async function forceInitBattle (addressIndex) {
    const { contract } = await getContract("PLMBattleField", addressIndex);
    const message = await contract.forceInitBattle();
    console.log({ forceInitBattle: message });
    return message;
}

///////////////////////////////////////
/// FUNCTIONS ABOUT EVENT LISTENING ///
///////////////////////////////////////

function battleStarted (myAddress, setMatched, addressIndex) {
    // const { contract } = await getContract("PLMBattleField", addressIndex);
    // const filter = contract.filters.BattleStarted(null, null);
    // contract.on(filter, (aliceAddr, bobAddr) => {
    //     console.log(`Battle Between ${aliceAddr} and ${bobAddr} has started.`);
    //     if (aliceAddr === myAddress) {
    //         setMatched(true);
    //     }
    // });
}

function playerSeedCommitted (opponentPlayerId, addressIndex) {
    // const { contract } = await getContract("PLMBattleField", addressIndex);
    // const filter = contract.filters.PlayerSeedCommitted(null);
    // contract.on(filter, (playerId) => {
    //     console.log(`Player${playerId} has committed.`);
    // });
}

function playerSeedRevealed (opponentPlayerId, addressIndex) {
    // const { contract } = await getContract("PLMBattleField", addressIndex);
    // const filter = contract.filters.PlayerSeedRevealed(null, null, null);
    // contract.on(filter, (numRounds, playerId, playerSeed) => {
    //     console.log(`Round ${numRounds+1}: Player${playerId}'s seed has revealed.`);
    // });
}

function choiceCommitted (opponentPlayerId, currentRound, setCommit, addressIndex) {
    // const { contract } = await getContract("PLMBattleField", addressIndex);
    // const filter = contract.filters.ChoiceCommitted(null, null);
    // contract.on(filter, (numRounds, playerId) => {
    //     console.log(`Round ${numRounds+1}: Player${playerId} has committed.`);
    //     if (playerId === opponentPlayerId && currentRound === numRounds) {
    //         setCommit(true);
    //     }
    // });
}

function choiceRevealed (opponentPlayerId, setOpponentRevealed, addressIndex) {
    // const { contract } = await getContract("PLMBattleField", addressIndex);
    // const filter = contract.filters.ChoiceRevealed(null, null, null, null);
    // contract.on(filter, (numRounds, playerId, levelPoint, choice) => {
    //     if(playerId == opponentPlayerId){
    //         const response = {
    //             numRounds: numRounds,
    //             playerId: playerId,
    //             levelPoint: levelPoint,
    //             choice: choice
    //         }
    //         setOpponentRevealed(response);
    //     }
    //     // console.log(`Round ${numRounds+1}: Player${playerId}'s choice has revealed (levelPoint, choice) = (${levelPoint}, ${choice}).`);
    // });
}

// function choiceRevealed (opponentPlayerId, addressIndex) {
//     const { contract } = await getContract("PLMBattleField", addressIndex);
//     const filter = contract.filters.ChoiceRevealed(null, null, null, null);
//     contract.on(filter, (numRounds, playerId, levelPoint, choice) => {
//         console.log(`Round ${numRounds+1}: Player${playerId}'s choice has revealed (levelPoint, choice) = (${levelPoint}, ${choice}).`);
//     });
// }

function roundResult (currentRound, nextIndex, setListenToRoundRes, setChoice, addressIndex) {
    // const { contract } = await getContract("PLMBattleField", addressIndex);
    // const filter = contract.filters.RoundResult(null, null, null, null, null, null);
    // contract.on(filter, (numRounds, isDraw, winner, loser, winnerDamage, loserDamage) => {
    //     if (currentRound === numRounds && nextIndex !== null) {
    //         setListenToRoundRes('can_choice');
    //         console.log(`choiceを${nextIndex}に変更`);
    //         setChoice(nextIndex);
    //         if (isDraw) {
    //             console.log(`${numRounds+1} Round: Draw (${winnerDamage}).`);
    //         } else {
    //             console.log(`${numRounds+1} Round: Winner ${winner} ${winnerDamage} vs Loser ${loser} ${loserDamage}.`);
    //         }
    //     }
    // });
}

function battleResult (addressIndex) {
    // const { contract } = await getContract("PLMBattleField", addressIndex);
    // const filter = contract.filters.BattleResult(null, null, null, null, null, null);
    // contract.on(filter, (numRounds, isDraw, winner, loser, winnerCount, loserCount) => {
    //     if (isDraw) {
    //         console.log(`Battle Result (${numRounds+1} Rounds): Draw (${winnerCount} - ${loserCount}).`);
    //     } else {
    //         console.log(`Battle Result (${numRounds+1} Rounds): Winner ${winner} (${winnerCount} - ${loserCount}).`);
    //     }
    // });
}

function battleCanceled (addressIndex) {
    // const { contract } = await getContract("PLMBattleField", addressIndex);
    // const filter = contract.filters.BattleCanceled(null);
    // contract.on(filter, (cause) => {
    //     console.log(`Battle has been canceled because of Player${cause}.`);
    // });
}

export { commitPlayerSeed, revealPlayerSeed, commitChoice, revealChoice, getFixedSlotCharInfo, getMyRandomSlot, getRandomSlotCharInfo,
         getPlayerIdFromAddress, getRemainingLevelPoint, forceInitBattle,
         battleStarted, playerSeedCommitted, playerSeedRevealed, choiceCommitted, choiceRevealed, roundResult, battleResult, battleCanceled };
