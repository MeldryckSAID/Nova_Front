export interface TimeSlot {
  id: string
  day: string
  startTime: string
  endTime: string
  isRecurring: boolean
}

export interface Helper {
  id: string
  name: string
  email: string
  avatar: string
  specialties: string[]
  timeSlots: TimeSlot[]
  description?: string
  hourlyRate?: number
  rating?: number
  totalSessions?: number
  status: "available" | "busy" | "offline"
}

export interface Student {
  id: string
  name: string
  email: string
  avatar: string
  needs?: string
  specialties: string[]
  contactedHelpers: string[]
}

export interface BookingRequest {
  id: string
  studentId: string
  helperId: string
  timeSlotId: string
  requestedDate: string
  message?: string
  status: "pending" | "accepted" | "rejected" | "completed"
  createdAt: string
}

export type UserType = "student" | "helper"
