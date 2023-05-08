import React from 'react';
import { Blocks } from 'react-loader-spinner';

export default function LoadingDOM({isLoading, message}){
    // isLoading が true の際は表示されない
    // message が存在する際はそれを表示する
    if (!isLoading) { return <></> }
    return(<>
        <div id="fullOverlay">
            <div className="text">
                <div style={{width: '100%', textAlign: 'center'}}>
                    <Blocks
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                    />
                </div>
                {(message) ? <>{message}</> : "ロード中です。"}
                <br/>
                しばらくお待ちください。
            </div>
        </div>
    </>)
}
