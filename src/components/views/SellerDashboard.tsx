import React from 'react';
import { 
  Building2, 
  PlusCircle, 
  Eye, 
  Calendar, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatIndianPrice } from '../../utils/formatters';

export const SellerDashboard: React.FC = () => {
  const { properties, leads, navigate, userName, userPhone } = useApp();

  // For prototype, show all properties or seller properties
  const myProperties = properties;
  const myLeads = leads;

  const liveCount = myProperties.filter(p => p.listingStatus === 'live').length;
  const pendingCount = myProperties.filter(p => p.listingStatus === 'pending_verification').length;
  const visitsCount = myLeads.filter(l => l.leadType === 'site_visit').length;
  const inquiriesCount = myLeads.filter(l => l.leadType === 'inquiry').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Seller & Owner Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Welcome back, {userName || 'Property Owner'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your Hazaribagh properties, track verification status, and respond to buyer inquiries.
          </p>
        </div>

        <button
          onClick={() => navigate('/list-property')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm shadow-blue-500/20 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle size={16} />
          <span>List New Property</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Live Properties
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {liveCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            Actively visible to buyers
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Under Verification
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600">
            {pendingCount}
          </div>
          <div className="text-[11px] text-amber-600 font-medium">
            Document review in progress
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Site Visits Requested
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {visitsCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Assisted buyer visits
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Direct Inquiries
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {inquiriesCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            WhatsApp / phone leads
          </div>
        </div>
      </div>

      {/* Main Tabs: My Properties & Leads CRM */}
      <div className="space-y-6">
        {/* Section 1: My Properties List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                My Listed Properties ({myProperties.length})
              </h2>
              <p className="text-xs text-slate-500">
                Track live views, verification seal, and pricing
              </p>
            </div>
            <button
              onClick={() => navigate('/list-property')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>+ Add Another</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {myProperties.map((prop) => (
              <div key={prop.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <img
                    src={prop.images[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80'}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-100"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        prop.listingStatus === 'live'
                          ? 'bg-emerald-100 text-emerald-800'
                          : prop.listingStatus === 'pending_verification'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {prop.listingStatus.replace('_', ' ')}
                      </span>

                      {prop.verificationStatus === 'verified' && (
                        <span className="bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                          <ShieldCheck size={11} className="text-emerald-400" />
                          <span>Title Verified</span>
                        </span>
                      )}
                    </div>

                    <h3 
                      onClick={() => navigate(`/property/${prop.slug}`)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {prop.title}
                    </h3>

                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{prop.locality}, Hazaribagh</span>
                      <span>•</span>
                      <strong className="text-slate-900">{formatIndianPrice(prop.price, prop.purpose)}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => navigate(`/property/${prop.slug}`)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>View Public Page</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Recent Leads & Scheduled Visits */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Buyer Inquiries & Site Visit Requests ({myLeads.length})
            </h2>
            <p className="text-xs text-slate-500">
              Direct inquiries submitted for your listed properties
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {myLeads.map((lead) => (
              <div key={lead.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      lead.leadType === 'site_visit' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {lead.leadType === 'site_visit' ? 'Site Visit Request' : 'Direct Inquiry'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-900">
                    {lead.userName} • <span className="font-medium text-slate-600">{lead.userPhone}</span>
                  </div>

                  <div className="text-xs text-slate-600">
                    Property: <strong className="text-slate-800">{lead.propertyTitle}</strong>
                  </div>

                  {lead.preferredDate && (
                    <div className="text-xs text-blue-900 font-medium flex items-center gap-1">
                      <Calendar size={13} />
                      <span>Preferred Slot: {lead.preferredDate} ({lead.preferredTimeSlot})</span>
                    </div>
                  )}

                  {lead.message && (
                    <p className="text-xs text-slate-500 italic">
                      "{lead.message}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <a
                    href={`https://wa.me/91${lead.userPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${lead.userPhone}`}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Phone size={13} />
                    <span>Call Buyer</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
