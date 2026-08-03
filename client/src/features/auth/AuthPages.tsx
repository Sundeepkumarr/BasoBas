import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/stores/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['BUYER', 'OWNER']),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/hamro-awas-icon.png" alt="Hamro Awas Icon" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold text-accent-900">Hamro <span className="text-primary-500">Awas</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-accent-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account to continue</p>
        </div>

        <div className="card p-8">
          <div className="mb-6 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  try {
                    await googleLogin(credentialResponse.credential);
                    toast.success('Signed in with Google!');
                    navigate('/');
                  } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Google sign-in failed');
                  }
                }
              }}
              onError={() => {
                toast.error('Google sign-in failed');
              }}
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="px-3 bg-white text-xs text-gray-400">Or continue with email</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input {...register('email')} type="email" className={`input ${errors.email ? 'input-error' : ''}`} placeholder="you@example.com" />
              {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input {...register('password')} type="password" className={`input ${errors.password ? 'input-error' : ''}`} placeholder="••••••••" />
              {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                Remember me
              </label>
              <Link to="/auth/forgot-password" className="text-sm text-primary-500 hover:text-primary-800 font-medium">Forgot password?</Link>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full btn-lg">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link to="/auth/register" className="text-primary-500 font-medium hover:text-primary-800">Create account</Link>
        </p>
      </motion.div>
    </div>
  );
}

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { register: authRegister, googleLogin } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'BUYER' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await authRegister(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      const data = error.response?.data;
      if (data?.errors) {
        // Find the first specific error message to show in the toast
        const firstErrorPath = Object.keys(data.errors)[0];
        const firstErrorMessage = data.errors[firstErrorPath]?.[0];
        toast.error(firstErrorMessage || data.message || 'Validation failed');
      } else {
        toast.error(data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/hamro-awas-icon.png" alt="Hamro Awas Icon" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold text-accent-900">Hamro <span className="text-primary-500">Awas</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-accent-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Join Hamro Awas and find your dream property</p>
        </div>

        <div className="card p-8">
          <div className="mb-6 flex justify-center">
            <GoogleLogin
              text="signup_with"
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  try {
                    await googleLogin(credentialResponse.credential, 'BUYER');
                    toast.success('Account created with Google!');
                    navigate('/');
                  } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Google sign-up failed');
                  }
                }
              }}
              onError={() => {
                toast.error('Google sign-up failed');
              }}
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="px-3 bg-white text-xs text-gray-400">Or register with email</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input {...register('fullName')} type="text" className={`input ${errors.fullName ? 'input-error' : ''}`} placeholder="Your full name" />
              {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input {...register('email')} type="email" className={`input ${errors.email ? 'input-error' : ''}`} placeholder="you@example.com" />
              {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input {...register('password')} type="password" className={`input ${errors.password ? 'input-error' : ''}`} placeholder="Min 8 characters" />
              {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-4">
                {(['BUYER', 'OWNER'] as const).map((role) => (
                  <label key={role} className="relative">
                    <input {...register('role')} type="radio" value={role} className="peer sr-only" />
                    <div className="p-3 rounded-xl border-2 border-gray-200 text-center cursor-pointer peer-checked:border-primary-700 peer-checked:bg-primary-50 transition-all">
                      <span className="text-2xl mb-1 block">{role === 'BUYER' ? '🏠' : '🏗️'}</span>
                      <p className="text-sm font-semibold text-gray-700">{role === 'BUYER' ? 'Buyer / Renter' : 'Property Owner'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full btn-lg">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/auth/login" className="text-primary-500 font-medium hover:text-primary-800">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/hamro-awas-icon.png" alt="Hamro Awas Icon" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold text-accent-900">Hamro <span className="text-primary-500">Awas</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-accent-900">Reset your password</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your email and we'll send you a reset link</p>
        </div>

        <div className="card p-8">
          {submitted ? (
            <div className="text-center py-6">
              <span className="text-5xl mb-4 block">📧</span>
              <h3 className="text-lg font-semibold text-accent-900 mb-2">Check your email</h3>
              <p className="text-sm text-gray-500 mb-6">If an account exists with that email, we've sent password reset instructions.</p>
              <Link to="/auth/login" className="btn-primary">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="input" placeholder="you@example.com" required />
              </div>
              <button type="submit" className="btn-primary w-full btn-lg">Send Reset Link</button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password? <Link to="/auth/login" className="text-primary-500 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
