import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Package,
  TrendingUp,
  DollarSign,
  Gavel,
  MessageSquare,
  Scale,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface DashboardOverviewProps {
  navigate: (path: string, params?: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ navigate }) => {
  const { currentCompany, userRole, setUserRole, orders, negotiations, listings, formatPrice, showToast } = useApp();

  const isSeller = userRole === 'seller';
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeCompanyName, setUpgradeCompanyName] = useState('PT Cilegon Precision Steel');
  const [upgradeCategory, setUpgradeCategory] = useState('Pabrik Peleburan / Smelter Baja');
  const [upgradeAddress, setUpgradeAddress] = useState('Kawasan Industri Krakatau Steel, Cilegon, Banten');

  const handleUpgradeToFactory = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole('buyer');
    setUpgradeModalOpen(false);
    showToast(`Selamat! Akun Anda berhasil ditingkatkan menjadi Akun Pabrik (${upgradeCompanyName}).`);
  };

  const totalValue = orders.reduce((acc, curr) => acc + curr.totalOriginalValue, 0);
  const activeOrders = orders.filter((o) => o.status !== 'COMPLETED');
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');

  return (
    <div className="space-y-6 font-sans">
      {/* Upgrade Banner for Pengepul */}
      {isSeller && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Akun Pengepul Aktif
              </span>
              <span className="text-xs text-slate-300">Ingin membeli scrap skala besar untuk pabrik?</span>
            </div>
            <h3 className="text-sm font-bold text-white">Upgrade ke Akun Pabrik / Smelter Resmi</h3>
            <p className="text-xs text-slate-300">
              Lengkapi nama PT/CV dan izin pabrik Anda untuk membuka fitur pembuatan Tender Pabrik (RFQ), lelang pembelian partai besar, dan penerbitan faktur pajak.
            </p>
          </div>
          <button
            onClick={() => setUpgradeModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs shrink-0"
          >
            Lengkapi Data & Upgrade ke Pabrik →
          </button>
        </div>
      )}

      {/* Upgrade to Factory Modal */}
      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-xs text-slate-700 space-y-4 shadow-xl">
            <div>
              <h3 className="text-base font-bold text-slate-900">Lengkapi Data Perusahaan Pabrik</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pabrik / smelter membutuhkan legalitas perusahaan (PT/CV) untuk penerbitan Purchase Order & kontrak timbangan.
              </p>
            </div>

            <form onSubmit={handleUpgradeToFactory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Nama Resmi Perusahaan (PT/CV) *</label>
                <input
                  type="text"
                  value={upgradeCompanyName}
                  onChange={(e) => setUpgradeCompanyName(e.target.value)}
                  placeholder="cth. PT Cilegon Precision Steel"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-hidden bg-slate-50/50 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Kategori Usaha Pabrik</label>
                <select
                  value={upgradeCategory}
                  onChange={(e) => setUpgradeCategory(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-hidden bg-slate-50/50"
                >
                  <option value="Pabrik Peleburan / Smelter Baja">Pabrik Peleburan / Smelter Baja</option>
                  <option value="Smelter Tembaga & Non-Ferrous">Smelter Tembaga & Non-Ferrous</option>
                  <option value="Pengecoran Logam / Foundry">Pengecoran Logam / Foundry</option>
                  <option value="Manufaktur & Fabrikasi Komponen">Manufaktur & Fabrikasi Komponen</option>
                  <option value="Pabrik Daur Ulang Plastik / Kertas">Pabrik Daur Ulang Plastik / Kertas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Lokasi Pabrik & Gerbang Jembatan Timbang *</label>
                <input
                  type="text"
                  value={upgradeAddress}
                  onChange={(e) => setUpgradeAddress(e.target.value)}
                  placeholder="Alamat gerbang timbangan pabrik"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-hidden bg-slate-50/50"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUpgradeModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                >
                  Simpan & Jadikan Akun Pabrik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Konsol Perdagangan Industri</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Selamat Datang, {currentCompany.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Akun perusahaan terverifikasi resmi · {currentCompany.businessType} · {currentCompany.country}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSeller ? (
            <button
              onClick={() => navigate('dashboard-create-listing')}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              + Pasang Iklan Material Baru
            </button>
          ) : (
            <button
              onClick={() => navigate('dashboard-create-rfq')}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              + Buat Kebutuhan Pabrik (RFQ)
            </button>
          )}
          <button
            onClick={() => navigate('marketplace')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Lihat Katalog Bursa
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 flex items-center justify-between font-medium">
            <span>{isSeller ? 'Total Penjualan' : 'Total Nilai Pengadaan'}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black font-mono text-slate-900 mt-2 tabular-nums">
            {formatPrice(totalValue)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>100% Rekonsiliasi Escrow</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 flex items-center justify-between font-medium">
            <span>Pesanan Sedang Berjalan</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black font-mono text-slate-900 mt-2 tabular-nums">
            {activeOrders.length} Pesanan
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Proses angkutan / jembatan timbang
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 flex items-center justify-between font-medium">
            <span>Negosiasi Aktif</span>
            <MessageSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black font-mono text-slate-900 mt-2 tabular-nums">
            {negotiations.length} Room Nego
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Tawar-menawar harga langsung
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 flex items-center justify-between font-medium">
            <span>Transaksi Selesai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black font-mono text-slate-900 mt-2 tabular-nums">
            {completedOrders.length + 14} Transaksi
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
            100% Selesai Timbang Terima
          </div>
        </div>
      </div>

      {/* Active Orders Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Transaksi Berjalan & Pelacakan Logistik
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pelacakan status pembayaran escrow, surat jalan angkutan, penimbangan jembatan, dan rekonsiliasi pencairan
            </p>
          </div>
          <button
            onClick={() => navigate('dashboard-orders')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Lihat Semua Pesanan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">No. Order / Kontrak</th>
                <th className="py-2.5 px-3">Lot Material</th>
                <th className="py-2.5 px-3">Mitra Transaksi</th>
                <th className="py-2.5 px-3">Volume</th>
                <th className="py-2.5 px-3 text-right">Nilai Kontrak</th>
                <th className="py-2.5 px-3">Status Saat Ini</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {o.orderNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 truncate max-w-[200px]">{o.productTitle}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Ketentuan: {o.incoterm}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-800 font-semibold">
                      {isSeller ? o.buyerCompany : o.sellerCompany}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isSeller ? o.buyerCountry : o.sellerCountry}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-800 font-bold">
                    {o.quantity} {o.unit}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                    {formatPrice(o.totalOriginalValue)}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={o.status} type="order" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => navigate('dashboard-order-detail', { id: o.id })}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    >
                      Buka Timeline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Column Lower Grid: Negotiations & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Negotiations */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Negosiasi Terkini
            </h3>
            <button
              onClick={() => navigate('dashboard-negotiations')}
              className="text-xs text-emerald-700 font-semibold hover:underline"
            >
              Buka Ruang Obrolan →
            </button>
          </div>

          <div className="space-y-3">
            {negotiations.map((n) => (
              <div
                key={n.id}
                onClick={() => navigate('dashboard-negotiations')}
                className="p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 truncate max-w-xs">{n.productTitle}</div>
                  <div className="text-slate-500 mt-0.5">
                    Rekan: <strong>{n.sellerCompany}</strong> · {n.messages.length} pesan
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-slate-900 tabular-nums">
                    {formatPrice(n.currentOfferPrice, n.unit)}
                  </div>
                  <StatusBadge status={n.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Status Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Status Kepatuhan & Legalitas Usaha
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Akses Penuh Tier 1
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Entitas bisnis Anda <strong>{currentCompany.name}</strong> memegang sertifikasi Tier 1 aktif. Anda memiliki otorisasi penuh untuk transaksi kuota besar, rekonsiliasi timbangan otomatis, dan pencairan rekening bersama.
            </p>

            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">NPWP / Tax ID:</span>
                <span className="text-slate-800 font-bold">{currentCompany.taxId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rekening Kustodi:</span>
                <span className="text-slate-800 font-bold">{currentCompany.bankAccount}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={() => navigate('dashboard-verification')}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Lihat Dokumen Legalitas (KYC)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
