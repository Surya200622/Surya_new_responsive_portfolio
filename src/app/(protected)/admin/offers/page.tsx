'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Tag, Send, Upload, Loader2, X, Edit2, Trash2 } from 'lucide-react';

import { PROJECT_TYPES } from '@/data/calculatorData';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Offers | Surya CS',
};


interface Offer {
  id: string;
  title: string;
  description: string;
  discount_percentage: number;
  valid_until: string;
  image_url: string | null;
  is_active: boolean;
}

export default function AdminOffersPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    valid_until: '',
    send_email: true
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [offers, setOffers] = useState<Offer[]>([]);
  const [fetchingOffers, setFetchingOffers] = useState(true);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setFetchingOffers(true);
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      if (data.offers) {
        setOffers(data.offers);
      }
    } catch (err) {
      console.error('Failed to fetch offers:', err);
    } finally {
      setFetchingOffers(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEdit = (offer: Offer) => {
    setEditingOfferId(offer.id);
    setFormData({
      title: offer.title,
      description: offer.description,
      discount_percentage: offer.discount_percentage ? offer.discount_percentage.toString() : '',
      valid_until: offer.valid_until ? offer.valid_until.split('T')[0] : '',
      send_email: false // Default to false when editing so we don't spam clients
    });
    setImagePreview(offer.image_url);
    setImageFile(null);
    setSuccess('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingOfferId(null);
    setFormData({
      title: '',
      description: '',
      discount_percentage: '',
      valid_until: '',
      send_email: true
    });
    removeImage();
    setSuccess('');
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      const res = await fetch(`/api/offers/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to delete offer');
      
      setSuccess('Offer deleted successfully.');
      fetchOffers();
      
      if (editingOfferId === id) {
        cancelEdit();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let image_url = imagePreview; // keep existing if editing

      // 1. Upload image if a new file is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('offers')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data } = supabase.storage.from('offers').getPublicUrl(filePath);
        image_url = data.publicUrl;
      }

      // 2. Submit to API (PUT if editing, POST if new)
      const url = editingOfferId ? `/api/offers/${editingOfferId}` : '/api/offers';
      const method = editingOfferId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          discount_percentage: parseInt(formData.discount_percentage) || 0,
          image_url: imageFile ? image_url : (imagePreview ? imagePreview : null) // Handle image clearing
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save offer');
      }

      setSuccess(editingOfferId ? 'Offer successfully updated!' : 'Offer successfully created and broadcasted!');
      
      if (!editingOfferId) {
        setFormData({
          title: '',
          description: '',
          discount_percentage: '',
          valid_until: '',
          send_email: true
        });
        removeImage();
      }
      
      fetchOffers();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">
          {editingOfferId ? 'Edit Special Offer' : 'Create Special Offer'}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          {editingOfferId ? 'Update the details of an existing freelance deal.' : 'Post a new freelance deal and broadcast it to all your clients.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Form */}
        <div className="glass-card-strong p-6 sm:p-8 rounded-2xl border border-[var(--color-glass-border)] h-fit">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl mb-6 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Select Service</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 text-[var(--color-text-muted)]" />
                  </div>
                  <select
                    className="auth-input pl-11 w-full appearance-none"
                    onChange={e => {
                      const serviceName = e.target.value;
                      const discount = formData.discount_percentage;
                      const newTitle = discount ? `${discount}% Off ${serviceName}` : `${serviceName} Special Offer`;
                      setFormData({...formData, title: newTitle});
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Select a predefined service...</option>
                    {PROJECT_TYPES.map(type => (
                      <option key={type.id} value={type.name}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Offer Title</label>
                <input
                  type="text"
                  required
                  className="auth-input px-4 w-full"
                  placeholder="e.g. 50% Off E-commerce Sites"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Description</label>
              <textarea
                required
                rows={4}
                className="auth-input p-4 w-full"
                placeholder="Describe what's included in this offer..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Discount % (Optional)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="auth-input px-4 w-full"
                  placeholder="e.g. 20"
                  value={formData.discount_percentage}
                  onChange={e => setFormData({...formData, discount_percentage: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Valid Until</label>
                <input
                  type="date"
                  required
                  className="auth-input px-4 w-full"
                  value={formData.valid_until}
                  onChange={e => setFormData({...formData, valid_until: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Offer Image (Optional)</label>
              {!imagePreview ? (
                <label className="border-2 border-dashed border-[var(--color-glass-border)] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--color-bg-glass)] hover:border-[var(--color-accent-primary)] transition-all">
                  <Upload className="w-8 h-8 text-[var(--color-text-muted)] mb-3" />
                  <span className="text-sm text-[var(--color-text-secondary)] font-medium">Click to upload image</span>
                  <span className="text-xs text-[var(--color-text-muted)] mt-1">PNG, JPG up to 5MB</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-[var(--color-glass-border)] bg-[var(--color-bg-glass)] flex items-center justify-center">
                  <img src={imagePreview} alt="Preview" className="max-h-[300px] object-contain" />
                  <button 
                    type="button" 
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--color-glass-border)] flex items-center justify-between">
              {!editingOfferId && (
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={formData.send_email}
                      onChange={e => setFormData({...formData, send_email: e.target.checked})}
                    />
                    <div className="w-10 h-6 bg-[var(--color-glass-border)] rounded-full peer peer-checked:bg-[var(--color-accent-primary)] transition-colors"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors">Broadcast via Email</span>
                    <span className="text-xs text-[var(--color-text-muted)]">Sends to all registered clients</span>
                  </div>
                </label>
              )}
              {editingOfferId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
                >
                  Cancel Edit
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-[var(--color-accent-primary)]/20 ml-auto"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {editingOfferId ? 'Updating...' : 'Processing...'}</>
                ) : (
                  <><Send className="w-4 h-4" /> {editingOfferId ? 'Update Offer' : 'Publish Offer'}</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Offers List */}
        <div>
          <h2 className="text-xl font-display font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            Active Offers
            <span className="bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] text-xs py-0.5 px-2 rounded-full">
              {offers.length}
            </span>
          </h2>
          
          {fetchingOffers ? (
            <div className="flex flex-col items-center justify-center p-10 bg-[var(--color-bg-glass)] border border-[var(--color-glass-border)] rounded-2xl h-64">
              <Loader2 className="w-8 h-8 text-[var(--color-accent-primary)] animate-spin mb-4" />
              <p className="text-sm text-[var(--color-text-secondary)]">Loading offers...</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 bg-[var(--color-bg-glass)] border border-[var(--color-glass-border)] rounded-2xl h-64 text-center">
              <Tag className="w-10 h-10 text-[var(--color-text-muted)] mb-3 opacity-50" />
              <p className="text-[var(--color-text-primary)] font-medium">No Active Offers</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-[250px]">You don't have any active offers at the moment. Create one using the form.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {offers.map((offer) => (
                <div 
                  key={offer.id} 
                  className={`p-5 rounded-2xl border transition-all ${
                    editingOfferId === offer.id 
                      ? 'bg-[var(--color-bg-glass-strong)] border-[var(--color-accent-primary)] shadow-[0_0_20px_rgba(201,168,76,0.1)]' 
                      : 'bg-[var(--color-bg-glass)] border-[var(--color-glass-border)] hover:border-[var(--color-text-muted)]'
                  }`}
                >
                  <div className="flex gap-4">
                    {offer.image_url && (
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-black/20 border border-[var(--color-glass-border)]">
                        <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-semibold text-[var(--color-text-primary)] truncate text-lg">
                          {offer.title}
                        </h3>
                        {offer.discount_percentage > 0 && (
                          <span className="shrink-0 bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full border border-orange-500/30">
                            {offer.discount_percentage}% OFF
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3">
                        {offer.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-xs text-[var(--color-text-muted)]">
                          Valid until: <span className="text-[var(--color-text-primary)]">{new Date(offer.valid_until).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(offer)}
                            className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-glass)] border border-[var(--color-border)] rounded-md transition-colors"
                            title="Edit Offer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(offer.id)}
                            className="p-1.5 text-[var(--color-text-secondary)] hover:text-red-400 bg-[var(--color-bg-primary)] hover:bg-red-500/10 border border-[var(--color-border)] rounded-md transition-colors"
                            title="Delete Offer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
