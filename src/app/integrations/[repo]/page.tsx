"use client";
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const RepoIssuePage: React.FC = () => {
  const router = useRouter();
  const { repo } = useParams(); // Get the repo name from the URL
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !message) {
      alert('Please fill out both fields');
      return;
    }

    try {
      // Submit the issue to the API
      const response = await fetch('/api/create-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, message, repository: repo }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Issue created successfully!');
        setTitle('');
        setMessage('');
        router.push('/integrations'); // Redirect back to integrations page after success
      } else {
        alert(data.error || 'Failed to create issue.');
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('Network error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">Create Issue for Repository: {repo}</h1>

      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-lg font-medium mb-2">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Submit Issue
        </button>
      </form>
    </div>
  );
};

export default RepoIssuePage;
