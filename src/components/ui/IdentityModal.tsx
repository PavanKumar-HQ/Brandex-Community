import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  getOrCreateIdentity,
  updateIdentityHandle,
  getIdenticonSvg,
  AnonymousIdentity,
  AVATAR_PRESETS,
  getAvatarPreset,
  updateIdentityAvatar
} from '../../utils/identity';
import { getPendingQueue, syncOfflineQueue } from '../../utils/offlineDb';
import {
  ShieldCheck,
  Award,
  RefreshCw,
  Wifi,
  WifiOff,
  Download,
  CheckCircle2,
  ExternalLink,
  Edit2,
  Check,
  X,
  Layers,
  ArrowRight,
  Palette
} from 'lucide-react';

interface IdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredInstallPrompt: any;
}

export const IdentityModal: React.FC<IdentityModalProps> = ({
  isOpen,
  onClose,
  deferredInstallPrompt
}) => {
  const [identity, setIdentity] = useState<AnonymousIdentity>(getOrCreateIdentity());
  const [isEditingHandle, setIsEditingHandle] = useState<boolean>(false);
  const [handleInput, setHandleInput] = useState<string>(identity.handle);
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);
  const [pendingQueue, setPendingQueue] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const id = getOrCreateIdentity();
      setIdentity(id);
      setHandleInput(id.handle);
      getPendingQueue().then((q) => setPendingQueue(q));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveHandle = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleInput.trim()) {
      const updated = updateIdentityHandle(handleInput.trim());
      setIdentity(updated);
      setIsEditingHandle(false);
    }
  };

  const handleSelectAvatar = (presetId: string) => {
    const updated = updateIdentityAvatar(presetId);
    setIdentity(updated);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus('');
    try {
      const res = await syncOfflineQueue();
      setSyncStatus(`Synced ${res.synced} items (${res.failed} pending).`);
      const updatedQ = await getPendingQueue();
      setPendingQueue(updatedQ);
    } catch {
      setSyncStatus('Sync failed. Please check internet connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTriggerInstall = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        onClose();
      }
    }
  };

  const identicon = getIdenticonSvg(identity.avatarSeed);
  const currentPreset = getAvatarPreset(identity.avatarSeed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Identity Avatar & Handle */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative group">
            <img
              src={identicon}
              alt="Algorithmic Identicon"
              className="w-16 h-16 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 object-contain"
            />
            <button
              type="button"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm border border-white dark:border-slate-900 transition-colors"
              title="Change Vector Avatar"
            >
              <Palette className="w-3 h-3" />
            </button>
            <span
              className={`absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                isOnline ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              title={isOnline ? 'Network Online' : 'Network Offline'}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {isEditingHandle ? (
                <form onSubmit={handleSaveHandle} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    className="px-2 py-1 rounded border border-indigo-400 dark:border-indigo-600 text-xs font-mono font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-base text-slate-900 dark:text-white truncate">
                    {identity.handle}
                  </span>
                  <button
                    onClick={() => setIsEditingHandle(true)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Archetype: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{currentPreset.name}</strong>
            </div>

            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/60">
                <Award className="w-3 h-3" />
                <span>{identity.contributorPoints} Points</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">Zero-PII</span>
            </div>
          </div>
        </div>

        {/* 5 Vector Avatars Picker Drawer */}
        {showAvatarPicker && (
          <div className="p-3 mb-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Switch Vector Avatar (Zero Uploads)
              </span>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(false)}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = identity.avatarSeed === preset.id;
                return (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => handleSelectAvatar(preset.id)}
                    className={`relative aspect-square rounded-xl p-1 transition-all border ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 ring-2 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                    title={preset.name}
                  >
                    <img
                      src={preset.svgDataUri}
                      alt={preset.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-2 h-2" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Privacy Shield Notice */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 mb-5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Your identity is pseudo-anonymous. No phone numbers, legal names, or invasive telemetry cookies are stored in the Brandex database.
          </p>
        </div>

        {/* Offline Queue & Sync Section */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-500" /> : <WifiOff className="w-3.5 h-3.5 text-amber-500" />}
              <span>Offline Queue ({pendingQueue.length})</span>
            </div>
            {pendingQueue.length > 0 && isOnline && (
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
            {pendingQueue.length === 0
              ? 'All client actions are fully synced with the backend.'
              : `${pendingQueue.length} action(s) cached in IndexedDB. Will sync automatically when network reconnects.`}
          </p>

          {syncStatus && (
            <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
              {syncStatus}
            </div>
          )}
        </div>

        {/* PWA Install Button (If supported / available) */}
        {deferredInstallPrompt && (
          <button
            onClick={handleTriggerInstall}
            className="w-full mb-4 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install Brandex Unified PWA</span>
          </button>
        )}

        {/* Action Links */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <NavLink
            to="/status"
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-between"
          >
            <span>Track BX- & SRV- Reference IDs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};
