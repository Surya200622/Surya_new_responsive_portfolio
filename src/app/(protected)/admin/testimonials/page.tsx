'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // In a real app, you might want a separate API for admin to fetch ALL reviews
      // including unapproved. I will update /api/reviews/all or similar.
      // Wait, let's just use /api/reviews but add a query param ?all=true
      const res = await fetch('/api/reviews?all=true');
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/reviews/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus })
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Failed to update approval status', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      // Admin delete
      const res = await fetch(`/api/reviews/${id}/admin-delete`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Failed to delete review', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Manage Testimonials</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Approve or reject client reviews.</p>
      </div>

      <div className="glass-card-strong rounded-2xl border border-[var(--color-glass-border)] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-bg-tertiary)]/50 border-b border-[var(--color-glass-border)]">
              <tr>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Author</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Review</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Rating</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Status</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-glass-border)]">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-[var(--color-bg-tertiary)]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[var(--color-text-primary)]">{review.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{review.role}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={review.content}>
                    {review.content}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {review.rating} <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      review.isApproved || review.is_approved
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {review.isApproved || review.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleToggleApproval(review.id, review.isApproved || review.is_approved)}
                        className="p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
                        title={review.isApproved || review.is_approved ? 'Unapprove' : 'Approve'}
                      >
                        {review.isApproved || review.is_approved ? <XCircle className="w-4 h-4 text-yellow-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                      </button>
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                    No testimonials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
