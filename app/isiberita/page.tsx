// app/isiberita/page.tsx
import { Suspense } from "react"
import IsiberitaClient from "./IsiBeritaClient"

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Memuat artikel...</div>}>
      <IsiberitaClient />
    </Suspense>
  )
}
