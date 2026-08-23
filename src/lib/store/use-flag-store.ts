import { create } from 'zustand';
import { DepartmentFlag, FlagStatus, ActionPlan, FlagTimelineEvent } from '../types/flag';

interface FlagState {
  flags: DepartmentFlag[];
  addFlag: (flag: Omit<DepartmentFlag, 'id' | 'createdAt' | 'timeline' | 'lastUpdated' | 'daysPending' | 'smsNotificationStatus' | 'emailNotificationStatus'>) => void;
  updateActionPlan: (flagId: string, actionPlan: ActionPlan, comment?: string) => void;
  resolveFlag: (flagId: string, comment?: string) => void;
}

const DEFAULT_MOCK_FLAGS: DepartmentFlag[] = [
  {
    id: 'flag-1',
    institutionId: 'fet-rmp',
    institutionName: 'SRM Institute of Science and Technology, Ramapuram',
    departmentId: 'cse-rmp',
    departmentName: 'Computer Science & Engineering',
    departmentCode: 'EEC-D1',
    parameterId: 'publication',
    parameterName: 'Publication',
    parameterCode: 'PUB',
    actualValue: 126,
    targetValue: 137,
    unit: 'Papers',
    createdAt: '2026-08-19T10:00:00.000Z',
    createdBy: "Chairman's Office (Mock)",
    priority: 'HIGH',
    reason: 'Publication output is currently below target. Need HOD action plan to improve indexing quality and volume.',
    status: 'FLAGGED',
    assignedTo: 'Designated HOD (Mock)',
    daysPending: 3,
    lastUpdated: '2026-08-19T10:00:00.000Z',
    smsNotificationStatus: 'NOT_SENT',
    emailNotificationStatus: 'NOT_SENT',
    timeline: [
      {
        id: 'evt-1',
        date: '2026-08-19T10:00:00.000Z',
        action: 'Flag Created',
        actor: "Chairman's Office (Mock)",
        comment: 'Urgent operational review required.',
      },
      {
        id: 'evt-2',
        date: '2026-08-19T10:05:00.000Z',
        action: 'Assigned to HOD',
        actor: 'System (Mock)',
        comment: 'Notification dispatched to HOD dashboard (SMS/Email mock-status: NOT_CONFIGURED).',
      },
    ],
  },
  {
    id: 'flag-2',
    institutionId: 'trp-eng',
    institutionName: 'SRM TRP Engineering College, Trichy',
    departmentId: 'ece-trp',
    departmentName: 'Electronics & Communication Engineering',
    departmentCode: 'TRP-D2',
    parameterId: 'patent',
    parameterName: 'Patent',
    parameterCode: 'PAT',
    actualValue: 4,
    targetValue: 8,
    unit: 'Patents',
    createdAt: '2026-08-12T09:00:00.000Z',
    createdBy: "Chairman's Office (Mock)",
    priority: 'MEDIUM',
    reason: 'Patent filings have stagnated. HOD intervention required.',
    status: 'ACTION_PLAN_SUBMITTED',
    assignedTo: 'Designated HOD (Mock)',
    daysPending: 10,
    lastUpdated: '2026-08-15T14:30:00.000Z',
    smsNotificationStatus: 'NOT_SENT',
    emailNotificationStatus: 'NOT_SENT',
    actionPlan: {
      actionPlanText: 'Initiate departmental IP awareness workshops. Partner with group IP cell to expedite search and filing reports.',
      responsiblePerson: 'Dr. K. ECE Coordinator (Mock)',
      expectedCompletionDate: '2026-11-30',
      requiredSupport: 'Sanction for guest speaker honorarium (₹15,000)',
      status: 'In Progress',
      lastUpdated: '2026-08-15T14:30:00.000Z',
    },
    timeline: [
      {
        id: 'evt-3',
        date: '2026-08-12T09:00:00.000Z',
        action: 'Flag Created',
        actor: "Chairman's Office (Mock)",
        comment: 'Target deficit requires structured approach.',
      },
      {
        id: 'evt-4',
        date: '2026-08-12T09:10:00.000Z',
        action: 'Assigned to HOD',
        actor: 'System (Mock)',
      },
      {
        id: 'evt-5',
        date: '2026-08-15T14:30:00.000Z',
        action: 'Action Plan Submitted',
        actor: 'Designated HOD (Mock)',
        comment: 'Workshops planned, requesting administrative approvals.',
      },
    ],
  },
];

