import { useContext } from 'react';
import { PlayerContext } from '../controllers/context';
import { Song } from '../models/song';

const SongList = () => {
    const { songs, playWithId } = useContext(PlayerContext);

    const handleSongClick = (song: Song) => {
        playWithId(song.id);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Songs</h2>
            <div className="grid gap-4">
                {songs.map((song) => (
                    <div
                        key={song.id}
                        className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                        onClick={() => handleSongClick(song)}
                    >
                        <img
                            src={`http://18.142.50.220/msa/track_img/${song.image}`}
                            alt={song.title}
                            className="w-12 h-12 rounded"
                        />
                        <div>
                            <h3 className="text-lg font-semibold">{song.title}</h3>
                            <p className="text-gray-400">
                                {song.participants?.map((p: { artist_name: string }) => p.artist_name).join(', ')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SongList; 