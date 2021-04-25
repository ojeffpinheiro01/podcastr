import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { usePlayer } from '../../contexts/PlayerContext'

import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

import styles from './styles.module.scss'

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0)

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        setPlayingState,
        togglePlay,
        toggleLoop,
        toggleShuffling,
        playNext,
        playPrevivous,
        hasNext,
        hasPrevious,
        clearPlayingState
    } = usePlayer()

    useEffect(() => {
        if (!audioRef.current) {
            return
        }

        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    const setupProgressListener = () => {
        audioRef.current.currentTime = 0
        audioRef.current.addEventListener('timeupdate', event => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    const handleSeek = (amount: number) => {
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    const handleEpisodeEnded = () => {
        if(hasNext){
            playNext()
        } else {
            clearPlayingState()
        }
    }

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.container}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora </strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        src={episode.thumbnail}
                        objectFit='cover'
                        alt={episode.title}
                        width={592}
                        height={592}
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : null}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#84d631' }}
                                railStyle={{ backgroundColor: '#9F75FF' }}
                                handleStyle={{ borderColor: '#84d631', borderWidth: 4 }} />
                        ) : (
                            <div className={styles.emptySlider}></div>
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        autoPlay
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener} 
                        onEnded={handleEpisodeEnded} >

                    </audio>
                )}

                <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffling}
                        className={isShuffling ? styles.isActive : ''}>
                        <img src="/shuffle.svg" alt="Aleatório" />
                    </button>

                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevivous} >
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>

                    <button
                        type="button"
                        className="playButton"
                        disabled={!episode}
                        onClick={togglePlay}>
                        {isPlaying
                            ? <img src="/pause.svg" alt="pausar" />
                            : <img src="/play.svg" alt="Tocar" />}
                    </button>

                    <button type="button" disabled={!episode || !hasNext} onClick={playNext} >
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>

                    <button
                        type="button"
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>

        </div >
    )
}