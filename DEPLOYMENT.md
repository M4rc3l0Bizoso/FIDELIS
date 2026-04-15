# 🚀 FIDELIS - Instrucciones de Deployment

Guía completa para deploy de FIDELIS a producción.

## Pre-requisitos

- Node.js 18+
- npm o yarn
- Cuenta en Vercel
- Cuenta en Supabase
- Cuenta en Google Cloud Console
- Cuenta en Anthropic
- Cuenta en Stripe

## 1️⃣ Configurar Supabase

```bash
# 1. Crear proyecto en supabase.co

# 2. En SQL Editor, crear tablas:
# (Ver schema en docs/database-schema.sql)

# 3. Obtener credenciales:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# 4. Enable Google OAuth
# Authentication → Providers → Google
# (Copiar Client ID/Secret de Google)
```

## 2️⃣ Configurar Google OAuth

```bash
# 1. Google Cloud Console
# https://console.cloud.google.com

# 2. Create Project → "FIDELIS"

# 3. Enable OAuth 2.0
# APIs & Services → Create Credentials → OAuth 2.0 Client ID

# 4. Application type: Web application

# 5. Authorized redirect URIs:
http://localhost:3000/api/auth/callback/google
https://tu-dominio.vercel.app/api/auth/callback/google

# 6. Copiar credenciales:
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
```

## 3️⃣ Configurar Anthropic (Claude)

```bash
# 1. https://console.anthropic.com

# 2. Crear API key

# 3. Obtener:
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

## 4️⃣ Configurar Stripe

```bash
# 1. https://dashboard.stripe.com

# 2. Crear 2 precios (Products → Create):
# - Pro Monthly: $9.99/mes
# - Pro Yearly: $79/año

# 3. Obtener IDs:
STRIPE_PRICE_ID_MONTHLY=price_xxxxx
STRIPE_PRICE_ID_YEARLY=price_xxxxx

# 4. Crear webhook (Developers → Webhooks → Add endpoint):
# URL: https://tu-dominio.vercel.app/api/stripe/webhook
# Events:
#   - checkout.session.completed
#   - invoice.payment_succeeded
#   - invoice.payment_failed
#   - customer.subscription.deleted

# 5. Copiar:
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

## 5️⃣ Deploy a Vercel

```bash
# 1. Conectar repo
vercel link

# 2. Configurar variables de entorno
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXTAUTH_SECRET  # openssl rand -base64 32
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add ANTHROPIC_API_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add STRIPE_PRICE_ID_MONTHLY
vercel env add STRIPE_PRICE_ID_YEARLY

# 3. Deploy
vercel --prod

# 4. Verificar
curl https://tu-dominio.vercel.app

# 5. Confirmar webhook en Stripe
```

## 6️⃣ Post-Deploy Checklist

- [ ] Landing page funciona
- [ ] Login con Google funciona
- [ ] Dashboard accesible
- [ ] API /api/summarize funciona
- [ ] Sistema de créditos funciona
- [ ] Bloqueo de créditos funciona
- [ ] Stripe checkout funciona
- [ ] Email de confirmación llega
- [ ] Webhook de Stripe funciona
- [ ] Bases de datos tienen datos

## 🔧 Monitoreo en Producción

### Logs en Vercel

```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs de errores
vercel logs --since 1h
```

### Base de Datos

```bash
# Conectar a Supabase
# supabase.co → Studio → SQL Editor

# Queries útiles:
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM summaries;
SELECT * FROM subscriptions WHERE status = 'active';
```

### Stripe

```bash
# Verificar webhooks
# dashboard.stripe.com → Developers → Webhooks → View logs

# Testear webhook
stripe trigger payment_intent.succeeded
```

## 🚨 Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL is not set"

```bash
# Verificar variables en Vercel
vercel env list

# Re-deployar
vercel --prod --force
```

### Error: "Invalid Google Client ID"

- Verificar que Client ID está correcto
- Verificar que redirect URI está configurado
- Regenerar credentials si es necesario

### Error: "Webhook signature verification failed"

- Verificar que STRIPE_WEBHOOK_SECRET es correcto
- Re-crear webhook en Stripe si es necesario

### Error: "No text content in response from Claude"

- Verificar que ANTHROPIC_API_KEY es válida
- Revisar logs en Vercel
- Aumentar max_tokens si es necesario

## 📈 Escalar a Producción

### Performance

```
- Implementar caching (Redis)
- CDN para assets estáticos
- Database read replicas
- Queue system (Bull)
```

### Seguridad

```
- Habilitar HTTPS everywhere
- Implementar rate limiting
- Audit logs
- DDoS protection (Cloudflare)
```

### Monitoreo

```
- Sentry para error tracking
- Posthog para analytics
- Healthchecks
- Alertas por email
```

## 📞 Soporte

- Issues: GitHub Issues
- Documentación: README.md
- Email: support@fidelis.app

---

**¡Listo para deploy!** 🚀
