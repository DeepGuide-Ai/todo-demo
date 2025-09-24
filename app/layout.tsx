import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import DeepGuideSDK from '@/components/DeepGuideSDK'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DeepGuide Sample Site',
  description: 'Sample site for testing DeepGuide replay functionality',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const apiKey = process.env.NEXT_PUBLIC_DEEPGUIDE_API_KEY || 'test-api-key-123'
  const workspaceId = process.env.NEXT_PUBLIC_DEEPGUIDE_WORKSPACE_ID || 'cmai1vqbl004luhb4j9xuoe3f'
  const baseUrl = process.env.NEXT_PUBLIC_DEEPGUIDE_BASE_URL || 'http://localhost:15001'
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <DeepGuideSDK 
          apiKey={apiKey}
          workspaceId={workspaceId}
          baseUrl={baseUrl}
          autoInit={true}
          enableUI={true}
        />
      </body>
    </html>
  )
}
