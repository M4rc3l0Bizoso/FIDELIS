import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Providers from "./providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "FIDELIS - Resumidor Académico con IA",
  description:
    "El resumen que NO inventa. Fidelidad 100% al contenido original.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es">
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
