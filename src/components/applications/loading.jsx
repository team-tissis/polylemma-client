import React from 'react';

export default function LoadingDOM({isLoading, message}){
    // isLoading が true の際は表示されない
    // message が存在する際はそれを表示する
    if (!isLoading) { return <></> }
    return(<>
        <div id="fullOverlay">
            <div className="text">
                {(message) ? <>{message}</> : "ロード中です。"}
                <br/>
                しばらくお待ちください。
            </div>
        </div>
    </>)
}
