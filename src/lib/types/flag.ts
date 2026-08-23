export type FlagStatus =
  | 'FLAGGED'
  | 'ACTION_REQUIRED'
  | 'ACTION_PLAN_SUBMITTED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'OVERDUE';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type NotificationDeliveryStatus = 'NOT_SENT' | 'PENDING' | 'SENT' | 'FAILED';

export interface FlagTimelineEvent {
  id: string;
  date: string;
  action: string;
  actor: string;
  comment?: string;
}

export interface ActionPlan {
  actionPlanText: string;
  responsiblePerson: string;
  expectedCompletionDate: string;
  requiredSupport?: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  lastUpdated: string;
}

export interface DepartmentFlag {
  id: string;
  institutionId: string;
  institutionName: string;
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  parameterId: string;
  parameterName: string;
  parameterCode: string;
  actualValue: string | number;
  targetValue: string | number;
  unit: string;
  createdAt: string;
  createdBy: string;
  priority: PriorityLevel;
  reason: string;
  status: FlagStatus;
  assignedTo: string;
  actionPlan?: ActionPlan;
  timeline: FlagTimelineEvent[];
  lastUpdated: string;
  daysPending: number;
  smsNotificationStatus: NotificationDeliveryStatus;
  emailNotificationStatus: NotificationDeliveryStatus;
}
