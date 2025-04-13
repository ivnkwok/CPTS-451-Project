import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const StudentBalanceCheck = () => {
    const [studentId, setStudentId] = useState('');
    const [balance, setBalance] = useState<number | null>(null);
    const [studentName, setStudentName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const handleCheckBalance = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setBalance(null);
        setStudentName(null);

        try {
            const response = await fetch(`http://localhost:8000/api/users/balance/${studentId}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch balance');
            }

            const data = await response.json();
            setBalance(data.balance);
            setStudentName(data.name);
        } catch (err) {
            setError('Failed to check balance. Please verify the student ID.');
        }
    };

    return (
        <div className="balance-check-container">
            <h2>Check Student Balance</h2>
            <form onSubmit={handleCheckBalance}>
                <div className="form-group">
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

            {error && <div className="error-message">{error}</div>}
            
            {balance !== null && studentName && (
                <div className="balance-result">
                    <h3>Balance Information</h3>
                    <p>Student: {studentName}</p>
                    <p>Student ID: {studentId}</p>
                    <p>Current Balance: ${balance.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default StudentBalanceCheck; 