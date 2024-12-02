import React, { useState } from 'react';
import { fetchCountsByEmailAndVideoId } from '../api/videoApi';
import { useAuth } from '../context/AuthContext';

function CountsByVideoId() {
    const { userEmail, authToken } = useAuth();
    const [videoId, setVideoId] = useState('');
    const [counts, setCounts] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFetchCounts = async () => {
        if (!videoId) {
            alert('Please enter a video ID');
            return;
        }

        setLoading(true);
        try {
            const data = await fetchCountsByEmailAndVideoId(userEmail, videoId, authToken);
            setCounts(data);
        } catch (error) {
            console.error('Error fetching counts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Search Object Counts by Video ID</h3>
            <div>
                <label>
                    Video ID:
                    <input
                        type="text"
                        value={videoId}
                        onChange={(e) => setVideoId(e.target.value)}
                    />
                </label>
                <button onClick={handleFetchCounts}>Search</button>
            </div>

            {loading && <p>Loading...</p>}

            {counts.length > 0 && (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Label</th>
                        <th>Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {counts.map(({ id, label, count }) => (
                        <tr key={id}>
                            <td>{id}</td>
                            <td>{label}</td>
                            <td>{count}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {counts.length === 0 && !loading && <p>No counts available for the specified video ID.</p>}
        </div>
    );
}

export default CountsByVideoId;