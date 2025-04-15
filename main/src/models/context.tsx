import React, { createContext, useEffect, useRef, useState } from 'react';
import {Song} from '../models/song';
import axios from 'axios';

export type PlayerContextType = {
    audioRef: React.RefObject<HTMLAudioElement | null>;
    seekBar: React.RefObject<HTMLHRElement | null>;
    seekBg: React.RefObject<HTMLDivElement | null>;
    track: any;
    setTrack: React.Dispatch<React.SetStateAction<any>>;
    playStatus: boolean;
    setPlayStatus: React.Dispatch<React.SetStateAction<boolean>>;
    time: {
        currentTime: { seconds: number; minutes: number };
        totalTime: { seconds: number; minutes: number };
    };
    setTime: React.Dispatch<React.SetStateAction<any>>;
    play: () => void;
    pause: () => void;
    playWithId: (id: number) => Promise<void>;
    previous: () => Promise<void>;
    next: () => Promise<void>;
    seekSong: (e: any) => void;
};

export const PlayerContext = createContext<PlayerContextType>(null!);

// ⬇️ Remember to pass songData from outside or import it properly
const PlayerContextProvider: React.FC<React.PropsWithChildren> = ({children}) => {

    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        axios.get('http://18.142.50.220:8000/api/songs/')
            .then(res => setSongs(res.data))
            .catch(err => console.error("Lỗi khi lấy bài hát", err));
    }, []);

    const audioRef = useRef<HTMLAudioElement>(null);
    const seekBar = useRef<HTMLHRElement>(null);
    const seekBg = useRef<HTMLDivElement>(null);

    const [track, setTrack] = useState(songs[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { seconds: 0, minutes: 0 },
        totalTime: { seconds: 0, minutes: 0 },
    });

    const play = () => {
        audioRef.current?.play();
        setPlayStatus(true);
    };

    const pause = () => {
        audioRef.current?.pause();
        setPlayStatus(false);
    };

    const playWithId = async (id: number) => {
        await setTrack(songs[id]);
        await audioRef.current?.play();
        setPlayStatus(true);
    };

    const previous = async () => {
        if (track.id > 0) {
        await setTrack(songs[track.id - 1]);
        await audioRef.current?.play();
        setPlayStatus(true);
        }
    };

    const next = async () => {
        if (track.id < songs.length - 1) {
        await setTrack(songs[track.id + 1]);
        await audioRef.current?.play();
        setPlayStatus(true);
        }
    };

    const seekSong = async (e: any) => {
        if (seekBg.current && audioRef.current) {
        audioRef.current.currentTime =
            (e.navigate.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
        }
    };

    useEffect(() => {
        setTimeout(() => {
        if (audioRef.current) {
            audioRef.current.ontimeupdate = () => {
            if (seekBar.current && audioRef.current && audioRef.current.duration) {
                seekBar.current.style.width =
                Math.floor((audioRef.current.currentTime / audioRef.current.duration) * 100) + '%';
                setTime({
                currentTime: {
                    seconds: Math.floor(audioRef.current.currentTime % 60),
                    minutes: Math.floor(audioRef.current.currentTime / 60),
                },
                totalTime: {
                    seconds: Math.floor(audioRef.current.duration % 60),
                    minutes: Math.floor(audioRef.current.duration / 60),
                },
                });
            }
            };
        }
        }, 1000);
    }, [audioRef]);

    const contextValue: PlayerContextType = {
        audioRef,
        seekBar,
        seekBg,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong,
    };

    return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
};

export default PlayerContextProvider;
