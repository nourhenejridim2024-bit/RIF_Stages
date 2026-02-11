'use client'

import React from "react"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'

export default function StagiaireLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/connexion')
    } else if (user.role !== 'stagiaire') {
      router.push(`/${user.role}`)
    }
  }, [user, router])

  if (!user || user.role !== 'stagiaire') {
    return null
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
