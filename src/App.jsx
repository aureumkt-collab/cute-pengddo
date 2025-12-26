import React, { useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import ApplyModal from './components/ApplyModal';
import ApplyForm from './components/ApplyForm';
import WelcomeChat from './components/WelcomeChat';
import MusicPlayer from './components/MusicPlayer';
import { MusicProvider } from './context/MusicContext';
import { AuthProvider } from './context/AuthContext';
import Admin from './components/Admin';
import ProductDetail from './components/ProductDetail';
import Purchase from './components/Purchase';
import { supabase } from './supabaseClient';

// 크리스마스 기간 확인 (12월 22일 ~ 12월 25일)
const checkIsChristmas = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 0-indexed
  const date = now.getDate();
  return month === 12 && date >= 22 && date <= 25;
};

// Admin 라우트 컴포넌트
const AdminRoute = () => {
  return <Admin />;
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: productId } = useParams();

  // 크리스마스 테마 적용
  useEffect(() => {
    if (checkIsChristmas()) {
      document.body.classList.add('christmas-theme');
    } else {
      document.body.classList.remove('christmas-theme');
    }
  }, []);

  // 지원하기 버튼 클릭 - 약관 모달 열기
  const handleApplyClick = useCallback(() => {
    navigate('/apply-modal');
  }, [navigate]);

  // 약관 동의 후 지원서 폼으로 이동
  const handleAgreeAndProceed = useCallback(() => {
    navigate('/apply-form');
  }, [navigate]);

  // 모달 닫기
  const handleCloseModal = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // 홈으로 돌아가기
  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // 뒤로 가기
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // 상품 상세 이동 핸들러
  const handleProductClick = useCallback((id) => {
    navigate(`/product/${id}`);
  }, [navigate]);

  const isApplyForm = location.pathname === '/apply-form';
  const isProductDetail = location.pathname.startsWith('/product/');
  const isApplyModal = location.pathname === '/apply-modal';
  const isPurchase = location.pathname.startsWith('/purchase/');

  // 방문 기록 (1일 1회 중복 제외 로직은 DB Function에서 처리)
  useEffect(() => {
    const recordVisit = async () => {
      try {
        const { error } = await supabase.rpc('log_visit', {
          p_page_path: location.pathname
        });
        if (error) console.error('Visit log error:', error);
      } catch (err) {
        console.error('Failed to log visit:', err);
      }
    };

    // 메인 접속이나 특정 페이지 진입 시 기록
    recordVisit();
  }, [location.pathname]); // 경로 이동시마다 체크 (DB 함수에서 24시간 중복 방지)

  return (
    <Layout hideHeader={isApplyForm || isProductDetail || isPurchase}>
      <Routes>
        <Route path="/" element={
          <>
            <Hero onApplyClick={handleApplyClick} />
            <Gallery onProductClick={handleProductClick} activeTabProp="activity" />
          </>
        } />
        <Route path="/mall" element={
          <>
            <Hero onApplyClick={handleApplyClick} />
            <Gallery onProductClick={handleProductClick} activeTabProp="mall" />
          </>
        } />
        <Route path="/apply-form" element={<ApplyForm onClose={handleGoHome} />} />
        <Route path="/product/:id" element={<ProductDetail onBack={handleBack} />} />
        <Route path="/purchase/:id" element={<Purchase />} />
        <Route path="/apply-modal" element={
          <>
            <Hero onApplyClick={handleApplyClick} />
            <Gallery onProductClick={handleProductClick} activeTabProp="activity" />
            <ApplyModal
              onClose={handleCloseModal}
              onAgree={handleAgreeAndProceed}
            />
          </>
        } />
      </Routes>
      <WelcomeChat />
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <Router>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<AppContent />} />
          </Routes>
        </Router>
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;
