'use client'

import { Suspense, lazy } from 'react'

const SPLINE_PACKAGE = '@splinetool/react-spline'
const Spline = lazy(() => import(/* @vite-ignore */ SPLINE_PACKAGE))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
