"use client"
import { useState } from 'react';

export default function TestConnection() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to test connection',
        error: error.message
      });
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ 
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ 
        color: '#333', 
        borderBottom: '2px solid #eaeaea',
        paddingBottom: '10px',
        marginBottom: '30px'
      }}>MongoDB Connection Test</h1>
      
      <button 
        onClick={testConnection} 
        disabled={loading}
        style={{
          backgroundColor: loading ? '#cccccc' : '#4285f4',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        {loading ? 'Testing Connection...' : 'Test Connection'}
      </button>
      
      {result && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: result.success ? 'rgba(212, 237, 218, 0.2)' : 'rgba(248, 215, 218, 0.2)',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ 
            color: result.success ? '#28a745' : '#dc3545',
            marginTop: '0'
          }}>
            {result.success ? '✅ Connection Successful' : '❌ Connection Failed'}
          </h3>
          
          <div style={{ fontSize: '16px', lineHeight: '1.6' }}>
            <p><strong>Message:</strong> {result.message}</p>
            
            {result.database && (
              <p><strong>Database:</strong> <span style={{ fontFamily: 'monospace', backgroundColor: '#f8f9fa', padding: '2px 5px', borderRadius: '3px' }}>{result.database}</span></p>
            )}
            
            {result.collections && (
              <div>
                <strong>Collections:</strong>
                <ul style={{ 
                  listStyleType: 'circle',
                  backgroundColor: '#f8f9fa', 
                  padding: '15px 15px 15px 35px',
                  borderRadius: '5px',
                  fontFamily: 'monospace'
                }}>
                  {result.collections.map((col, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{col}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.error && (
              <p><strong>Error:</strong> <span style={{ color: '#dc3545' }}>{result.error}</span></p>
            )}
            
            {result.timestamp && (
              <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '20px' }}>
                <strong>Timestamp:</strong> {result.timestamp}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}