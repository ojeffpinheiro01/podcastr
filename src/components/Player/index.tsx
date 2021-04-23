import Image from 'next/image'
import { useContext } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { PlayerContext } from '../../contexts/PlayerContext'

import styles from './styles.module.scss'

export function Player() {
    const { episodeList, currentEpisodeIndex } = useContext(PlayerContext)
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
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#84d631' }}
                                railStyle={{ backgroundColor: '#9F75FF' }}
                                handleStyle={{ borderColor: '#84d631', borderWidth: 4 }} />
                        ) : (
                            <div className={styles.emptySlider}></div>
                        )}
                    </div>
                    <span>00:00</span>
                </div>
                
                { episode && (
                    <audio 
                        src={episode.url}
                        autoPlay
                        >

                    </audio>
                ) }

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Aleatório" />
                    </button>

                    <button type="button" disabled={!episode}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>

                    <button type="button" className="playButton" disabled={!episode}>
                        <img src="/play.svg" alt="Tocar" />
                    </button>

                    <button type="button" disabled={!episode}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>

                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>

        </div >
    )
}