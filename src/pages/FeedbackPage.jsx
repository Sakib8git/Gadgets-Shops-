import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createReview } from '../api/client';

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" role="radio" aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded">
          <svg xmlns="http://www.w3.org/2000/svg"
            className={`h-9 w-9 transition-colors ${star <= (hovered || value) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
            viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 self-center text-sm text-gray-500 dark:text-gray-400">
        {value ? ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value] : 'Select rating'}
      </span>
    </div>
  );
}

const EMPTY = { name: '', email: '', rating: 0, message: '' };

const inputCls = (hasError) =>
  `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
    hasError
      ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
      : 'border-gray-300 dark:border-gray-600'
  }`;

export default function FeedbackPage() {
  const [form, setForm]         = useState(EMPTY);
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [apiError, setApiError]     = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required.';
    if (!form.email.trim())   e.email   = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              e.email   = 'Enter a valid email address.';
    if (!form.rating)         e.rating  = 'Please select a rating.';
    if (!form.message.trim()) e.message = 'Message is required.';
    else if (form.message.trim().length < 20)
                              e.message = 'Please write at least 20 characters.';
    return e;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setApiError('');
    try {
      await createReview({
        name:    form.name.trim(),
        rating:  form.rating,
        message: form.message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Thank you, {form.name.split(' ')[0]}!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Your review has been saved and will appear on our homepage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setForm(EMPTY); setSubmitted(false); }}
              className="border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500 font-semibold px-6 py-2.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              Submit Another
            </button>
            <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-full transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────
  return (
    <main className="max-w-2xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <span className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
          Share your experience
        </span>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Leave a Review</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your feedback helps us improve and helps others shop with confidence.
          Reviews appear on our homepage after submission.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 flex flex-col gap-6"
      >
        {/* API-level error */}
        {apiError && (
          <div role="alert" className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {apiError}
          </div>
        )}

        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input id="name" type="text" value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Jane Smith" className={inputCls(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined} aria-invalid={!!errors.name} />
            {errors.name && <p id="name-error" className="text-red-500 text-xs mt-1.5" role="alert">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input id="email" type="email" value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="jane@example.com" className={inputCls(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined} aria-invalid={!!errors.email} />
            {errors.email && <p id="email-error" className="text-red-500 text-xs mt-1.5" role="alert">{errors.email}</p>}
          </div>
        </div>

        {/* Star rating */}
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Overall Rating <span className="text-red-500">*</span>
          </p>
          <StarPicker value={form.rating} onChange={(v) => handleChange('rating', v)} />
          {errors.rating && <p className="text-red-500 text-xs mt-1.5" role="alert">{errors.rating}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea id="message" rows={5} value={form.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="Tell us about your experience with our products and service..."
            className={`${inputCls(errors.message)} resize-none`}
            aria-describedby={errors.message ? 'message-error' : undefined} aria-invalid={!!errors.message} />
          <div className="flex justify-between items-center mt-1.5">
            {errors.message
              ? <p id="message-error" className="text-red-500 text-xs" role="alert">{errors.message}</p>
              : <span />}
            <span className={`text-xs ${form.message.length < 20 ? 'text-gray-400 dark:text-gray-500' : 'text-green-500'}`}>
              {form.message.length} / 20 min
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 -mt-2">
          Your email is used for verification only and won't be displayed publicly.
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm shadow disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          )}
          {submitting ? 'Submitting…' : 'Submit Review'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Changed your mind?{' '}
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Back to Home</Link>
      </p>
    </main>
  );
}
