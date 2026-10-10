import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  Sprout, 
  FileText, 
  MessageSquare, 
  Layers, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { FarmerDirectoryRecord } from '../types';

interface FarmersDirectoryViewProps {
  farmers: FarmerDirectoryRecord[];
  onSelectFarmerQuery?: (farmerName: string) => void;
  onBackToDashboard: () => void;
}

export const FarmersDirectoryView: React.FC<FarmersDirectoryViewProps> = ({
  farmers,
  onSelectFarmerQuery,
  onBackToDashboard
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');

  const filtered = farmers.filter((f) => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.taluk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.mainCrop.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = districtFilter === 'all' || f.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-800 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-white/20">
              <Users className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black tracking-tight">
              Registered Farmers Registry
            </h3>
          </div>
          <p className="text-xs text-teal-100 font-medium mt-1">
            Active farming holdings across 5 Karnataka Agro-Climatic Zones
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition cursor-pointer"
        >
          Back
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search farmer name, taluk, or crop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
            District:
          </span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer"
          >
            <option value="all">All 5 Districts</option>
            <option value="Belagavi">Belagavi</option>
            <option value="Raichur">Raichur</option>
            <option value="Dakshina Kannada">Dakshina Kannada</option>
            <option value="Udupi">Udupi</option>
            <option value="Shivamogga">Shivamogga</option>
          </select>
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((farmer) => (
          <div
            key={farmer.id}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                    {farmer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {farmer.name}
                    </h4>
                    <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{farmer.taluk}, {farmer.district}</span>
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                  {farmer.acreage}
                </span>
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Primary Crop</span>
                  <span className="font-bold text-slate-800 truncate block">{farmer.mainCrop}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Soil Type</span>
                  <span className="font-bold text-slate-800 truncate block">{farmer.soilType}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <a
                href={`tel:${farmer.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{farmer.phone}</span>
              </a>

              <span className="text-[10px] font-medium text-slate-400">
                {farmer.queriesSent} inquiries logged
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
