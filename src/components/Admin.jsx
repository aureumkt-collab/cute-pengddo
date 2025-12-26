import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { RefreshCw, Upload, Music, Image as ImageIcon, Copy, Trash2, ExternalLink, Check, LogIn, X, Search, Edit2, Download, BarChart2, Users, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const Admin = () => {
    const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState('stats');

    // 이메일 기반 관리자 확인
    const isAdmin = user?.email === 'ksmark1@gmail.com';

    if (authLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)' }}>
                <div style={{ textAlign: 'center' }}>
                    <RefreshCw className="spin" size={40} style={{ color: 'var(--color-primary)', marginBottom: '10px' }} />
                    <p>인증 확인 중...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-background)'
            }}>
                <div style={{
                    background: 'var(--color-surface-light)',
                    padding: '40px',
                    borderRadius: '24px',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ marginBottom: '12px', fontSize: '1.5rem', fontWeight: '800' }}>관리자 구역 🐧</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>로그인이 필요합니다.</p>

                    <button
                        onClick={signInWithGoogle}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '12px',
                            background: 'white',
                            color: '#000',
                            border: '1px solid #ddd',
                            fontWeight: '700',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <LogIn size={20} />
                        구글로 로그인하기
                    </button>

                    <p style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        접속 후 [로그아웃] 버튼이 뜨면 URL 주소창에서 /admin을 제거하여 홈으로 돌아갈 수 있습니다.
                    </p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)', color: 'var(--color-text)' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>접근 권한이 없습니다.</h2>
                    <p style={{ marginBottom: '24px', color: 'var(--color-text-muted)' }}>
                        관리자 계정(ksmark1@gmail.com)이 아닙니다.<br />
                        현재 로그인: {user.email}
                    </p>
                    <button onClick={() => signOut()} style={adminDeleteButtonStyle}>다른 계정으로 로그인</button>
                    <button onClick={() => window.location.href = '/'} style={{ ...adminInputStyle, marginLeft: '10px' }}>홈으로 가기</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            padding: '20px 15px' // 모바일 대응을 위해 패딩 축소
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px'
                }}>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '800' }}>Admin Dashboard</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{user.email}</span>
                        <button
                            onClick={() => signOut()}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                background: 'rgba(255, 0, 0, 0.1)',
                                color: '#ff4d4d',
                                border: '1px solid #ff4d4d',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >로그아웃</button>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '32px',
                    overflowX: 'auto',
                    padding: '4px 4px 12px 4px', // 터치 영역 및 스크롤바 가시성
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none', // 스크롤바 숨기기 (깔끔함)
                    WebkitOverflowScrolling: 'touch'
                }}>
                    {[
                        { id: 'stats', label: '방문 통계' },
                        { id: 'welcome', label: '말풍선' },
                        { id: 'gallery', label: '갤러리' },
                        { id: 'mall', label: '쇼핑몰' },
                        { id: 'tracks', label: '곡 등록' },
                        { id: 'images', label: '이미지 관리' },
                        { id: 'notices', label: '공지사항' },
                        { id: 'applicants', label: '지원자 확인' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '10px 18px',
                                borderRadius: '30px',
                                border: '1px solid',
                                borderColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
                                background: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-surface-light)',
                                color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)',
                                fontWeight: '700',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s',
                                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{
                    background: 'var(--color-surface-light)',
                    padding: '32px',
                    borderRadius: '24px',
                    border: '1px solid var(--color-border)',
                    minHeight: '400px'
                }}>
                    {activeTab === 'welcome' && <WelcomeChatManager />}
                    {activeTab === 'gallery' && <GalleryManager />}
                    {activeTab === 'mall' && <MallManager />}
                    {activeTab === 'tracks' && <TracksManager />}
                    {activeTab === 'images' && <ImageManager />}
                    {activeTab === 'notices' && <NoticeManager />}
                    {activeTab === 'applicants' && <ApplicantsList />}
                    {activeTab === 'stats' && <VisitorStats />}
                </div>
            </div>
        </div>
    );
};
// --- Helper functions ---
const createThumbnail = (file, size = 200) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');

                const minSize = Math.min(img.width, img.height);
                const sourceX = (img.width - minSize) / 2;
                const sourceY = (img.height - minSize) / 2;

                ctx.drawImage(img, sourceX, sourceY, minSize, minSize, 0, 0, size, size);

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', 0.8);
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

// --- Management Components ---

