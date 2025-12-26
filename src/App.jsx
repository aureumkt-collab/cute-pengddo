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
import MobileTabs from './components/MobileTabs';
import { supabase } from './supabaseClient';

// 크리스마스 기간 확인 (12월 22일 ~ 12월 25일)
const checkIsChristmas = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 0-indexed
  const date = now.getDate();
  return month === 12 && date >= 22 && date <= 25;
};

// 페이지 이동 시 상단으로 스크롤
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Admin 라우트 컴포넌트
const AdminRoute = () => {
  return <Admin />;
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: productId } = useParams();

  // Scroll to top on route change
  // Actually we call it inside the return below

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

  const [showMini, setShowMini] = React.useState(false);
  const isHomePage = location.pathname === '/';

  React.useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        // 홈 페이지에서는 300px 이상 스크롤했을 때 미니 플레이어 표시
        setShowMini(window.scrollY > 400);
      } else {
        // 다른 페이지에서는 항상 표시 (단, 지원서 폼 등 일부 제외)
        const excludedPaths = ['/apply-form'];
        setShowMini(!excludedPaths.includes(location.pathname));
      }
    };

    handleScroll(); // 초기 상태 체크
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, isHomePage]);

  return (
    <Layout hideHeader={isApplyForm || isProductDetail || isPurchase}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Hero onApplyClick={handleApplyClick} />} />
        <Route path="/activity" element={<Gallery onProductClick={handleProductClick} activeTabProp="activity" />} />
        <Route path="/mall" element={<Gallery onProductClick={handleProductClick} activeTabProp="mall" />} />
        <Route path="/apply-form" element={<ApplyForm onClose={handleGoHome} />} />
        <Route path="/product/:id" element={<ProductDetail onBack={handleBack} />} />
        <Route path="/purchase/:id" element={<Purchase />} />
        <Route path="/apply-modal" element={
          <>
            <Hero onApplyClick={handleApplyClick} />
            <ApplyModal
              onClose={handleCloseModal}
              onAgree={handleAgreeAndProceed}
            />
          </>
        } />
      </Routes>

      {/* 글로벌 미니 플레이어 */}
      <div style={{
        position: 'fixed',
        bottom: window.innerWidth <= 768 ? '100px' : '30px',
        left: '50%',
        zIndex: 2200,
        opacity: showMini ? 1 : 0,
        visibility: showMini ? 'visible' : 'hidden',
        transform: `translateX(-50%) translateY(${showMini ? '0' : '100px'})`,
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: showMini ? 'auto' : 'none'
      }}>
        <MusicPlayer variant="mini" />
      </div>

      <WelcomeChat />
      <MobileTabs />
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
