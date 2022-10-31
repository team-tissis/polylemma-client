import React, { useState } from 'react';
import './App.css';
import 'react-tabs/style/react-tabs.css';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Battle from './components/home/battle';
import ModelTraining from './components/home/training';
import GachaGacha from './components/home/gacha';


const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

function App() {
  const [alignment, setAlignment] = React.useState('battle');

  const handleAlignment = (event,newAlignment) => {
    if(!(newAlignment == null)){
      setAlignment(newAlignment);
    }
  };

  function toggleStyle(val){
    if(alignment==val){
      return { width: '25%', backgroundColor: '#75A9FF', color: 'white', fontWeight: 600, fontSize: 17 }
    }else{
      return { width: '25%', backgroundColor: '#EEEEEE', fontWeight: 500, fontSize: 17  }
    }
  }

  function homeBody(){
    if(alignment == "battle"){
      return <Battle/>
    }else if(alignment == "training"){
      return <ModelTraining/>
    }else if(alignment == "gacha"){
      return <GachaGacha/>
    }else if(alignment == "pictorial_book"){
    }
  }

  return (<>
      <Paper
        elevation={0}
        // style={{marginTop: 80}}
        sx={{ display: 'flex', border: (theme) => `1px solid ${theme.palette.divider}`, flexWrap: 'wrap'}}
      >
        <StyledToggleButtonGroup
          size="small"
          value={alignment}
          exclusive
          color="primary"
          onChange={handleAlignment}
          style={{ width: '100%' }}
          aria-label="text alignment"
        >
            <ToggleButton value="battle" style={ toggleStyle("battle") }>バトル</ToggleButton>
            <ToggleButton value="training" style={ toggleStyle("training") }>育成</ToggleButton>
            <ToggleButton value="gacha" style={ toggleStyle("gacha") }>ガチャ</ToggleButton>
            <ToggleButton value="pictorial_book" style={ toggleStyle("pictorial_book") }>図鑑</ToggleButton>
        </StyledToggleButtonGroup>
    </Paper>
    { homeBody() }
  </>);
}

export default App;