// Re-hydrate state from localStorage if available
const loadInitialFlags = (): DepartmentFlag[] => {
  if (typeof window === 'undefined') return DEFAULT_MOCK_FLAGS;
  try {
    const saved = localStorage.getItem('srm_mis_department_flags');
    return saved ? JSON.parse(saved) : DEFAULT_MOCK_FLAGS;
  } catch {
    return DEFAULT_MOCK_FLAGS;
  }
};

const saveFlags = (flags: DepartmentFlag[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('srm_mis_department_flags', JSON.stringify(flags));
  } catch {
    console.error('Failed to save flags to localStorage');
  }
};

export const useFlagStore = create<FlagState>((set) => ({
  flags: loadInitialFlags(),

  addFlag: (flagData) =>
    set((state) => {
      const now = new Date().toISOString();
      const newFlag: DepartmentFlag = {
        ...flagData,
        id: `flag-${Date.now()}`,
        createdAt: now,
        lastUpdated: now,
        daysPending: 0,
        smsNotificationStatus: 'NOT_SENT',
        emailNotificationStatus: 'NOT_SENT',
        timeline: [
          {
            id: `evt-${Date.now()}-1`,
            date: now,
            action: 'Flag Created',
            actor: "Chairman's Office (Mock)",
            comment: flagData.reason,
          },
          {
            id: `evt-${Date.now()}-2`,
            date: now,
            action: 'Assigned to HOD',
            actor: 'System (Mock)',
            comment: `Assigned to ${flagData.assignedTo}`,
          },
        ],
      };

      const updated = [newFlag, ...state.flags];
      saveFlags(updated);
      return { flags: updated };
    }),

  updateActionPlan: (flagId, actionPlan, comment) =>
    set((state) => {
      const now = new Date().toISOString();
      const updated = state.flags.map((flag): DepartmentFlag => {
        if (flag.id !== flagId) return flag;

        const newTimelineEvent: FlagTimelineEvent = {
          id: `evt-${Date.now()}`,
          date: now,
          action: actionPlan.status === 'Completed' ? 'Resolved' : 'Action Plan Submitted',
          actor: 'Designated HOD (Mock)',
          comment: comment || actionPlan.actionPlanText,
        };

        const newStatus: FlagStatus = actionPlan.status === 'Completed'
          ? 'RESOLVED'
          : actionPlan.status === 'In Progress'
          ? 'IN_PROGRESS'
          : 'ACTION_PLAN_SUBMITTED';

        return {
          ...flag,
          status: newStatus,
          lastUpdated: now,
          actionPlan: {
            ...actionPlan,
            lastUpdated: now,
          },
          timeline: [...flag.timeline, newTimelineEvent],
        };
      });

      saveFlags(updated);
      return { flags: updated };
    }),

  resolveFlag: (flagId, comment) =>
    set((state) => {
      const now = new Date().toISOString();
      const updated = state.flags.map((flag): DepartmentFlag => {
        if (flag.id !== flagId) return flag;

        const newTimelineEvent: FlagTimelineEvent = {
          id: `evt-${Date.now()}`,
          date: now,
          action: 'Resolved',
          actor: "Chairman's Office (Mock)",
          comment: comment || 'Issue resolved successfully by Chairman review.',
        };

        return {
          ...flag,
          status: 'RESOLVED',
          lastUpdated: now,
          timeline: [...flag.timeline, newTimelineEvent],
        };
      });

      saveFlags(updated);
      return { flags: updated };
    }),
}));
