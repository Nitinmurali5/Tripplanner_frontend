import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Plane, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const name = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-st-primary">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-st-charcoal/5 p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-st-secondary mb-6 text-st-accent">
            <Plane className="h-10 w-10 rotate-45" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-st-charcoal leading-none">Join Elite</h2>
          <p className="mt-4 text-st-charcoal/50 text-[10px] uppercase font-black tracking-widest">Begin your journey with the world's finest</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/60 mb-2 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-st-charcoal/30" />
              </div>
              <input
                type="text"
                name="fullName"
                required
                disabled={loading}
                className="pl-14 block w-full bg-st-secondary border-none rounded-2xl py-4 focus:ring-2 focus:ring-st-accent text-st-charcoal placeholder-st-charcoal/20 transition-all font-medium disabled:opacity-50"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/60 mb-2 ml-1">Email Identifier</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-st-charcoal/30" />
              </div>
              <input
                type="email"
                name="email"
                required
                disabled={loading}
                className="pl-14 block w-full bg-st-secondary border-none rounded-2xl py-4 focus:ring-2 focus:ring-st-accent text-st-charcoal placeholder-st-charcoal/20 transition-all font-medium disabled:opacity-50"
                placeholder="you@domain.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/60 mb-2 ml-1">Privacy Code</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-st-charcoal/30" />
              </div>
              <input
                type="password"
                name="password"
                required
                disabled={loading}
                className="pl-14 block w-full bg-st-secondary border-none rounded-2xl py-4 focus:ring-2 focus:ring-st-accent text-st-charcoal placeholder-st-charcoal/20 transition-all font-medium disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 py-4 bg-st-charcoal hover:bg-st-accent text-st-primary hover:text-st-charcoal rounded-2xl text-[10px] uppercase font-black tracking-[0.3em] transition-all duration-500 shadow-lg shadow-st-charcoal/10 disabled:opacity-70 group"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-st-primary group-hover:text-st-charcoal" /> : 'Create Identity'}
          </button>
        </form>

        <div className="mt-10 text-center text-[10px] uppercase font-black tracking-widest text-st-charcoal/40">
          Already have an account?{' '}
          <Link to="/login" className="text-st-accent hover:border-b-2 border-st-accent pb-1 transition-all">
            Access Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
