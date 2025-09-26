import React, { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.1; // Start with low volume
      audio.play().catch(error => {
        // Autoplay is often blocked, but we can try.
        console.log("Audio autoplay was prevented.", error);
      });
    }
  }, [src]);

  return (
    <audio ref={audioRef} src={src} loop playsInline />
  );
};

export default AudioPlayer;
