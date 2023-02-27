import React from 'react';

export default function LoadingDOM({isLoading, message}){
    // isLoadingがtureの際は表示されない
    // message が存在する際はそれを表示する
    if (!isLoading) { return <></> }
    return(<>
        <div id="fullOverlay">
            <div class="text">
                {(message) ? <>{message}</> : "ロード中です"}
                <br/>
                しばらくお待ちください
            </div>
        </div>
    </>)
}
