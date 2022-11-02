import { getSubscExpiredBlock, subscIsExpired, getSubscFeePerUnitPeriod,
    extendSubscPeriod, getSubscUnitPeriodBlockNum, charge, accountCharged ,
    getCurrentStamina, getStaminaMax, getStaminaPerBattle, getRestoreStaminaFee, restoreFullStamina, consumeStaminaForBattle,
} from '../../fetch_sol/dealer.js';
import { balanceOf } from '../../fetch_sol/coin.js';
import { totalSupply, updateLevel, getNecessaryExp, getCurrentCharacterInfo, getOwnedCharacterWithIDList } from '../../fetch_sol/token.js';
import { gacha, getGachaFee } from '../../fetch_sol/gacha.js';
import { proposeBattle, getProposalList, isInProposal, isNonProposal, requestChallenge, cancelProposal } from '../../fetch_sol/match_organizer.js';

async function testProposal(){
    for (let addressIndex = 0; addressIndex < 1; addressIndex++) {
        for (let i = 0; i < 10; i++) {
            await charge(addressIndex);
        }
        const thisUserChara1 = await gacha('hoge1', addressIndex);
        const thisUserChara2 = await gacha('hoge2', addressIndex);
        const thisUserChara3 = await gacha('hoge3', addressIndex);
        const thisUserChara4 = await gacha('hoge4', addressIndex);
        console.log({キャラ1: thisUserChara1, キャラ2: thisUserChara2,
            キャラ3: thisUserChara3, キャラ4: thisUserChara4
        })
    }
}

export { testProposal };
