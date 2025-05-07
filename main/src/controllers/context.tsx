import axios from 'axios';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { Song } from '../models/song';

export type PlayerContextType = {
    audioRef: React.RefObject<HTMLAudioElement | null>;
    seekBar: React.RefObject<HTMLHRElement | null>;
    seekBg: React.RefObject<HTMLDivElement | null>;
    track: any;
    songs: Song[];
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
    loop: () => Promise<void>;
    shuffle: () => Promise<void>;
    seekSong: (e: any) => void;
};

export const PlayerContext = createContext<PlayerContextType>(null!);

const PlayerContextProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [track, setTrack] = useState<Song | undefined>(undefined);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { seconds: 0, minutes: 0 },
        totalTime: { seconds: 0, minutes: 0 },
    });

    const audioRef = useRef<HTMLAudioElement>(null);
    const seekBar = useRef<HTMLHRElement>(null);
    const seekBg = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await axios.get('http://18.142.50.220:8000/api/songs/');
                setSongs(res.data);
                if (res.data.length > 0 && !track) {
                    setTrack(res.data[0]);
                }
            } catch (err) {
                console.error("Lỗi khi lấy bài hát", err);
            }
        };
        fetchSongs();
    }, []);

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(err => {
                console.error("Lỗi khi phát nhạc:", err);
                setPlayStatus(false);
            });
            setPlayStatus(true);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };

    const playWithId = async (id: number) => {
        try {
            const song = songs.find(s => s.id === id);
            if (song) {
                await setTrack(song);
                if (audioRef.current) {
                    await audioRef.current.play();
                    setPlayStatus(true);
                }
            }
        } catch (err) {
            console.error("Lỗi khi phát bài hát:", err);
            setPlayStatus(false);
        }
    };

    const previous = async () => {
        if (!track || !songs.length) return;
        
        const currentIndex = songs.findIndex(s => s.id === track.id);
        if (currentIndex > 0) {
            try {
                await setTrack(songs[currentIndex - 1]);
                if (audioRef.current) {
                    await audioRef.current.play();
                    setPlayStatus(true);
                }
            } catch (err) {
                console.error("Lỗi khi phát bài trước:", err);
                setPlayStatus(false);
            }
        }
    };

    const next = async () => {
        if (!track || !songs.length) return;
        
        const currentIndex = songs.findIndex(s => s.id === track.id);
        if (currentIndex < songs.length - 1) {
            try {
                await setTrack(songs[currentIndex + 1]);
                if (audioRef.current) {
                    await audioRef.current.play();
                    setPlayStatus(true);
                }
            } catch (err) {
                console.error("Lỗi khi phát bài tiếp theo:", err);
                setPlayStatus(false);
            }
        }
    };

    const seekSong = (e: React.MouseEvent<HTMLDivElement>) => {
        if (seekBg.current && audioRef.current) {
            const rect = seekBg.current.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const percent = offsetX / rect.width;
            const newTime = percent * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
        }
    };

    const loop = async () => {
        if (!track || !songs.length) return;
        
        const currentIndex = songs.findIndex(s => s.id === track.id);
        try {
            await setTrack(songs[currentIndex]);
            if (audioRef.current) {
                await audioRef.current.play();
                setPlayStatus(true);
            }
        } catch (err) {
            console.error("Lỗi khi lặp bài hát:", err);
            setPlayStatus(false);
        }
    };

    const shuffle = async () => {
        if (!songs.length) return;
        
        const shuffledSongs = [...songs].sort(() => Math.random() - 0.5);
        try {
            await setTrack(shuffledSongs[0]);
            if (audioRef.current) {
                await audioRef.current.play();
                setPlayStatus(true);
            }
        } catch (err) {
            console.error("Lỗi khi phát ngẫu nhiên:", err);
            setPlayStatus(false);
        }
    };

    useEffect(() => {
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

            audioRef.current.onended = () => {
                setPlayStatus(false);
                next();
            };

            audioRef.current.onerror = () => {
                console.error("Lỗi khi phát audio");
                setPlayStatus(false);
            };
        }
    }, [audioRef.current]);

    const contextValue: PlayerContextType = {
        audioRef,
        seekBar,
        seekBg,
        track,
        songs,
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
        loop,
        shuffle,
        seekSong,
    };

    return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
};

export default PlayerContextProvider;