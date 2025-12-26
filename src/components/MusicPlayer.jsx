import React, { useEffect, useState, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { SkipBack, SkipForward, Play, Pause, Shuffle, Share2, ListMusic, Music } from 'lucide-react';


const SafeImage = ({ src, alt, style, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        setIsLoaded(false);
        setIsError(false);

        // 캐시된 이미지의 경우 이미 로드 완료 상태일 수 있음
        if (imgRef.current && imgRef.current.complete) {
            setIsLoaded(true);
        }
    }, [src]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setIsError(true);
        setIsLoaded(true); // 에러 상태여도 로딩 애니메이션은 멈춤
    };

    return (
        <div style={{
            width: style?.width || '100%',
            height: style?.height || '100%',
            position: 'relative',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: style?.borderRadius || '0'
        }}>
            <img
                ref={imgRef}
                src={src || '/default-album.png'}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                style={{
                    ...style,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: (isLoaded && !isError) ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out'
                }}
                {...props}
            />
            {(!isLoaded || isError) && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.1)',
                    zIndex: 1
                }}>
                    <Music size={16} style={{ opacity: 0.2, color: 'white' }} />
                </div>
            )}
        </div>
    );
};

const renderTextWithLinks = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
        if (part.match(urlRegex)) {
            return (
                <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: '#F472B6',
                        textDecoration: 'underline',
                        wordBreak: 'break-all'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};

const MusicPlayer = ({ variant = 'fixed' }) => {
    const {
        isPlaying,
        setIsPlaying,
        togglePlay,
        skipToNextTrack,
        skipToPrevTrack,
        isPanelOpen,
        setIsPanelOpen,
        trackIndex,
        setTrackIndex,
        isShuffle,
        setIsShuffle,
        currentTime,
        duration,
        seek,
        tracks,
        isAdmin
    } = useMusic();

    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState('playlist');
    const [showFullCover, setShowFullCover] = useState(false);
    const progressBarRef = useRef(null);

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
        if (clientX === undefined) return;

        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        seek(percentage * duration);
    };

    const onDragStart = (e) => {
        setIsDragging(true);
        handleSeek(e);
    };

    useEffect(() => {
        setShowFullCover(false);
    }, [trackIndex, isPanelOpen]);

    useEffect(() => {
        if (!isDragging) return;

        const handleMove = (e) => {
            if (e.type === 'touchmove') {
                // e.preventDefault(); // This can cause issues if not handled carefully in some browsers
            }
            if (!progressBarRef.current) return;
            const rect = progressBarRef.current.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
            if (clientX === undefined) return;

            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            seek(percentage * duration);
        };

        const handleEnd = () => {
            setIsDragging(false);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', handleEnd);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, duration, seek]);


    const handleShare = () => {
        // slug가 있으면 그것을 사용, 없으면 id 사용 (대규모 시스템의 Slug 기반 공유 방식)
        const songId = currentInfo.slug || currentInfo.id;
        const shareUrl = `${window.location.origin}${window.location.pathname}?song=${songId}`;
        const shareData = {
            title: `귀염부서 펭뚜 - ${currentInfo.title}`,
            text: `펭뚜의 신곡 '${currentInfo.title}'을(를) 들어보세요!`,
            url: shareUrl,
        };

        if (navigator.share) {
            navigator.share(shareData).catch((error) => console.log('Error sharing', error));
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('공유 링크가 클립보드에 복사되었습니다!');
            });
        }
    };

    const currentInfo = tracks[trackIndex] || tracks[0] || {};

    if (variant === 'mini') {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(28, 28, 30, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '40px',
                padding: '8px 24px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                width: 'min(90vw, 400px)',
                justifyContent: 'space-between'
            }} className="mini-player-container">
                {/* Title and Info */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    paddingRight: '12px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    marginRight: '4px',
                    position: 'relative'
                }}>
                    <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        flexShrink: 0
                    }}>
                        <SafeImage
                            src={currentInfo.cover}
                            alt="cover"
                            loading="eager"
                            decoding="async"
                            style={{ width: '100%', height: '100%', borderRadius: '6px', cursor: 'pointer' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowFullCover(!showFullCover);
                            }}
                        />
                    </div>
                    {/* Cover Image Tooltip/Bubble (Mini) */}
                    {showFullCover && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowFullCover(false);
                            }}
                            style={{
                                position: 'absolute',
                                bottom: '40px',
                                left: '0',
                                zIndex: 1000,
                                width: '180px',
                                height: '180px',
                                background: 'rgba(28, 28, 30, 0.95)',
                                backdropFilter: 'blur(20px)',
                                padding: '8px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                animation: 'bubblePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                cursor: 'pointer'
                            }}
                        >
                            <SafeImage
                                src={currentInfo.original_cover || currentInfo.cover}
                                alt="large cover"
                                style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }}
                            />
                            {/* Tip */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-8px',
                                left: '6px',
                                width: '16px',
                                height: '16px',
                                background: 'rgba(28, 28, 30, 0.95)',
                                transform: 'rotate(45deg)',
                                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                            }} />
                        </div>
                    )}
                    <div style={{
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: '600',
                        maxWidth: '100px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {currentInfo.title}
                    </div>
                </div>

                {/* Progress Bar (Mini) */}
                <div
                    ref={variant === 'mini' ? progressBarRef : null}
                    onMouseDown={onDragStart}
                    onTouchStart={onDragStart}
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '24px',
                        right: '24px',
                        height: '10px', // Increased hit area
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-end'
                    }}
                >
                    <div style={{
                        width: '100%',
                        height: '2px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: `${(currentTime / duration) * 100}%`,
                            height: '100%',
                            background: '#F472B6',
                            transition: isDragging ? 'none' : 'width 0.1s linear',
                            position: 'relative'
                        }}>
                            {/* Thumb (Mini) */}
                            <div style={{
                                width: '10px',
                                height: '10px',
                                background: 'white',
                                borderRadius: '50%',
                                position: 'absolute',
                                right: '-5px',
                                top: '50%',
                                transform: `translateY(-50%) scale(${isDragging ? 1.4 : 0})`,
                                opacity: isDragging ? 1 : 0,
                                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }} />
                        </div>
                    </div>
                </div>

                {/* Controls Group */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                }}>
                    {/* Back */}
                    <button onClick={skipToPrevTrack} style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        padding: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        opacity: 0.8
                    }} className="btn-hover-scale-lg btn-hover-opacity btn-active-scale">
                        <SkipBack size={18} fill="currentColor" />
                    </button>

                    {/* Play/Pause */}
                    <button onClick={togglePlay} style={{
                        background: 'white',
                        border: 'none',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        color: '#1c1c1e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)'
                    }} className="btn-hover-scale btn-active-scale">
                        {isPlaying ? (
                            <Pause size={14} fill="currentColor" />
                        ) : (
                            <Play size={16} fill="currentColor" style={{ marginLeft: '2px' }} />
                        )}
                    </button>

                    {/* Forward */}
                    <button onClick={skipToNextTrack} style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        padding: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        opacity: 0.8
                    }} className="btn-hover-scale-lg btn-hover-opacity btn-active-scale">
                        <SkipForward size={18} fill="currentColor" />
                    </button>

                    {/* Shuffle */}
                    <button onClick={() => setIsShuffle(!isShuffle)} style={{
                        background: 'transparent',
                        border: 'none',
                        color: isShuffle ? '#F472B6' : 'white',
                        padding: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        opacity: isShuffle ? 1 : 0.6
                    }} className="btn-hover-scale-lg btn-hover-opacity btn-active-scale">
                        <Shuffle size={16} />
                    </button>
                </div>
            </div>

        );
    }

    if (variant === 'hero') {
        return (
            <div style={{
                margin: '12px auto 24px',
                width: '100%',
                maxWidth: '420px',
                background: 'rgba(44, 44, 46, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                textAlign: 'left',
                color: 'white',
                position: 'relative',
                zIndex: 10,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                maxHeight: isPanelOpen ? '750px' : '260px',
                overflow: 'hidden'
            }}
                onMouseOver={(e) => {
                    if (!isPanelOpen) e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                    if (!isPanelOpen) e.currentTarget.style.transform = 'translateY(0)';
                }}>

                {/* Top Right Share Button */}
                <button
                    onClick={handleShare}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.4)',
                        padding: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        borderRadius: '10px',
                        zIndex: 20
                    }}
                    className="btn-hover-bg btn-active-scale"
                    title="공유하기"
                >
                    <Share2 size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', marginBottom: '16px', position: 'relative' }}>
                    {/* Album Art */}
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                        flexShrink: 0
                    }}>
                        <SafeImage
                            src={currentInfo.cover}
                            alt="cover"
                            loading="eager"
                            decoding="async"
                            style={{
                                width: '100%',
                                height: '100%',
                                animation: isPlaying ? 'rotateArt 20s linear infinite' : 'none',
                                cursor: 'pointer'
                            }}
                            onClick={() => setShowFullCover(!showFullCover)}
                        />
                    </div>

                    {/* Cover Image Tooltip/Bubble (Hero) */}
                    {showFullCover && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowFullCover(false);
                            }}
                            style={{
                                position: 'absolute',
                                top: '70px',
                                left: '0px',
                                zIndex: 1000,
                                width: '300px',
                                height: '300px',
                                background: 'rgba(28, 28, 30, 0.95)',
                                backdropFilter: 'blur(20px)',
                                padding: '10px',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                                animation: 'bubblePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                cursor: 'pointer'
                            }}
                        >
                            <SafeImage
                                src={currentInfo.original_cover || currentInfo.cover}
                                alt="large cover"
                                style={{ width: '100%', height: '100%', borderRadius: '14px', objectFit: 'cover' }}
                            />
                            {/* Tip */}
                            <div style={{
                                position: 'absolute',
                                top: '-8px',
                                left: '22px',
                                width: '16px',
                                height: '16px',
                                background: 'rgba(28, 28, 30, 0.95)',
                                transform: 'rotate(45deg)',
                                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                            }} />
                        </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {currentInfo.title}
                        </div>
                        <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.48)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {currentInfo.artist}
                        </div>
                    </div>
                </div>

                {/* Progress Bar (Hero) */}
                <div style={{ marginBottom: '16px', padding: '0 4px' }}>
                    <div
                        ref={variant === 'hero' ? progressBarRef : null}
                        onMouseDown={onDragStart}
                        onTouchStart={onDragStart}
                        style={{
                            height: '20px', // Increased hit area
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            flex: 1,
                            height: '4px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '2px',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: `${(currentTime / duration) * 100}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #F472B6, #FB923C)',
                                borderRadius: '2px',
                                position: 'relative'
                            }}>
                                {/* Thumb */}
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    background: 'white',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    right: '-6px',
                                    top: '50%',
                                    transform: `translateY(-50%) scale(${isDragging ? 1.4 : 1})`,
                                    boxShadow: isDragging ? '0 0 15px rgba(255,255,255,0.5)' : '0 0 10px rgba(0,0,0,0.5)',
                                    display: (isPlaying || isDragging) ? 'block' : 'none',
                                    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }} />
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '4px',
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.4)',
                        fontWeight: '500'
                    }}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => setIsPanelOpen(!isPanelOpen)} style={{
                            background: 'transparent',
                            border: 'none',
                            color: isPanelOpen ? '#F472B6' : 'rgba(255, 255, 255, 0.4)',
                            padding: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            borderRadius: '10px'
                        }} className="btn-hover-bg btn-active-scale" title="재생목록">
                            <ListMusic size={22} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button onClick={skipToPrevTrack} style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.4)',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '10px',
                            transition: 'all 0.2s'
                        }} className="btn-hover-bg btn-hover-opacity btn-active-scale">
                            <SkipBack size={22} fill="currentColor" />
                        </button>

                        <button onClick={togglePlay} style={{
                            background: 'white',
                            border: 'none',
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            color: '#1c1c1e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.2s'
                        }} className="btn-hover-scale btn-active-scale">
                            {isPlaying ? (
                                <Pause size={20} fill="currentColor" />
                            ) : (
                                <Play size={22} fill="currentColor" style={{ marginLeft: '2px' }} />
                            )}
                        </button>

                        <button onClick={skipToNextTrack} style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.4)',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '10px',
                            transition: 'all 0.2s'
                        }} className="btn-hover-bg btn-hover-opacity btn-active-scale">
                            <SkipForward size={22} fill="currentColor" />
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => setIsShuffle(!isShuffle)} style={{
                            background: 'transparent',
                            border: 'none',
                            color: isShuffle ? '#F472B6' : 'rgba(255, 255, 255, 0.4)',
                            padding: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            borderRadius: '10px'
                        }} className="btn-hover-bg btn-active-scale">
                            <Shuffle size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs Section */}
                <div style={{
                    maxHeight: isPanelOpen ? '500px' : '0px',
                    opacity: isPanelOpen ? 1 : 0,
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflowY: 'auto',
                    marginTop: isPanelOpen ? '16px' : '0px',
                    paddingTop: isPanelOpen ? '16px' : '0px',
                    borderTop: isPanelOpen ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    scrollbarWidth: 'none'
                }} className="integrated-container">
                    <style>{`
                        .integrated-container::-webkit-scrollbar { display: none; }
                    `}</style>

                    {/* Tab Buttons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '16px'
                    }}>
                        <button
                            onClick={() => setActiveTab('playlist')}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '20px',
                                border: 'none',
                                background: activeTab === 'playlist' ? 'rgba(244, 114, 182, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                color: activeTab === 'playlist' ? '#F472B6' : 'rgba(255, 255, 255, 0.5)',
                                fontSize: '12px',
                                fontWeight: '600',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            className="btn-hover-scale"
                        >
                            PLAYLIST
                        </button>
                        <button
                            onClick={() => setActiveTab('lyrics')}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '20px',
                                border: 'none',
                                background: activeTab === 'lyrics' ? 'rgba(244, 114, 182, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                color: activeTab === 'lyrics' ? '#F472B6' : 'rgba(255, 255, 255, 0.5)',
                                fontSize: '12px',
                                fontWeight: '600',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            className="btn-hover-scale"
                        >
                            LYRICS
                        </button>
                    </div>

                    {/* Playlist Tab Content */}
                    {activeTab === 'playlist' && (
                        <div>
                            {tracks.map((track, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setTrackIndex(index);
                                        setIsPlaying(true);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 12px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        background: trackIndex === index ? 'rgba(244, 114, 182, 0.1)' : 'transparent',
                                        transition: 'all 0.2s',
                                        marginBottom: '4px',
                                        border: trackIndex === index ? '1px solid rgba(244, 114, 182, 0.2)' : '1px solid transparent'
                                    }}
                                    className="btn-hover-bg"
                                >
                                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', overflow: 'hidden' }}>
                                        <SafeImage src={track.cover} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: trackIndex === index ? '#F472B6' : '#fff',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {track.title}
                                            {isAdmin && track.is_active === false && (
                                                <span style={{
                                                    fontSize: '10px',
                                                    background: 'rgba(255, 0, 0, 0.2)',
                                                    color: '#ff4d4d',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    marginLeft: '8px',
                                                    verticalAlign: 'middle'
                                                }}>비공개</span>
                                            )}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: 'rgba(255, 255, 255, 0.4)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {track.artist}
                                        </div>
                                    </div>
                                    {trackIndex === index && (
                                        <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '12px', opacity: 0.8 }}>
                                            <div style={{
                                                width: '2px',
                                                height: isPlaying ? '100%' : '60%',
                                                background: '#F472B6',
                                                borderRadius: '1px',
                                                animation: isPlaying ? 'musicBar 0.8s ease-in-out infinite alternate' : 'none',
                                                transition: 'height 0.3s ease'
                                            }} />
                                            <div style={{
                                                width: '2px',
                                                height: isPlaying ? '60%' : '40%',
                                                background: '#F472B6',
                                                borderRadius: '1px',
                                                animation: isPlaying ? 'musicBar 0.5s ease-in-out infinite alternate-reverse' : 'none',
                                                transition: 'height 0.3s ease'
                                            }} />
                                            <div style={{
                                                width: '2px',
                                                height: isPlaying ? '80%' : '50%',
                                                background: '#F472B6',
                                                borderRadius: '1px',
                                                animation: isPlaying ? 'musicBar 0.7s ease-in-out infinite alternate' : 'none',
                                                transition: 'height 0.3s ease'
                                            }} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Lyrics Tab Content */}
                    {activeTab === 'lyrics' && (
                        <div style={{
                            fontSize: '14px',
                            lineHeight: '1.8',
                            color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                            {currentInfo.description && (
                                <div style={{
                                    marginBottom: '24px',
                                    padding: '16px',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    borderRadius: '16px',
                                    fontSize: '13px',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    textAlign: 'center',
                                    lineHeight: '1.6',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    whiteSpace: 'pre-line'
                                }}>
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        margin: '0 auto 16px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                    }}>
                                        <SafeImage
                                            src={currentInfo.cover}
                                            alt="cover"
                                            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                                            onClick={() => setShowFullCover(!showFullCover)}
                                        />
                                    </div>
                                    <div style={{ color: '#F472B6', fontWeight: 'bold', fontSize: '11px', letterSpacing: '0.05em', marginBottom: '8px' }}>SONG INFO</div>
                                    {renderTextWithLinks(currentInfo.description)}
                                </div>
                            )}

                            {currentInfo.lyrics && currentInfo.lyrics.split('\n').map((line, i) => (
                                <div key={i} style={{
                                    margin: '8px 0',
                                    color: 'inherit',
                                    fontWeight: '400',
                                    textAlign: 'center'
                                }}>{line.trim()}</div>
                            ))}
                        </div>
                    )}
                </div>

                <style>{`
    @keyframes musicBar {
        from { height: 20%; }
        to { height: 100%; }
    }
    @keyframes rotateArt {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
    }
    @keyframes bubblePop {
        from { transform: scale(0.8) translateY(10px); opacity: 0; }
        to { transform: scale(1) translateY(0); opacity: 1; }
    }
    `}</style>
            </div >
        );
    }

    // Default floating variant
    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(28, 28, 30, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '8px 16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            maxHeight: isPanelOpen ? '550px' : '88px',
            width: '220px',
            overflow: 'hidden'
        }}>
            {/* Progress Bar (Floating) */}
            <div
                ref={variant === 'fixed' || !variant ? progressBarRef : null}
                onMouseDown={onDragStart}
                onTouchStart={onDragStart}
                style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '8px', // Increased hit area
                    cursor: 'pointer'
                }}
            >
                <div style={{
                    width: '100%',
                    height: '2px',
                    background: 'rgba(255, 255, 255, 0.05)'
                }}>
                    <div style={{
                        width: `${(currentTime / duration) * 100}%`,
                        height: '100%',
                        background: '#F472B6',
                        transition: isDragging ? 'none' : 'width 0.1s linear',
                        position: 'relative'
                    }}>
                        {/* Thumb (Floating) */}
                        <div style={{
                            width: '8px',
                            height: '8px',
                            background: 'white',
                            borderRadius: '50%',
                            position: 'absolute',
                            right: '-4px',
                            top: '50%',
                            transform: `translateY(-50%) scale(${isDragging ? 1.4 : 0})`,
                            opacity: isDragging ? 1 : 0,
                            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }} />
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '40px' }}>
                <button onClick={togglePlay} style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isPlaying ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {isPlaying ? (
                        <div style={{ display: 'flex', gap: '3px' }}>
                            <div style={{ width: '3px', height: '10px', background: 'white', borderRadius: '1px' }} />
                            <div style={{ width: '3px', height: '10px', background: 'white', borderRadius: '1px' }} />
                        </div>
                    ) : (
                        <Play size={16} fill="white" style={{ marginLeft: '2px' }} />
                    )}
                </button>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'white', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                    {currentInfo.title}
                </div>
                <button onClick={() => setIsPanelOpen(!isPanelOpen)} style={{
                    background: 'transparent',
                    border: 'none',
                    color: isPanelOpen ? '#F472B6' : 'white',
                    cursor: 'pointer',
                    padding: '4px'
                }} title="재생목록">
                    <ListMusic size={20} />
                </button>
            </div>

            {/* Integrated Lyrics & Playlist Part (Floating) */}
            <div style={{
                maxHeight: isPanelOpen ? '450px' : '0px',
                opacity: isPanelOpen ? 1 : 0,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                overflowY: 'auto',
                marginTop: isPanelOpen ? '8px' : '0px',
                paddingTop: isPanelOpen ? '12px' : '0px',
                borderTop: isPanelOpen ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                scrollbarWidth: 'none'
            }} className="integrated-container-fixed">
                <style>{`
                    .integrated-container-fixed::-webkit-scrollbar { display: none; }
                `}</style>

                {/* Tab Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '4px',
                    marginBottom: '12px'
                }}>
                    <button
                        onClick={() => setActiveTab('playlist')}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '14px',
                            border: 'none',
                            background: activeTab === 'playlist' ? 'rgba(244, 114, 182, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            color: activeTab === 'playlist' ? '#F472B6' : 'rgba(255, 255, 255, 0.5)',
                            fontSize: '10px',
                            fontWeight: '600',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        PLAYLIST
                    </button>
                    <button
                        onClick={() => setActiveTab('lyrics')}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '14px',
                            border: 'none',
                            background: activeTab === 'lyrics' ? 'rgba(244, 114, 182, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            color: activeTab === 'lyrics' ? '#F472B6' : 'rgba(255, 255, 255, 0.5)',
                            fontSize: '10px',
                            fontWeight: '600',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        LYRICS
                    </button>
                </div>

                {/* Playlist Tab */}
                {activeTab === 'playlist' && tracks.map((track, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            setTrackIndex(index);
                            setIsPlaying(true);
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            background: trackIndex === index ? 'rgba(244, 114, 182, 0.1)' : 'transparent',
                            transition: 'all 0.2s',
                            marginBottom: '2px'
                        }}
                        className="btn-hover-bg"
                    >
                        <div style={{ width: '28px', height: '28px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={track.cover} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: trackIndex === index ? '#F472B6' : '#fff',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {track.title}
                                {isAdmin && track.is_active === false && (
                                    <span style={{
                                        fontSize: '9px',
                                        background: 'rgba(255, 0, 0, 0.2)',
                                        color: '#ff4d4d',
                                        padding: '1px 4px',
                                        borderRadius: '3px',
                                        marginLeft: '6px'
                                    }}>비공개</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Lyrics Tab */}
                {activeTab === 'lyrics' && (
                    <div>
                        {currentInfo.description && (
                            <div style={{
                                marginBottom: '16px',
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.04)',
                                borderRadius: '12px',
                                fontSize: '11px',
                                color: 'rgba(255, 255, 255, 0.5)',
                                textAlign: 'center',
                                lineHeight: '1.5',
                                border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    margin: '0 auto 12px',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                }}>
                                    <SafeImage
                                        src={currentInfo.cover}
                                        alt="cover"
                                        style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                                        onClick={() => setShowFullCover(!showFullCover)}
                                    />
                                </div>
                                <div style={{ color: '#F472B6', fontWeight: 'bold', fontSize: '10px', letterSpacing: '0.05em', marginBottom: '6px' }}>SONG INFO</div>
                                <div style={{ whiteSpace: 'pre-line' }}>{renderTextWithLinks(currentInfo.description)}</div>
                            </div>
                        )}
                        {currentInfo.lyrics && currentInfo.lyrics.split('\n').map((line, i) => (
                            <div key={i} style={{
                                margin: '4px 0',
                                fontSize: '11px',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontWeight: '400',
                                textAlign: 'center'
                            }}>{line.trim()}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MusicPlayer;
