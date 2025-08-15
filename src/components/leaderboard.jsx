import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the leaderboard data from the API
    const fetchLeaderboard = async () => {
        try {
            console.log("fetching data");
        const response = await fetch('http://localhost:4321/api/get_leaderboard');
        const data = await response.json();

        if (data.success) {
          setLeaderboard(data.leaderboard);
        } else {
          setError(data.error || 'Failed to load leaderboard');
        }
      } catch (error) {
        setError('An error occurred while fetching leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <div className="leaderboard-table">
        <div className="table-header">
          <div className="table-column">Rank</div>
          <div className="table-column">Player Name</div>
          <div className="table-column">Score</div>
        </div>
        {leaderboard.map((entry, index) => (
          <div key={entry.id} className="table-row">
            <div className="table-column">{index + 1}</div>
            <div className="table-column">{entry.player_name}</div>
            <div className="table-column">{entry.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;