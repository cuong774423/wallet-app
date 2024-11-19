  import React, { useState, useEffect, useCallback } from 'react';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import { useTonConnect } from "../../hooks/useTonConnect";
  import './Game.css';
  import '../../assets/style/reset.css'
  import dancing1 from '../../assets/images/dacing1.gif';
  import banh from'../../assets/images/khabanh1.gif';
  import dogdancing from'../../assets/images/dogdancing.gif';
  import smolder from'../../assets/images/smolder.jpeg';
  import dogsmile from'../../assets/images/laughingdog.gif';
  import coin from '../../assets/images/coin.png'
  import { initMusic, playMusic, pauseMusic } from '../../untils/Music';
  import backgroundMusic from '../../assets/music/anhtha.mp3';

  const Game = () => {
    const [gridSize, setGridSize] = useState(2);
    const [score, setScore] = useState(0);
    const [correctStreak, setCorrectStreak] = useState(0);
    const [timer, setTimer] = useState(20);
    const [gameOver, setGameOver] = useState(false);
    const [colors, setColors] = useState([]);
    const [differentColorIndex, setDifferentColorIndex] = useState(0);
    const [borderColor, setBorderColor] = useState(null);
    const [penalty, setPenalty] = useState(null);
    const navigate = useNavigate();
    const { wallet } = useTonConnect();
    const [userScore, setUserScore] = useState(0); 

    const saveScore = async (score) => {
      if (!wallet) return;
  
      try {
        // Kiểm tra ví có trong cơ sở dữ liệu chưa, nếu chưa thì tạo tài khoản
        await axios.post('http://localhost:3000/update-score', {
          wallet_address: wallet,
          score: score
        });
      } catch (error) {
        console.error("Lỗi khi lưu điểm:", error);
      }
    };

    const fetchUserScore = async () => {
    if (!wallet) return;
    try {
      // Lấy điểm của người dùng từ API
      const response = await axios.get(`http://localhost:3000/get-score/${wallet}`);
      if (response.data && response.data.total_score !== undefined) {
        setUserScore(response.data.total_score); // Cập nhật điểm người dùng từ API
      }
    } catch (error) {
      console.error("Lỗi khi lấy điểm người dùng:", error);
    }
    };

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

    const generateColors = useCallback((previousIndex = -1) => {
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
        saveScore(score);
        setTimeout( fetchUserScore,1000);
      } 
    }, [timer, gameOver]);

    const handleColorPress = (index) => {
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
        saveScore(score);
        setTimeout( fetchUserScore,1000);
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
                    borderColor: borderColor
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
                <span> {userScore} </span>
                <img src={coin} alt="coin" className="coin" />
              </div>
              
            </div>
            <img src={smolder} alt="img" className="image" />
            <h2>Kết quả</h2>
            <div className="result_scrore">Score: <span style={{ color: 'red' }}>{score}</span></div>
            <div className="result_level" >Level: <span style={{ color: 'blue' }}>{gridSize - 1}</span></div>
            
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
