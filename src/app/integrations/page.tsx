"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Integrations: React.FC = () => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [repositories, setRepositories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch the integration status and repositories on component mount
    const fetchIntegrationStatus = async () => {
      const response = await fetch('/api/status');
      const data = await response.json();
      setIsConnected(data.connected);

      if (data.connected) {
        setRepositories(data.repositories.map((repo: any) => repo.name));
      }
    };

    fetchIntegrationStatus();
  }, []);

  const handleConnect = async () => {
    router.push('/api/integrations'); // Redirect to GitHub OAuth
  };

  const handleDisconnect = async () => {
    const response = await fetch('/api/disconnect', {
      method: 'DELETE',
    });

    if (response.ok) {
      setIsConnected(false); // Update UI after disconnection
      setRepositories([]);   // Clear repository list after disconnection
    } else {
      const errorData = await response.json();
      alert(errorData.error || 'Failed to disconnect the integration.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">Available Integrations</h1>

      <div className="integration-card bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">GitHub</h2>

        {!isConnected ? (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleConnect}
          >
            Connect GitHub
          </button>
        ) : (
          <div>
            <h3 className="text-xl font-medium mb-4">Connected Repositories</h3>
            <ul className="list-disc pl-5">
              {repositories.map((repo) => (
                <li key={repo} className="mb-2">
                  {/* When clicked, navigate to the action page for the selected repository */}
                  <button
                    onClick={() => router.push(`/integrations/${repo}`)}
                    className="text-blue-500 hover:underline"
                  >
                    {repo}
                  </button>
                </li>
              ))}
            </ul>

            {/* Disconnect button */}
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-4"
              onClick={handleDisconnect}
            >
              Disconnect GitHub
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Integrations;
