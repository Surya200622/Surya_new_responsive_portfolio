import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, GitCommit, Users } from 'lucide-react';
import './GithubStats.css';

const GithubIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

export default function GithubStats({ username }) {
  const [stats, setStats] = useState({
    repos: 0,
    followers: 0,
    stars: 0,
    commits: 0, // Hard to get exact total commits without GraphQL, but we can mock or estimate
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchGithubStats() {
      try {
        setLoading(true);
        // Fetch user data
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error('User fetch failed');
        const userData = await userRes.json();

        // Fetch repos to calculate stars
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!reposRes.ok) throw new Error('Repos fetch failed');
        const reposData = await reposRes.json();

        const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);

        setStats({
          repos: userData.public_repos,
          followers: userData.followers,
          stars: totalStars,
          commits: '100+', // Public REST API doesn't give total commits easily, using a placeholder for aesthetic
        });
      } catch (err) {
        console.error("Failed to fetch GitHub stats:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchGithubStats();
  }, [username]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (error) return null; // Fallback to not showing if API limit reached

  return (
    <div className="github-stats-container">
      <div className="github-stats-header">
        <GithubIcon size={18} className="text-accent" />
        <h4>Live GitHub Activity</h4>
      </div>
      
      <div className="github-stats-grid">
        <motion.div className="github-stat-card" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="stat-icon"><GitCommit size={18} /></div>
          <div className="stat-content">
            <span className="stat-value">{loading ? '...' : stats.repos}</span>
            <span className="stat-label">Repositories</span>
          </div>
        </motion.div>

        <motion.div className="github-stat-card" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <div className="stat-icon"><Star size={18} /></div>
          <div className="stat-content">
            <span className="stat-value">{loading ? '...' : stats.stars}</span>
            <span className="stat-label">Total Stars</span>
          </div>
        </motion.div>

        <motion.div className="github-stat-card" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <div className="stat-icon"><Users size={18} /></div>
          <div className="stat-content">
            <span className="stat-value">{loading ? '...' : stats.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
