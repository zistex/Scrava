import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  ShieldCheck,
  Leaf,
  Layers,
  Award,
  Download,
  X,
  QrCode,
  Share2
} from 'lucide-react';
import { Listing } from '../../types';

interface MaterialPassportModalProps {
  listing: Listing;
  onClose: () => void;
}

export const MaterialPassportModal: React.FC<MaterialPassportModalProps> = ({ listing, onClose }) => {
  const { showToast } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 bg-emerald-950 text-white flex items-start justify-between border-b border-emerald-900">
          <div>
            <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Leaf className="w-4 h-4" />
              <span>Paspor Sirkularitas & Jejak Karbon Scrava</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {listing.title}
            </h3>
            <p className="text-xs text-emerald-200/80 font-mono mt-0.5">
              ID Paspor: TRZ-PASSPORT-{listing.id}-2026
            </p>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passport Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[70vh] overflow-y-auto">
          {/* Circularity Highlights */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-[10px] text-emerald-800 uppercase font-semibold">Skor Sirkularitas</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-700 mt-0.5">96 / 100</div>
              <div className="text-[10px] text-emerald-600 mt-0.5">100% Scrap Daur Ulang</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-[10px] text-emerald-800 uppercase font-semibold">Reduksi Emisi CO₂</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-700 mt-0.5">
                {(listing.quantity * 1.67).toFixed(1)} MT
              </div>
              <div className="text-[10px] text-emerald-600 mt-0.5">vs. Peleburan Bijih Tambang</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Uji Bebas Radiasi</div>
              <div className="text-base font-bold text-emerald-700 mt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Nol Kontaminasi</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Di bawah ambang 0.2 μSv/h</div>
            </div>
          </div>

          {/* Metallurgical Assay Specs */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Uji Spektrometer & Sifat Fisik Material
            </div>
            <dl className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-500">Kode Standar ISRI:</dt>
                <dd className="font-bold text-slate-900">{listing.specs['ISRI Code'] || 'ISRI 200'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-500">Kemurnian Logam:</dt>
                <dd className="font-bold text-emerald-700">99.2% Sesuai Standar Mutu</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-500">Ketebalan Fisik:</dt>
                <dd className="font-bold text-slate-900">{listing.specs['Thickness'] || 'Min 6mm'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-500">Kotoran / Terak Non-Logam:</dt>
                <dd className="font-bold text-slate-900">&lt; 0.8% Berat Kering</dd>
              </div>
            </dl>
          </div>

          {/* Provenance & Chain History */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Asal Usul & Rantai Pasok Material
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
              Sumber: Potongan surplus manufaktur otomotif dan pembongkaran mesin berat berizin di Jawa Barat. Telah disortir bersih sesuai pedoman kelestarian lingkungan ISO 14001.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Memenuhi Syarat Sertifikasi ESG Industri</span>
          <button
            onClick={() => showToast('Mengekspor Sertifikat Paspor Sirkularitas ESG (PDF)...')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Paspor ESG (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
