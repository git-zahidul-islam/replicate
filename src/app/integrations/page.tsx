"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Repo {
  name: string;
  html_url: string;
}

const Integrations: React.FC = () => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<Repo[]>([]);

  useEffect(() => {
    // Fetch the integration status on component mount
    const fetchIntegrationStatus = async () => {
      const response = await fetch('/api/status'); // This will check if the user is connected
      const data = await response.json();

      if (data.connected) {
        setIsConnected(true);
        setUsername(data.username);
        setRepositories(data.repositories);
      }
    };

    fetchIntegrationStatus();
  }, []);

  const handleConnect = async () => {
    // Redirect to the GitHub OAuth authorization page
    router.push('/api/integrations');
  };

  const handleDisconnect = async () => {
    const response = await fetch('/api/disconnect', {
      method: 'DELETE',
    });

    if (response.ok) {
      setIsConnected(false); // Update UI after successful disconnection
      setUsername(null);
      setRepositories([]);
    } else {
      const errorData = await response.json();
      alert(errorData.error || 'Failed to disconnect the integration.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">Available Integrations</h1>
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-medium mb-4">GitHub</h2>

        {!isConnected ? (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleConnect}
          >
            Connect GitHub
          </button>
        ) : (
          <div>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mb-4"
              onClick={handleDisconnect}
            >
              Disconnect GitHub
            </button>

            {/* Display the username and repositories */}
            {username && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Connected GitHub User: {username}</h3>
              </div>
            )}
            {repositories.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Repositories:</h3>
                <ul className="list-disc list-inside">
                  {repositories.map((repo) => (
                    <li key={repo.name}>
                      <a
                        href={repo.html_url}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {repo.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Integrations;