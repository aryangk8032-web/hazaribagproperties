import React from 'react';
import { ChevronRight, Clock, Calendar, ArrowLeft, ShieldCheck, Share2, Calculator, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PROPERTY_GUIDES } from '../../data/propertyGuides';

interface GuideDetailViewProps {
  slug: string;
}

export const GuideDetailView: React.FC<GuideDetailViewProps> = ({ slug }) => {
  const { navigate, openUnitConverterModal, showToast } = useApp();

  const guide = PROPERTY_GUIDES.find(g => g.slug === slug) || PROPERTY_GUIDES[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Guide link copied to clipboard', 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <button onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">Home</button>
        <ChevronRight size={13} className="text-slate-400" />
        <button onClick={() => navigate('/property-guides')} className="hover:text-blue-600 cursor-pointer">Property Guides</button>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="text-slate-900 font-bold truncate max-w-[200px]">{guide.title}</span>
      </nav>

      {/* Article Header */}
      <div className="space-y-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-0.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
            {guide.category}
          </span>
          <span className="text-slate-400">•</span>
          <span className="flex items-center gap-1 text-slate-500 font-medium">
            <Clock size={13} />
            {guide.readTime}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 font-medium">
            Updated {guide.publishedAt}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
          {guide.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
          {guide.summary}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500">
            By <strong className="text-slate-900">{guide.author}</strong>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <Share2 size={13} />
            <span>Share Guide</span>
          </button>
        </div>
      </div>

      {/* Article Content Body */}
      <div className="space-y-8 text-slate-800">
        {guide.content?.map((sec, idx) => (
          <section key={sec.heading} className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-baseline gap-2">
              <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                0{idx + 1}
              </span>
              <span>{sec.heading}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {sec.text}
            </p>

            {sec.points && sec.points.length > 0 && (
              <ul className="space-y-1.5 pl-2 pt-1 text-xs sm:text-sm text-slate-700">
                {sec.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-blue-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}

            {sec.callout && (
              <div className="p-3.5 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-950 font-medium">
                💡 <strong>Important Note:</strong> {sec.callout}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Disclaimer Callout */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <AlertTriangle size={15} className="text-amber-600" />
          <span>Legal Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          The information contained in this guide is intended purely for general public awareness and educational reference regarding real estate procedures in Hazaribagh & Jharkhand. Property laws, circle rates, and mutation guidelines are subject to government notifications. Prospective buyers must seek verified legal opinion from an advocate registered with the Jharkhand Bar Council before finalizing transactions.
        </p>
      </div>

      {/* Footer Navigation Back to Guides */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => navigate('/property-guides')}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to All Property Guides</span>
        </button>

        <button
          onClick={() => navigate('/properties')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
        >
          Explore Verified Properties
        </button>
      </div>
    </div>
  );
};
