import YouTube from 'react-youtube';
import { Button } from 'react-bootstrap';
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

export default class CreditsMusic extends React.Component {
    constructor(properties) {
        super(properties);
        this.state = {
            videoId: properties.videoId,
            playing: true,
            player: null,
            hidden: false,
        }
    }

    onClick = async () => {
        const { player, playing } = this.state;

        this.setState({
            playing: !playing,
        });
        playing ? player.playVideo() : this.pause();
        if (playing) {
            toast.success(`Now playing: ${player.getVideoData().title}`);
        }
    }

    onReady = (event) => {
        this.setState({
            player: event.target,
        });
    }

    onError = () => {
        this.setState({
            hidden: true,
        });
    }

    pause() {
        const { player } = this.state;
        const { getMusic } = this.props;

        player.stopVideo();
        this.setState({
            videoId: getMusic()
        });
    }

    render() {
        const { videoId, playing, hidden } = this.state;
        return (
            <div>
                <YouTube 
                    videoId={videoId}
                    opts={{
                        height: '0',
                        width: '0',
                        playerVars: {
                            controls: 1,
                            showinfo: 0,
                            modestbranding: 1,
                        },
                    }}
                    onReady={this.onReady}
                    onError={this.onError}
                />
                <Button 
                    variant="success" 
                    onClick={this.onClick}
                    className="rounded-circle shadow position-fixed"
                    style={{
                        bottom: '7%',
                        right: '5%',
                        width: 70,
                        height: 70,
                        fontSize: '2rem',
                        zIndex: 99,
                        visibility: hidden ? 'hidden' : 'visible',
                    }}
                >
                    {playing ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faStop} />}
                </Button>
            </div>
        )
    }
}

CreditsMusic.propTypes = {
    getMusic: PropTypes.func.isRequired,
}