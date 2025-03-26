import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  contact: string;
  isBitsStudent: boolean;
  bitsId: string;
  slotPreference: '12:30 - 2:30 PM' | '3:30 - 5:30 PM' | '';
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    contact: '',
    isBitsStudent: false,
    bitsId: '',
    slotPreference: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [slotsFull, setSlotsFull] = useState<{
    morning: boolean;
    afternoon: boolean;
  }>({ morning: false, afternoon: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/register-art-therapy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit registration');
      }

      if (data.slotsFull) {
        setSlotsFull(data.slotsFull);
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        contact: '',
        isBitsStudent: false,
        bitsId: '',
        slotPreference: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-8 mb-8">
            <img src="https://i.imgur.com/TVrLOZ6.png" alt="Pearl 2025 Logo" className="h-24" />
            <img src="https://i.imgur.com/XvSrYmA.png" alt="BITS Mental Health Support Group Logo" className="h-24" />
            <img src="https://i.imgur.com/TnFzLtR.png" alt="Additional Logo" className="h-24" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Art Therapy Registration</h1>
          <p className="text-lg text-gray-600">Join us for a therapeutic art session during Pearl 2025</p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-green-800 mb-2">Registration Successful!</h2>
            <p className="text-green-700">Thank you for registering. We look forward to seeing you at the session!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="text-red-500 mr-2" size={20} />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name *
              </label>
              <input
                type="text"
                id="name"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email ID *
              </label>
              <input
                type="email"
                id="email"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact">
                Contact Number *
              </label>
              <input
                type="tel"
                id="contact"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Are You a BITS Student? *
              </label>
              <div className="mt-2 space-y-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    required
                    className="form-radio"
                    name="studentType"
                    checked={formData.isBitsStudent}
                    onChange={() => setFormData({ ...formData, isBitsStudent: true })}
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    required
                    className="form-radio"
                    name="studentType"
                    checked={!formData.isBitsStudent}
                    onChange={() => setFormData({ ...formData, isBitsStudent: false, bitsId: '' })}
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            {formData.isBitsStudent && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bitsId">
                  BITS ID Number *
                </label>
                <input
                  type="text"
                  id="bitsId"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.bitsId}
                  onChange={(e) => setFormData({ ...formData, bitsId: e.target.value })}
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Slot Preference *
              </label>
              <div className="mt-4 space-y-6">
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    required
                    className="form-radio"
                    name="slotPreference"
                    value="12:30 - 2:30 PM"
                    disabled={slotsFull.morning}
                    checked={formData.slotPreference === '12:30 - 2:30 PM'}
                    onChange={(e) => setFormData({ ...formData, slotPreference: e.target.value as FormData['slotPreference'] })}
                  />
                  <span className="ml-2 flex-grow">12:30 - 2:30 PM {slotsFull.morning && '(Full)'}</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    required
                    className="form-radio"
                    name="slotPreference"
                    value="3:30 - 5:30 PM"
                    disabled={slotsFull.afternoon}
                    checked={formData.slotPreference === '3:30 - 5:30 PM'}
                    onChange={(e) => setFormData({ ...formData, slotPreference: e.target.value as FormData['slotPreference'] })}
                  />
                  <span className="ml-2 flex-grow">3:30 - 5:30 PM {slotsFull.afternoon && '(Full)'}</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Register Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;