import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Eye, 
  Layers, 
  Building2, 
  Search, 
  Check, 
  X,
  FileCheck,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, Lead } from '../../types/property';
import { formatIndianPrice } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const { 
    properties, 
    leads, 
    updatePropertyVerification, 
    updateLeadStatus, 
    navigate, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verification' | 'all_listings' | 'site_visits' | 'leads'>('verification');
  const [inspectionNoteInput, setInspectionNoteInput] = useState<Record<string, string>>({});

  const pendingProperties = properties.filter(p => p.listingStatus === 'pending_verification' || p.verificationStatus === 'unverified');
  const siteVisits = leads.filter(l => l.leadType === 'site_visit');
  const directInquiries = leads.filter(l => l.leadType === 'inquiry');

  const handleApproveVerified = (propId: string) => {
    const notes = inspectionNoteInput[propId] || 'RS Khatiyan and Jharbhoomi records physically verified. Road width and plot demarcation inspected on-site by Hazaribagh team.';
    updatePropertyVerification(propId, 'verified', notes);
  };

  const handleApproveStandard = (propId: string) => {
    updatePropertyVerification(propId, 'unverified', 'Approved for public listing without physical document verification seal.');
  };

  const handleReject = (propId: string) => {
    updatePropertyVerification(propId, 'rejected', 'Documentation mismatch or duplicate listing.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 text-blue-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={13} />
              <span>Admin Desk</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Verification & Ops Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review land records, verify Khatiyan / mutation status, manage buyer visit logistics, and approve properties.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-900">
            {pendingProperties.length} Pending Review
          </div>
          <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-900">
            {properties.filter(p => p.verificationStatus === 'verified').length} Verified Live
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-max flex-wrap">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'verification' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Verification Queue ({pendingProperties.length})
        </button>
        <button
          onClick={() => setActiveTab('site_visits')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'site_visits' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Site Visits ({siteVisits.length})
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'leads' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Buyer Inquiries ({directInquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('all_listings')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'all_listings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Listings ({properties.length})
        </button>
      </div>

      {/* TAB 1: Verification Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Pending Verification Queue
              </h2>
              <p className="text-xs text-slate-500">
                Verify Khatiyan copies, mutation receipts, and on-site road widths before issuing the Verified Badge.
              </p>
            </div>

            {pendingProperties.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
                <div className="text-sm font-bold text-slate-800">Queue is Clear</div>
                <p className="text-xs text-slate-500">All submitted properties have been reviewed.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingProperties.map((prop) => (
                  <div key={prop.id} className="p-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={prop.images[0]?.url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=80'}
                          alt=""
                          className="w-20 h-20 rounded-lg object-cover shrink-0 border border-slate-100"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                              {prop.listingStatus}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">ID: {prop.listingId}</span>
                          </div>

                          <h3 
                            onClick={() => navigate(`/property/${prop.slug}`)}
                            className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                          >
                            {prop.title}
                          </h3>

                          <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                            <span>📍 {prop.locality}, Hazaribagh</span>
                            <span>•</span>
                            <span>Price: <strong>{formatIndianPrice(prop.price, prop.purpose)}</strong></span>
                            <span>•</span>
                            <span>Listed by: <strong>{prop.sellerName} ({prop.contactPhone})</strong></span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/property/${prop.slug}`)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md self-start cursor-pointer"
                      >
                        Preview Listing Page
                      </button>
                    </div>

                    {/* Revenue Details Summary Box */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Khatiyan Type</span>
                        <span className="font-semibold text-slate-900">{prop.khatiyanType || 'RS Khatiyan'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Mutation Status</span>
                        <span className="font-semibold text-slate-900">{prop.mutationStatus || 'Up-to-date'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Khata / Plot No.</span>
                        <span className="font-semibold text-slate-900">Khata {prop.khataNumber || 'N/A'} • Plot {prop.plotNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Road & Demarcation</span>
                        <span className="font-semibold text-slate-900">{prop.roadWidthFt || 20} ft • {prop.boundaryWall ? 'Boundary Built' : 'Open'}</span>
                      </div>
                    </div>

                    {/* Admin Verification Input & Actions */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                        Inspection Summary Note (Will be saved with verification record)
                      </label>
                      <input
                        type="text"
                        value={inspectionNoteInput[prop.id] || ''}
                        onChange={(e) => setInspectionNoteInput({ ...inspectionNoteInput, [prop.id]: e.target.value })}
                        placeholder="e.g. RS Khatiyan matches Anchal revenue register; 20ft road frontage verified in Matwari."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <button
                          onClick={() => handleApproveVerified(prop.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <ShieldCheck size={14} />
                          <span>Approve & Mark Verified</span>
                        </button>

                        <button
                          onClick={() => handleApproveStandard(prop.id)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check size={14} />
                          <span>Approve Standard (Unverified)</span>
                        </button>

                        <button
                          onClick={() => handleReject(prop.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <X size={14} />
                          <span>Reject Listing</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Site Visits Logistics CRM */}
      {activeTab === 'site_visits' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Assisted Site Visits Schedule ({siteVisits.length})
            </h2>
            <p className="text-xs text-slate-500">
              Assign local field executives to accompany buyers to property locations in Hazaribagh.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {siteVisits.map((visit) => (
              <div key={visit.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      visit.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : visit.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : visit.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {visit.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      Requested: {new Date(visit.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-900">
                    Buyer: {visit.userName} • <span className="font-semibold text-blue-600">{visit.userPhone}</span>
                  </div>

                  <div className="text-xs text-slate-600">
                    Property: <strong className="text-slate-900">{visit.propertyTitle}</strong>
                  </div>

                  <div className="text-xs text-blue-900 font-bold flex items-center gap-1.5 pt-0.5">
                    <Calendar size={13} />
                    <span>Slot: {visit.preferredDate} ({visit.preferredTimeSlot})</span>
                  </div>
                </div>

                {/* Status Changer Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => updateLeadStatus(visit.id, 'confirmed')}
                    className="px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-md text-xs font-semibold cursor-pointer"
                  >
                    Confirm Visit
                  </button>
                  <button
                    onClick={() => updateLeadStatus(visit.id, 'completed')}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-md text-xs font-semibold cursor-pointer"
                  >
                    Mark Escorted / Completed
                  </button>
                  <button
                    onClick={() => updateLeadStatus(visit.id, 'cancelled')}
                    className="px-3 py-1.5 bg-rose-50 text-rose-800 hover:bg-rose-100 rounded-md text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <a
                    href={`tel:${visit.userPhone}`}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold flex items-center gap-1"
                  >
                    <Phone size={12} />
                    <span>Call Buyer</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Buyer Inquiries CRM */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Direct Buyer Inquiries ({directInquiries.length})
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {directInquiries.map((inq) => (
              <div key={inq.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {inq.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-900">
                    {inq.userName} ({inq.userPhone})
                  </div>

                  <div className="text-xs text-slate-600">
                    Regarding: <strong>{inq.propertyTitle}</strong>
                  </div>

                  {inq.message && (
                    <p className="text-xs text-slate-500 italic">
                      "{inq.message}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/91${inq.userPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${inq.userPhone}`}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Phone size={13} />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: All Listings Overview */}
      {activeTab === 'all_listings' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Complete Property Database ({properties.length})
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {properties.map((prop) => (
              <div key={prop.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={prop.images[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80'}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        prop.listingStatus === 'live' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {prop.listingStatus}
                      </span>
                      {prop.verificationStatus === 'verified' && (
                        <span className="bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                          Verified
                        </span>
                      )}
                    </div>
                    <h3 
                      onClick={() => navigate(`/property/${prop.slug}`)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                    >
                      {prop.title}
                    </h3>
                    <div className="text-xs text-slate-500">
                      {prop.locality} • {formatIndianPrice(prop.price, prop.purpose)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/property/${prop.slug}`)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
