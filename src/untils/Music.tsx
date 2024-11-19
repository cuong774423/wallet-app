let audio: HTMLAudioElement | null = null;

export const initMusic = (filePath: string): void => {
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



