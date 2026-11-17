import React, { useState, useEffect } from 'react';
import { businessService } from '../services/api';

export default function CreateBusiness() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Beauty',
    address: '',
    phone: '',
    image: '',
  });
  const [existingBusinessId, setExistingBusinessId] = useState(null);
  const [imageType, setImageType] = useState('url'); // 'url' or 'file'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function loadExistingBusiness() {
      try {
        const res = await businessService.getMyBusiness();
        if (res.data && res.data.id) {
          setExistingBusinessId(res.data.id);
          setFormData({
            name: res.data.name || '',
            description: res.data.description || '',
            category: res.data.category || 'Beauty',
            address: res.data.address || '',
            phone: res.data.phone || '',
            image: res.data.image || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setFetching(false);
      }
    }
    loadExistingBusiness();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNavigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new CustomEvent('navigate', { detail: { href: path } }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result })); // base64 data URL
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (existingBusinessId) {
        response = await businessService.update(existingBusinessId, formData);
      } else {
        response = await businessService.create(formData);
      }
      if (response.error) {
        setError(response.error);
      } else {
        handleNavigate('/owner-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to save business profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewInstead = () => {
    setExistingBusinessId(null);
    setFormData({
      name: '',
      description: '',
      category: 'Beauty',
      address: '',
      phone: '',
      image: '',
    });
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <a
            href="/owner-dashboard"
            className="text-xs sm:text-sm font-bold text-[#636D62] hover:text-[#16261A] transition-colors inline-flex items-center gap-1.5 no-underline"
          >
            &larr; Back to Dashboard
          </a>
        </div>

        {/* Forest Green Banner Header */}
        <div className="bg-[#182B1F] text-[#FAF7F2] border border-[#273D2E] rounded-3xl p-6 sm:p-8 mb-8 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D9A948] bg-[#253E2C] border border-[#D9A948]/30 px-3 py-1 rounded-full mb-2">
              Portal Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight my-1">
              {existingBusinessId ? 'Edit Business Profile' : 'Create Business Profile'}
            </h1>
            <p className="text-xs sm:text-sm text-[#B4C2AF] m-0 max-w-xl">
              {existingBusinessId
                ? 'Update your existing business information, address, and imagery.'
                : 'Register your institution or service business to publish verified live booking slots.'}
            </p>
          </div>
          {existingBusinessId && (
            <button
              type="button"
              onClick={handleCreateNewInstead}
              className="px-4 py-2 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/25 transition-all cursor-pointer whitespace-nowrap"
            >
              + Create New Business Instead
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-[#FEF5F4] text-[#C0392B] border border-[#F5C2BE] rounded-2xl text-xs sm:text-sm font-bold mb-6">
            ! {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E2D5] shadow-sm sunnah-card-hover flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-[#16261A] mb-1.5">Business name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Luna Glow Salon"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#16261A] mb-1.5">Description *</label>
            <textarea
              name="description"
              required
              rows="3"
              placeholder="Brief description of what services you offer..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] transition-all resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#16261A] mb-1.5">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] transition-all"
            >
              <option value="Beauty">Beauty</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Fitness">Fitness</option>
              <option value="Consulting">Consulting</option>
              <option value="Restaurants">Restaurants</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#16261A] mb-1.5">Location / Address *</label>
            <input
              type="text"
              name="address"
              required
              placeholder="123 Main Street, Downtown"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#16261A] mb-1.5">Phone *</label>
            <input
              type="text"
              name="phone"
              required
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#16261A] mb-2">Business Photo</label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 text-xs font-bold text-[#16261A] cursor-pointer">
                <input
                  type="radio"
                  name="imageType"
                  value="url"
                  checked={imageType === 'url'}
                  onChange={() => setImageType('url')}
                  className="accent-[#203626]"
                />
                Image URL
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-[#16261A] cursor-pointer">
                <input
                  type="radio"
                  name="imageType"
                  value="file"
                  checked={imageType === 'file'}
                  onChange={() => setImageType('file')}
                  className="accent-[#203626]"
                />
                Upload from Computer
              </label>
            </div>

            {imageType === 'url' ? (
              <input
                type="url"
                name="image"
                placeholder="https://images.unsplash.com/..."
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] transition-all"
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337]"
              />
            )}

            {formData.image && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={formData.image}
                  alt="Business Preview"
                  className="w-20 h-14 object-cover rounded-xl border border-[#E8E2D5]"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="text-xs font-bold text-[#C0392B] bg-transparent border-none cursor-pointer hover:underline"
                >
                  Remove Image
                </button>
              </div>
            )}
            <small className="block text-[0.72rem] text-[#636D62] mt-1.5">
              Choose whether to paste a direct image URL or upload an image file from your PC.
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none mt-2 disabled:opacity-50"
          >
            {loading
              ? 'Saving Profile...'
              : existingBusinessId
              ? 'Update Business Profile \u2192'
              : 'Create Business Profile \u2192'}
          </button>
        </form>
      </div>
    </div>
  );
}
