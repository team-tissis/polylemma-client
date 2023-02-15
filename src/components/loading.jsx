import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

const useStyles = styled((theme) => ({
    buttonProgress: {
        color: '#4DA7F0',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

export default function Loading({loading, btnSize}){
    const classes = useStyles();
    return(<>
        <div>
        {loading && <>
            <CircularProgress size={btnSize} className={classes.buttonProgress} /> <>ロード中</>
        </>}
        </div>
    </>)
}
