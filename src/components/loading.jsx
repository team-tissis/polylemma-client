import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingDOM({loading}){
    return(<>
            {loading && <>
                <CircularProgress size={40} className="loading-btn" />
            </>}
    </>)
}
