import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Анимация для эквалайзера
const barAnimation = keyframes`
  0% { height: 3px; }
  50% { height: 14px; }
  100% { height: 3px; }
`;

// Анимация появления плеера
const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(30px);
    backdrop-filter: blur(0px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
    backdrop-filter: blur(12px);
  }
`;

const PlayerWrapper = styled.div`
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 1000;
  
  @media (max-width: 600px) {
    top: auto;
    bottom: 20px;
    right: 10px;
    transform: none;
  }
`;

const ToggleButton = styled.button<{ isOpen: boolean }>`
  position: absolute;
  left: -40px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 70px;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-right: none;
  border-radius: 20px 0 0 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  
  &:hover {
    background: rgba(0, 0, 0, 0.35);
    width: 45px;
    color: white;
  }
  
  &::before {
    content: '▶';
    font-size: 14px;
    opacity: ${props => props.isOpen ? '0' : '1'};
    transition: opacity 0.2s;
  }
  
  &::after {
    content: '✕';
    font-size: 14px;
    position: absolute;
    opacity: ${props => props.isOpen ? '1' : '0'};
    transition: opacity 0.2s;
  }
  
  @media (max-width: 600px) {
    display: none;
  }
`;

const PlayerContent = styled.div<{ isOpen: boolean }>`
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(12px);
  border-radius: 20px 0 0 20px;
  padding: 15px 12px;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-right: none;
  animation: ${slideIn} 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  
  @media (max-width: 600px) {
    flex-direction: row;
    padding: 8px 15px;
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    animation: none;
  }
`;

const Equalizer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  height: 50px;
  
  @media (max-width: 600px) {
    flex-direction: row;
    height: auto;
    gap: 2px;
  }
`;

const Bar = styled.div<{ isPlaying: boolean; delay: number }>`
  width: 3px;
  height: 8px;
  background: ${props => props.isPlaying ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'};
  border-radius: 2px;
  animation: ${props => props.isPlaying ? barAnimation : 'none'};
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-delay: ${props => props.delay}s;
  
  @media (max-width: 600px) {
    width: 20px;
    height: 3px;
  }
`;

const ControlButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: scale(1.05);
  }
`;

const PlayButton = styled(ControlButton)`
  background: rgba(255, 255, 255, 0.15);
  color: white;
  width: 40px;
  height: 40px;
  font-size: 14px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }
`;

const VolumeIcon = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: white;
  }
`;

const VolumeSlider = styled.input`
  width: 60px;
  height: 3px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    cursor: pointer;
  }
  
  &::-webkit-slider-thumb:hover {
    background: white;
  }
`;

const MobileOnly = styled.div`
  display: none;
  
  @media (max-width: 600px) {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;

const DesktopOnly = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 600px) {
    display: none;
  }
`;

// Плейлист (замени на свои файлы)
const playlist = [
  { name: "City Lights", url: "/music/City lights - Patrick Patrikios.mp3" },
  { name: "Midnight Groove", url: "/music/track2.mp3" },
  { name: "Electric Dreams", url: "/music/track3.mp3" },
];

const MusicPlayer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTrack, setCurrentTrack] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.loop = false;
    
    audioRef.current.addEventListener('ended', () => {
      nextTrack();
    });
    
    loadTrack(currentTrack);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const loadTrack = (index: number) => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current.src = playlist[index].url;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(e => console.log("Playback error:", e));
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Playback error:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % playlist.length;
    setCurrentTrack(next);
    loadTrack(next);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Playback error:", e));
    }
  };

  const prevTrack = () => {
    const prev = (currentTrack - 1 + playlist.length) % playlist.length;
    setCurrentTrack(prev);
    loadTrack(prev);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Playback error:", e));
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    } else {
      setVolume(0.3);
      if (audioRef.current) audioRef.current.volume = 0.3;
    }
  };

  // Полоски эквалайзера
  const bars = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

  return (
    <PlayerWrapper>
      <ToggleButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      
      <PlayerContent isOpen={isOpen}>
        {/* Десктоп версия - вертикальная */}
        <DesktopOnly>
          <Equalizer>
            {bars.map((delay, i) => (
              <Bar key={i} isPlaying={isPlaying} delay={delay} />
            ))}
          </Equalizer>
          
          <ControlButton onClick={prevTrack}>◀</ControlButton>
          <PlayButton onClick={togglePlay}>{isPlaying ? '⏸' : '▶'}</PlayButton>
          <ControlButton onClick={stopMusic}>■</ControlButton>
          <ControlButton onClick={nextTrack}>▶</ControlButton>
          
          <VolumeIcon onClick={toggleMute}>
            {volume === 0 ? '🔇' : volume < 0.3 ? '🔈' : volume < 0.7 ? '🔉' : '🔊'}
          </VolumeIcon>
          <VolumeSlider 
            type="range" 
            min={0} 
            max={1} 
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
          />
        </DesktopOnly>
        
        {/* Мобильная версия - горизонтальная */}
        <MobileOnly>
          <Equalizer>
            {bars.slice(0, 5).map((delay, i) => (
              <Bar key={i} isPlaying={isPlaying} delay={delay} />
            ))}
          </Equalizer>
          
          <ControlButton onClick={prevTrack}>◀</ControlButton>
          <PlayButton onClick={togglePlay}>{isPlaying ? '⏸' : '▶'}</PlayButton>
          <ControlButton onClick={stopMusic}>■</ControlButton>
          <ControlButton onClick={nextTrack}>▶</ControlButton>
          
          <VolumeIcon onClick={toggleMute}>
            {volume === 0 ? '🔇' : '🔊'}
          </VolumeIcon>
        </MobileOnly>
      </PlayerContent>
    </PlayerWrapper>
  );
};

export default MusicPlayer;