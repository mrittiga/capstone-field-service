export type UserRole = 'DISPATCHER' | 'TECHNICIAN' | 'MANAGER' | 'CUSTOMER'
export type WorkOrderStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CLOSED' | 'CANCELLED'
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type SlaStatus = 'on_track' | 'at_risk' | 'breached' | 'completed' | 'unknown'

export interface Customer {
  id: number
  name: string
  contactEmail: string
  phone: string
  createdAt: string
  updatedAt: string
}

export interface Site {
  id: number
  customerId: number
  customerName: string
  name: string
  address: string
  createdAt: string
  updatedAt: string
}

export interface WorkOrder {
  id: number
  workOrderCode: string
  siteId: number
  siteName: string
  customerId: number
  customerName: string
  title: string
  description: string
  priority: Priority
  status: WorkOrderStatus
  assigneeId: number | null
  assigneeName: string | null
  slaDueDate: string
  slaStatus: SlaStatus
  totalPartsCost: number
  totalTimeMinutes: number
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

export interface DashboardMetrics {
  newCount: number
  assignedCount: number
  inProgressCount: number
  onHoldCount: number
  completedCount: number
  closedCount: number
  cancelledCount: number
  overdueCount: number
  slaCompliancePercentage: number
}
