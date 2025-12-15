import React, { useState } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import ApplyModal from './components/ApplyModal';
import ApplyForm from './components/ApplyForm';

function App() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  const handleApplyClick = () => {
    setShowApplyModal(true);
  };

  const handleAgreeAndProceed = () => {
    setShowApplyModal(false);
    setShowApplyForm(true);
  };

  const handleCloseModal = () => {
    setShowApplyModal(false);
  };

  const handleCloseForm = () => {
    setShowApplyForm(false);
  };

  return (
    <Layout onApplyClick={handleApplyClick}>
      {showApplyForm ? (
        <ApplyForm onClose={handleCloseForm} />
      ) : (
        <>
          <Hero />
          <Gallery />
        </>
      )}

      {showApplyModal && (
        <ApplyModal
          onClose={handleCloseModal}
          onAgree={handleAgreeAndProceed}
        />
      )}
    </Layout>
  );
}

export default App;
