"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
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
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingRole, setLoadingRole] = useState<"admin" | "user" | null>(null);

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

    // Role detected automatically
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

  // 1-Click Autofill & Realtime Connect
  const handleQuickLogin = async (targetRole: "admin" | "user") => {
    const targetEmail = targetRole === "admin" ? "admin@dashboard.com" : "user@dashboard.com";
    const targetPass = targetRole === "admin" ? "admin123" : "user123";

    // 1. Autofill inputs realtime
    setEmail(targetEmail);
    setPassword(targetPass);
    setErrorMessage("");
    setLoadingRole(targetRole);
    setIsSubmitting(true);

    // 2. Authenticate
    const result = await login(targetEmail, targetPass);
    setIsSubmitting(false);

    if (!result.success) {
      setLoadingRole(null);
      setErrorMessage(result.error || "Login gagal.");
      return;
    }

    // 3. Connect realtime to dashboard
    if (result.role === "admin") {
      toast({
        title: "Login Berhasil (Administrator)",
        description: "Menghubungkan langsung ke konsol manajemen...",
        type: "success",
      });
      router.push("/admin");
    } else {
      toast({
        title: "Login Berhasil (Standard User)",
        description: "Menghubungkan langsung ke dashboard analitik...",
        type: "success",
      });
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Decorative subtle blue radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Simplified Header: 1 main title and 1-line subtitle */}
        <div className="text-center mb-6 space-y-1.5">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/15 border border-blue-500/20 shadow-inner mb-1 text-blue-400">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            DataPulse Enterprise
          </h1>
          <p className="text-sm text-slate-400">
            Masuk ke akun Anda untuk mengakses dashboard analitik.
          </p>
        </div>

        {/* Card Form with Glassmorphism */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl max-w-md w-full space-y-6">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="nama@dashboard.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-sm transition-all"
                />
              </div>
            </div>

            {/* Password Field with Peek/Hide */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {isSubmitting && !loadingRole ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Login */}
          <div className="pt-5 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Pilihan Akun Demo
              </span>
              <span className="text-[11px] text-slate-500">Klik untuk masuk instan</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Admin Card */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleQuickLogin("admin")}
                className="relative overflow-hidden rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-slate-900/90 p-3.5 text-left transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/25 text-blue-400 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/30 transition-all duration-300 shrink-0">
                    {loadingRole === "admin" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white group-hover:text-blue-200 transition-colors">
                      Akun Admin
                    </p>
                    <p className="text-[10px] text-blue-400/90 font-medium flex items-center gap-0.5 mt-0.5">
                      {loadingRole === "admin" ? (
                        "Menghubungkan..."
                      ) : (
                        <>
                          <span>Masuk Instan</span>
                          <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </button>

              {/* User Card */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleQuickLogin("user")}
                className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-900/90 p-3.5 text-left transition-all duration-300 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-emerald-500/30 transition-all duration-300 shrink-0">
                    {loadingRole === "user" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white group-hover:text-emerald-200 transition-colors">
                      Akun User
                    </p>
                    <p className="text-[10px] text-emerald-400/90 font-medium flex items-center gap-0.5 mt-0.5">
                      {loadingRole === "user" ? (
                        "Menghubungkan..."
                      ) : (
                        <>
                          <span>Masuk Instan</span>
                          <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
