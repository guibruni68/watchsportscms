import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}