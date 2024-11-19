let audio;

export const initMusic = (filePath) => {
  audio = new Audio(filePath);
  audio.loop = true; 
};

export const playMusic = () => {
  if (audio) {
    audio.play();
  }
};

export const pauseMusic = () => {
  if (audio) {
    audio.pause();
  }
};



