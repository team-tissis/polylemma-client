import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from 'components/applications/header';
import HomeIndex from 'components/home/Index.jsx';
import BattleMain from 'components/battle/BattleMain.jsx';
import MatchMake from 'components/battle/MatchMake.jsx';

export const RouterConfig = ({currentCoin, setCurrentCoin}) => {
    return (<>
        <BrowserRouter>
            <Routes>
                <Route index element={<>
                    <Header currentCoin={currentCoin} setCurrentCoin={setCurrentCoin} />
                    <HomeIndex currentCoin={currentCoin} setCurrentCoin={setCurrentCoin} />
                </>} />
                <Route path="/battle_main" element={<BattleMain />} />
                <Route path="/match_make" element={<>
                    <Header currentCoin={currentCoin} setCurrentCoin={setCurrentCoin} />
                    <MatchMake />
                </>} />
            </Routes>
        </BrowserRouter>
    </>);
}