const WelcomeChatManager = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ group_id: '', sender: '', text: '', type: 'manager', delay: 1000, group_delay: 500 });

    const fetchChats = async () => {
        const { data, error } = await supabase.from('welcome_chats').select('*').order('group_id', { ascending: true }).order('orders', { ascending: true });
        if (error) console.error(error);
        else setChats(data);
        setLoading(false);
    };

    useEffect(() => { fetchChats(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('welcome_chats').insert([formData]);
        if (error) alert(error.message);
        else {
            setFormData({ ...formData, text: '' });
            fetchChats();
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        await supabase.from('welcome_chats').delete().eq('id', id);
        fetchChats();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h3 style={{ marginBottom: '20px' }}>말풍선 관리</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 100px', gap: '10px', marginBottom: '20px' }}>
                <input placeholder="그룹ID (ex: initial)" value={formData.group_id} onChange={e => setFormData({ ...formData, group_id: e.target.value })} required style={adminInputStyle} />
                <input placeholder="발신자" value={formData.sender} onChange={e => setFormData({ ...formData, sender: e.target.value })} required style={adminInputStyle} />
                <input placeholder="메시지 내용" value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} required style={adminInputStyle} />
                <button type="submit" style={adminAddButtonStyle}>추가</button>
            </form>
            <table style={adminTableStyle}>
                <thead>
                    <tr><th>그룹</th><th>발신자</th><th>내용</th><th>관리</th></tr>
                </thead>
                <tbody>
                    {chats.map(chat => (
                        <tr key={chat.id}>
                            <td>{chat.group_id}</td>
                            <td>{chat.sender}</td>
                            <td>{chat.text}</td>
                            <td><button onClick={() => handleDelete(chat.id)} style={adminDeleteButtonStyle}>삭제</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const GalleryManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ filename: '', caption: '', hashtags: '' });

    const fetchItems = async () => {
        const { data, error } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false });
        if (error) console.error(error);
        else setItems(data);
        setLoading(false);
    };

    useEffect(() => { fetchItems(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('gallery_items').insert([formData]);
        if (error) alert(error.message);
        else {
            setFormData({ filename: '', caption: '', hashtags: '' });
            fetchItems();
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        await supabase.from('gallery_items').delete().eq('id', id);
        fetchItems();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h3 style={{ marginBottom: '20px' }}>갤러리 관리</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 100px', gap: '10px', marginBottom: '20px' }}>
                <input placeholder="파일명 (ex: image.jpg)" value={formData.filename} onChange={e => setFormData({ ...formData, filename: e.target.value })} required style={adminInputStyle} />
                <input placeholder="캡션" value={formData.caption} onChange={e => setFormData({ ...formData, caption: e.target.value })} style={adminInputStyle} />
                <input placeholder="해시태그" value={formData.hashtags} onChange={e => setFormData({ ...formData, hashtags: e.target.value })} style={adminInputStyle} />
                <button type="submit" style={adminAddButtonStyle}>추가</button>
            </form>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                {items.map(item => (
                    <div key={item.id} style={{ border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', background: 'var(--color-surface)' }}>
                        <img src={`/assets/${item.filename}`} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                        <div style={{ padding: '8px', fontSize: '0.8rem' }}>
                            <div style={{ fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.filename}</div>
                            <button onClick={() => handleDelete(item.id)} style={{ ...adminDeleteButtonStyle, width: '100%', marginTop: '8px' }}>삭제</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MallManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', price: '', image: '', tag: 'NEW', description: '' });

    const fetchItems = async () => {
        const { data, error } = await supabase.from('mall_items').select('*').order('created_at', { ascending: false });
        if (error) console.error(error);
        else setItems(data);
        setLoading(false);
    };

    useEffect(() => { fetchItems(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('mall_items').insert([formData]);
        if (error) alert(error.message);
        else {
            setFormData({ name: '', price: '', image: '', tag: 'NEW', description: '' });
            fetchItems();
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        await supabase.from('mall_items').delete().eq('id', id);
        fetchItems();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h3 style={{ marginBottom: '20px' }}>쇼핑몰 아이템 관리</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', maxWidth: '500px' }}>
                <input placeholder="상품명" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={adminInputStyle} />
                <input placeholder="가격 (ex: 300수당)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required style={adminInputStyle} />
                <input placeholder="이미지 경로 (ex: goods/img.jpg)" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} required style={adminInputStyle} />
                <input placeholder="태그 (NEW, HOT, BEST 등)" value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} style={adminInputStyle} />
                <textarea placeholder="상품 설명" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...adminInputStyle, minHeight: '80px' }} />
                <button type="submit" style={adminAddButtonStyle}>상품 등록</button>
            </form>
            <table style={adminTableStyle}>
                <thead>
                    <tr><th>이미지</th><th>상품명</th><th>가격</th><th>태그</th><th>관리</th></tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td><img src={`/assets/${item.image}`} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.tag}</td>
                            <td><button onClick={() => handleDelete(item.id)} style={adminDeleteButtonStyle}>삭제</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Image Selector Modal Component ---
const ImageSelectorModal = ({ isOpen, onClose, onSelect }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchImages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('image_library')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) console.error('Error fetching images:', error);
            else setImages(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchImages();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredImages = images.filter(img =>
        img.display_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: 'var(--color-surface)',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh', // 모바일에서 공간 최대한 활용
                borderRadius: '24px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                margin: 'auto'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>이미지 선택하기 🐧</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Search Bar */}
                <div style={{ padding: '16px 24px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="이미지 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                ...adminInputStyle,
                                width: '100%',
                                paddingLeft: '40px'
                            }}
                        />
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    </div>
                </div>

                {/* Grid */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: 'clamp(12px, 4vw, 24px)', // 모바일에서 패딩 축소
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(100px, 30vw, 140px), 1fr))', // 모바일에서 카드 크기 조정
                    gap: '12px',
                    minHeight: '200px'
                }}>
                    {loading ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                            <RefreshCw className="spin" size={32} style={{ color: 'var(--color-primary)' }} />
                            <p style={{ marginTop: '12px' }}>이미지 목록 불러오는 중...</p>
                        </div>
                    ) : filteredImages.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                            검색 결과가 없습니다.
                        </div>
                    ) : (
                        filteredImages.map(img => (
                            <div
                                key={img.id}
                                onClick={() => onSelect(img)}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '12px',
                                    border: '2px solid transparent',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s',
                                    background: 'var(--color-surface-light)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                                    <img
                                        src={img.thumbnail_url || img.public_url}
                                        alt={img.display_name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{
                                    padding: '8px',
                                    fontSize: '0.7rem',
                                    fontWeight: '600',
                                    color: 'var(--color-text)',
                                    textAlign: 'center',
                                    background: 'rgba(0,0,0,0.5)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    marginTop: 'auto'
                                }} title={img.display_name}>
                                    {img.display_name}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid var(--color-border)',
                    textAlign: 'right',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)'
                }}>
                    이미지를 클릭하면 즉시 선택됩니다.
                </div>
            </div>
        </div>
    );
};

const TracksManager = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({ slug: '', title: '', artist: 'Pengddo', description: '', lyrics: '', coverUrl: '', cover_id: null, is_active: true });
    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [currentAudioUrl, setCurrentAudioUrl] = useState('');
    const [currentCoverUrl, setCurrentCoverUrl] = useState('');
    const [currentCoverId, setCurrentCoverId] = useState(null);
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortAscending, setSortAscending] = useState(false);

    const fetchTracks = async () => {
        const { data, error } = await supabase
            .from('tracks')
            .select(`
                *,
                cover_library:image_library(public_url, thumbnail_url)
            `)
            .order(sortBy, { ascending: sortAscending });
        if (error) console.error(error);
        else setTracks(data);
        setLoading(false);
    };

    useEffect(() => { fetchTracks(); }, [sortBy, sortAscending]);

    const handleUpload = async (file, folder) => {
        if (!file) return null;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('tracks')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('tracks')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const extractStorageInfo = (url) => {
        if (!url) return null;

        if (url.includes('/storage/v1/object/public/tracks/')) {
            return {
                bucket: 'tracks',
                path: decodeURIComponent(url.split('/storage/v1/object/public/tracks/')[1])
            };
        }

        if (url.includes('/storage/v1/object/public/images/')) {
            return {
                bucket: 'images',
                path: decodeURIComponent(url.split('/storage/v1/object/public/images/')[1])
            };
        }

        return null;
    };

    const deleteStorageFile = async (url) => {
        if (!url) return;
        const info = extractStorageInfo(url);
        if (info) {
            // 커버 이미지는 이제 image_library에서 관리하므로 storage에서 직접 삭제하지 않음 (필요시 이미지 관리 탭에서 삭제)
            // 오디오 파일만 여기서 관리
            if (info.bucket === 'tracks' && info.path.startsWith('audio/')) {
                await supabase.storage.from(info.bucket).remove([info.path]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 새 등록인데 오디오 파일이 없는 경우 체크
        if (!editingId && !audioFile) {
            alert('오디오 파일이 필요합니다.');
            return;
        }

        setUploading(true);
        try {
            let audioUrl = currentAudioUrl;
            let coverUrl = currentCoverUrl;
            let coverId = formData.cover_id || currentCoverId;
            let oldAudioToSafeDelete = '';
            let oldCoverToSafeDelete = '';

            // 1. 오디오 파일 처리
            if (audioFile) {
                oldAudioToSafeDelete = currentAudioUrl;
                audioUrl = await handleUpload(audioFile, 'audio');
            }

            // 2. 커버 이미지 처리
            if (coverFile) {
                // 직접 파일을 올린 경우: Storage 업로드 + image_library 등록 + 썸네일 생성
                const fileExt = coverFile.name.split('.').pop() || 'jpg';
                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(2, 7);
                const storageFileName = `${timestamp}-${randomStr}.${fileExt}`;
                const thumbnailFileName = `thumb-${timestamp}-${randomStr}.jpg`;

                // 2-1. 원본 업로드
                const { error: storageError } = await supabase.storage
                    .from('images')
                    .upload(storageFileName, coverFile, {
                        contentType: coverFile.type,
                        upsert: true
                    });
                if (storageError) throw storageError;

                // 2-2. 썸네일 생성 및 업로드
                const thumbnailBlob = await createThumbnail(coverFile);
                const { error: thumbError } = await supabase.storage
                    .from('images')
                    .upload(thumbnailFileName, thumbnailBlob, {
                        contentType: 'image/jpeg',
                        upsert: true
                    });
                if (thumbError) throw thumbError;

                // 2-3. Public URL 가져오기
                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(storageFileName);
                const { data: { publicUrl: thumbnailUrl } } = supabase.storage.from('images').getPublicUrl(thumbnailFileName);

                // 2-4. 이미지 라이브러리에 등록
                const { data: newImg, error: libError } = await supabase
                    .from('image_library')
                    .insert([{
                        display_name: coverFile.name,
                        storage_path: storageFileName,
                        public_url: publicUrl,
                        thumbnail_path: thumbnailFileName,
                        thumbnail_url: thumbnailUrl
                    }])
                    .select()
                    .single();

                if (!libError && newImg) {
                    coverId = newImg.id;
                    coverUrl = publicUrl;
                } else {
                    coverUrl = publicUrl;
                }
            } else if (formData.coverUrl) {
                coverUrl = formData.coverUrl;
            }

            const dataToSave = {
                slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                title: formData.title,
                artist: formData.artist,
                description: formData.description,
                lyrics: formData.lyrics,
                audio: audioUrl,
                cover_id: coverId,
                is_active: formData.is_active,
                orders: editingId ? undefined : tracks.length + 1
            };

            if (editingId) {
                dataToSave.id = editingId;
            }

            const { error } = await supabase.from('tracks').upsert([dataToSave]);
            if (error) throw error;

            // DB 업데이트 성공 후 기존 파일 삭제 (파일이 교체된 경우에만)
            if (oldAudioToSafeDelete) await deleteStorageFile(oldAudioToSafeDelete);
            if (oldCoverToSafeDelete) await deleteStorageFile(oldCoverToSafeDelete);

            alert(editingId ? '곡이 수정되었습니다!' : '곡이 성공적으로 등록되었습니다!');
            cancelEdit();
            fetchTracks();
        } catch (error) {
            alert('처리 중 오류 발생: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (track) => {
        setEditingId(track.id);
        setFormData({
            slug: track.slug || '',
            title: track.title,
            artist: track.artist,
            description: track.description || '',
            lyrics: track.lyrics || '',
            coverUrl: track.cover_library?.public_url || '',
            cover_id: track.cover_id || null,
            is_active: track.is_active !== false // 기본값 true 처리
        });
        setCurrentAudioUrl(track.audio || '');
        setCurrentCoverUrl(track.cover_library?.public_url || '');
        setCurrentCoverId(track.cover_id || null);
        // 파일 인풋 초기화는 브라우저 보안상 어렵지만 상태는 비워둠
        setAudioFile(null);
        setCoverFile(null);
        window.scrollTo({ top: 100, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ slug: '', title: '', artist: 'Pengddo', description: '', lyrics: '', coverUrl: '', cover_id: null, is_active: true });
        setAudioFile(null);
        setCoverFile(null);
        setCurrentAudioUrl('');
        setCurrentCoverUrl('');
        setCurrentCoverId(null);
    };

    const handleDelete = async (track) => {
        if (!confirm(`'${track.title}' 곡을 정말 삭제하시겠습니까? 관련 파일도 모두 삭제됩니다.`)) return;

        try {
            // 1. Storage 파일 먼저 삭제
            if (track.audio) await deleteStorageFile(track.audio);
            if (track.cover) await deleteStorageFile(track.cover);

            // 2. DB 삭제
            const { error } = await supabase.from('tracks').delete().eq('id', track.id);
            if (error) throw error;

            fetchTracks();
        } catch (error) {
            alert('삭제 중 오류 발생: ' + error.message);
        }
    };

    const handleDownload = async (url, filename) => {
        if (!url) return;
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename || 'track.mp3';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            alert('다운로드 중 오류가 발생했습니다.');
        }
    };




    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>{editingId ? '곡 수정하기' : '곡 및 가사 관리'}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>* 제목 입력 시 URL용 슬러그가 자동 생성됩니다.</div>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px', background: 'var(--color-surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>제목</label>
                        <input
                            placeholder="곡 제목"
                            value={formData.title}
                            onChange={e => {
                                const title = e.target.value;
                                // 한글을 지원하는 슬러그 생성 로직
                                // 1. 소문자 변환
                                // 2. 공백을 하이픈(-)으로 변경
                                // 3. 특수문자 제거 (한글, 영문, 숫자, 하이픈만 허용)
                                // 4. 연속된 하이픈을 하나로 축소
                                const autoSlug = title.toLowerCase()
                                    .replace(/\s+/g, '-')
                                    .replace(/[^a-z0-9가-힣-]/g, '')
                                    .replace(/-+/g, '-')
                                    .replace(/^-|-$/g, ''); // 앞뒤 하이픈 제거
                                setFormData({ ...formData, title, slug: autoSlug });
                            }}
                            required
                            style={adminInputStyle}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>URL 슬러그</label>
                        <input
                            placeholder="ex: daiso-socks"
                            value={formData.slug}
                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                            required
                            style={{ ...adminInputStyle, color: 'var(--color-primary)' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>아티스트</label>
                        <input placeholder="아티스트" value={formData.artist} onChange={e => setFormData({ ...formData, artist: e.target.value })} required style={adminInputStyle} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>사용 여부</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '40px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span style={{ fontSize: '0.9rem' }}>메인 재생목록에 노출</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>커버 이미지 설정</label>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', background: 'var(--color-background)', padding: '15px', borderRadius: '12px', border: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
                            <div style={{
                                width: 'min(100%, 80px)',
                                height: '80px',
                                borderRadius: '10px',
                                border: '1px solid var(--color-border)',
                                overflow: 'hidden',
                                background: 'var(--color-surface-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                margin: '0 auto' // 모바일에서 중앙 정렬 지원
                            }}>
                                {formData.coverUrl ? (
                                    <img src={formData.coverUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Cover Preview" />
                                ) : (
                                    <ImageIcon size={24} style={{ color: 'var(--color-text-muted)' }} />
                                )}
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowImageSelector(true)}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        background: 'var(--color-surface)',
                                        color: 'var(--color-primary)',
                                        border: '1px solid var(--color-primary)',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <ImageIcon size={16} /> 라이브러리에서 선택
                                </button>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files[0];
                                            setCoverFile(file);
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData(prev => ({ ...prev, coverUrl: reader.result }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        style={{ ...adminInputStyle, width: '100%', paddingLeft: '40px' }}
                                    />
                                    <Upload size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                </div>
                            </div>
                        </div>
                        {editingId && currentCoverUrl && !coverFile && <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', marginTop: '4px' }}>※ 현재 등록된 이미지가 표시되고 있습니다.</div>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>MP3 파일 업로드 {editingId && '(생략 가능)'}</label>
                        <div style={{ position: 'relative', marginTop: '5px' }}>
                            <input
                                type="file"
                                accept="audio/mp3,audio/mpeg"
                                onChange={e => setAudioFile(e.target.files[0])}
                                required={!editingId}
                                style={{ ...adminInputStyle, width: '100%', paddingLeft: '40px' }}
                            />
                            <Music size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        </div>
                        {editingId && currentAudioUrl && <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', marginTop: '4px' }}>기존 파일 있음: {currentAudioUrl.split('/').pop()}</div>}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>곡 설명</label>
                    <textarea placeholder="곡에 대한 짧은 설명을 입력하세요" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...adminInputStyle, minHeight: '60px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>가사</label>
                    <textarea placeholder="가사를 입력하세요" value={formData.lyrics} onChange={e => setFormData({ ...formData, lyrics: e.target.value })} style={{ ...adminInputStyle, minHeight: '120px' }} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        disabled={uploading}
                        style={{
                            ...adminAddButtonStyle,
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            background: uploading ? 'var(--color-text-muted)' : 'var(--gradient-primary)',
                            height: '48px',
                            fontSize: '1rem'
                        }}
                    >
                        {uploading ? (
                            <>
                                <RefreshCw size={20} className="spin" />
                                처리 중...
                            </>
                        ) : (
                            <>
                                <Upload size={20} />
                                {editingId ? '곡 수정 완료' : '새 곡 등록하기'}
                            </>
                        )}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={cancelEdit}
                            style={{
                                ...adminDeleteButtonStyle,
                                background: 'var(--color-surface)',
                                color: 'var(--color-text)',
                                borderColor: 'var(--color-border)',
                                padding: '0 20px',
                                fontSize: '1rem'
                            }}
                        >
                            취소
                        </button>
                    )}
                </div>
            </form>

            {/* 정렬 UI - 목록 바로 위로 이동 */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                padding: '0 4px',
                flexWrap: 'wrap',
                gap: '12px'
            }}>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text)' }}>
                    등록된 곡 목록 <span style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }}>({tracks.length})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>정렬 기준:</div>
                    <select
                        value={`${sortBy}-${sortAscending}`}
                        onChange={(e) => {
                            const [field, asc] = e.target.value.split('-');
                            setSortBy(field);
                            setSortAscending(asc === 'true');
                        }}
                        style={{
                            ...adminInputStyle,
                            padding: '6px 12px',
                            height: 'auto',
                            width: 'auto',
                            fontSize: '0.85rem',
                            borderRadius: '10px'
                        }}
                    >
                        <option value="created_at-false">최신순</option>
                        <option value="created_at-true">과거순</option>
                        <option value="title-true">제목순</option>
                        <option value="artist-true">아티스트순</option>
                        <option value="orders-true">노출순서</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', gap: '20px' }}>
                {tracks.map(track => (
                    <div key={track.id} style={{
                        background: 'var(--color-surface)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', padding: '15px', gap: '15px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                <img
                                    src={track.cover_library?.thumbnail_url || track.cover_library?.public_url || track.cover || '/default-album.png'}
                                    alt=""
                                    style={{ width: '100px', height: '100px', borderRadius: '15px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    fontSize: '0.65rem',
                                    padding: '3px 7px',
                                    borderRadius: '8px',
                                    background: track.is_active ? 'var(--gradient-primary)' : 'var(--color-text-muted)',
                                    color: 'white',
                                    fontWeight: '800',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}>
                                    {track.is_active ? 'ACTIVE' : 'INACTIVE'}
                                </div>
                            </div>
                            <div style={{ flex: '1 1 200px', minWidth: 0, textAlign: 'center' }}>
                                <div style={{
                                    fontWeight: '800',
                                    fontSize: '1.2rem',
                                    lineHeight: '1.2',
                                    marginBottom: '6px',
                                    color: 'var(--color-text)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }} title={track.title}>
                                    {track.title}
                                </div>
                                <div style={{
                                    fontSize: '1rem',
                                    color: 'var(--color-primary)',
                                    fontWeight: '600',
                                    marginBottom: '10px'
                                }}>
                                    {track.artist}
                                </div>
                                {track.description ? (
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--color-text-muted)',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '2',
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        lineHeight: '1.4'
                                    }}>
                                        {track.description}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                        등록된 설명이 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{
                            padding: '16px 20px',
                            background: 'rgba(0,0,0,0.02)',
                            borderTop: '1px solid var(--color-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: '600', wordBreak: 'break-all', flex: '1 1 100%', textAlign: 'center', order: 2 }}>
                                🔗 ?song={track.slug || track.id}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', flex: '1 1 auto', order: 1 }}>
                                <button onClick={() => handleDownload(track.audio, `${track.title}.mp3`)} style={{
                                    ...adminDeleteButtonStyle,
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    color: '#22c55e',
                                    borderColor: '#22c55e',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '6px 10px',
                                    fontWeight: '700',
                                    fontSize: '0.8rem'
                                }}>
                                    <Download size={14} />
                                    다운
                                </button>
                                <button onClick={() => handleEdit(track)} style={{
                                    ...adminDeleteButtonStyle,
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    color: '#3b82f6',
                                    borderColor: '#3b82f6',
                                    padding: '6px 10px',
                                    fontWeight: '700',
                                    fontSize: '0.8rem'
                                }}>수정</button>
                                <button onClick={() => handleDelete(track)} style={{
                                    ...adminDeleteButtonStyle,
                                    padding: '6px 10px',
                                    fontWeight: '700',
                                    fontSize: '0.8rem'
                                }}>삭제</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ImageSelectorModal
                isOpen={showImageSelector}
                onClose={() => setShowImageSelector(false)}
                onSelect={(img) => {
                    setFormData({ ...formData, coverUrl: img.public_url, cover_id: img.id });
                    setShowImageSelector(false);
                }}
            />
        </div>
    );
};

// 공지사항 관리 컴포넌트
const NoticeManager = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ content: '', date: '', author: '' });
    const [editingId, setEditingId] = useState(null);

    const fetchNotices = async () => {
        const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
        if (error) console.error(error);
        else setNotices(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchNotices(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSave = {
            content: formData.content,
            date: formData.date,
            author: formData.author
        };

        if (editingId) {
            dataToSave.id = editingId;
        }

        try {
            const { error } = await supabase
                .from('notices')
                .upsert(dataToSave);

            if (error) {
                alert('저장 실패: ' + error.message);
                console.error('Save error:', error);
            } else {
                alert(editingId ? '수정되었습니다.' : '등록되었습니다.');
                setEditingId(null);
                setFormData({ content: '', date: '', author: '' });
                fetchNotices();
            }
        } catch (err) {
            alert('오류가 발생했습니다: ' + err.message);
        }
    };

    const handleEdit = (notice) => {
        setEditingId(notice.id);
        setFormData({
            content: notice.content,
            date: notice.date,
            author: notice.author
        });
        window.scrollTo({ top: 100, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ content: '', date: '', author: '' });
    };

    const handleDelete = async (id) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        await supabase.from('notices').delete().eq('id', id);
        fetchNotices();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>{editingId ? '공지사항 수정' : '공지사항 관리'}</h3>
            </div>

            <form onSubmit={handleSubmit} style={{
                background: 'var(--color-surface)',
                padding: '24px',
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                marginBottom: '32px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                maxWidth: '800px'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>공지 내용</label>
                        <textarea
                            placeholder="공지 내용을 상세히 입력하세요"
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            required
                            style={{ ...adminInputStyle, minHeight: '120px', lineHeight: '1.6' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>일자 (ex: 2024.12.24)</label>
                            <input
                                placeholder="YYYY.MM.DD"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                required
                                style={adminInputStyle}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>작성자</label>
                            <input
                                placeholder="작성자 이름"
                                value={formData.author}
                                onChange={e => setFormData({ ...formData, author: e.target.value })}
                                required
                                style={adminInputStyle}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                        <button type="submit" style={{
                            ...adminAddButtonStyle,
                            flex: 1,
                            height: '48px',
                            background: 'var(--gradient-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '1rem'
                        }}>
                            {editingId ? <><Edit2 size={18} /> 수정 완료</> : <><Upload size={18} /> 공지사항 등록</>}
                        </button>
                        {editingId && (
                            <button type="button" onClick={cancelEdit} style={{
                                ...adminDeleteButtonStyle,
                                background: 'var(--color-surface)',
                                color: 'var(--color-text)',
                                borderColor: 'var(--color-border)',
                                padding: '0 24px',
                                fontSize: '1rem',
                                height: '48px'
                            }}>
                                취소
                            </button>
                        )}
                    </div>
                </div>
            </form>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '24px'
            }}>
                {notices.map(notice => (
                    <div key={notice.id} style={{
                        background: 'var(--color-surface)',
                        borderRadius: '20px',
                        border: '1px solid var(--color-border)',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: 'var(--color-primary)',
                                background: 'rgba(139, 92, 246, 0.1)',
                                padding: '4px 10px',
                                borderRadius: '8px'
                            }}>
                                {notice.date}
                            </div>
                        </div>

                        <div style={{
                            fontSize: '1rem',
                            lineHeight: '1.6',
                            color: 'var(--color-text)',
                            whiteSpace: 'pre-wrap',
                            flex: 1,
                            minHeight: '80px'
                        }}>
                            {notice.content}
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '8px',
                            paddingTop: '16px',
                            borderTop: '1px solid var(--color-border)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>작성자:</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-text)' }}>{notice.author}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleEdit(notice)} style={{
                                    ...adminDeleteButtonStyle,
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    color: '#3b82f6',
                                    borderColor: '#3b82f6',
                                    padding: '6px 12px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <Edit2 size={14} /> 수정
                                </button>
                                <button onClick={() => handleDelete(notice.id)} style={{
                                    ...adminDeleteButtonStyle,
                                    padding: '6px 12px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <Trash2 size={14} /> 삭제
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {notices.length === 0 && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '80px 0',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '20px',
                    border: '1px dashed var(--color-border)',
                    color: 'var(--color-text-muted)'
                }}>
                    <p>등록된 공지사항이 없습니다.</p>
                </div>
            )}
        </div>
    );
};

const ImageManager = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [generatingAI, setGeneratingAI] = useState(false);
    const [aiPreviewUrl, setAiPreviewUrl] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    const [imageName, setImageName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [replacingFileName, setReplacingFileName] = useState(null);
    const [renamingFileName, setRenamingFileName] = useState(null);
    const [tempNewName, setTempNewName] = useState('');
    const fileInputRef = React.useRef(null);
    const replaceInputRef = React.useRef(null);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('image_library')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching images:', error);
                if (error.message.includes('relation "image_library" does not exist')) {
                    alert('Supabase DB에 "image_library" 테이블이 필요합니다.');
                }
            } else {
                setImages(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // 명칭이 비어있다면 파일 이름으로 자동 설정 (확장자 제외)
            if (!imageName) {
                const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
                setImageName(nameWithoutExt);
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('파일을 선택해주세요.');
            return;
        }
        if (!imageName.trim()) {
            alert('이미지 명칭을 입력해주세요.');
            return;
        }

        setUploading(true);
        try {
            // 1. 파일 이름 설정
            const fileExt = selectedFile.name.split('.').pop() || 'jpg';
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 7);
            const storageFileName = `${timestamp}-${randomStr}.${fileExt}`;
            const thumbnailFileName = `thumb-${timestamp}-${randomStr}.jpg`;

            // 2. 썸네일 생성
            const thumbnailBlob = await createThumbnail(selectedFile);

            // 3. Storage에 원본 업로드
            const { error: storageError } = await supabase.storage
                .from('images')
                .upload(storageFileName, selectedFile, {
                    contentType: selectedFile.type,
                    upsert: true
                });

            if (storageError) throw storageError;

            // 4. Storage에 썸네일 업로드
            const { error: thumbError } = await supabase.storage
                .from('images')
                .upload(thumbnailFileName, thumbnailBlob, {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (thumbError) throw thumbError;

            // 5. Public URL 가져오기
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(storageFileName);

            const { data: { publicUrl: thumbnailUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(thumbnailFileName);

            // 6. DB 테이블에 정보 저장
            const { error: dbError } = await supabase
                .from('image_library')
                .insert([{
                    display_name: imageName.trim(),
                    storage_path: storageFileName,
                    public_url: publicUrl,
                    thumbnail_path: thumbnailFileName,
                    thumbnail_url: thumbnailUrl
                }]);

            if (dbError) throw dbError;

            alert('이미지와 썸네일이 라이브러리에 등록되었습니다.');
            setSelectedFile(null);
            setImageName('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchImages();
        } catch (error) {
            console.error('Upload handling error:', error);
            alert('등록 실패: ' + error.message + '\n(DB에 thumbnail_path, thumbnail_url 컬럼이 있는지 확인해주세요)');
        } finally {
            setUploading(false);
        }
    };

    const handleReplace = async (e) => {
        const file = e.target.files[0];
        if (!file || !replacingFileName) return;

        setUploading(true);
        try {
            const targetImage = images.find(img => img.storage_path === replacingFileName);
            if (!targetImage) throw new Error('파일 대상을 찾을 수 없습니다.');

            // 1. 원본 교체
            const { error } = await supabase.storage
                .from('images')
                .upload(targetImage.storage_path, file, {
                    upsert: true
                });
            if (error) throw error;

            // 2. 썸네일 생성 및 교체 (기존 썸네일 경로가 있으면 사용, 없으면 새로 생성)
            const thumbnailBlob = await createThumbnail(file);
            const thumbPath = targetImage.thumbnail_path || `thumb-${targetImage.storage_path.split('.')[0]}.jpg`;

            const { error: thumbError } = await supabase.storage
                .from('images')
                .upload(thumbPath, thumbnailBlob, {
                    upsert: true
                });
            if (thumbError) throw thumbError;

            // 3. DB 업데이트 (썸네일 경로가 없었던 경우를 위해)
            if (!targetImage.thumbnail_path) {
                const { data: { publicUrl: thumbnailUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(thumbPath);

                await supabase
                    .from('image_library')
                    .update({
                        thumbnail_path: thumbPath,
                        thumbnail_url: thumbnailUrl
                    })
                    .eq('id', targetImage.id);
            }

            alert('이미지와 썸네일이 성공적으로 교체되었습니다.');
            setReplacingFileName(null);
            fetchImages();
        } catch (error) {
            alert('교체 실패: ' + error.message);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleRename = async (id) => {
        if (!tempNewName.trim()) {
            alert('변경할 이름을 입력해주세요.');
            return;
        }

        setUploading(true);
        try {
            // DB의 이름만 업데이트 (Storage 건드릴 필요 없음 -> URL 유지!)
            const { error } = await supabase
                .from('image_library')
                .update({ display_name: tempNewName.trim() })
                .eq('id', id);

            if (error) throw error;

            alert('이미지 명칭이 변경되었습니다.');
            setRenamingFileName(null);
            fetchImages();
        } catch (error) {
            alert('이름 변경 실패: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (image) => {
        if (!confirm(`'${image.display_name}' 이미지를 라이브러리에서 완전히 삭제하시겠습니까?`)) return;

        try {
            // 1. Storage에서 삭제 (원본 & 썸네일)
            const filesToDelete = [image.storage_path];
            if (image.thumbnail_path) filesToDelete.push(image.thumbnail_path);

            const { error: storageError } = await supabase.storage
                .from('images')
                .remove(filesToDelete);

            if (storageError) throw storageError;

            // 2. DB에서 삭제
            const { error: dbError } = await supabase
                .from('image_library')
                .delete()
                .eq('id', image.id);

            if (dbError) throw dbError;

            fetchImages();
        } catch (error) {
            alert('삭제 실패: ' + error.message);
        }
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url).then(() => {
            setCopySuccess(url);
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    const handleGenerateAI = async () => {
        if (!aiPrompt.trim()) {
            alert('프롬프트를 입력해주세요.');
            return;
        }

        setGeneratingAI(true);
        setAiPreviewUrl('');

        try {
            const seed = Math.floor(Math.random() * 1000000);
            // Pollinations AI: No API key needed for basic usage, good for demo/utility
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiPrompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;

            // Image object to pre-load and verify
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                setAiPreviewUrl(imageUrl);
                setGeneratingAI(false);
            };
            img.onerror = () => {
                alert('이미지 생성 중 오류가 발생했습니다.');
                setGeneratingAI(false);
            };
        } catch (error) {
            console.error('AI Generation error:', error);
            alert('생성 실패: ' + error.message);
            setGeneratingAI(false);
        }
    };

    const handleRegisterAIImage = async () => {
        if (!aiPreviewUrl) return;

        setUploading(true);
        try {
            const response = await fetch(aiPreviewUrl);
            const blob = await response.blob();
            const fileExt = 'jpg';
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 7);
            const storageFileName = `ai-${timestamp}-${randomStr}.${fileExt}`;
            const thumbnailFileName = `thumb-ai-${timestamp}-${randomStr}.jpg`;

            // 썸네일 생성
            const thumbnailBlob = await createThumbnail(blob);

            // Storage 업로드
            const { error: storageError } = await supabase.storage
                .from('images')
                .upload(storageFileName, blob, {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (storageError) throw storageError;

            const { error: thumbError } = await supabase.storage
                .from('images')
                .upload(thumbnailFileName, thumbnailBlob, {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (thumbError) throw thumbError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(storageFileName);

            const { data: { publicUrl: thumbnailUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(thumbnailFileName);

            const { error: dbError } = await supabase
                .from('image_library')
                .insert([{
                    display_name: `AI: ${aiPrompt.substring(0, 30)}...`,
                    storage_path: storageFileName,
                    public_url: publicUrl,
                    thumbnail_path: thumbnailFileName,
                    thumbnail_url: thumbnailUrl
                }]);

            if (dbError) throw dbError;

            alert('AI 생성 이미지와 썸네일이 라이브러리에 등록되었습니다.');
            setAiPreviewUrl('');
            setAiPrompt('');
            fetchImages();
        } catch (error) {
            console.error('AI Register error:', error);
            alert('등록 실패: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const getImageUrl = (path) => {
        // DB에 public_url이 이미 있으므로 이 함수는 보조적으로 사용
        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(path);
        return publicUrl;
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>이미지 라이브러리</h3>
                <button
                    onClick={fetchImages}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    새로고침 <RefreshCw size={16} className={loading ? 'spin' : ''} />
                </button>
            </div>

            {/* AI 이미지 생성 섹션 */}
            <div style={{
                background: 'var(--color-surface)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                marginBottom: '24px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(30, 41, 59, 0.05) 100%)',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)'
            }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
                    ✨ AI 이미지 생성 (Beta)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                            placeholder="생성하고 싶은 이미지 프롬프트를 입력하세요 (영문 권장)"
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            style={{ ...adminInputStyle, flex: 1 }}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
                        />
                        <button
                            onClick={handleGenerateAI}
                            disabled={generatingAI || !aiPrompt.trim()}
                            style={{
                                padding: '0 24px',
                                borderRadius: '12px',
                                background: generatingAI || !aiPrompt.trim() ? 'var(--color-text-muted)' : 'var(--gradient-primary)',
                                color: 'white',
                                fontWeight: '700',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                minWidth: '140px',
                                transition: 'all 0.2s'
                            }}
                        >
                            {generatingAI ? <><RefreshCw size={18} className="spin" /> 생성 중</> : <><ImageIcon size={18} /> 이미지 생성</>}
                        </button>
                    </div>

                    {aiPreviewUrl && (
                        <div style={{
                            marginTop: '10px',
                            padding: '16px',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <div style={{ position: 'relative', width: '200px', height: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                                <img src={aiPreviewUrl} alt="AI Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px', fontSize: '0.7rem', textAlign: 'center' }}>미리보기</div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={handleRegisterAIImage}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        background: 'var(--color-primary)',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <Upload size={16} /> 라이브러리에 등록하기
                                </button>
                                <button
                                    onClick={() => setAiPreviewUrl('')}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        background: 'transparent',
                                        color: 'var(--color-text-muted)',
                                        border: '1px solid var(--color-border)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 업로드 폼 섹션 */}
            <div style={{
                background: 'var(--color-surface)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                marginBottom: '32px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Upload size={18} /> 새 이미지 업로드
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr) auto', gap: '16px', alignItems: 'end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>이미지 명칭 (관리용)</label>
                        <input
                            placeholder="이미지 이름을 입력하세요"
                            value={imageName}
                            onChange={e => setImageName(e.target.value)}
                            style={adminInputStyle}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>이미지 파일 선택</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ ...adminInputStyle, padding: '8px' }}
                        />
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={uploading || !selectedFile}
                        style={{
                            padding: '0 24px',
                            borderRadius: '12px',
                            background: uploading || !selectedFile ? 'var(--color-text-muted)' : 'var(--gradient-primary)',
                            color: 'white',
                            fontWeight: '700',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            height: '46px',
                            minWidth: '120px',
                            transition: 'all 0.2s'
                        }}
                    >
                        {uploading ? (
                            <><RefreshCw size={18} className="spin" /> 업로드 중</>
                        ) : (
                            <><Upload size={18} /> 업로드 시작</>
                        )}
                    </button>
                </div>
                {selectedFile && !uploading && (
                    <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: '500' }}>
                        💡 선택됨: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                    </p>
                )}
            </div>

            {loading && images.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--color-text-muted)' }}>
                    <RefreshCw size={32} className="spin" style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p>이미지를 불러오는 중...</p>
                </div>
            ) : images.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '80px 0',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '20px',
                    border: '1px dashed var(--color-border)',
                    color: 'var(--color-text-muted)'
                }}>
                    <ImageIcon size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                    <p>업로드된 이미지가 없습니다.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '24px'
                }}>
                    {images.map(image => (
                        <div key={image.id} style={{
                            background: 'var(--color-surface)',
                            borderRadius: '16px',
                            border: '1px solid var(--color-border)',
                            overflow: 'hidden',
                            transition: 'all 0.3s',
                            position: 'relative'
                        }} className="image-card">
                            <div style={{ height: '180px', overflow: 'hidden', background: '#000', position: 'relative' }}>
                                <img
                                    src={image.thumbnail_url || image.public_url}
                                    alt={image.display_name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    display: 'flex',
                                    gap: '6px'
                                }}>
                                    <button
                                        onClick={() => window.open(image.public_url, '_blank')}
                                        title="원본 보기"
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '10px',
                                            background: 'rgba(0,0,0,0.6)',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            backdropFilter: 'blur(4px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    ><ExternalLink size={14} /></button>
                                    <button
                                        onClick={() => {
                                            setReplacingFileName(image.storage_path);
                                            replaceInputRef.current.click();
                                        }}
                                        title="이미지 교체 (URL 유지)"
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '10px',
                                            background: 'rgba(139, 92, 246, 0.6)',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            backdropFilter: 'blur(4px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {uploading && replacingFileName === image.storage_path ? (
                                            <RefreshCw size={14} className="spin" />
                                        ) : (
                                            <RefreshCw size={14} />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image)}
                                        title="삭제"
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '10px',
                                            background: 'rgba(255,50,50,0.6)',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            backdropFilter: 'blur(4px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    ><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div style={{ padding: '16px' }}>
                                {renamingFileName === image.id ? (
                                    <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                                        <input
                                            value={tempNewName}
                                            onChange={e => setTempNewName(e.target.value)}
                                            style={{ ...adminInputStyle, flex: 1, padding: '6px 10px', fontSize: '0.85rem' }}
                                            autoFocus
                                            onKeyDown={e => e.key === 'Enter' && handleRename(image.id)}
                                        />
                                        <button
                                            onClick={() => handleRename(image.id)}
                                            style={{
                                                padding: '6px',
                                                borderRadius: '8px',
                                                background: 'var(--color-primary)',
                                                color: 'white',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        ><Check size={16} /></button>
                                        <button
                                            onClick={() => setRenamingFileName(null)}
                                            style={{
                                                padding: '6px',
                                                borderRadius: '8px',
                                                background: 'var(--color-surface)',
                                                color: 'var(--color-text-muted)',
                                                border: '1px solid var(--color-border)',
                                                cursor: 'pointer'
                                            }}
                                        ><X size={16} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '4px',
                                            gap: '8px'
                                        }}>
                                            <div style={{
                                                fontSize: '0.9rem',
                                                fontWeight: '800',
                                                color: 'var(--color-primary)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }} title={image.display_name}>
                                                {image.display_name}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setRenamingFileName(image.id);
                                                    setTempNewName(image.display_name);
                                                }}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--color-text-muted)',
                                                    cursor: 'pointer',
                                                    padding: '2px',
                                                    marginTop: '-2px'
                                                }}
                                                title="이름 변경"
                                            ><Edit2 size={14} /></button>
                                        </div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--color-text-muted)',
                                            marginBottom: '12px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }} title={image.storage_path}>
                                            시스템경로: {image.storage_path}
                                        </div>
                                    </>
                                )}
                                <button
                                    onClick={() => copyToClipboard(image.public_url)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        background: copySuccess === image.public_url ? 'rgba(74, 222, 128, 0.1)' : 'var(--color-background)',
                                        color: copySuccess === image.public_url ? '#4ade80' : 'var(--color-primary)',
                                        border: `1px solid ${copySuccess === image.public_url ? '#4ade80' : 'var(--color-primary)'}`,
                                        fontSize: '0.85rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {copySuccess === image.public_url ? (
                                        <><Check size={16} /> 복사 완료</>
                                    ) : (
                                        <><Copy size={16} /> URL 주소 복사</>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{
                marginTop: '48px',
                padding: '24px',
                borderRadius: '20px',
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.1)'
            }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    💡 활용 가이드
                </h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                    1. 이미지 업로드 시 입력한 <strong>명칭</strong>은 파일 이름에 포함되어 관리가 용이해집니다.<br />
                    2. 업로드된 이미지의 <strong>URL 주소를 복사</strong>하여 곡 등록, 쇼핑몰, 갤러리 등 어디든 사용할 수 있습니다.<br />
                    3. <strong>교체(새로고침 아이콘)</strong> 버튼을 사용하면 이미지를 바꿔도 기존 URL 주소가 유지되어 편리합니다.
                </p>
            </div>

            {/* 숨겨진 파일 교체용 Input */}
            <input
                type="file"
                ref={replaceInputRef}
                onChange={handleReplace}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
    );
};

// 지원자 목록 컴포넌트
const ApplicantsList = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplicants = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('applicants').select('*').order('created_at', { ascending: false });
        if (error) console.error(error);
        else setApplicants(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchApplicants();
    }, []);

    if (loading && applicants.length === 0) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>지원자 내역 ({applicants.length}명)</h3>
                <button
                    onClick={fetchApplicants}
                    disabled={loading}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                    {loading ? '갱신 중...' : '새로고침'}
                    {!loading && <RefreshCw size={14} />}
                </button>
            </div>
            <table style={adminTableStyle}>
                <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                        <th style={{ padding: '12px 8px' }}>날짜</th>
                        <th style={{ padding: '12px 8px' }}>소수명</th>
                        <th style={{ padding: '12px 8px' }}>닉네임</th>
                        <th style={{ padding: '12px 8px' }}>레벨</th>
                        <th style={{ padding: '12px 8px' }}>지원동기/한마디</th>
                    </tr>
                </thead>
                <tbody>
                    {applicants.map(app => (
                        <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: '12px 8px', fontSize: '0.85rem' }}>{new Date(app.created_at).toLocaleDateString()}</td>
                            <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{app.name}</td>
                            <td style={{ padding: '12px 8px' }}>{app.nickname || '-'}</td>
                            <td style={{ padding: '12px 8px' }}><span style={{ fontSize: '0.8rem', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>{app.love_level}</span></td>
                            <td style={{ padding: '12px 8px' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{app.reason}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', fontStyle: 'italic' }}>{app.promise}</div>
                            </td>
                        </tr>
                    ))}
                    {applicants.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                                아직 지원자가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Styles
const adminInputStyle = {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-background)',
    color: 'var(--color-text)',
    fontSize: '1rem', // 모바일에서 focus 시 줌 방지
    outline: 'none',
    width: '100%'
};

const adminAddButtonStyle = {
    padding: '10px',
    borderRadius: '8px',
    background: 'var(--color-primary)',
    color: 'white',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer'
};

const adminDeleteButtonStyle = {
    padding: '4px 8px',
    background: 'rgba(255, 0, 0, 0.1)',
    color: '#ff4d4d',
    border: '1px solid #ff4d4d',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
};

const adminTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    marginTop: '10px'
};

const VisitorStats = () => {
    const [stats, setStats] = useState({
        totalUV: 0,
        todayUV: 0,
        recentLogs: [],
        pageStats: []
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // 1. 전체 UV (중복 IP 제외 전체 카운트)
            const { count: totalUV } = await supabase
                .from('visit_logs')
                .select('ip', { count: 'exact', head: true });

            // 2. 오늘 UV
            const today = new Date().toISOString().split('T')[0];
            const { data: todayData } = await supabase
                .from('visit_logs')
                .select('ip')
                .gte('created_at', today);
            const todayUV = new Set(todayData?.map(d => d.ip)).size;

            // 3. 페이지별 통계
            const { data: pageData } = await supabase
                .from('visit_logs')
                .select('page_path');

            const pageCounts = pageData?.reduce((acc, curr) => {
                acc[curr.page_path] = (acc[curr.page_path] || 0) + 1;
                return acc;
            }, {}) || {};

            const sortedPageStats = Object.entries(pageCounts)
                .map(([path, count]) => ({ path, count }))
                .sort((a, b) => b.count - a.count);

            // 4. 최근 로그 20개
            const { data: recentLogs } = await supabase
                .from('visit_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            setStats({
                totalUV: totalUV || 0,
                todayUV,
                pageStats: sortedPageStats,
                recentLogs: recentLogs || []
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
            <RefreshCw className="spin" size={32} style={{ color: 'var(--color-primary)' }} />
            <p style={{ marginTop: '12px' }}>통계 데이터 불러오는 중...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>방문자 통계 📊</h3>
                <button onClick={fetchStats} style={{ ...adminAddButtonStyle, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                    <RefreshCw size={16} /> 새로고침
                </button>
            </div>

            {/* 요약 카드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div style={statsCardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={iconBoxStyle('#8b5cf6')}><Users size={24} /></div>
                        <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>누적 순수 방문자 (UV)</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '12px' }}>{stats.totalUV.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: '400' }}>명</span></div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.4' }}>
                        서비스 시작일부터 지금까지 방문한 중복 없는 전체 사용자 수입니다.
                    </p>
                </div>
                <div style={statsCardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={iconBoxStyle('#10b981')}><Calendar size={24} /></div>
                        <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>오늘 순수 방문자 (UV)</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '12px' }}>{stats.todayUV.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: '400' }}>명</span></div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.4' }}>
                        오늘 접속한 사용자 중 중복(동일 IP)을 제외한 실제 고유 사용자 수입니다.
                    </p>
                </div>
            </div>

            {/* 페이지별 유입 및 실시간 로그 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                <div style={statsSectionStyle}>
                    <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart2 size={20} /> 페이지별 이동량</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stats.pageStats.length === 0 ? (
                            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>데이터가 없습니다.</p>
                        ) : stats.pageStats.map((item, idx) => (
                            <div key={idx} style={{
                                background: 'rgba(255,255,255,0.03)',
                                padding: '14px 18px',
                                borderRadius: '14px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                border: '1px solid var(--color-border)'
                            }}>
                                <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{item.path}</span>
                                <span style={{ fontWeight: '700' }}>{item.count} <small style={{ fontWeight: '400', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>hits</small></span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={statsSectionStyle}>
                    <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowRight size={20} /> 실시간 유입 로그 (최근 20건)</h4>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ ...adminTableStyle, fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                    <th style={{ padding: '12px', fontWeight: '600' }}>시간</th>
                                    <th style={{ padding: '12px', fontWeight: '600' }}>정보</th>
                                    <th style={{ padding: '12px', fontWeight: '600' }}>경로</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentLogs.length === 0 ? (
                                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>방문 기록이 없습니다.</td></tr>
                                ) : stats.recentLogs.map((log) => (
                                    <tr key={log.id} style={{ borderBottom: '1px dotted var(--color-border)' }}>
                                        <td style={{ padding: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                                            {new Date(log.created_at).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ fontWeight: '600' }}>{log.ip?.substring(0, 8)}...</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {log.user_agent}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                background: 'rgba(139, 92, 246, 0.1)',
                                                color: 'var(--color-primary)',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                fontSize: '0.75rem'
                                            }}>{log.page_path}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const statsCardStyle = {
    background: 'var(--color-surface-light)',
    padding: '30px',
    borderRadius: '24px',
    border: '1px solid var(--color-border)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
};

const statsSectionStyle = {
    background: 'var(--color-surface-light)',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid var(--color-border)'
};

const iconBoxStyle = (color) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: `${color}20`,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

export default Admin;
