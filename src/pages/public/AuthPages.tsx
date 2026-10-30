import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../data/mockData';
import {
  ShieldCheck,
  Building2,
  Store,
  Shield,
  CheckCircle2,
  UploadCloud,
  FileText,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Lock,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Sparkles,
  ChevronRight,
  User
} from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'register' | 'verification';
  navigate: (path: string, params?: any) => void;
}

export const AuthPages: React.FC<AuthPageProps> = ({ mode: initialMode, navigate }) => {
  const { setUserRole, kycProgress, updateKycProgress, currentCompany, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    initialMode === 'register' ? 'register' : 'login'
  );

  // Login form state
  const [selectedLoginRole, setSelectedLoginRole] = useState<'buyer' | 'seller' | 'admin'>('seller');
  const [loginEmail, setLoginEmail] = useState('sales@nusantarametalindo.co.id');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');

  // Register form state: ONLY 2 ROLES: 'seller' (Pengepul/Depo - Default) and 'buyer' (Pabrik/Smelter)
  const [registerRole, setRegisterRole] = useState<'seller' | 'buyer'>('seller');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState(''); // Only required for Pabrik (buyer)
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [factoryCategory, setFactoryCategory] = useState('Pabrik Peleburan / Smelter Baja');
  const [password, setPassword] = useState('••••••••••••');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Quick Google Sign-In / Sign-Up Simulator
  const handleGoogleAuth = () => {
    // Default registration/login is Pengepul/Depo (seller) as requested
    const targetRole = activeTab === 'register' ? registerRole : 'seller';
    setUserRole(targetRole);
    showToast('Berhasil masuk dengan akun Google! Selamat datang di Scrava.');
    navigate('dashboard-overview');
  };

  const handleRoleSelectChange = (role: 'buyer' | 'seller' | 'admin') => {
    setSelectedLoginRole(role);
    if (role === 'buyer') {
      setLoginEmail('procurement@cilegonsteel.co.id');
    } else if (role === 'seller') {
      setLoginEmail('sales@nusantarametalindo.co.id');
    } else {
      setLoginEmail('admin.ops@scrava.com');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(selectedLoginRole);
    if (selectedLoginRole === 'admin') {
      showToast('Berhasil masuk sebagai Administrator Operasional Scrava');
      navigate('admin-overview');
    } else if (selectedLoginRole === 'buyer') {
      showToast('Berhasil masuk sebagai Pabrik / Smelter (PT Cilegon Precision Steel)');
      navigate('dashboard-overview');
    } else {
      showToast('Berhasil masuk sebagai Depo / Pengepul Scrap (PT Nusantara Metalindo)');
      navigate('dashboard-overview');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast('Harap setujui Syarat & Ketentuan serta Protokol Escrow.');
      return;
    }

    if (registerRole === 'buyer' && !companyName.trim()) {
      showToast('Harap isi Nama Resmi Perusahaan (PT/CV) untuk akun Pabrik.');
      return;
    }

    setUserRole(registerRole);
    if (registerRole === 'seller') {
      showToast(`Pendaftaran Depo/Pengepul berhasil! Selamat datang, ${fullName || 'Rekan Depo'}.`);
    } else {
      showToast(`Pendaftaran Pabrik/Smelter berhasil! Akun ${companyName || 'Pabrik'} siap bertransaksi.`);
    }
    navigate('dashboard-overview');
  };

  // If in Verification (KYC) mode
  if (initialMode === 'verification') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 font-sans">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verifikasi Legalitas Bisnis (KYC)</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Status entitas perusahaan terverifikasi membuka akses penawaran tanpa batas, kontrak pembelian resmi, dan pencairan escrow otomatis.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Status: Terverifikasi Tier 1</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Dokumen Legalitas Perusahaan
              </h3>

              <div className="p-4 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg text-center cursor-pointer bg-slate-50 transition-colors">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-800">Unggah Nomor Induk Berusaha (NIB) / IUI / Izin Usaha</div>
                <div className="text-[10px] text-slate-500 mt-1">PDF, PNG, JPG maksimal 25MB</div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg text-center cursor-pointer bg-slate-50 transition-colors">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-800">Unggah NPWP Perusahaan / SPKP / Bukti Pajak</div>
                <div className="text-[10px] text-slate-500 mt-1">Dokumen resmi tervalidasi Ditjen Pajak</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Kredensial Terverifikasi Saat Ini
              </h3>

              <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Nama Perusahaan:</span>
                  <span className="font-semibold text-slate-900">{currentCompany.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Negara:</span>
                  <span className="font-semibold text-slate-900">{currentCompany.country}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">NPWP / Tax ID:</span>
                  <span className="font-mono font-semibold text-slate-900">{currentCompany.taxId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Rekening Bank Escrow:</span>
                  <span className="font-semibold text-slate-900">{currentCompany.bankAccount}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Status Legalitas:</span>
                  <span className="font-semibold text-emerald-700">Level 6 Lengkap (Akses Penuh Escrow & Tonase Besar)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={() => showToast('Dokumen pembaruan berhasil dikirim ke petugas kepatuhan hukum.')}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-xs cursor-pointer"
            >
              Kirim Dokumen Terbaru
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xs font-sans">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg mb-2.5 shadow-xs">
            S
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-xl font-black tracking-tight text-slate-900">Scrava</span>
          </div>
          <p className="text-xs font-medium text-slate-500">
            Bursa Bahan Baku & Scrap Industri
          </p>
        </div>

        {/* Tab Switcher: Masuk vs Daftar */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Masuk ke Akun
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Quick Google / Gmail 1-Click Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full py-2.5 px-4 mb-5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer group"
        >
          {/* Google 4-color G icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>
            {activeTab === 'login' ? 'Masuk dengan Google' : 'Daftar Cepat dengan Google'}
          </span>
        </button>

        <div className="relative flex py-1 items-center mb-5">
          <div className="grow border-t border-slate-200"></div>
          <span className="shrink mx-3 text-[11px] text-slate-400 font-medium">atau dengan email</span>
          <div className="grow border-t border-slate-200"></div>
        </div>

        {/* 1. LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Quick Demo Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Masuk Cepat Sebagai:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleSelectChange('seller')}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedLoginRole === 'seller'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-500/20 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px]">Pengepul</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelectChange('buyer')}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedLoginRole === 'buyer'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-500/20 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px]">Pabrik</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelectChange('admin')}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedLoginRole === 'admin'
                      ? 'bg-slate-900 border-slate-900 text-white font-bold ring-2 ring-slate-800/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px]">Admin</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-hidden bg-slate-50/50"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Kata Sandi</label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Tautan atur ulang kata sandi telah dikirim ke email demo.');
                  }}
                  className="text-[11px] text-emerald-700 hover:underline"
                >
                  Lupa sandi?
                </a>
              </div>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-hidden bg-slate-50/50"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              Masuk ke Akun
            </button>
          </form>
        )}

        {/* 2. SIMPLIFIED REGISTER FORM (Only 2 Roles: Pengepul [Default] & Pabrik) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* 2 Roles Selector Only */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Saya mendaftar sebagai:
                </label>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Pengepul (Default)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Penjual (Pengepul / Depo) - Default */}
                <button
                  type="button"
                  onClick={() => setRegisterRole('seller')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    registerRole === 'seller'
                      ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-slate-900">Penjual (Pengepul)</span>
                    <Store className={`w-3.5 h-3.5 ${registerRole === 'seller' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Depo scrap & lapak rongsok
                  </div>
                </button>

                {/* 2. Pembeli (Pabrik / Smelter) */}
                <button
                  type="button"
                  onClick={() => setRegisterRole('buyer')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    registerRole === 'buyer'
                      ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-slate-900">Pembeli (Pabrik)</span>
                    <Building2 className={`w-3.5 h-3.5 ${registerRole === 'buyer' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Smelter & manufaktur
                  </div>
                </button>
              </div>

              {/* Quick Helper Note */}
              <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {registerRole === 'seller'
                    ? 'Pendaftaran kilat Pengepul: Hanya butuh Nama, Email & WhatsApp. Anda bisa langsung pasang stok scrap.'
                    : 'Pabrik diwajibkan melengkapi Nama PT/CV untuk penerbitan faktur pajak & verifikasi timbangan metrologi.'}
                </span>
              </div>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {registerRole === 'buyer' ? 'Nama Lengkap Penanggung Jawab / PIC *' : 'Nama Lengkap *'}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={registerRole === 'buyer' ? 'cth. Ir. Hendra Wijaya' : 'cth. Hendra Wijaya'}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-hidden bg-slate-50/50"
                required
              />
            </div>

            {/* Nama Perusahaan (HANYA DITAMPILKAN & WAJIB DIISI JIKA DAFTAR SEBAGAI PABRIK) */}
            {registerRole === 'buyer' && (
              <div className="animate-in fade-in duration-150 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Resmi Perusahaan (PT/CV) *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="cth. PT Cilegon Precision Steel"
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-hidden bg-slate-50/50 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Usaha Pabrik
                  </label>
                  <select
                    value={factoryCategory}
                    onChange={(e) => setFactoryCategory(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-hidden bg-slate-50/50"
                  >
                    <option value="Pabrik Peleburan / Smelter Baja">Pabrik Peleburan / Smelter Baja</option>
                    <option value="Smelter Tembaga & Non-Ferrous">Smelter Tembaga & Non-Ferrous</option>
                    <option value="Pengecoran Logam / Foundry">Pengecoran Logam / Foundry</option>
                    <option value="Manufaktur & Fabrikasi Komponen">Manufaktur & Fabrikasi Komponen</option>
                    <option value="Pabrik Daur Ulang Plastik / Kertas">Pabrik Daur Ulang Plastik / Kertas</option>
                  </select>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {registerRole === 'buyer' ? 'Email Perusahaan *' : 'Alamat Email *'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={registerRole === 'buyer' ? 'pengadaan@perusahaan.co.id' : 'hendra.depo@gmail.com'}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-hidden bg-slate-50/50"
                required
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {registerRole === 'buyer' ? 'Nomor Telepon / WhatsApp Kantor *' : 'Nomor WhatsApp Aktif *'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-3456-7890"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-hidden bg-slate-50/50"
                required
              />
            </div>

            {/* Kata Sandi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-hidden bg-slate-50/50"
                required
              />
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 text-emerald-600 rounded cursor-pointer"
                />
                <span>
                  Saya menyetujui <strong>Syarat & Ketentuan</strong>, <strong>Jaminan Escrow</strong>, serta <strong>Kebijakan Privasi Scrava</strong>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{registerRole === 'buyer' ? 'Daftar Akun Pabrik' : 'Daftar Akun Pengepul Gratis'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500">
          Dilindungi oleh Jaminan Rekber Escrow & Metrologi Legal Indonesia
        </div>
      </div>
    </div>
  );
};
