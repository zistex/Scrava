import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UpgradeToFactoryModal } from '../../components/common/UpgradeToFactoryModal';
import {
  LayoutDashboard,
  Store,
  PlusCircle,
  Package,
  MessageSquare,
  Building2,
  ShieldCheck,
  Wallet,
  Sparkles,
  LogOut,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface DashboardLayoutProps {
  currentPath: string;
  navigate: (path: string, params?: any) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentPath, navigate, children }) => {
  const {
    userRole,
    setUserRole,
    currentUser,
    isBuyerVerified,
    orders,
    negotiations,
    showToast,
  } = useApp();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const activeOrdersCount = orders.filter((o) => o.status !== 'COMPLETED').length;
  const pendingNegCount = negotiations.filter((n) => n.status === 'Countered' || n.status === 'Pending').length;

  const handleLogout = () => {
    setUserRole('public');
    showToast('Berhasil keluar dari akun. Sampai jumpa kembali!');
    navigate('home');
  };

  interface CustomerMenuItem {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    desc: string;
    badge?: string;
    badgeColor?: string;
  }

  // Unified Customer Navigation Menu (Penjual & Pembeli)
  const customerMenuItems: CustomerMenuItem[] = [
    {
      label: 'Ringkasan Dashboard',
      path: 'dashboard-overview',
      icon: LayoutDashboard,
      desc: 'Ringkasan penjualan, pembelian & saldo',
    },
    {
      label: 'Beli Scrap',
      path: 'dashboard-marketplace',
      icon: Store,
      desc: 'Cari scrap & beli bahan baku industri',
    },
    {
      label: 'Iklan & Stok Saya (Jual)',
      path: 'dashboard-listings',
      icon: Package,
      desc: 'Kelola harga (Rp) & tonase stok scrap Anda',
    },
    {
      label: 'Upload Iklan Jual Baru',
      path: 'dashboard-create-listing',
      icon: PlusCircle,
      desc: 'Pasang iklan scrap / material baru',
    },
    {
      label: 'Semua Transaksi & Pesanan',
      path: 'dashboard-orders',
      icon: Package,
      badge: activeOrdersCount > 0 ? String(activeOrdersCount) : undefined,
      desc: 'Pesanan jual & beli, surat jalan & timbangan',
    },
    {
      label: 'Tawaran & Negosiasi',
      path: 'dashboard-bids-nego',
      icon: MessageSquare,
      badge: pendingNegCount > 0 ? String(pendingNegCount) : undefined,
      desc: 'Negosiasi harga & histori bid lelang',
    },
    {
      label: 'Kebutuhan Pabrik (RFQ)',
      path: 'dashboard-create-rfq',
      icon: Sparkles,
      desc: 'Tender pasokan bahan baku pabrik',
    },
    {
      label: 'Saldo & Dompet Escrow',
      path: 'dashboard-wallet',
      icon: Wallet,
      desc: 'Saldo penjualan, deposit & mutasi (Rp)',
    },
    {
      label: 'Legalitas Pembeli',
      path: 'dashboard-verification',
      icon: ShieldCheck,
      desc: 'NIB, NPWP & izin industri pembeli',
    },
    {
      label: 'Profil Perusahaan',
      path: 'dashboard-company',
      icon: Building2,
      desc: 'Profil depo & data legalitas entitas',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Main Workspace: Left Drawer (Sidebar) + Content Canvas */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Left Drawer / Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs sticky top-20">
            {/* Account Status Pill / Card */}
            <div className="p-2.5 mb-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 pb-1.5 border-b border-slate-200/80">
                <span>Status Akun Customer</span>
                <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                  2-in-1
                </span>
              </div>
              <div className="pt-1.5 space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Akses Jual (Depo):</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aktif
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Akses Beli (Pabrik):</span>
                  {isBuyerVerified ? (
                    <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terverifikasi
                    </span>
                  ) : (
                    <span className="font-bold text-amber-700 flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3 text-amber-600" /> Belum Legal
                    </span>
                  )}
                </div>
              </div>

              {!isBuyerVerified && (
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(true)}
                  className="mt-2 w-full py-1 px-2 text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded transition-colors flex items-center justify-center gap-1"
                >
                  <span>Lengkapi Legalitas Pembeli</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 mb-2">
              Menu Customer (Jual & Beli)
            </div>

            <div className="space-y-1">
              {customerMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentPath === item.path ||
                  (item.path === 'dashboard-orders' && currentPath === 'dashboard-order-detail') ||
                  (item.path === 'dashboard-marketplace' &&
                    (currentPath === 'checkout' ||
                      currentPath === 'listing-detail' ||
                      currentPath === 'dashboard-checkout'));

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.path === 'dashboard-create-rfq' && !isBuyerVerified) {
                        setShowVerificationModal(true);
                        return;
                      }
                      navigate(item.path);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors text-left ${
                      isActive
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          item.badgeColor
                            ? item.badgeColor
                            : isActive
                            ? 'bg-emerald-500 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Logout Button in Left Drawer */}
            <div className="mt-3 pt-3 border-t border-slate-100 px-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Left Drawer Modal */}
        {mobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-4 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="text-xs font-bold text-slate-900">
                    Menu Customer (Jual & Beli)
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 text-slate-500 hover:text-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {customerMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          if (item.path === 'dashboard-create-rfq' && !isBuyerVerified) {
                            setShowVerificationModal(true);
                            setMobileDrawerOpen(false);
                            return;
                          }
                          navigate(item.path);
                          setMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-left ${
                          isActive
                            ? 'bg-slate-900 text-white font-bold'
                            : 'text-slate-700 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            </div>

            <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0">
          {/* Mobile Horizontal Submenu Navigation */}
          <div className="lg:hidden mb-4 overflow-x-auto pb-1 flex items-center gap-2 no-scrollbar">
            {customerMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (item.path === 'dashboard-orders' && currentPath === 'dashboard-order-detail');

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.path === 'dashboard-create-rfq' && !isBuyerVerified) {
                      setShowVerificationModal(true);
                      return;
                    }
                    navigate(item.path);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {children}
        </main>
      </div>

      {/* Verification Modal for quick completion */}
      <UpgradeToFactoryModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        reasonMessage="Akun Anda berstatus Penjual (Depo Scrap). Untuk melakukan pembelian atau membuka tender pengadaan pabrik (RFQ), lengkapi NIB & NPWP perusahaan di bawah ini."
      />
    </div>
  );
};
