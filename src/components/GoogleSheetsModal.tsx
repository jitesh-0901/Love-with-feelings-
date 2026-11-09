import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Link2, Sheet, Copy, ExternalLink, Activity, Trash2, Send } from 'lucide-react';
import {
  TARGET_SHEET_URL,
  getStoredScriptUrl,
  setStoredScriptUrl,
  getStoredEvents,
  clearStoredEvents,
  getRecommendedAppsScriptCode,
  sendTestPing,
} from '../utils/analyticsTracker';
import type { AnalyticsRecord } from '../utils/analyticsTracker';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState<string>(getStoredScriptUrl());
  const [saved, setSaved] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [pingStatus, setPingStatus] = useState<string>('');
  const [events, setEvents] = useState<AnalyticsRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      setUrl(getStoredScriptUrl());
      setEvents(getStoredEvents());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredScriptUrl(url);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getRecommendedAppsScriptCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTestPing = async () => {
    if (!url) {
      setPingStatus('Please paste and save Web App URL first!');
      setTimeout(() => setPingStatus(''), 2500);
      return;
    }
    setPingStatus('Sending test row to Sheet...');
    const ok = await sendTestPing();
    if (ok) {
      setPingStatus('✓ Test row sent! Check your Google Sheet!');
      setEvents(getStoredEvents());
    } else {
      setPingStatus('Failed to send test row. Check script URL.');
    }
    setTimeout(() => setPingStatus(''), 3000);
  };

  const handleClearLogs = () => {
    clearStoredEvents();
    setEvents([]);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-3 sm:p-4 flex items-center justify-center select-none"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-3xl border-2 border-rosePetal-300 relative shadow-2xl text-left space-y-4"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-roseDark-950 p-1"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2">
          <Sheet className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-cinzel font-black text-roseDark-950">
            Real-Time Google Sheets Tracker
          </h3>
        </div>

        {/* Google Sheet Link */}
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2">
          <div className="truncate">
            <p className="text-[11px] font-bold text-emerald-900">Your Google Spreadsheet:</p>
            <p className="text-[10px] text-emerald-700 truncate font-mono">
              1Ufy115dOz_r0W40sSfUTeD7WrXks4GO7_3OYsceyxW8
            </p>
          </div>
          <a
            href={TARGET_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-sm"
          >
            <span>Open Sheet</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Web App URL Input & Test Ping */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-roseDark-900 block">
            Google Apps Script Web App URL:
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1 flex items-center">
              <Link2 size={14} className="absolute left-3 text-gray-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-rosePetal-50 border border-rosePetal-300 text-xs text-roseDark-950 placeholder:text-gray-400 focus:outline-none focus:border-velvetRose-500 font-medium"
              />
            </div>
            {url && (
              <button
                type="button"
                onClick={handleTestPing}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 active:scale-95 shadow-xs"
                title="Send a test row to verify Google Sheet connection"
              >
                <Send size={12} />
                <span>Test Ping</span>
              </button>
            )}
          </div>
          {pingStatus && (
            <p className="text-[10px] font-bold text-velvetRose-700 animate-pulse">
              {pingStatus}
            </p>
          )}
        </div>

        {/* Copy Apps Script Code */}
        <div className="p-3 rounded-2xl bg-rosePetal-50 border border-rosePetal-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-roseDark-900">Google Apps Script Code:</span>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded-full bg-velvetRose-600 hover:bg-velvetRose-700 text-white text-[10px] font-bold flex items-center gap-1"
            >
              {copiedCode ? <Check size={11} /> : <Copy size={11} />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <p className="text-[10px] text-roseDark-700 leading-normal">
            In your Sheet: Extensions &gt; Apps Script &gt; Paste code &gt; Deploy as Web App (Access: Anyone).
          </p>
        </div>

        {/* Live Stored Activity Logs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Activity size={14} className="text-velvetRose-600" />
              <span className="text-xs font-bold text-roseDark-900">
                Live Visitor Logs ({events.length} events recorded locally)
              </span>
            </div>
            {events.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="text-[10px] text-gray-400 hover:text-rose-600 flex items-center gap-1 font-medium"
                title="Clear local logs"
              >
                <Trash2 size={11} />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="max-h-40 overflow-y-auto rounded-xl bg-gray-50 border border-gray-200 p-2 space-y-1.5 font-mono text-[10px]">
            {events.length === 0 ? (
              <p className="text-gray-400 text-center py-4 font-sans text-xs">
                No events recorded yet. Open the website or tap heart/buttons to see live events appear here!
              </p>
            ) : (
              events.slice(-10).reverse().map((ev) => (
                <div key={ev.id} className="p-1.5 bg-white rounded-lg border border-gray-100 shadow-xs">
                  <div className="flex justify-between items-center text-velvetRose-700 font-bold">
                    <span>{ev.action}</span>
                    <span className="text-gray-400 text-[9px]">{ev.timestamp}</span>
                  </div>
                  <div className="text-gray-700 truncate">{ev.details}</div>
                  <div className="text-gray-400 text-[9px] truncate">
                    📱 {ev.device} | {ev.screen}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-rosePetal-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs text-roseDark-700 hover:text-roseDark-950 font-bold"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-full rose-btn-primary font-cinzel text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95"
          >
            {saved ? (
              <>
                <Check size={14} className="text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Web App URL</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GoogleSheetsModal;
