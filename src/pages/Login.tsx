// Login.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Building2, Mail, Lock, LogIn, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Zod schema for form validation
const loginSchema = z.object({
  tenantCode: z.string().min(1, 'Tenant code is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      tenantCode: 'acme',
      email: 'admin@example.com',
      password: 'admin123',
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password, data.tenantCode);
      if (success) {
        toast({
          title: 'Login Successful',
          description: 'Welcome back! Redirecting you to the dashboard.',
        });
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid credentials or tenant code. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'An Unexpected Error Occurred',
        description: 'Please check the console or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 xl:grid-cols-5">
      {/* ===== Left Panel (Image with Text Overlay) ===== */}
      <div className="hidden lg:block relative xl:col-span-3">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=1920&auto=format&fit=crop"
          alt="A modern office setting with people collaborating"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />

        {/* Text Content */}
        <div className="relative flex flex-col justify-end h-full p-12">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Streamline Your HR Processes
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Your all-in-one platform for modern human resource management.
          </p>
        </div>
      </div>

      {/* ===== Right Panel (Login Form) ===== */}
      <div className="flex flex-col justify-between p-6 sm:p-10 bg-white h-screen lg:col-span-1 xl:col-span-2">
        {/* Top section for Logo/Title */}
        <div className="text-left font-bold text-xl text-slate-800">
          HRMS Portal
        </div>
        
        {/* Middle section for Form */}
        <div className="w-full max-w-md mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back!</h1>
            <p className="text-slate-500 mt-2">Enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            {/* All form inputs are compacted with space-y-4 */}
            <div className="space-y-2">
              <Label htmlFor="tenantCode">Tenant Code</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input id="tenantCode" type="text" placeholder="e.g., acme-corp" className={`pl-10 ${errors.tenantCode ? 'border-red-500 focus-visible:ring-red-500' : ''}`} {...register('tenantCode')} />
              </div>
              {errors.tenantCode && <p className="text-sm text-red-600">{errors.tenantCode.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input id="email" type="email" placeholder="name@company.com" className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`} {...register('email')} />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input id="password" type="password" placeholder="••••••••" className={`pl-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`} {...register('password')} />
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing In...</>) : (<><LogIn className="mr-2 h-4 w-4" />Sign In</>)}
            </Button>
          </form>
          
          <Alert variant="default" className="bg-blue-50 border-blue-200 mt-6">
             <Info className="h-5 w-5 text-blue-600" />
             <AlertTitle className="font-semibold text-blue-800">Demo Account</AlertTitle>
             <AlertDescription className="text-blue-700">
              <strong>Tenant:</strong> acme, <strong>Email:</strong> admin@example.com, <strong>Password:</strong> admin123
             </AlertDescription>
          </Alert>
        </div>
        
        {/* Bottom section for Footer */}
        <p className="text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} HRMS Portal. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;