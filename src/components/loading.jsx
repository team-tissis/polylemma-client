import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingDOM({loading, btnSize}){
    return(<>
        <div>
        {loading && <>
            {/* <CircularProgress size={btnSize} className={classes.buttonProgress} /> */}
            <CircularProgress size={40} className="loading-btn" />
        </>}
        </div>
    </>)
}
