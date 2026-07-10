import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Lock, 
  Database, 
  RefreshCw, 
  Download, 
  Trash2,
  Check
} from "lucide-react";
import { SUPABASE_SQL_SCHEMA } from "../supabase";

interface OrganizerPortalProps {
  showOrganizer: boolean;
  setShowOrganizer: (val: boolean) => void;
  organizerPasscode: string;
  setOrganizerPasscode: (val: string) => void;
  isOrganizerAuthed: boolean;
  handleOrganizerAuth: (e: React.FormEvent) => void;
  organizerError: string;
  rsvpsList: any[];
  adminPhotosList: any[];
  handleAdminDeleteRsvp: (id: string) => void;
  handleAdminDeletePhoto: (id: string) => void;
  currentBackend: "firebase" | "supabase";
  setCurrentBackend: (val: "firebase" | "supabase") => void;
  isSupabaseActive: boolean;
  supabaseUrl: string;
  setSupabaseUrl: (val: string) => void;
  supabaseAnonKey: string;
  setSupabaseAnonKey: (val: string) => void;
  handleSaveSupabaseSettings: (e: React.FormEvent) => void;
  supabaseTestLoading: boolean;
  supabaseStatusMsg: string;
  clearSupabaseCredentials: () => void;
  setIsSupabaseActive: (val: boolean) => void;
  handleSyncAllData: () => void;
  supabaseSyncing: boolean;
  supabaseSyncError: string;
  supabaseSyncSuccess: string;
  showSqlSchema: boolean;
  setShowSqlSchema: (val: boolean) => void;
  exportRsvpsToCSV: () => void;
  loadOrganizerData: () => void;
}

