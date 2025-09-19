import { useState } from 'react'
import apiClient from '../api/http'

const ConnectionTest = () => {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)

  const testEndpoints = [
    { name: 'Health Check', method: 'GET', url: '/api/health' },
    { name: 'Register Test', method: 'POST', url: '/api/auth/register', 
      body: { username: 'testuser', email: 'test@example.com', password: 'testpass', role: 'CUSTOMER' }},
    { name: 'Login Test', method: 'POST', url: '/api/auth/login', 
      body: { email: 'test@example.com', password: 'testpass' }},
    { name: 'Admin Endpoint (requires auth)', method: 'GET', url: '/api/user/admin' }
  ]

  const runTest = async (test) => {
    setLoading(true)
    setResults(prev => ({ ...prev, [test.name]: { status: 'testing', message: 'Testing...' } }))

    try {
      let response
      if (test.method === 'GET') {
        response = await apiClient.get(test.url)
      } else {
        response = await apiClient.post(test.url, test.body || {})
      }

      setResults(prev => ({
        ...prev,
        [test.name]: {
          status: 'success',
          message: `Success: ${response.status}`,
          data: typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)
        }
      }))
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [test.name]: {
          status: 'error',
          message: `Error: ${error.response?.status || 'Connection Failed'}`,
          data: error.response?.data || error.message
        }
      }))
    }
    setLoading(false)
  }

  const runAllTests = async () => {
    for (const test of testEndpoints) {
      await runTest(test)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-deepNavy mb-2">Backend Connection Test</h1>
          <p className="text-gray-600">Test connectivity to Spring Boot backend</p>
          <p className="text-sm text-gray-500 mt-2">
            Backend URL: <code className="bg-gray-100 px-2 py-1 rounded">{import.meta.env.VITE_API_BASE}</code>
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="bg-teal text-white px-6 py-3 rounded-xl hover:bg-teal-600 transition-colors font-semibold shadow-lg disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run All Tests'}
          </button>
        </div>

        <div className="space-y-6">
          {testEndpoints.map((test) => (
            <div key={test.name} className="border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-deepNavy">{test.name}</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded mr-2">{test.method}</span>
                    {test.url}
                  </p>
                </div>
                <button
                  onClick={() => runTest(test)}
                  disabled={loading}
                  className="bg-coral text-white px-4 py-2 rounded-lg hover:bg-coral-600 transition-colors text-sm disabled:opacity-50"
                >
                  Test
                </button>
              </div>

              {results[test.name] && (
                <div className={`mt-4 p-4 rounded-lg ${
                  results[test.name].status === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : results[test.name].status === 'error'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className={`font-medium mb-2 ${
                    results[test.name].status === 'success' 
                      ? 'text-green-800' 
                      : results[test.name].status === 'error'
                      ? 'text-red-800'
                      : 'text-yellow-800'
                  }`}>
                    {results[test.name].message}
                  </div>
                  {results[test.name].data && (
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                      {typeof results[test.name].data === 'string' 
                        ? results[test.name].data 
                        : JSON.stringify(results[test.name].data, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-800 text-sm">
            <strong>Development Note:</strong> This page is for testing backend connectivity during development. 
            Some tests may fail if the backend is not running or if authentication is required.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConnectionTest