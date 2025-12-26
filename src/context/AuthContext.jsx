import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 현재 세션 확인
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // 인증 상태 변화 리스너
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Google 로그인
    const signInWithGoogle = async () => {
        // 현재 브라우저의 접속 정보를 기반으로 리디렉션 주소 설정
        const redirectUrl = window.location.origin;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl
            }
        });
        if (error) {
            console.error('로그인 에러:', error.message);
            alert('로그인에 실패했습니다: ' + error.message);
        }
    };

    // 로그아웃
    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('로그아웃 에러:', error.message);
            }
        } catch (err) {
            console.error('로그아웃 도중 예외 발생:', err);
        } finally {
            // 세션이나 네트워크 이슈와 상관없이 클라이언트 상태 명시적 초기화 및 홈으로 이동
            setUser(null);
            window.location.href = '/';
        }
    };

    const value = {
        user,
        loading,
        isAdmin: user?.email === 'ksmark1@gmail.com',
        signInWithGoogle,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
