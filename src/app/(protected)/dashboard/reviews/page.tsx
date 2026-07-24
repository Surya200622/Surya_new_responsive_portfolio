'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Star, Save, AlertCircle } from 'lucide-react';

export default function ReviewsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [profileName, setProfileName] = useState('');
  
  const [form, setForm] = useState({
    role: '',
    content: '',
    rating: 5,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      if (status === 'loading') return;
      if (status === 'unauthenticated' || !session?.user) {
        router.push('/login');
        return;
      }

      try {
        // Get user profile to get display name
        const resProfile = await fetch('/api/user/profile');
        if (resProfile.ok) {
          const profile = await resProfile.json();
          setProfileName(profile.full_name || session.user.name || session.user.email?.split('@')[0] || 'User');
        } else {
          setProfileName(session.user.name || session.user.email?.split('@')[0] || 'User');
        }

        // Get existing review
        const resReview = await fetch('/api/reviews/me');
        if (resReview.ok) {
          const review = await resReview.json();
          if (review && review.id) {
            setReviewId(review.id);
            setForm({
              role: review.role || '',
              content: review.content || '',
              rating: review.rating || 5,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load review data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (!form.content.trim() || !form.role.trim()) {
        throw new Error('Please fill out all fields.');
      }

      const reviewData = {
        name: profileName,
        role: form.role,
        content: form.content,
        rating: form.rating,
      };

      if (reviewId) {
        // Update
        const res = await fetch(`/api/reviews/${reviewId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData)
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to update review');
        }
        setMessage({ type: 'success', text: 'Review updated successfully! It is now live on the portfolio.' });
      } else {
        // Insert
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData)
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to publish review');
        }
        const data = await res.json();
        if (data.review) setReviewId(data.review.id);
        setMessage({ type: 'success', text: 'Review published successfully! It is now live on the portfolio.' });
      }
    } catch (err: any) {
      console.error('Save review error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to save review.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Your Review</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Share your experience working with Surya. Your review will be displayed publicly on the testimonials section.
        </p>
      </div>

      <div className="glass-card-strong p-6 md:p-8 rounded-2xl border border-[var(--color-glass-border)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {message && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Display Name</label>
            <input 
              type="text" 
              className="auth-input opacity-50 cursor-not-allowed" 
              value={profileName} 
              disabled 
            />
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Your display name is pulled from your profile settings.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Your Role / Profession <span className="text-red-400">*</span></label>
            <input 
              type="text" 
              className="auth-input" 
              placeholder="e.g. Startup Founder, Marketing Director, Small Business Owner" 
              value={form.role} 
              onChange={e => setForm({ ...form, role: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 ${form.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-[var(--color-text-muted)]'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Review Description <span className="text-red-400">*</span></label>
            <textarea 
              className="auth-input min-h-[150px] py-3 resize-y" 
              placeholder="Write about your experience working with Surya..." 
              value={form.content} 
              onChange={e => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>

          <div className="pt-4 border-t border-[var(--color-glass-border)] flex justify-between items-center">
            {reviewId ? (
              <button
                type="button"
                onClick={async () => {
                  if (!confirm('Are you sure you want to delete your review?')) return;
                  setSaving(true);
                  try {
                    const res = await fetch(`/api/reviews/${reviewId}`, {
                      method: 'DELETE'
                    });
                    
                    if (!res.ok) {
                      const data = await res.json();
                      throw new Error(data.error || 'Failed to delete review');
                    }
                    
                    setReviewId(null);
                    setForm({ role: '', content: '', rating: 5 });
                    setMessage({ type: 'success', text: 'Review deleted successfully! It is instantly removed from the portfolio.' });
                  } catch (err: any) {
                    setMessage({ type: 'error', text: err.message || 'Failed to delete review.' });
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                Delete Review
              </button>
            ) : <div />}

            <button 
              type="submit" 
              disabled={saving}
              className="gradient-btn px-8 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {reviewId ? 'Update Review' : 'Publish Review'}
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
