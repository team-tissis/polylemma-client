import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Battle from './components/home/battle';
import ModelTraining from './components/home/training';

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
  const [value, setValue] = useState(0);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  
  const [alignment, setAlignment] = React.useState('web');

  const handleChange = (event,newAlignment) => {
    setAlignment(newAlignment);
  };
  const [formats, setFormats] = React.useState(() => ['italic']);
  const handleFormat = (event,newFormats) => {
    setFormats(newFormats);
  };
  const handleAlignment = (event,newAlignment) => {
    setAlignment(newAlignment);
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
    }else if(alignment == "pictorial_book"){
    }
  }

  return (<>
      <Paper
        elevation={0}
        sx={{ display: 'flex',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          flexWrap: 'wrap'}}
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
