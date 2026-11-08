import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DeepGuide Sample Site',
  description: 'Sample site for testing DeepGuide replay functionality',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const apiKey = process.env.NEXT_PUBLIC_DEEPGUIDE_API_KEY
  const workspaceId = process.env.NEXT_PUBLIC_DEEPGUIDE_WORKSPACE_ID
  const baseUrl = process.env.NEXT_PUBLIC_DEEPGUIDE_BASE_URL
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        <meta name="strix-verification" content="strix-verify-3084b6c24970c4e0c2baf208928591d6"/>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
