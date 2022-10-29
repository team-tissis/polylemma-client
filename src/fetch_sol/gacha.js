import { getContract, handleApprove, getCoinForGacha, getBalance, getTotalSupply } from "./utils.js";

async function mintCoin () {
    const { signer, contract } = getContract("PLMCoin");
    const message = await contract.mint(100);
    console.log({ mint: message });

    // event の listen v1
    // 本当はこのやり方でやりたいがなぜか動かない (.on の中身が実行されている様子がない)
    // const myAddress = await signer.getAddress();
    // const filter = contract.filters.mintDebug(null, myAddress);
    // contract.on(filter, (amount, user) => {
    //     console.log(`${user} got ${amount}.`);
    // });

    // event の listen v2
    // 一応これで動くが、あまり綺麗じゃない
    const myAddress = await signer.getAddress();
    const rc = await message.wait();
    const event = rc.events.find(event => event.event === 'mintDebug' && event.args.user == myAddress);
    if (event != undefined) {
        const [ amount, user ] = event.args;
        console.log(`${user} got ${amount.toString()}.`);
    }
    // event の listen 終了

    return { newCoin: await getBalance() };
}

async function playGacha () {
    const { contractAddress, signer, contract } = getContract("PLMGacha");
    const coinForGacha = await getCoinForGacha();
    await handleApprove(contractAddress, coinForGacha);
    const message = await contract.gacha();
    console.log({ gacha: message });

    // contract.on は非同期(?)だから return する段階で、tokenId の値が入ってくれない
    // /home の方で書く必要があるかも
    // let newTokenId;
    // const myAddress = await signer.getAddress();
    // const filter = contract.filters.CharacterRecievedByUser(myAddress, null, null);
    // contract.on(filter, (account, tokenId, characterInfo) => {
    //     newTokenId = tokenId.toString();
    //     console.log(`${account} got token of ${tokenId}.`);
    //     console.log({ characterInfo: characterInfo })
    // });

    const myAddress = await signer.getAddress();
    const rc = await message.wait();
    const event = rc.events.find(event => event.event === 'CharacterRecievedByUser' && event.args.account == myAddress);
    const [ account, tokenId, characterInfo ] = event.args;
    console.log(`${account} got token of ${tokenId}.`);
    console.log({ characterInfo: characterInfo })

    return { newCoin: await getBalance(), newToken: await getTotalSupply(), newTokenId:  tokenId.toString() };
}

export { mintCoin, playGacha };
