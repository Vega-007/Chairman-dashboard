import React, { useEffect, useState } from 'react';
import { X, ClipboardList, CheckCircle2, History, Send } from 'lucide-react';
import { DepartmentFlag, ActionPlan } from '@/lib/types/flag';
import { getStatusColorClass } from '@/lib/utils/status';
import { cn } from '@/lib/utils';

interface ActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  flag: DepartmentFlag | null;
  onSaveActionPlan: (flagId: string, actionPlan: ActionPlan, comment?: string) => void;
  onResolveFlag: (flagId: string, comment?: string) => void;
}

export const ActionPlanModal: React.FC<ActionPlanModalProps> = ({
  isOpen,
  onClose,
  flag,
  onSaveActionPlan,
  onResolveFlag,
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'edit_mock'>('view');
  
  // HOD edit form state
  const [actionPlanText, setActionPlanText] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [expectedCompletionDate, setExpectedCompletionDate] = useState('');
  const [requiredSupport, setRequiredSupport] = useState('');
  const [hodStatus, setHodStatus] = useState<'Not Started' | 'In Progress' | 'Completed'>('In Progress');
  const [comment, setComment] = useState('');

  // Sync state when flag changes using render-sync pattern
  const [lastFlagId, setLastFlagId] = useState<string | null>(null);
  if (flag && flag.id !== lastFlagId) {
    setLastFlagId(flag.id);
    setActionPlanText(flag.actionPlan?.actionPlanText || '');
    setResponsiblePerson(flag.actionPlan?.responsiblePerson || 'Designated HOD (Mock)');
    setExpectedCompletionDate(flag.actionPlan?.expectedCompletionDate || '');
    setRequiredSupport(flag.actionPlan?.requiredSupport || '');
    setHodStatus(flag.actionPlan?.status || 'In Progress');
    setComment('');
    setActiveTab('view');
  }

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !flag) return null;

  const colors = getStatusColorClass(flag.status === 'RESOLVED' ? 'GREEN' : flag.status === 'FLAGGED' ? 'RED' : 'ORANGE');

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionPlanText.trim()) return;

    onSaveActionPlan(flag.id, {
      actionPlanText,
      responsiblePerson,
      expectedCompletionDate,
      requiredSupport,
      status: hodStatus,
      lastUpdated: new Date().toISOString(),
    }, comment.trim() || undefined);

    setActiveTab('view');
  };

  const handleResolve = () => {
    onResolveFlag(flag.id, 'Chairman resolved the intervention flag after reviewing the plan outcomes.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-action-title"
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden z-10 animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 shrink-0">
              <ClipboardList className="w-4 h-4 text-blue-700 dark:text-blue-450" />
            </div>
            <div>
              <h2 id="modal-action-title" className="text-sm font-extrabold text-slate-950 dark:text-white tracking-tight">
                ACTION PLAN MONITORING
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">
                {flag.departmentName} · {flag.parameterName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-850/20 px-4">
          <button
            onClick={() => setActiveTab('view')}
            className={cn(
              'px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-all',
              activeTab === 'view'
                ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            Intervention & Action Plan Status
          </button>
          {flag.status !== 'RESOLVED' && (
            <button
              onClick={() => setActiveTab('edit_mock')}
              className={cn(
                'px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-all flex items-center gap-1.5',
                activeTab === 'edit_mock'
                  ? 'border-rose-500 text-rose-600 dark:text-rose-450'
                  : 'border-transparent text-slate-550 hover:text-rose-550'
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>HOD Console (Mock Roleplay)</span>
            </button>
          )}
        </div>

        {/* Scrollable Container */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {activeTab === 'view' ? (
            <>
              {/* Flag Details Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Left Card: Flag Info */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-150 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Flag Meta</span>
                    <span className={cn('px-2 py-0.5 rounded-[4px] text-[9px] font-bold font-mono', colors.bg, colors.text, colors.border, 'border')}>
                      {flag.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-750 dark:text-slate-350">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase font-mono">Priority</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{flag.priority}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase font-mono">Target vs Actual</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {flag.actualValue} / {flag.targetValue} {flag.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase font-mono">Flagged Reason</span>
                      <p className="leading-relaxed font-medium">{flag.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Right Card: HOD Assignment / Notifications */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-150 dark:border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Delegation & Notifications</span>
                  <div className="space-y-1.5 text-slate-750 dark:text-slate-350">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase font-mono">Assigned Representative</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{flag.assignedTo}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase font-mono">Date Flagged</span>
                      <span className="font-semibold text-slate-850 dark:text-slate-200">
                        {new Date(flag.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase font-mono">Notification Channels</span>
                      <div className="grid grid-cols-2 gap-2 mt-1 font-mono text-[10px]">
                        <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
                          <span className="text-slate-400 block">SMS Notification</span>
                          <span className="text-slate-500 font-semibold mt-0.5 block">Not Configured</span>
                        </div>
                        <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
                          <span className="text-slate-400 block">Email Dispatch</span>
                          <span className="text-slate-500 font-semibold mt-0.5 block">Not Configured</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Plan Text Block */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <span>HOD Action Plan Details</span>
                </h3>
                {flag.actionPlan ? (
                  <div className="p-4 rounded-lg bg-blue-50/20 dark:bg-blue-950/10 border border-blue-200/60 dark:border-blue-900/40 text-xs space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[10px] pb-3 border-b border-slate-100 dark:border-slate-800/80">
                      <div>
                        <span className="text-slate-400 block">Action Status</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase mt-0.5 block">
                          {flag.actionPlan.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Responsible Person</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                          {flag.actionPlan.responsiblePerson}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Expected Completion</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                          {new Date(flag.actionPlan.expectedCompletionDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase font-mono">Action Plan Proposal</span>
                        <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap mt-0.5">
                          {flag.actionPlan.actionPlanText}
                        </p>
                      </div>

                      {flag.actionPlan.requiredSupport && (
                        <div>
                          <span className="text-slate-400 font-bold block text-[10px] uppercase font-mono">Requested Institutional Support</span>
                          <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap mt-0.5">
                            {flag.actionPlan.requiredSupport}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-850/50 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-1">
                    <p className="text-xs font-semibold text-slate-650 dark:text-slate-400">Action Plan Awaiting HOD Submission</p>
                    <p className="text-[10px] text-slate-400">The assigned department representative has been alerted to draft an operational action plan.</p>
                  </div>
                )}
              </div>

              {/* Timeline Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  <span>Timeline & Communication History</span>
                </h3>

                <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-4">
                  {flag.timeline.map((event, idx) => (
                    <div key={idx} className="relative text-xs">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 ring-2 ring-blue-600/20" />
                      
                      <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono text-slate-400">
                        <span className="font-bold text-slate-600 dark:text-slate-350">{event.actor}</span>
                        <span>·</span>
                        <span>{new Date(event.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}</span>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white mt-0.5">{event.action}</h4>
                      {event.comment && (
                        <p className="text-slate-600 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-850 p-2 rounded mt-1 border border-slate-100 dark:border-slate-800/80">
                          {event.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Roleplay Form Tab */
            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg text-amber-900 dark:text-amber-200 leading-relaxed">
                💡 <strong>HOD Roleplay Environment:</strong> Submit an operational plan below to mimic the assigned HOD response. Submitting updates the status timeline in real-time.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="hod-rep" className="block font-bold text-slate-400 uppercase font-mono text-[10px]">
                    Responsible HOD/Rep (Mock)
                  </label>
                  <input
                    id="hod-rep"
                    type="text"
                    required
                    value={responsiblePerson}
                    onChange={(e) => setResponsiblePerson(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="exp-date" className="block font-bold text-slate-400 uppercase font-mono text-[10px]">
                    Expected Completion Date
                  </label>
                  <input
                    id="exp-date"
                    type="date"
                    required
                    value={expectedCompletionDate}
                    onChange={(e) => setExpectedCompletionDate(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="plan-desc" className="block font-bold text-slate-400 uppercase font-mono text-[10px]">
                  Action Plan Proposal Text
                </label>
                <textarea
                  id="plan-desc"
                  required
                  rows={4}
                  value={actionPlanText}
                  onChange={(e) => setActionPlanText(e.target.value)}
                  placeholder="Detail the actionable steps, resource realignments, or operational strategies the department will employ..."
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="support-req" className="block font-bold text-slate-400 uppercase font-mono text-[10px]">
                  Requested Institutional Support (Optional)
                </label>
                <textarea
                  id="support-req"
                  rows={2}
                  value={requiredSupport}
                  onChange={(e) => setRequiredSupport(e.target.value)}
                  placeholder="Detail any budget requests, infrastructure support, or policy approvals required from the Chairman..."
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="plan-status" className="block font-bold text-slate-400 uppercase font-mono text-[10px]">
                    Current Execution Status
                  </label>
                  <select
                    id="plan-status"
                    value={hodStatus}
                    onChange={(e) => setHodStatus(e.target.value as 'Not Started' | 'In Progress' | 'Completed')}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-850 dark:text-slate-100"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed / Resolved</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="timeline-comment" className="block font-bold text-slate-400 uppercase font-mono text-[10px]">
                    Timeline Comment / Update Note
                  </label>
                  <input
                    id="timeline-comment"
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter an optional brief log comment for the timeline..."
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('view')}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-rose-900 dark:bg-rose-700 hover:bg-rose-800 dark:hover:bg-rose-600 text-white transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save HOD Action Plan</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close Dialog
          </button>

          {activeTab === 'view' && flag.status !== 'RESOLVED' && (
            <button
              onClick={handleResolve}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolve intervention (Close Flag)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
