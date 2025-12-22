import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Admin = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('welcome'); // welcome, gallery, mall, tracks, applicants

    const handleLogin = (e) => {
        e.preventDefault();
        // 실제 서비스에서는 환경변수나 DB에서 관리해야 하지만, 요청에 따라 간단히 구현
        if (password === '1234') {
            setIsAuthenticated(true);
            sessionStorage.setItem('isAdmin', 'true');
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem('isAdmin') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    if (!isAuthenticated) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-background)'
            }}>
                <form onSubmit={handleLogin} style={{
                    background: 'var(--color-surface-light)',
                    padding: '40px',
                    borderRadius: '24px',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: '800' }}>관리자 로그인</h2>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-background)',
                            color: 'var(--color-text)',
                            marginBottom: '20px',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <button type="submit" style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}>로그인</button>
                    <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        Home으로 돌아가려면 URL 주소창에서 /admin을 제거하세요.
                    </p>
                </form>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            padding: '40px 20px'
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px'
                }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Admin Dashboard</h1>
                    <button
                        onClick={() => {
                            sessionStorage.removeItem('isAdmin');
                            setIsAuthenticated(false);
                        }}
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

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '32px',
                    overflowX: 'auto',
                    paddingBottom: '8px'
                }}>
                    {[
                        { id: 'welcome', label: '말풍선' },
                        { id: 'gallery', label: '갤러리' },
                        { id: 'mall', label: '쇼핑몰' },
                        { id: 'tracks', label: '곡 등록' },
                        { id: 'applicants', label: '지원자 확인' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '30px',
                                border: '1px solid',
                                borderColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
                                background: activeTab === tab.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                cursor: 'pointer',
                                fontWeight: activeTab === tab.id ? '700' : '500',
                                transition: 'all 0.3s',
                                whiteSpace: 'nowrap'
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
                    {activeTab === 'applicants' && <ApplicantsList />}
                </div>
            </div>
        </div>
    );
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

const TracksManager = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ track_id: '', title: '', artist: 'Pengddo', cover: '', audio: '', description: '', lyrics: '' });

    const fetchTracks = async () => {
        const { data, error } = await supabase.from('tracks').select('*').order('orders', { ascending: true });
        if (error) console.error(error);
        else setTracks(data);
        setLoading(false);
    };

    useEffect(() => { fetchTracks(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('tracks').insert([formData]);
        if (error) alert(error.message);
        else {
            setFormData({ track_id: '', title: '', artist: 'Pengddo', cover: '', audio: '', description: '', lyrics: '' });
            fetchTracks();
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        await supabase.from('tracks').delete().eq('id', id);
        fetchTracks();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h3 style={{ marginBottom: '20px' }}>곡 및 가사 관리</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <input placeholder="트랙ID (unique)" value={formData.track_id} onChange={e => setFormData({ ...formData, track_id: e.target.value })} required style={adminInputStyle} />
                    <input placeholder="제목" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={adminInputStyle} />
                    <input placeholder="아티스트" value={formData.artist} onChange={e => setFormData({ ...formData, artist: e.target.value })} required style={adminInputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input placeholder="커버 이미지 경로" value={formData.cover} onChange={e => setFormData({ ...formData, cover: e.target.value })} style={adminInputStyle} />
                    <input placeholder="오디오 파일 경로" value={formData.audio} onChange={e => setFormData({ ...formData, audio: e.target.value })} required style={adminInputStyle} />
                </div>
                <textarea placeholder="곡 설명" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...adminInputStyle, minHeight: '60px' }} />
                <textarea placeholder="가사" value={formData.lyrics} onChange={e => setFormData({ ...formData, lyrics: e.target.value })} style={{ ...adminInputStyle, minHeight: '150px' }} />
                <button type="submit" style={adminAddButtonStyle}>곡 추가</button>
            </form>
            <table style={adminTableStyle}>
                <thead>
                    <tr><th>제목</th><th>아티스트</th><th>관리</th></tr>
                </thead>
                <tbody>
                    {tracks.map(track => (
                        <tr key={track.id}>
                            <td>{track.title}</td>
                            <td>{track.artist}</td>
                            <td><button onClick={() => handleDelete(track.id)} style={adminDeleteButtonStyle}>삭제</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                    }}
                >
                    {loading ? '갱신 중...' : '새로고침 🔄'}
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
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-background)',
    color: 'var(--color-text)',
    fontSize: '0.9rem',
    outline: 'none'
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

export default Admin;
