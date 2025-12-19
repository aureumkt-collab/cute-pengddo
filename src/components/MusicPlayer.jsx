import React, { useEffect, useState, useRef } from 'react';
import { useMusic } from '../context/MusicContext';


const MusicPlayer = ({ variant = 'fixed' }) => {
    const {
        isPlaying,
        togglePlay,
        skipToNextTrack,
        skipToPrevTrack,
        showLyrics,
        setShowLyrics,
        trackIndex,
        isShuffle,
        setIsShuffle,
        currentTime,
        duration,
        seek
    } = useMusic();

    const [isDragging, setIsDragging] = useState(false);
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

    // 곡 정보 (보통 metadata에서 가져오지만 여기서는 고정)
    const trackInfo = [
        {
            title: '펭뚜송 (Official)',
            artist: 'Pengddo',
            cover: '/assets/pengddo_song_v1.png',
            description: '작지만 세상에서 가장 큰 행복을 전하는 펭뚜의 응원가입니다. 아빠 뒤를 졸졸 따라다니고, 맛있는 밥 한 끼에 세상을 다 가진 듯 행복해하는 펭뚜의 순수함을 노래합니다. 지친 일상에 웃음이 필요한 모든 분께 펭뚜가 전하는 상큼 발랄한 비타민 같은 곡입니다.',
            lyrics: `[Verse 1]
            안녕! 나는 펭뚜야 (뚜뚜)
귀염부서 팀장 소수 인형
호기심 백만 개 눈 반짝반짝
세상 모든 게 신기해 항상 여섯 살!

[Pre-Chorus]
아빠~ 아빠~~ 어디 있어요? (찾는다 뚜뚜)
아빠만 바라보는 귀염둥이
오늘도 내 귀여움 충전 완료!
모두에게 힐링을 줄게 (큐트 파워!)

[Chorus]
랄랄라 펭뚜 (귀여워!) 랄랄라 펭뚜 (사랑스러워!)
온 동네 귀여움은 내가 다 맡아!
작지만 세상 제일 큰 행복
펭뚜와 함께라면 매일이 즐거워!
헤-펭-이! (멍~) 거기서 뭐 해?

[Verse 2]
헤펭이는 항상 멍 때리지 (멍청미!)
펭뚜 옆에선 늘 티격태격 짝꿍
"야! 펭뚜! (흥칫뿡)" 말만 그래도
사실 제일 친한 우리 둘

[Pre-Chorus]
아빠~ 아빠~~ 배고파요! (냠냠 뚜뚜)
밥 먹을 때도 귀여움 발사!
매일매일 귀여움 만렙 찍는 중
이 모습 그대로가 힐링 그 자체!

[Chorus]
랄랄라 펭뚜 (귀여워!) 랄랄라 펭뚜 (사랑스러워!)
온 동네 귀여움은 내가 다 맡아!
작지만 세상 제일 큰 행복
펭뚜와 함께라면 매일이 즐거워!`
        },
        {
            title: '펭뚜송 v2',
            artist: 'Pengddo feat. Hepeng',
            cover: '/assets/pengddo_song_v2.png',
            description: '공식 펭뚜송의 변형된 버전 입니다. 헤펭이와 추임새를 강조하였습니다.',
            lyrics: `[Verse 1]
안녕! 나는 펭뚜야 (뚜뚜)
귀염부서 팀장 소수 인형
호기심 백만 개 눈 반짝반짝
세상 모든 게 신기해 항상 여섯 살!

[Pre-Chorus]
아빠~ 아빠~~ 어디 있어요? (찾는다 뚜뚜)
아빠만 바라보는 귀염둥이
오늘도 내 귀여움 충전 완료!
모두에게 힐링을 줄게 (큐트 파워!)

[Chorus]
랄랄라 펭뚜 (귀여워!) 랄랄라 펭뚜 (사랑스러워!)
온 동네 귀여움은 내가 다 맡아!
작지만 세상 제일 큰 행복
펭뚜와 함께라면 매일이 즐거워!
헤-펭-이! (멍~) 거기서 뭐 해?

[Verse 2]
헤펭이는 항상 멍 때리지 (멍청미!)
펭뚜 옆에선 늘 티격태격 짝꿍
"야! 펭뚜! (흥칫뿡)" 말만 그래도
사실 제일 친한 우리 둘

[Pre-Chorus]
아빠~ 아빠~~ 배고파요! (냠냠 뚜뚜)
밥 먹을 때도 귀여움 발사!
매일매일 귀여움 만렙 찍는 중
이 모습 그대로가 힐링 그 자체!

[Chorus]
랄랄라 펭뚜 (귀여워!) 랄랄라 펭뚜 (사랑스러워!)
온 동네 귀여움은 내가 다 맡아!
작지만 세상 제일 큰 행복
펭뚜와 함께라면 매일이 즐거워!`
        },
        {
            title: '500원의 비상',
            artist: 'Pengddo',
            cover: '/assets/500won_fly.png',
            description: `누구에게나 처음은 힘들고, 때론 소중한 꿈이 수포로 돌아가기도 합니다.남극에서 온 펭귄 인형 펭뚜가 겪은 '투자 실패'라는 시련과, 아빠를 따라 '귀염부서'에 입사하며 보여주는 뜨거운 가족애를 한 편의 서사시처럼 담아내고 싶었습니다.`,
            lyrics: `[Verse 1]
            고사리 같은 앞발로 모은 소중한 오백 원 업비트 파란 불빛 속에 내 꿈을 던졌지 엄마가 좋아하던 커다란 노래방 새우깡 그 봉지를 가득 채울 꿈에 부풀었는데
            
            [Verse 2] 
            차트는 꺾이고 내 마음도 무너져 내렸어 남극의 얼음보다 차갑게 얼어붙은 내 계좌 오백 원의 기적은 수포로 돌아갔지만 노란 부리 끝에 맺힌 눈물을 닦아내 본다
            
            [Pre - Chorus]
            슬픔은 여기까지, 다시 일어설 시간 아빠의 뒷모습을 따라 좁은 문을 열어 정장 대신 귀여움을 장착하고서 새로운 세상을 향해 뒤뚱이며 걷는다

    [Chorus] 
나의 이름은 펭뚜, 귀염부서의 신입사원! 무너진 코인의 잔해 위에서 다시 피어날 거야 비록 오백 원은 사라졌어도 나의 귀여움은 영원해 세상을 치유하는 미소로 다시 재기하리라 효도라는 이름의 찬란한 빛을 향해!

    [Bridge] 
노래방 새우깡, 그 바삭한 약속을 잊지 않아! 언젠가 내 월급으로 백 봉지 사다 줄 거야 지켜봐 줘, 펭뚜의 위대한 도전은 이제부터 시작이니까!

    [Chorus]
나의 이름은 펭뚜, 귀염부서의 신입사원! 무너진 코인의 잔해 위에서 다시 피어날 거야 비록 오백 원은 사라졌어도 나의 귀여움은 영원해 세상을 치유하는 미소로 다시 재기하리라 효도라는 이름의 찬란한 빛을 향해!

    [Outro] 
내일은 출근날... 귀여움 준비 완료.`
        },
        {
            title: '푸른 얼음 나라의 선물',
            artist: 'Pengddo',
            cover: '/assets/ice_gift.png',
            description: `평범하고 조용했던 우리 집에 '천방지축 펭귄 인형' 하나가 들어오며 시작된 놀라운 변화를 노래합니다.서툰 발걸음과 말똥말똥한 눈동자 뒤에 숨겨진 펭뚜의 신비로운 힘, 그리고 그로 인해 다시 춤추기 시작한 우리 가족의 소중한 시간을 담은 따뜻한 헌사입니다.`,
            lyrics: `[Verse 1]
            먼 남극의 얼음 나라 꿈을 싣고 왔니 노란 부리 꼭 다물고 우리 집에 온 날 말똥말똥 커다란 눈, 무얼 보고 있니 세상 모든 게 신기한 너의 그 눈동자

    [Verse 2] 
엉뚱한 네 발걸음 아기처럼 서툴러도 사고뭉치 펭뚜야, 넌 알고 있을까 네가 우리 문을 열고 들어온 그 순간부터 무채색이던 거실이 빛으로 물든 걸

    [Chorus] 
신비로운 너의 마법, 작은 날개짓 하나에 멈춰있던 우리 시간이 춤을 추기 시작해 천방지축 펭뚜야, 너는 우리의 기적 남극에서 온 신비한 나의 작은 친구

    [Bridge] 
    깜짝 놀란 그 표정은 언제나 귀여워 비틀거리는 뒷모습도 사랑스러워 너로 인해 달라진 이 놀라운 이야기 아름다운 서사가 여기서 시작돼

    [Chorus] 
    신비로운 너의 마법, 작은 날개짓 하나에 멈춰있던 우리 시간이 춤을 추기 시작해 천방지축 펭뚜야, 너는 우리의 기적 남극에서 온 신비한 나의 작은 친구

    [Outro]
    고마워 펭뚜야... 우리 곁에 와줘서... (부드러운 여운과 함께 종료)`
        },
        {
            title: '티격태격',
            artist: 'Pengddo feat. Hepeng',
            cover: '/assets/fight_scat.png',
            description: `"말 많은 펭뚜와 음악 광 헤펭이의 티격태격 케미를 담은 경쾌한 펑키 사운드. 다름을 넘어 하나로 만나는 두 인형의 특별한 이중주입니다."`,
            lyrics: `[Intro]
"슈비두-바 다바다바- 둠칫!"

"야, 너... 내 말 좀 들어봐."

"뚜-왑! 슈비두-왑! 뭐라구?"

[Verse 1]
안녕 나를 봐, 평범한 게 내 매력

근데 너를 보면 가끔은 나 혈압 올라

말을 걸면 멍- 대답은 늘 어?

항상 끼고 있는 그 헤드셋은 네 신체 일부니?

한쪽은 덜렁덜렁 곧 떨어질 것 같은데

내 목소린 그 틈으로도 안 들어가는 것 같아

답답해 미치겠네, 오늘도 혼잣말 중!

[Verse 2]
나를 봐, 이 리듬이 내 전부야 바-다-비-두!

왼쪽 귀엔 힙합, 오른쪽 귀엔 자유가 흘러

덜렁대는 헤드셋? 이게 내 스웨그인 걸

네가 뭐라 해도 내 세상은 비트 위

너의 잔소리도 왠지 샘플링 같아

조금만 더 크게 말해봐, 베이스에 묻히니까!

[Pre-Chorus]
우린 너무나 달라, 얼음과 불처럼

나는 말하고, 너는 춤을 추고

자꾸만 어긋나는 우리 둘의 리듬

[Chorus]
달라도 너무 다른 우리들의 사정

티격태격해도 어느새 우린 짝꿍

한쪽 귀를 열어둘게 너의 목소리 들리게

서로 다른 비트 위에 피어나는 우리 우정

랄랄라- 너와 나의 얘기, 반대의 끌림!

[Bridge]
"제발 그 덜렁거리는 것 좀 고쳐!"

"바-다-비-두-밥! 넌 몰라~"

"내가 말할 때만이라도 음악 좀 꺼!"

"슈비-두-비-둡! 그럼 들을게!"

"하! 진짜 못 말린다니까!"

[Chorus]
달라도 너무 다른 우리들의 사정

티격태격해도 어느새 우린 짝꿍

한쪽 귀를 열어둘게 너의 목소리 들리게

서로 다른 비트 위에 피어나는 우리 우정

랄랄라- 너와 나의 얘기, 반대의 끌림!

[Outro]
"슈비두-왑 뚜왑- 뚜왑!"

"아니, 칭찬이 아니라니까... 에휴."

"가자, 이제!" "그래, 함께!"

"바-다-다-바-두-왑!"`
        }
    ];

    const currentInfo = trackInfo[trackIndex] || trackInfo[0];

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
                overflow: 'hidden'
            }} className="mini-player-container">
                {/* Title and Info */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    paddingRight: '12px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    marginRight: '4px'
                }}>
                    <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        flexShrink: 0
                    }}>
                        <img src={currentInfo.cover} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 6h2v12H6zm3.5 6L19 18V6z" />
                    </svg>
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </svg>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 3 21 3 21 8"></polyline>
                        <line x1="4" y1="20" x2="21" y2="3"></line>
                        <polyline points="21 16 21 21 16 21"></polyline>
                        <line x1="15" y1="15" x2="21" y2="21"></line>
                        <line x1="4" y1="4" x2="9" y2="9"></line>
                    </svg>
                </button>
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
                maxHeight: showLyrics ? '600px' : '260px',
                overflow: 'hidden'
            }} onMouseOver={(e) => {
                if (!showLyrics) e.currentTarget.style.transform = 'translateY(-2px)';
            }}
                onMouseOut={(e) => {
                    if (!showLyrics) e.currentTarget.style.transform = 'translateY(0)';
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', marginBottom: '16px' }}>
                    {/* Album Art */}
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                        flexShrink: 0
                    }}>
                        <img src={currentInfo.cover} alt="cover" style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            animation: isPlaying ? 'rotateArt 20s linear infinite' : 'none'
                        }} />
                    </div>

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
                        <button onClick={() => setShowLyrics(!showLyrics)} style={{
                            background: 'transparent',
                            border: 'none',
                            color: showLyrics ? '#F472B6' : 'rgba(255, 255, 255, 0.4)',
                            padding: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            borderRadius: '10px'
                        }} className="btn-hover-bg btn-active-scale">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
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
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 6h2v12H6zm3.5 6L19 18V6z" />
                            </svg>
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
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="6" y="4" width="4" height="16" rx="1" />
                                    <rect x="14" y="4" width="4" height="16" rx="1" />
                                </svg>
                            ) : (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
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
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                            </svg>
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
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 3 21 3 21 8"></polyline>
                                <line x1="4" y1="20" x2="21" y2="3"></line>
                                <polyline points="21 16 21 21 16 21"></polyline>
                                <line x1="15" y1="15" x2="21" y2="21"></line>
                                <line x1="4" y1="4" x2="9" y2="9"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Lyrics Section */}
                <div style={{
                    maxHeight: showLyrics ? '400px' : '0px',
                    opacity: showLyrics ? 1 : 0,
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflowY: 'auto',
                    marginTop: showLyrics ? '16px' : '0px',
                    paddingTop: showLyrics ? '16px' : '0px',
                    borderTop: showLyrics ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    fontSize: '14px',
                    lineHeight: '1.8',
                    color: 'rgba(255, 255, 255, 0.8)',
                    scrollbarWidth: 'none'
                }} className="lyrics-container">
                    <style>{`
        .lyrics - container:: -webkit - scrollbar { display: none; }
    `}</style>

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
                            <div style={{ color: '#F472B6', fontWeight: 'bold', marginBottom: '8px', fontSize: '11px', letterSpacing: '0.05em' }}>SONG INFO</div>
                            {currentInfo.description}
                        </div>
                    )}

                    {currentInfo.lyrics && currentInfo.lyrics.split('\n').map((line, i) => (
                        <div key={i} style={{
                            margin: '8px 0',
                            color: line.trim().startsWith('[') ? '#F472B6' : 'inherit',
                            fontWeight: line.trim().startsWith('[') ? '600' : '400',
                            textAlign: 'center'
                        }}>{line.trim()}</div>
                    ))}
                </div>

                <style>{`
    @keyframes rotateArt {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
    }
    `}</style>
            </div>
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
            maxHeight: showLyrics ? '400px' : '88px',
            width: '200px',
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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                    )}
                </button>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'white', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>
                    {currentInfo.title}
                </div>
                <button onClick={() => setShowLyrics(!showLyrics)} style={{
                    background: 'transparent',
                    border: 'none',
                    color: showLyrics ? '#F472B6' : 'white',
                    cursor: 'pointer'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                </button>
            </div>

            <div style={{
                maxHeight: showLyrics ? '320px' : '0px',
                opacity: showLyrics ? 1 : 0,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                overflowY: 'auto',
                fontSize: '12px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.8)',
                marginTop: showLyrics ? '8px' : '0px',
                paddingTop: showLyrics ? '8px' : '0px',
                borderTop: showLyrics ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                scrollbarWidth: 'none'
            }} className="lyrics-container">
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
                        {currentInfo.description}
                    </div>
                )}
                {currentInfo.lyrics && currentInfo.lyrics.split('\n').map((line, i) => (
                    <div key={i} style={{
                        margin: '4px 0',
                        color: line.trim().startsWith('[') ? '#F472B6' : 'inherit',
                        fontWeight: line.trim().startsWith('[') ? '600' : '400',
                        textAlign: 'center'
                    }}>{line.trim()}</div>
                ))}
            </div>
        </div>
    );
};

export default MusicPlayer;
