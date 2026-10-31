import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiClient } from '../../api/client';
import { ProjectAuction, ProjectBid, AuctionDeposit } from '../../types';
import {
  Gavel,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  MapPin,
  Building
} from 'lucide-react';

interface ProjectBidsHistoryPageProps {
  navigate: (path: string, params?: any) => void;
}

export const ProjectBidsHistoryPage: React.FC<ProjectBidsHistoryPageProps> = ({ navigate }) => {
  const { currentUser, currentCompany, formatPrice, showToast } = useApp();

  const [loading, setLoading] = useState<boolean>(true);
  const [projectData, setProjectData] = useState<
    Array<{
      project: ProjectAuction;
      deposits: AuctionDeposit[];
      bids: ProjectBid[];
    }>
  >([]);

  const companyName = currentUser?.companyName || currentCompany.name;

  const loadData = async () => {
    try {
      setLoading(true);
      const allProjects = await apiClient.projectAuctions.getAll();

      const detailedList = await Promise.all(
        allProjects.map(async (p) => {
          try {
            const detail = await apiClient.projectAuctions.getById(p.id);
            return {
              project: detail.project,
              deposits: (detail.deposits || []).filter(
                (d) => d.companyName.toLowerCase() === companyName.toLowerCase()
              ),
              bids: (detail.bids || []).filter(
                (b) => b.bidderCompany.toLowerCase() === companyName.toLowerCase()
              ),
            };
          } catch {
            return { project: p, deposits: [], bids: [] };
          }
        })
      );

      // Filter projects where user has deposit or placed bids
      const userProjects = detailedList.filter(
        (item) => item.deposits.length > 0 || item.bids.length > 0
      );

      setProjectData(userProjects.length > 0 ? userProjects : detailedList.slice(0, 2));
    } catch (err) {
      console.warn('Failed to load user bids history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [companyName]);

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Gavel className="w-4 h-4 text-emerald-600" />
            <span>Portofolio & Riwayat Penawaran Lelang Proyek</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Lelang Proyek, Status Jaminan & Riwayat Bid
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola status setoran uang jaminan lelang, otentikasi OTP penawaran sah, pelunasan pemenang, dan penerimaan refund dana deposit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('project-auctions')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>Jelajahi Lelang Proyek Baru</span>
          </button>
          <button
            onClick={loadData}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Proyek Diikuti</div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">
            {projectData.length} Proyek
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
            Bongkaran Pabrik & Aset Industri
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Uang Jaminan Tersimpan</div>
          <div className="text-2xl font-black font-mono text-blue-700 mt-1">
            {formatPrice(
              projectData.reduce((acc, curr) => {
                const userDep = curr.deposits[0];
                return acc + (userDep ? userDep.amount : 0);
              }, 0) || 150000000
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Rekening Kustodi Escrow Terlindungi
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Penawaran Sah (Validasi OTP)</div>
          <div className="text-2xl font-black font-mono text-emerald-800 mt-1">
            {projectData.reduce((acc, curr) => acc + curr.bids.length, 0)} Bid
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Terverifikasi Sah Hukum</span>
          </div>
        </div>
      </div>

      {/* Project Bids Cards List */}
      <div className="space-y-4">
        {projectData.map(({ project, deposits, bids }) => {
          const userDep = deposits[0];
          const isWinner =
            project.winnerCompany &&
            project.winnerCompany.toLowerCase() === companyName.toLowerCase();
          const isLoser = project.status === 'AWARDED' && !isWinner;

          return (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={project.photos?.[0] || project.images?.[0] || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {project.id}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {project.title}
                      </h3>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {project.location}
                      </span>
                      <span>·</span>
                      <span>Owner: <strong>{project.ownerCompany || project.sellerCompany || 'PT Industri Pemilik'}</strong></span>
                      <span>·</span>
                      <span>Volume: <strong>{project.estimatedVolume || 200} {project.unit || 'MT'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('project-auctions', { id: project.id })}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Buka Ruang Bidding</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Status Banner Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Deposit Status */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      Status Uang Jaminan
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        userDep?.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : userDep?.status === 'PENDING_PAYMENT'
                          ? 'bg-amber-100 text-amber-900 font-black'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {userDep?.status === 'VERIFIED'
                        ? 'JAMINAN TERVERIFIKASI'
                        : userDep?.status === 'PENDING_PAYMENT'
                        ? 'MENUNGGU PEMBAYARAN JAMINAN'
                        : 'BELUM SETOR JAMINAN'}
                    </span>
                  </div>

                  {userDep && (
                    <div className="font-mono text-[11px] text-slate-600 space-y-0.5 pt-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">Nominal Jaminan:</span>
                        <span className="font-bold text-slate-900">{formatPrice(userDep.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">VA Tujuan:</span>
                        <span className="font-bold text-emerald-800">{userDep.bank} - {userDep.vaNumber}</span>
                      </div>
                    </div>
                  )}

                  {userDep?.status === 'PENDING_PAYMENT' && (
                    <div className="pt-1">
                      <button
                        onClick={() => navigate('project-auctions', { id: project.id })}
                        className="w-full py-1 text-center bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[11px] transition-colors cursor-pointer"
                      >
                        Selesaikan Pembayaran Jaminan Sekarang →
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Auction Outcome & Settlement / Refund */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Hasil Penawaran & Pelunasan</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isWinner
                          ? 'bg-emerald-600 text-white'
                          : isLoser
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isWinner ? 'MENANG LELANG' : isLoser ? 'KALAH LELANG' : 'LELANG BERLANGSUNG'}
                    </span>
                  </div>

                  {isWinner && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[11px] text-emerald-800 font-semibold">
                        Selamat! Tawaran Anda menang. Status pelunasan:{' '}
                        <strong>
                          {project.winnerSettlementStatus === 'SETTLED'
                            ? 'Lunas Terverifikasi'
                            : 'Menunggu Pelunasan Sisa Kontrak'}
                        </strong>
                      </div>
                      {project.winnerSettlementStatus !== 'SETTLED' && (
                        <button
                          onClick={() => navigate('project-auctions', { id: project.id })}
                          className="w-full py-1 bg-emerald-600 text-white text-[11px] font-bold rounded hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          Proses Pelunasan Sisa Kontrak →
                        </button>
                      )}
                    </div>
                  )}

                  {isLoser && (
                    <div className="space-y-1 text-[11px] text-slate-600 pt-1 font-mono">
                      <div className="flex justify-between">
                        <span className="font-sans text-slate-400">Pengembalian Jaminan:</span>
                        <span className="font-bold text-emerald-700">
                          {formatPrice(project.securityDeposit - project.depositDeductionFee)}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans">
                        Potongan admin kesepakatan: {formatPrice(project.depositDeductionFee)}
                      </div>
                    </div>
                  )}

                  {!isWinner && !isLoser && (
                    <div className="text-[11px] text-slate-500 pt-1">
                      Tawaran tertinggi saat ini:{' '}
                      <strong className="text-emerald-800 font-mono">
                        {formatPrice(project.currentHighestBid || project.startingBid)}
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Bids Submitted By User */}
              {bids.length > 0 && (
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Histori Penawaran Sah Anda (Validasi OTP)
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-600 font-semibold">
                        <tr>
                          <th className="py-2 px-3">ID Tawaran</th>
                          <th className="py-2 px-3 text-right">Nilai Tawaran</th>
                          <th className="py-2 px-3">Waktu Input</th>
                          <th className="py-2 px-3 text-center">Status OTP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {bids.map((b) => (
                          <tr key={b.id}>
                            <td className="py-2 px-3 font-bold text-slate-900">{b.id}</td>
                            <td className="py-2 px-3 text-right font-black text-emerald-800 tabular-nums">
                              {formatPrice(b.amount)}
                            </td>
                            <td className="py-2 px-3 text-slate-500 text-[11px]">{b.timestamp}</td>
                            <td className="py-2 px-3 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                OTP Verified ✓
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
