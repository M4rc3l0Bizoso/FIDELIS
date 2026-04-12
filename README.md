# 🌟 FIDELIS - Resumidor Académico con IA Premium

**El resumen que NO inventa. Fidelidad 100% al contenido original.**

Resumidor de textos universitarios con sistema anti-alucinación bulletproof, trazabilidad visual y modos específicos para estudiar.

## 🚀 Features

- ✅ **Sistema Anti-Alucinación**: Valida cada afirmación contra el texto original
- 🔗 **Trazabilidad Total**: Ve exactamente de dónde sale cada punto del resumen
- 🎯 **4 Modos de Resumen**: Estudio, Breve, Profundo, Mapas Conceptuales
- ❓ **Preguntas de Examen**: Generadas SOLO del contenido del texto
- ⚠️ **Detección de Ambigüedades**: Alerta cuando el texto original es confuso
- 📊 **Indicadores de Confianza**: Score de confianza por sección
- 💾 **Histórico Completo**: Guarda todos tus resúmenes
- 💳 **Monetización Clara**: Free (5 resúmenes) + Pro ($9.99/mes)

## 🏗️ Stack Técnico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Next.js API Routes, TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | NextAuth.js + Google OAuth |
| **AI** | Claude 3.5 Sonnet |
| **Pagos** | Stripe |
| **Deploy** | Vercel |

## 📦 Instalación

```bash
# Clone
git clone https://github.com/tuuser/fidelis.git
cd fidelis

# Install
npm install

# Setup .env.local
cp .env.example .env.local
# Editar con tus credenciales

# Dev server
npm run dev

# Abre http://localhost:3000
```

## 🔧 Configuración

### 1. Supabase
```bash
# Crear proyecto en supabase.co
# Obtener credenciales:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 2. Google OAuth
```bash
# Google Cloud Console → Create OAuth 2.0 credentials
# Authorized redirect URIs:
# - http://localhost:3000/api/auth/callback/google
# - https://tu-dominio.vercel.app/api/auth/callback/google

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### 3. Claude API
```bash
# https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Stripe
```bash
# https://dashboard.stripe.com
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...
```

## 📁 Estructura del Proyecto

```
src/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── auth/            # NextAuth
│   │   ├── summarize/       # Motor principal
│   │   ├── credits/         # Sistema de créditos
│   │   └── documents/       # CRUD documentos
│   ├── dashboard/           # Dashboard (protegido)
│   ├── pricing/             # Página de pricing
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # Componentes React
│   ├── layout/              # Header, Sidebar, Footer
│   ├── dashboard/           # Componentes del dashboard
│   ├── summary/             # Mostrar resumen
│   └── modals/              # Modales (bloqueo, upgrade)
├── lib/                     # Lógica compartida
│   ├── auth.ts              # NextAuth config
│   ├── supabase.ts          # Cliente + helpers
│   ├── claude.ts            # Motor de IA + prompts
│   └── stripe.ts            # Cliente Stripe
├── types/                   # TypeScript types
├── styles/                  # CSS global + Tailwind
└── utils/                   # Utilidades
```

## 🎯 Cómo Funciona el Motor de IA

### Sistema Anti-Alucinación

FIDELIS usa un sistema en 3 capas para garantizar fidelidad 100%:

1. **Validación de Entrada**: Verifica que el usuario proporciona texto válido
2. **Generación con Prompts Estrictos**: Claude sigue reglas anti-alucinación
3. **Validación Post-Procesamiento**: Verifica que cada claim está en el original

### Prompt del Sistema

```
Tu trabajo NO es crear, interpretar, mejorar o editar.
Tu trabajo ES SOLO extraer, estructurar y aclarar lo que YA EXISTE en el texto.

REGLAS ABSOLUTAS:
- Nunca inventar
- Preservar nuance
- Mantener scope
- Señalar confianza
- Mantener trazabilidad
```

### Modos de Resumen

| Modo | Uso | % Original |
|------|-----|-----------|
| **Study** | Preparar exámenes | 40% |
| **Brief** | Resumen ejecutivo | 20% |
| **Deep** | Comprensión total | 70% |
| **Conceptmap** | Visualizar relaciones | 35% |

## 💳 Modelo de Negocio

### Free Tier
- 5 resúmenes/mes
- Máx 5,000 palabras
- Solo modo "Study"
- Sin PDF export
- Bloqueo 24h al agotar

### Pro Tier ($9.99/mes)
- Resúmenes ilimitados
- Máx 50,000 palabras
- Todos los modos
- PDF + Notion export
- Historial ilimitado

## 🔐 Seguridad

- JWT tokens con NextAuth
- Oauth con Google
- Validación de inputs en todas partes
- CORS configurado
- Rate limiting en API
- Datos encriptados en Supabase

## 📊 Métricas de Éxito

- **DAU/MAU**: >10% de usuarios activos
- **Conversion rate**: >5% free → pro
- **LTV:CAC**: >3:1
- **Churn**: <5% mensual

## 🚀 Deploy en Vercel

```bash
# 1. Push a GitHub
git push origin main

# 2. Conectar a Vercel
vercel link

# 3. Configurar variables de entorno
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXTAUTH_SECRET
# ... (rest de variables)

# 4. Deploy
vercel --prod
```

## 📞 Soporte

- **Docs**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: GitHub Issues
- **Email**: support@fidelis.app

## 📄 Licencia

MIT

## 🎉 Roadmap v2.0

- [ ] Integración con Notion API
- [ ] Soporte para PDF nativos
- [ ] Colaboración en tiempo real
- [ ] Flashcards automáticas
- [ ] Quiz interactivo
- [ ] Comunidad de estudiantes
- [ ] Marketplace de resúmenes

---

**Hecho con ❤️ para estudiantes que quieren aprender bien**

*"El resumen que NO inventa"* - FIDELIS
