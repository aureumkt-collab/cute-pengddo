import React, { useState, useEffect, useCallback } from 'react';
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

// URL에서 view 파라미터 읽기
const getViewFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('view');
};

// URL에 view 파라미터 설정
const setViewToURL = (view, params = {}, replace = false) => {
  const url = new URL(window.location.href);
  if (view) {
    url.searchParams.set('view', view);
    // 추가 파라미터 처리
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  } else {
    url.searchParams.delete('view');
    // 모든 검색 파라미터 삭제 (필요시)
    const keysToDelete = Array.from(url.searchParams.keys());
    keysToDelete.forEach(key => url.searchParams.delete(key));
  }

  if (replace) {
    window.history.replaceState({ view, ...params }, '', url.toString());
  } else {
    window.history.pushState({ view, ...params }, '', url.toString());
  }
};

// 크리스마스 기간 확인 (12월 22일 ~ 12월 25일)
const checkIsChristmas = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 0-indexed
  const date = now.getDate();
  return month === 12 && date >= 22 && date <= 25;
};

function App() {
  const [currentView, setCurrentView] = useState(() => getViewFromURL());

  // popstate 이벤트로 뒤로가기/앞으로가기 처리
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromURL());
      document.body.style.overflow = 'auto';
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    setViewToURL('apply-modal');
    setCurrentView('apply-modal');
  }, []);

  // 약관 동의 후 지원서 폼으로 이동
  const handleAgreeAndProceed = useCallback(() => {
    setViewToURL('apply-form');
    setCurrentView('apply-form');
  }, []);

  // 모달 닫기 - 뒤로가기
  const handleCloseModal = useCallback(() => {
    window.history.back();
  }, []);

  // 폼 닫기 - 메인으로 돌아가기
  const handleCloseForm = useCallback(() => {
    setViewToURL(null, true);
    setCurrentView(null);
  }, []);

  const showApplyModal = currentView === 'apply-modal';
  const showApplyForm = currentView === 'apply-form';
  const showProductDetail = currentView === 'product-detail';
  const isAdminPath = window.location.pathname === '/admin';

  // 상품 ID 추출
  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get('id');

  // 상품 상세 이동 핸들러
  const handleProductClick = useCallback((id) => {
    setViewToURL('product-detail', { id });
    setCurrentView('product-detail');
  }, []);

  if (isAdminPath) {
    return <Admin />;
  }

  return (
    <AuthProvider>
      <MusicProvider>
        <Layout hideHeader={showApplyForm || showProductDetail}>
          {showApplyForm ? (
            <ApplyForm onClose={handleCloseForm} />
          ) : showProductDetail ? (
            <ProductDetail productId={productId} onBack={handleCloseForm} />
          ) : (
            <>
              <Hero onApplyClick={handleApplyClick} />
              <Gallery onProductClick={handleProductClick} />
            </>
          )}

          {showApplyModal && (
            <ApplyModal
              onClose={handleCloseModal}
              onAgree={handleAgreeAndProceed}
            />
          )}

          <WelcomeChat />
        </Layout>
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;