export default function OrganizerPortal({
  showOrganizer,
  setShowOrganizer,
  organizerPasscode,
  setOrganizerPasscode,
  isOrganizerAuthed,
  handleOrganizerAuth,
  organizerError,
  rsvpsList,
  adminPhotosList,
  handleAdminDeleteRsvp,
  handleAdminDeletePhoto,
  currentBackend,
  setCurrentBackend,
  isSupabaseActive,
  supabaseUrl,
  setSupabaseUrl,
  supabaseAnonKey,
  setSupabaseAnonKey,
  handleSaveSupabaseSettings,
  supabaseTestLoading,
  supabaseStatusMsg,
  clearSupabaseCredentials,
  setIsSupabaseActive,
  handleSyncAllData,
  supabaseSyncing,
  supabaseSyncError,
  supabaseSyncSuccess,
  showSqlSchema,
  setShowSqlSchema,
  exportRsvpsToCSV,
  loadOrganizerData
}: OrganizerPortalProps) {
  return (
    <AnimatePresence>
      {showOrganizer && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-burgundy-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-burgundy-900 border border-gold-400/40 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col my-8"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-burgundy-950 border-b border-gold-400/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif-lux font-semibold text-gold-200 tracking-wider">ORGANIZER PORTAL</h3>
              </div>
              <button 
                onClick={() => setShowOrganizer(false)}
                className="bg-burgundy-950 border border-gold-400/30 text-gold-300 hover:text-white px-3 py-1 rounded-full text-xs font-semibold transition-all"
              >
                Close Portal
              </button>
            </div>

            {!isOrganizerAuthed ? (
              <form onSubmit={handleOrganizerAuth} className="p-8 max-w-md mx-auto text-center space-y-6 my-12">
                <div className="w-12 h-12 rounded-full border border-gold-300/30 bg-burgundy-950 flex items-center justify-center mx-auto text-gold-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-serif-lux text-xl text-gold-200 tracking-wide">Yara & Ahmed's Dashboard</h4>
                  <p className="text-xs text-burgundy-200">Enter the wedding passcode to view RSVP lists and guest photo uploads.</p>
                </div>
                <div className="space-y-2">
                  <input 
                    type="password"
                    placeholder="Secret Passcode"
                    value={organizerPasscode}
                    onChange={(e) => setOrganizerPasscode(e.target.value)}
                    className="w-full bg-burgundy-950 border border-gold-400/30 rounded-xl px-4 py-2.5 text-center text-sm focus:outline-none focus:ring-1 focus:ring-gold-400 text-gold-200"
                  />
                  {organizerError && <p className="text-[11px] text-rose-400">{organizerError}</p>}
                </div>
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-gold-400 hover:bg-gold-300 text-burgundy-950 font-bold rounded-xl text-xs tracking-wider transition-colors"
                >
                  AUTHORIZE
                </button>
              </form>
            ) : (
              /* Dashboard Panel */
              <div className="p-6 md:p-8 space-y-8 overflow-y-auto max-h-[80vh]">
                
                {/* Stats counters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-burgundy-950 border border-gold-400/10 p-5 rounded-xl space-y-1">
                    <span className="text-[10px] text-gold-400 tracking-widest block uppercase">Total RSVP Submissions</span>
                    <span className="text-3xl font-serif-lux font-bold text-white">{rsvpsList.length}</span>
                  </div>
                  <div className="bg-burgundy-950 border border-gold-400/10 p-5 rounded-xl space-y-1">
                    <span className="text-[10px] text-gold-400 tracking-widest block uppercase">Attending Guests</span>
                    <span className="text-3xl font-serif-lux font-bold text-emerald-400">
                      {rsvpsList.filter(r => r.attending).reduce((acc, r) => acc + 1 + (r.guestsCount || 0), 0)}
                    </span>
                  </div>
                  <div className="bg-burgundy-950 border border-gold-400/10 p-5 rounded-xl space-y-1">
                    <span className="text-[10px] text-gold-400 tracking-widest block uppercase">Declined Invitation</span>
                    <span className="text-3xl font-serif-lux font-bold text-rose-400">
                      {rsvpsList.filter(r => !r.attending).length}
                    </span>
                  </div>
                </div>

                {/* Supabase Integration & Database Hub */}
                <div className="bg-burgundy-950/60 border border-gold-400/20 rounded-xl p-5 md:p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-400/10">
                    <div className="space-y-1">
                      <h4 className="font-serif-lux text-base text-gold-200 tracking-wide flex items-center gap-2">
                        <Database className="w-4 h-4 text-gold-400" />
                        Database Configuration & Integrations
                      </h4>
                      <p className="text-xs text-burgundy-200">
                        Choose your active database backend and sync data in real-time.
                      </p>
                    </div>
                    
                    {/* Backend Toggler */}
                    <div className="flex items-center gap-1.5 bg-burgundy-900/60 p-1 rounded-lg border border-gold-400/20">
                      <button
                        onClick={() => setCurrentBackend("firebase")}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          currentBackend === "firebase"
                            ? "bg-gold-400 text-burgundy-950 shadow-sm font-semibold"
                            : "text-gold-300/70 hover:text-white hover:bg-gold-400/5"
                        }`}
                      >
                        Firebase (Default)
                      </button>
                      <button
                        onClick={() => {
                          if (!isSupabaseActive) {
                            alert("Please configure and connect your Supabase database first below.");
                            return;
                          }
                          setCurrentBackend("supabase");
                        }}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          currentBackend === "supabase"
                            ? "bg-gold-400 text-burgundy-950 shadow-sm font-semibold"
                            : "text-gold-300/70 hover:text-white hover:bg-gold-400/5"
                        } ${!isSupabaseActive ? "opacity-50 cursor-not-allowed" : ""}`}
                        title={!isSupabaseActive ? "Configure Supabase below to activate" : "Use Supabase backend"}
                      >
                        Supabase {isSupabaseActive && <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full ml-1" />}
                      </button>
                    </div>
                  </div>

                  {/* Config Form and SQL Schema */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Credentials configuration */}
                    <form onSubmit={handleSaveSupabaseSettings} className="lg:col-span-7 space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gold-300 tracking-wider uppercase block">Supabase Project URL</label>
                        <input
                          type="text"
                          placeholder="https://your-project.supabase.co"
                          value={supabaseUrl}
                          onChange={(e) => setSupabaseUrl(e.target.value)}
                          className="w-full bg-burgundy-900 border border-gold-400/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400 text-gold-200 font-mono"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-gold-300 tracking-wider uppercase block">Supabase Anon/Public Key</label>
                        <input
                          type="password"
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          value={supabaseAnonKey}
                          onChange={(e) => setSupabaseAnonKey(e.target.value)}
                          className="w-full bg-burgundy-900 border border-gold-400/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400 text-gold-200 font-mono"
                        />
                      </div>

                      {supabaseStatusMsg && (
                        <p className={`text-xs ${supabaseStatusMsg.includes("Successfully") ? "text-emerald-400" : "text-rose-400"}`}>
                          {supabaseStatusMsg}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={supabaseTestLoading}
                          className="flex-1 py-2 bg-gold-400 hover:bg-gold-300 disabled:bg-gold-400/40 text-burgundy-950 font-bold rounded-lg text-xs tracking-wider transition-colors"
                        >
                          {supabaseTestLoading ? "TESTING CONNECTION..." : isSupabaseActive ? "UPDATE CONFIGURATION" : "CONNECT & SAVE SUPABASE"}
                        </button>
                        {isSupabaseActive && (
                          <button
                            type="button"
                            onClick={() => {
                              clearSupabaseCredentials();
                              setSupabaseUrl("");
                              setSupabaseAnonKey("");
                              setIsSupabaseActive(false);
                              setCurrentBackend("firebase");
                            }}
                            className="px-3 py-2 border border-rose-500/30 hover:border-rose-500 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 hover:text-white rounded-lg text-xs font-semibold transition-all"
                          >
                            Disconnect
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Database action & SQL helper column */}
                    <div className="lg:col-span-5 flex flex-col justify-between bg-burgundy-900/40 border border-gold-400/10 p-4 rounded-xl space-y-4">
                      <div className="space-y-2">
                        <h5 className="text-xs text-gold-300 font-medium tracking-wide uppercase">Database Synchronizer</h5>
                        <p className="text-[11px] text-burgundy-200 leading-relaxed">
                          Seamlessly synchronize all RSVP submissions and gallery photo uploads from your main Firestore database into your connected Supabase instance.
                        </p>
                      </div>

                      {/* Sync Buttons and Statuses */}
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={handleSyncAllData}
                          disabled={supabaseSyncing || !isSupabaseActive}
                          className={`w-full py-2 flex items-center justify-center gap-1.5 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-burgundy-950 font-bold rounded-lg text-xs tracking-wide transition-all shadow-md ${
                            (!isSupabaseActive || supabaseSyncing) ? "opacity-40 cursor-not-allowed" : "active:scale-[0.98]"
                          }`}
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${supabaseSyncing ? "animate-spin" : ""}`} />
                          {supabaseSyncing ? "SYNCHRONIZING..." : "SYNC FIRESTORE TO SUPABASE"}
                        </button>

                        {supabaseSyncError && (
                          <p className="text-[10px] text-rose-400 text-center">{supabaseSyncError}</p>
                        )}
                        {supabaseSyncSuccess && (
                          <p className="text-[10px] text-emerald-400 text-center font-medium">{supabaseSyncSuccess}</p>
                        )}
                      </div>

                      {/* Schema toggler button */}
                      <button
                        type="button"
                        onClick={() => setShowSqlSchema(!showSqlSchema)}
                        className="w-full py-1.5 border border-gold-400/20 hover:border-gold-400/40 text-gold-300 hover:text-white rounded-lg text-[11px] font-medium transition-all"
                      >
                        {showSqlSchema ? "Hide SQL Setup Snippet" : "View Supabase SQL Schema"}
                      </button>
                    </div>
                  </div>

                  {/* SQL Code Box Accordion */}
                  {showSqlSchema && (
                    <div className="bg-burgundy-950/80 border border-gold-400/10 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-gold-400/10">
                        <span className="text-xs text-gold-300 font-semibold tracking-wide">SUPABASE SQL SCHEMA SETUP</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                            alert("SQL snippet copied to clipboard! Paste it into your Supabase SQL Editor and run it.");
                          }}
                          className="text-[10px] bg-gold-400 hover:bg-gold-300 text-burgundy-950 px-2 py-1 rounded font-bold transition-colors"
                        >
                          COPY SQL CODE
                        </button>
                      </div>
                      <p className="text-[11px] text-burgundy-200">
                        Run this schema block inside your Supabase project's <strong className="text-gold-200">SQL Editor</strong> to create the <code>rsvps</code> and <code>photos</code> tables and configure the required row-level security (RLS) public read and write policies!
                      </p>
                      <pre className="p-3 bg-black/50 border border-gold-400/5 rounded-lg text-[10px] text-emerald-300/90 font-mono overflow-x-auto max-h-[160px] overflow-y-auto leading-relaxed select-all">
                        {SUPABASE_SQL_SCHEMA}
                      </pre>
                    </div>
                  )}
                </div>

                {/* RSVPs Table list */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-serif-lux text-lg text-gold-200 tracking-wide">Guest Attendance RSVPs</h4>
                      <p className="text-xs text-burgundy-200">List of all submissions updated in real-time.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={loadOrganizerData}
                        className="p-2 border border-gold-400/20 rounded-lg hover:bg-gold-400/10 text-gold-400 transition-colors"
                        title="Refresh list"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={exportRsvpsToCSV}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gold-400 hover:bg-gold-300 text-burgundy-950 rounded-lg text-xs font-bold transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export CSV
                      </button>
                    </div>
                  </div>

                  <div className="border border-gold-400/10 rounded-xl overflow-hidden bg-burgundy-950">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gold-400/10 text-[10px] uppercase text-gold-400 tracking-wider">
                            <th className="px-4 py-3">Guest Name</th>
                            <th className="px-4 py-3">Attending</th>
                            <th className="px-4 py-3">Dietary Needs</th>
                            <th className="px-4 py-3 text-center">Guests</th>
                            <th className="px-4 py-3">Message</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gold-400/5 text-xs text-burgundy-100">
                          {rsvpsList.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-8 text-burgundy-300 italic">No RSVPs received yet.</td>
                            </tr>
                          ) : (
                            rsvpsList.map((rsvp) => (
                              <tr key={rsvp.id} className="hover:bg-burgundy-900/40">
                                <td className="px-4 py-3.5 font-medium text-white">{rsvp.guestName}</td>
                                <td className="px-4 py-3.5">
                                  {rsvp.attending ? (
                                    <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">YES</span>
                                  ) : (
                                    <span className="bg-rose-950/80 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">NO</span>
                                  )}
                                </td>
                                <td className="px-4 py-3.5 max-w-[120px] truncate" title={rsvp.dietary}>{rsvp.dietary || "-"}</td>
                                <td className="px-4 py-3.5 text-center">{rsvp.guestsCount || 0}</td>
                                <td className="px-4 py-3.5 max-w-[180px] truncate" title={rsvp.message}>{rsvp.message || "-"}</td>
                                <td className="px-4 py-3.5 font-mono text-[10px] opacity-80">{rsvp.createdAt ? new Date(rsvp.createdAt).toLocaleDateString() : "-"}</td>
                                <td className="px-4 py-3.5 text-center">
                                  <button 
                                    type="button"
                                    onClick={() => handleAdminDeleteRsvp(rsvp.id)}
                                    className="text-burgundy-300 hover:text-rose-400 p-1 rounded hover:bg-rose-950/35 transition-colors"
                                    title="Delete RSVP"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Guest Shared Photos Moderation */}
                <div className="space-y-4 pt-4 border-t border-gold-400/10">
                  <div className="space-y-0.5">
                    <h4 className="font-serif-lux text-lg text-gold-200 tracking-wide">Gallery Moderation</h4>
                    <p className="text-xs text-burgundy-200">Remove inappropriate photos uploaded by guests.</p>
                  </div>

                  {adminPhotosList.length === 0 ? (
                    <div className="text-center p-6 bg-burgundy-950/40 border border-dashed border-gold-400/10 rounded-xl text-burgundy-300 italic text-xs">
                      No custom photos uploaded by guests yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {adminPhotosList.map((photo) => (
                        <div key={photo.id} className="relative group border border-gold-400/10 rounded-lg overflow-hidden bg-burgundy-950">
                          <img src={photo.photoUrl} alt={photo.caption} className="aspect-video w-full object-cover" referrerPolicy="no-referrer" />
                          <div className="p-2 space-y-0.5 text-[10px]">
                            <span className="text-white block font-medium truncate">{photo.guestName}</span>
                            <span className="text-burgundy-300 block truncate italic">"{photo.caption || "No caption"}"</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleAdminDeletePhoto(photo.id)}
                            className="absolute top-2 right-2 p-1.5 bg-burgundy-950/80 rounded-full hover:bg-rose-600 text-gold-300 hover:text-white transition-colors"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
