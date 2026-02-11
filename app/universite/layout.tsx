'use client'

import React from "react"

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'

export default function UniversiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== 'universite') {
      router.push('/')
    }
  }, [user, router])

  if (!user || user.role !== 'universite') {
    return null
  }

  return (
    <DashboardLayout user={user} role="universite">
      {children}
    </DashboardLayout>
  )
}
