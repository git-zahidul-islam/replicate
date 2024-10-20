// pages/integrations.tsx
"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

const Integrations: React.FC = () => {
  const router = useRouter();

  const handleConnect = async () => {
    // Redirect to the GitHub OAuth authorization page
    router.push('/api/integrations');
  };

  return (
    <div className="container">
      <h1>Available Integrations</h1>
      <div className="integration-card">
        <h2>GitHub</h2>
        <button className="connect-button my-20" onClick={handleConnect}>
          Connect GitHub
        </button>
      </div>
    </div>
  );
};

export default Integrations;
