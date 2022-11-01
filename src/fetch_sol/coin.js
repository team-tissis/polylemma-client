import { getContract } from "./utils.js";

async function balanceOf () {
    const { signer, contract } = getContract("PLMCoin");
    const myAddress = await signer.getAddress();
    const message = await contract.balanceOf(myAddress);
    console.log({ balanceOf: message });
    return message.toString();
}

async function approve (contractAddress, approvedCoin) {
    const { contract } = getContract("PLMCoin");
    const message = await contract.approve(contractAddress, approvedCoin);
    console.log({ approve: message });
}

async function mint () {
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
    const event = rc.events.find(event => event.event === 'mintDebug' && event.args.user === myAddress);
    if (event !== undefined) {
        const [ amount, user ] = event.args;
        console.log(`${user} got ${amount.toString()}.`);
    }
    // event の listen 終了

    return { newCoin: await balanceOf() };
}

export { balanceOf, approve, mint};
