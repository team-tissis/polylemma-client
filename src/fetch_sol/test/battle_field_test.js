import { bytes32ToString, getSeedString, getCommitString, 
    calcRandomSlotId, getContract, poll, getMyAddress } from "../utils.js";
import { getImgURI } from "../token.js";
import { getTypeName } from "../data.js";
import { ContactSupportOutlined } from "@mui/icons-material";
import { BigNumber } from 'bignumber.js';

const COMAddress = 2

async function _COMCommitChoice (levelPoint, choice, blindingFactor, addressIndex) {
    const { signer, contract } = getContract("PLMBattleChoice", COMAddress);
    const myAddress = await signer.getAddress();
    const commitString = getCommitString(myAddress, levelPoint, choice, blindingFactor);
    const response = await poll(() => {return contract.commitChoice(commitString);});
    console.log({ commitChoice: response });
    await response.wait();
}

async function _COMRevealChoice (levelPoint, choice, blindingFactor, addressIndex) {
    const { contract } = getContract("PLMBattleChoice", COMAddress);
    const response = await poll(() => {return contract.revealChoice(levelPoint, choice, blindingFactor);});
    console.log({ revealChoice: response });
    await response.wait();
}

async function _COMRevealPlayerSeed (playerSeed, addressIndex) {
    const { contract } = getContract("PLMBattlePlayerSeed", COMAddress);
    const response = await poll(() => {return contract.revealPlayerSeed(playerSeed);});
    console.log({ revealPlayerSeed: response });
    await response.wait();
}

export { _COMCommitChoice, _COMRevealChoice, _COMRevealPlayerSeed };
