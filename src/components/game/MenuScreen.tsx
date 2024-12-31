import React from 'react';
import './Menu.css';
import backgroundImg from '../../assets/images/background.jpg';
import aatroxImg from '../../assets/images/aatrox.jpg';
import coin from '../../assets/images/coin.png'
import bd from '../../assets/images/png-clipart-coins-coins-removebg-preview.png'
import { useNavigate } from 'react-router-dom';
import { initMusic, playMusic} from '../../untils/Music';
import backgroundMusic from '../../assets/music/Alan Walker - Fade [COPYRIGHTED NCS Release].mp3';
import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "../../hooks/useTonConnect";
import { useScore } from '../context/ScoreContext';
import { useFaucetJettonContract } from '../../hooks/useFaucetJettonContract';

export default function Menu() {
  const { connected } = useTonConnect();
  const { scores } = useScore();
  const { balance} = useFaucetJettonContract();

  const handlePlayMusic = () => {
    initMusic(backgroundMusic); 
    playMusic();
  };
  const butonClick = () => {
    navigate('/game');
    handlePlayMusic();
  }
  const navigate = useNavigate();
  return (
    <div className="background" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="containermenu">
        <img src={aatroxImg} alt="Aatrox" className="image" />
        <h1 className="textname">Tìm màu khác biệt</h1>
        <div className='coin_box'>
          <TonConnectButton style={{margin: 10}}/>
          <span style={{display: 'flex', alignItems: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold',
         marginRight: 20}}>{balance && balance}<img style={{height: 20, width: 20,}} src={bd}/></span>
        </div>
        
        <p className="textdescription">Trong 20s, chọn vào ô có màu khác biệt</p>
        <button disabled={!connected} className="button" onClick={butonClick} >
          Chơi Game
        </button>
        <button className="button" style={{backgroundColor: "hsl(0, 0%, 40%)"}} onClick={() =>{
          navigate('/wallet');
        }} >
          Xem ví
        </button>
        
      </div>
    </div>
  );
}
