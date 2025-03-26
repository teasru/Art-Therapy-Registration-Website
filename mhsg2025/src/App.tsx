import React, { useState } from 'react';

function App() {
  const [isBitsStudent, setIsBitsStudent] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch('https://formspree.io/f/moveloqw', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus('success');
        e.currentTarget.reset();
        setIsBitsStudent(false);
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Logos */}
        <div className="flex justify-center items-center gap-8 mb-8">
          <img src="https://i.imgur.com/TVrLOZ6.png" alt="Logo 1" className="h-20 object-contain" />
          <img src="https://i.imgur.com/XvSrYmA.png" alt="Logo 2" className="h-20 object-contain" />
          <img src="https://i.imgur.com/TnFzLtR.png" alt="Logo 3" className="h-20 object-contain" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Art Therapy Registration - Pearl 2025
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg shadow-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number *</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email ID *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">BITS Student? *</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="isBitsStudent"
                  value="yes"
                  required
                  onChange={() => setIsBitsStudent(true)}
                  className="form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="isBitsStudent"
                  value="no"
                  required
                  onChange={() => setIsBitsStudent(false)}
                  className="form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          {isBitsStudent && (
            <div>
              <label htmlFor="bitsId" className="block text-sm font-medium text-gray-700">BITS ID Number *</label>
              <input
                type="text"
                id="bitsId"
                name="bitsId"
                required={isBitsStudent}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="slot" className="block text-sm font-medium text-gray-700">Slot Preference *</label>
            <select
              id="slot"
              name="slot"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a slot</option>
              <option value="12:30-2:30">12:30 - 2:30 pm</option>
              <option value="3:30-5:30">3:30 - 5:30 pm</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={formStatus === 'submitting'}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {formStatus === 'submitting' ? 'Submitting...' : 'Register'}
          </button>

          {formStatus === 'success' && (
            <p className="text-green-600 text-center">Registration successful!</p>
          )}
          {formStatus === 'error' && (
            <p className="text-red-600 text-center">Something went wrong. Please try again.</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;