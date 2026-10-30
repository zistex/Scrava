import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_BIDS } from '../../data/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { UpgradeToFactoryModal } from '../../components/common/UpgradeToFactoryModal';
import {
  Gavel,
  Clock,
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  FileText,
  DollarSign,
  ChevronRight,
  Info
} from 'lucide-react';

interface AuctionDetailProps {
  id?: string;
  navigate: (path: string, params?: any) => void;
}

export const AuctionDetailPage: React.FC<AuctionDetailProps> = ({ id, navigate }) => {
  const { auctions, listings, formatPrice, placeBid, userRole, isBuyerVerified, showToast } = useApp();

  const auction = auctions.find((a) => a.id === id) || auctions[0] || listings[1];

  const currentBidAmount = auction.currentBid || auction.minAskingPrice || 1000;
  const increment = auction.bidIncrement || 50;
  const minRequiredBid = currentBidAmount + increment;

  const [bidInput, setBidInput] = useState<number>(minRequiredBid);
  const [bidsHistory, setBidsHistory] = useState(MOCK_BIDS.filter((b) => b.listingId === auction.id || true));
  const [showLegalityModal, setShowLegalityModal] = useState(false);

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === 'public') {
      showToast('Silakan masuk untuk mengikuti lelang resmi.');
      navigate('login');
      return;
    }

    if (!isBuyerVerified) {
      setShowLegalityModal(true);
      return;
    }

    const res = placeBid(auction.id, bidInput);
    if (res.success) {
      const newHistoryItem = {
        id: `BID-${Date.now().toString().slice(-4)}`,
        listingId: auction.id,
        bidderCompany: 'PT Cilegon Precision Steel',
        bidderCountry: 'Indonesia',
        amount: bidInput,
        timestamp: 'Baru saja',
        status: 'WINNING' as const,
      };
      setBidsHistory([newHistoryItem, ...bidsHistory.map((b) => ({ ...b, status: 'OUTBID' as const }))]);
      setBidInput(bidInput + increment);
      showToast(`Tawaran lelang sebesar ${formatPrice(bidInput, auction.unit)} berhasil dipasang!`);
    } else {
      showToast(res.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Top Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('auctions')}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Lelang Kilat</span>
        </button>
        <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
          <span>Sesi Lelang Aktif Berlangsung</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Image, Lot Specs, Documents */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-16/10 bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 relative shadow-xs">
            <img
              src={auction.photos[0]}
              alt={auction.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2.5 py-1 text-xs font-black text-slate-950 bg-amber-400 rounded-lg flex items-center gap-1 shadow-xs">
                <Gavel className="w-3.5 h-3.5" />
                LELANG
              </span>
              <StatusBadge status={auction.condition} />
            </div>
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-xs text-white p-3.5 rounded-xl border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Sisa Waktu Penutupan</div>
                  <div className="text-sm font-bold font-mono text-amber-400">
                    {auction.closingCountdown || '01 Hari 05 Jam 23 Menit'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Total Tonase Lot</div>
                <div className="text-xs font-mono font-bold text-white">
                  {auction.quantity} {auction.unit}
                </div>
              </div>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 mb-2">{auction.title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lot lelang industri bersertifikat resmi. Setiap tawaran yang dipasang mengikat dan dijamin oleh sistem rekening bersama escrow Scrava. Pengiriman dilakukan sesuai ketentuan <strong>{auction.incoterm}</strong>.
            </p>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-6 mb-3">
              Spesifikasi Teknis Lot
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-500">Kategori Material:</span>
                <span className="font-bold text-slate-800 ml-2">{auction.category}</span>
              </div>
              <div>
                <span className="text-slate-500">Kondisi Fisik:</span>
                <span className="font-bold text-slate-800 ml-2">{auction.condition}</span>
              </div>
              <div>
                <span className="text-slate-500">Depo Asal:</span>
                <span className="font-bold text-slate-800 ml-2">{auction.location.city}, {auction.location.country}</span>
              </div>
              <div>
                <span className="text-slate-500">Syarat Pengiriman:</span>
                <span className="font-mono font-bold text-slate-800 ml-2">{auction.incoterm}</span>
              </div>
            </div>
          </div>

          {/* Bidding History Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Riwayat Penawaran ({bidsHistory.length} Bid)</h3>
              <span className="text-xs text-slate-400 font-mono">Audit Transaksi Transparan</span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Perusahaan Penawar</th>
                    <th className="py-2.5 px-3">Asal Kota</th>
                    <th className="py-2.5 px-3 text-right">Nilai Tawaran</th>
                    <th className="py-2.5 px-3">Waktu</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bidsHistory.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{b.bidderCompany}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{b.bidderCountry}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatPrice(b.amount, auction.unit)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px] font-mono">{b.timestamp}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'WINNING'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {b.status === 'WINNING' ? 'MEMIMPIN' : 'TERLAMPAUI'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Bidding Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Panel Pasang Tawaran Lelang
              </span>
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                TERBUKA
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Tawaran Tertinggi Saat Ini</div>
                <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                  {formatPrice(currentBidAmount)}
                </div>
                <div className="text-[11px] text-slate-500">per {auction.unit}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Harga Buka Minimum</div>
                <div className="text-sm font-bold text-slate-700 font-mono tabular-nums">
                  {formatPrice(auction.minAskingPrice || currentBidAmount)}
                </div>
                <div className="text-[11px] text-slate-400">Kelipatan: +{formatPrice(increment)}</div>
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Komitmen Tonase Lot:</span>
                <span className="font-mono font-bold text-slate-900">
                  {auction.quantity} {auction.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimasi Total Nilai:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {formatPrice(currentBidAmount * auction.quantity)}
                </span>
              </div>
            </div>

            {/* Bid Placement Form */}
            <form onSubmit={handlePlaceBid} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Masukkan Nilai Tawaran Anda ({auction.unit})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">Rp</span>
                  <input
                    type="number"
                    value={bidInput}
                    min={minRequiredBid}
                    step={increment}
                    onChange={(e) => setBidInput(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-sm border-2 border-slate-300 focus:border-amber-500 rounded-lg font-mono font-bold text-slate-900"
                    required
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Tawaran minimal berikutnya: <strong>{formatPrice(minRequiredBid)}</strong></span>
                  <button
                    type="button"
                    onClick={() => setBidInput(minRequiredBid)}
                    className="text-amber-700 font-bold hover:underline"
                  >
                    Set Minimum
                  </button>
                </div>
              </div>

              {/* Quick Increment Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[minRequiredBid, minRequiredBid + increment * 2, minRequiredBid + increment * 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBidInput(val)}
                    className="py-1.5 text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-800 transition-colors"
                  >
                    +{formatPrice(val - currentBidAmount)}
                  </button>
                ))}
              </div>

              {!isBuyerVerified && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Akses Penjual (Default):</span>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Untuk memasang tawaran lelang dan memenangkan lot scrap, Anda wajib melengkapi legalitas dokumen pembeli (NIB & NPWP).
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowLegalityModal(true)}
                      className="mt-1.5 text-xs font-bold text-amber-900 underline hover:text-amber-950"
                    >
                      Lengkapi Legalitas Sekarang &rarr;
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-xs uppercase tracking-wide flex items-center justify-center gap-1.5"
              >
                <Gavel className="w-4 h-4" />
                <span>Pasang Tawaran Lelang</span>
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Ingin negosiasi langsung tanpa lelang?</span>
              <button
                onClick={() => navigate('dashboard-negotiations')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Kirim Penawaran Privat
              </button>
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Penyelenggara Lelang (Depo Penjual)
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">
                🏭
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{auction.seller.companyName}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </h4>
                <div className="text-xs text-slate-500">{auction.seller.country} · {auction.seller.completedTx} transaksi sukses</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpgradeToFactoryModal
        isOpen={showLegalityModal}
        onClose={() => setShowLegalityModal(false)}
        reasonMessage="Default akun Customer adalah Penjual (Depo Scrap). Untuk memasang tawaran di lelang resmi ini, silakan lengkapi nomor NIB & NPWP pabrik/perusahaan Anda."
      />
    </div>
  );
};
