'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { PartenariatRequestsManagement } from '@/components/partenariat-requests-management'

export default function AdminPartenariatPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/connexion')
    }
  }, [user, router])

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <DashboardLayout user={user} role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des partenariats
          </h1>
          <p className="mt-2 text-muted-foreground">
            Gérez les demandes de partenariat des universités
          </p>
        </div>

        <PartenariatRequestsManagement />
      </div>
    </DashboardLayout>
  )
}
