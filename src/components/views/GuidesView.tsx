import React from 'react';
import { FileText, ArrowRight, ShieldCheck, Calculator, BookOpen, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PROPERTY_GUIDES } from '../../data/propertyGuides';

export const GuidesView: React.FC = () => {
  const { navigate, openUnitConverterModal, openVerificationModal } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Hazaribagh Property Knowledge Hub
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Real Estate Guides & Jharkhand Land Records
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Comprehensive, lawyer-reviewed advice for home buyers, plot investors, and NRI families investing in Hazaribagh real estate.
        </p>
      </div>

      {/* Quick Tool Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={openUnitConverterModal}
          className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all shadow-xs"
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Calculator size={15} className="text-blue-600" />
              <span>Area Conversion Tool</span>
            </div>
            <p className="text-xs text-slate-500">
              Convert between Decimal, Katha, Sq.ft and Acre instantly according to Hazaribagh measurement standards.
            </p>
          </div>
          <ArrowRight size={18} className="text-slate-400 shrink-0 ml-3" />
        </div>

        <div 
          onClick={openVerificationModal}
          className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all shadow-xs"
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-blue-600" />
              <span>Verification Checklist</span>
            </div>
            <p className="text-xs text-slate-500">
              Understand our 12-point inspection protocol for land title, boundary wall demarcation, and revenue entries.
            </p>
          </div>
          <ArrowRight size={18} className="text-slate-400 shrink-0 ml-3" />
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROPERTY_GUIDES.map((guide) => (
          <article
            key={guide.id}
            onClick={() => navigate(`/property-guides/${guide.slug}`)}
            className="group bg-white rounded-xl border border-slate-200 hover:border-blue-500/50 p-6 space-y-4 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="text-blue-600 font-bold uppercase tracking-wider text-[11px]">{guide.category}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{guide.readTime}</span>
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {guide.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {guide.summary}
              </p>

              {/* Key topics bullets */}
              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                {guide.content?.slice(0, 3).map((item) => (
                  <div key={item.heading} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-blue-600 shrink-0" />
                    <span className="truncate">{item.heading}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Read Full Article</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
