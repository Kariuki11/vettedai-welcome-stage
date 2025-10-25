import { useState, useEffect } from 'react';
import { backendClient } from '@/integrations/backend/client';

export default function TestConnection() {
  const [status, setStatus] = useState('Testing...');
  const [results, setResults] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const addResult = (test: string, success: boolean, data?: any, error?: any) => {
    setResults(prev => [...prev, {
      test,
      success,
      data,
      error: error?.message || error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTests = async () => {
    setResults([]);
    setStatus('Running tests...');

    try {
      // Test 1: Health check
      try {
        const health = await backendClient.healthCheck();
        addResult('Health Check', true, health);
      } catch (error) {
        addResult('Health Check', false, null, error);
      }

      // Test 2: Database test
      try {
        const db = await backendClient.testDatabase();
        addResult('Database Connection', true, db);
      } catch (error) {
        addResult('Database Connection', false, null, error);
      }

      // Test 3: User signup
      try {
        const email = `test${Date.now()}@example.com`;
        const signup = await backendClient.signup(email, 'test123', 'Test User');
        addResult('User Signup', true, { email, userId: signup.data.user.id });
        setUser(signup.data.user);
      } catch (error) {
        addResult('User Signup', false, null, error);
      }

      // Test 4: Create project (if user is logged in)
      if (user || localStorage.getItem('auth_token')) {
        try {
          const project = await backendClient.createProject({
            roleTitle: 'Test Developer',
            jobDescription: 'Test job description for demo',
            jobSummary: 'Test job summary',
            tierId: 1,
            tierName: 'Basic',
            candidateSource: 'own',
            candidateCount: 5
          });
          addResult('Create Project', true, project);
        } catch (error) {
          addResult('Create Project', false, null, error);
        }
      }

      // Test 5: Get projects
      if (user || localStorage.getItem('auth_token')) {
        try {
          const projects = await backendClient.getProjects();
          addResult('Get Projects', true, { count: projects.length });
        } catch (error) {
          addResult('Get Projects', false, null, error);
        }
      }

      setStatus('Tests completed!');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Backend Connection Test</h1>
        <p className="text-gray-600">Testing connection between frontend and MongoDB backend</p>
        <div className="mt-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            status.includes('Error') ? 'bg-red-100 text-red-800' : 
            status.includes('completed') ? 'bg-green-100 text-green-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {status}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <button 
          onClick={runTests}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Run Tests Again
        </button>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className={`border rounded-lg p-4 ${
            result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  result.success ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                {result.test}
              </h3>
              <span className="text-sm text-gray-500">{result.timestamp}</span>
            </div>
            
            {result.success ? (
              <div>
                <p className="text-green-700 text-sm mb-2">Success</p>
                {result.data && (
                  <pre className="bg-white p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <div>
                <p className="text-red-700 text-sm mb-2"> Failed</p>
                <p className="text-red-600 text-sm bg-white p-2 rounded">
                  {result.error}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No test results yet...
        </div>
      )}
    </div>
  );
}
