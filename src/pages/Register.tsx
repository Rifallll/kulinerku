import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Calculate password strength
    const calculatePasswordStrength = (pass: string) => {
        let strength = 0;
        if (pass.length >= 6) strength++;
        if (pass.length >= 10) strength++;
        if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
        if (/\d/.test(pass)) strength++;
        if (/[^a-zA-Z0-9]/.test(pass)) strength++;
        return Math.min(strength, 4);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: 'Password Tidak Cocok',
                description: 'Password dan konfirmasi password harus sama',
                variant: 'destructive',
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: 'Password Terlalu Pendek',
                description: 'Password minimal 6 karakter',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        const { error } = await signUp(email, password, 'member');

        if (error) {
            if (error.message.includes('already registered')) {
                toast({
                    title: 'Email Sudah Terdaftar',
                    description: 'Silakan gunakan email lain atau login',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Pendaftaran Gagal',
                    description: error.message || 'Terjadi kesalahan',
                    variant: 'destructive',
                });
            }
        } else {
            toast({
                title: 'Pendaftaran Berhasil! 🎉',
                description: 'Silakan cek email Anda untuk verifikasi',
            });
            navigate('/login');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
            {/* Animated Background Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-orange-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-rose-300/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Floating Food Icons */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-20 text-6xl opacity-10 animate-bounce">🍱</div>
                <div className="absolute top-1/3 left-32 text-5xl opacity-10 animate-bounce" style={{ animationDelay: '0.5s' }}>🍚</div>
                <div className="absolute bottom-40 right-1/4 text-7xl opacity-10 animate-bounce" style={{ animationDelay: '1s' }}>🥟</div>
                <div className="absolute bottom-24 left-24 text-6xl opacity-10 animate-bounce" style={{ animationDelay: '1.5s' }}>🍢</div>
            </div>

            <Card className="w-full max-w-md backdrop-blur-xl bg-white/90 shadow-2xl border-white/40 relative z-10 animate-in slide-in-from-bottom-8 fade-in duration-700">
                <CardHeader className="space-y-1 text-center animate-in slide-in-from-top-4 fade-in duration-500 delay-150">
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                            <UserPlus className="h-16 w-16 text-primary relative z-10 animate-in zoom-in duration-500 delay-300" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent animate-in slide-in-from-left-4 duration-500 delay-200">
                        Daftar Akun Baru
                    </CardTitle>
                    <CardDescription className="text-center animate-in fade-in duration-500 delay-300">
                        Buat akun untuk menikmati fitur lengkap
                    </CardDescription>
                </CardHeader>
                <CardContent className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-400">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2 group">
                            <Label htmlFor="email" className="text-sm font-medium group-hover:text-primary transition-colors">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2 group">
                            <Label htmlFor="password" className="text-sm font-medium group-hover:text-primary transition-colors">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minimal 6 karakter"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordStrength(calculatePasswordStrength(e.target.value));
                                    }}
                                    required
                                    disabled={loading}
                                    className="pr-10 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary hover:scale-110 transition-all duration-200"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4 transition-transform hover:rotate-12" /> : <Eye className="h-4 w-4 transition-transform hover:rotate-12" />}
                                </button>
                            </div>

                            {/* Password Strength Meter */}
                            {password && (
                                <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className="flex gap-1 h-1">
                                        {[...Array(4)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`flex-1 rounded-full transition-all duration-300 ${i < passwordStrength
                                                    ? passwordStrength === 1
                                                        ? 'bg-red-500'
                                                        : passwordStrength === 2
                                                            ? 'bg-orange-500'
                                                            : passwordStrength === 3
                                                                ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                    : 'bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs ${passwordStrength === 1 ? 'text-red-500' :
                                        passwordStrength === 2 ? 'text-orange-500' :
                                            passwordStrength === 3 ? 'text-yellow-600' :
                                                'text-green-600'
                                        }`}>
                                        {passwordStrength === 0 ? 'Terlalu lemah' :
                                            passwordStrength === 1 ? '😐 Lemah' :
                                                passwordStrength === 2 ? '🙂 Sedang' :
                                                    passwordStrength === 3 ? '😊 Kuat' :
                                                        '🔥 Sangat Kuat!'}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2 group">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium group-hover:text-primary transition-colors">Konfirmasi Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Ketik ulang password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="pr-10 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary hover:scale-110 transition-all duration-200"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4 transition-transform hover:rotate-12" /> : <Eye className="h-4 w-4 transition-transform hover:rotate-12" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Mendaftar...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Daftar Sekarang
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">Atau lanjutkan dengan</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md group"
                        onClick={async () => {
                            const { error } = await signInWithGoogle();
                            if (error) {
                                toast({
                                    title: 'Login Gagal',
                                    description: error.message,
                                    variant: 'destructive',
                                });
                            }
                        }}
                        disabled={loading}
                    >
                        <svg className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Masuk dengan Google
                    </Button>

                    <div className="mt-4 text-center text-sm">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Masuk di sini
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
