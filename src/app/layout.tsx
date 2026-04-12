import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: '✨ FIDELIS - Resumidor Académico con IA',
  description: 'El resumen que NO inventa. Fidelidad 100% al contenido original.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="es">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
