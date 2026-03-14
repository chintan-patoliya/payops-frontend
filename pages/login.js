import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { ERROR_MESSAGES, UI_TEXT, DEMO_CREDENTIALS } from '../constants/messages';

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/payouts');
    }
  }, [user, loading, router]);

  const validateEmail = (email) => {
    if (!email) {
      return ERROR_MESSAGES.EMAIL_REQUIRED;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ERROR_MESSAGES.EMAIL_INVALID;
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return ERROR_MESSAGES.PASSWORD_REQUIRED;
    }
    if (password.length < 3) {
      return ERROR_MESSAGES.PASSWORD_MIN_LENGTH;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');

    // Validate fields
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    if (emailErr || passwordErr) {
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      return;
    }

    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      const errorMsg = err.response?.data?.message || ERROR_MESSAGES.INVALID_CREDENTIALS;
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader text="" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {submitting && <Loader fullScreen text="Signing in..." />}

      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600">{UI_TEXT.LOGIN_TITLE}</h1>
          <p className="mt-2 text-sm text-gray-500">{UI_TEXT.LOGIN_SUBTITLE}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              onBlur={() => setEmailError(validateEmail(email))}
              className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-sm ${
                emailError
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              placeholder={DEMO_CREDENTIALS.OPS.email}
              title={UI_TEXT.TOOLTIP_EMAIL}
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-600">{emailError}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                onBlur={() => setPasswordError(validatePassword(password))}
                className={`block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-sm ${
                  passwordError
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="Enter password"
                title={UI_TEXT.TOOLTIP_PASSWORD}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1 text-xs text-red-600">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={UI_TEXT.TOOLTIP_SIGN_IN}
          >
            {submitting ? UI_TEXT.LOGIN_SIGNING_IN : UI_TEXT.LOGIN_BUTTON}
          </button>
        </form>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-500 mb-2">Demo Credentials:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>OPS:</strong> {DEMO_CREDENTIALS.OPS.email} / {DEMO_CREDENTIALS.OPS.password}</p>
            <p><strong>FINANCE:</strong> {DEMO_CREDENTIALS.FINANCE.email} / {DEMO_CREDENTIALS.FINANCE.password}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
