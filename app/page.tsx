'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import LandingPage from '@/components/landing/LandingPage'
import DashboardPage from '@/components/layout/DashboardPage'
import BuilderPage from '@/components/builder/BuilderPage'
import AiModePage from '@/components/builder/AiModePage'
import PreviewPage from '@/components/preview/PreviewPage'
import ExportPage from '@/components/builder/ExportPage'
import TemplateSelectPage from '@/components/builder/TemplateSelectPage'
import type { AppPage } from '@/types'

export default function Home() {
  const [page, setPage] = useState<AppPage>('landing')

  const navigate = (p: AppPage) => {
    setPage(p)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <Navbar currentPage={page} navigate={navigate} />
      {page === 'landing'   && <LandingPage          navigate={navigate} />}
      {page === 'dashboard' && <DashboardPage         navigate={navigate} />}
      {page === 'templates' && <TemplateSelectPage    navigate={navigate} />}
      {page === 'builder'   && <BuilderPage           navigate={navigate} />}
      {page === 'aimode'    && <AiModePage            navigate={navigate} />}
      {page === 'preview'   && <PreviewPage           navigate={navigate} />}
      {page === 'export'    && <ExportPage            navigate={navigate} />}
    </>
  )
}
