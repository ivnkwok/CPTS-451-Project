import React, { useState } from 'react';
import { useAuth } from '../../utils/AuthContext';

const BalanceCheck = () => {
  const [studentId, setStudentId] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const handleCheckBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/users/balance/${studentId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      
      const data = await response.json();
      setBalance(data.balance);
      setError(null);
    } catch (err) {
      setError('Failed to fetch balance. Please check the student ID and try again.');
      setBalance(null);
    }
  };

  return (
    <div className="balance-check">
      <h2>Check Student Balance</h2>
      <form onSubmit={handleCheckBalance}>
        <div>
          <label htmlFor="studentId">Student ID:</label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Check Balance</button>
      </form>
      
      {error && <div className="error">{error}</div>}
      
      {balance !== null && (
        <div className="balance-result">
          <h3>Balance Information</h3>
          <p>Student ID: {studentId}</p>
          <p>Current Balance: ${balance.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default BalanceCheck; 