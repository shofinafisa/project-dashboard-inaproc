"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Silakan masukkan email dan kata sandi Anda.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || "Login gagal. Periksa kembali kredensial Anda.");
      return;
    }

    // Role detected automatically!
    if (result.role === "admin") {
      toast({
        title: "Login Berhasil (Administrator)",
        description: "Selamat datang kembali, Administrator. Mengalihkan ke konsol manajemen...",
        type: "success",
      });
      router.push("/admin");
    } else {
      toast({
        title: "Login Berhasil (Standard User)",
        description: "Selamat datang kembali. Mengalihkan ke dashboard analitik...",
        type: "success",
      });
      router.push("/dashboard");
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative overflow-hidden">
      {/* Decorative enterprise background ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/25 mb-1">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            DataPulse Enterprise
          </h1>
          <p className="text-xs text-slate-400">
            Unified Login &bull; Otomatisasi Deteksi Role &bull; Dynamic Feature Flags
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-lg font-bold text-white">
              Satu Pintu Masuk (Unified Login)
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Masuk menggunakan akun Anda. Sistem otomatis mengenali hak akses (Admin / User) tanpa memerlukan seleksi role manual.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-0 space-y-5">
            {errorMessage && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Alamat Email Perusahaan
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="nama@dashboard.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 bg-slate-800/70 border-slate-700 text-white placeholder:text-slate-500 text-sm focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-9 bg-slate-800/70 border-slate-700 text-white placeholder:text-slate-500 text-sm focus:border-blue-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 gap-2 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Hak Akses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Credentials Pill Bar */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-slate-300">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  Kredensial Demo Cepat:
                </span>
                <span className="text-[10px] text-slate-500">(Klik untuk autofill)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Admin button autofill */}
                <button
                  type="button"
                  onClick={() => handleFillDemo("admin@dashboard.com", "admin123")}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-700/80 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Akun Admin</p>
                      <p className="text-[10px] text-slate-400 font-mono">admin@dashboard.com</p>
                    </div>
                  </div>
                </button>

                {/* User button autofill */}
                <button
                  type="button"
                  onClick={() => handleFillDemo("user@dashboard.com", "user123")}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-700/80 bg-slate-800/50 hover:bg-slate-800 hover:border-emerald-500/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Akun User</p>
                      <p className="text-[10px] text-slate-400 font-mono">user@dashboard.com</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="text-[11px] text-center text-slate-500 pt-1">
                Password default: <code className="text-slate-300 font-mono px-1 py-0.5 rounded bg-slate-800">admin123</code> / <code className="text-slate-300 font-mono px-1 py-0.5 rounded bg-slate-800">user123</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
