import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTonConnect } from "../../hooks/useTonConnect";
import './Game.css';
import '../../assets/style/reset.css'
import dancing1 from '../../assets/images/dacing1.gif';
import banh from'../../assets/images/khabanh1.gif';
import dogdancing from'../../assets/images/dogdancing.gif';
import smolder from'../../assets/images/smolder.jpeg';
import dogsmile from'../../assets/images/laughingdog.gif';
import coin from '../../assets/images/coin.png'
import bd from '../../assets/images/png-clipart-coins-coins-removebg-preview.png'
import { initMusic, playMusic, pauseMusic } from '../../untils/Music';
import backgroundMusic from '../../assets/music/Alan Walker - Fade [COPYRIGHTED NCS Release].mp3';
import { useScore } from '../context/ScoreContext';
import { useFaucetJettonContract } from '../../hooks/useFaucetJettonContract';

const Game = () => {
  const [gridSize, setGridSize] = useState<number>(2);
  const [score, setScore] = useState<number>(0);
  const [correctStreak, setCorrectStreak] = useState<number>(0);
  const [timer, setTimer] = useState<number>(20);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [colors, setColors] = useState<string[]>([]);
  const [differentColorIndex, setDifferentColorIndex] = useState<number>(0);
  const [borderColor, setBorderColor] = useState<string | null>(null);
  const [penalty, setPenalty] = useState<number | null>(null);
  const navigate = useNavigate();
  const { wallet } = useTonConnect();
  const {scores, increaseScore} = useScore();
  const {balance, mint} = useFaucetJettonContract();
 
  const handlePlayMusic = () => {
    initMusic(backgroundMusic); 
    playMusic();
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return {
      baseColor: `rgb(${r}, ${g}, ${b})`,
      differentColor: `rgb(${r + 50}, ${g + 50}, ${b + 50})`,
      borderColor: `rgb(${r + 25}, ${g + 25}, ${b + 25})`
    };
  };

  const generateColors = useCallback((previousIndex: number = -1) => {
    const { baseColor, differentColor, borderColor } = getRandomColor();

    let newDifferentColorIndex;
    do {
      newDifferentColorIndex = Math.floor(Math.random() * (gridSize * gridSize));
    } while (newDifferentColorIndex === previousIndex);

    const newColors = Array(gridSize * gridSize).fill(baseColor);
    newColors[newDifferentColorIndex] = differentColor;

    setDifferentColorIndex(newDifferentColorIndex);
    setBorderColor(borderColor);
    return newColors;
  }, [gridSize]);

  useEffect(() => {
    setColors(generateColors());
  }, [gridSize, generateColors]);

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const interval = setInterval(() => setTimer(prev => prev - 1  ), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !gameOver) {
      setGameOver(true);
      pauseMusic();
      increaseScore(score);
      if(score >= 20) {
        mint();
      }
    }
  }, [timer, gameOver]);

  const handleColorPress = (index: number) => {
    if (index === differentColorIndex) {
      setScore(score + 1);
      setCorrectStreak(correctStreak + 1);

      if (correctStreak + 1 === 3) {
        if (gridSize < 6) setGridSize(gridSize + 1);
        setCorrectStreak(0);
      }
      setColors(generateColors(differentColorIndex));
    } else {
      setTimer(prev => Math.max(prev - 2, 0));
      setPenalty(-2);
      setTimeout(() => setPenalty(null), 500);
    }
  };

  const endGame = () => {
    if (!gameOver) {  
      setGameOver(true);
      pauseMusic();
      increaseScore(score);
      if(score >= 20) {
        mint();
      }
    }
  }

  const resetGame = () => {
    setGridSize(2);
    setScore(0);
    setCorrectStreak(0);
    setTimer(20);
    setGameOver(false);
    setColors(generateColors());
    handlePlayMusic();
  };    

  return (
    <div className="container">
      {!gameOver ? (
        <>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${(timer / 20) * 100}%` }} />
          </div>
          <div className="timer">
            Thời gian: <span style={{ color: '#0000EE' }}>{timer}</span>
            {penalty && <span className="penalty-text">{penalty}s</span>}
          </div>

          <div className="grid">
            {colors.map((color, index) => (
              <button
                key={index}
                className="box"
                style={{
                  backgroundColor: color,
                  width: `${70 / gridSize}vw`, 
                  height: `${70 / gridSize}vw`, 
                  borderColor: borderColor || "#000",
                }}
                onClick={() => handleColorPress(index)}
              />
            ))}
          </div>

          <div className="score-level">
            <div>Score: <span style={{ color: 'red', fontWeight: 'bold' }}>{score}</span></div>
            <div>Level: <span style={{ color: 'blue',fontWeight: 'bold' }}>{gridSize - 1}</span></div>
          </div>

          <button onClick={endGame} className="end-game">Kết thúc</button>
          <div className="gif">
            <img src={dancing1} alt="gif"/>
            <img src={banh} alt="gif"/>
            <img src={dogdancing} alt="gif"/>
          </div>
        </>
      ) : (
        <div className="result-container">
          <div className="total-score">
            <h4> {wallet}</h4>
            <div className='coin_box'>
              <span> {scores} </span>
              <img src={coin} alt="coin" className="coin" />
            </div>
          </div>
          <span style={{display: 'flex', alignItems: 'center', color: 'grey', fontSize: 18, fontWeight: 'bold',
           alignSelf: 'end', paddingRight: 20}}>{balance && balance}<img style={{height: 20, width: 20,}} src={bd}/></span>
          <img src={smolder} alt="img" className="image" />
          <h2>Kết quả</h2>
          <div className="result_scrore">Score: <span style={{ color: 'red' }}>{score}</span></div>
          <div className="result_level" >Level: <span style={{ color: 'blue' }}>{gridSize - 1}</span></div>
          {score<20 ? (<span className="result_level" style={{color: 'crimson', fontSize: 18}}> Đạt ít nhất 20 điểm để lấy jetton!</span>) : ''}

          <button onClick={resetGame} className="play_again">
            Chơi lại
          </button>
          <button onClick={() => {navigate('/')}} className="back_menu">
            Trở lại menu
          </button>
          <button onClick={() => {navigate('/wallet')}} style={{backgroundColor: "hsl(0, 0%, 40%)"}} className="back_menu">
            Wallet
          </button>
          <div className="gif">
            <img src={dogsmile} alt="gif"/>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
