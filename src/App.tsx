import "./App.css";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameScreen from './components/game/GameScreen';
import MenuScreen from './components/game/MenuScreen';
import { TonConnectButton } from "@tonconnect/ui-react";
import { Counter } from "./components/Counter";
import { Jetton } from "./components/Jetton";
import { TransferTon } from "./components/TransferTon";
import WalletInfo from "./components/Ton";
import styled from "styled-components";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import { ScoreProvider } from "./components/context/ScoreContext";
import "@twa-dev/sdk";
import { BDCoin } from "./components/BDCoin";

const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

function App() {
  return (
    <ScoreProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MenuScreen />} />
            <Route path="/game" element={<GameScreen />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </div>
      </Router>
    </ScoreProvider>
  );
}

function Wallet() {
  const navigate = useNavigate();
  const { network } = useTonConnect();

  return (
    <StyledApp style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
      <AppContainer>
        <FlexBoxCol>
          <FlexBoxRow style={{ justifyContent: "space-around"}}>
            <TonConnectButton />
            <Button>
              {network
                ? network === CHAIN.MAINNET
                  ? "mainnet"
                  : "testnet"
                : "N/A"}
            </Button>
            <button className="backmenu" onClick={() => {
              navigate('/')
            }}>
              Game
            </button>
          </FlexBoxRow>
          <WalletInfo />
          <Jetton />
          <BDCoin />
          <TonConnectButton />
        </FlexBoxCol>
      </AppContainer>
    </StyledApp>
  );
}

export default App;
