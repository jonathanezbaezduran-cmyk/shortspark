# 🚀 ShortSpark — Guía de Deployment Completa

## Lo que necesitas antes de empezar
- [ ] Dominio comprado (shortspark.net en Namecheap)
- [ ] Cuenta en GitHub (github.com) — gratis
- [ ] Cuenta en Vercel (vercel.com) — gratis
- [ ] Cuenta en Stripe (stripe.com) — gratis
- [ ] Tu API key de Anthropic (ya la tienes)

---

## PASO 1 — Sube el proyecto a GitHub

1. Ve a github.com → New repository
2. Nombre: `shortspark` → Create repository
3. Instala Git si no lo tienes: https://git-scm.com
4. Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
git init
git add .
git commit -m "ShortSpark initial"
git remote add origin https://github.com/TU_USUARIO/shortspark.git
git push -u origin main
```

---

## PASO 2 — Despliega en Vercel

1. Ve a vercel.com → Login con GitHub
2. Click "Add New Project"
3. Selecciona el repo `shortspark`
4. Click "Deploy" (Vercel detecta Next.js automáticamente)
5. En 2 minutos tienes la app en vivo en una URL de vercel.com

---

## PASO 3 — Crea el producto en Stripe

1. Ve a stripe.com → Create account
2. En el dashboard: Products → Add Product
   - Name: ShortSpark Pro
   - Price: $9.00 / month (recurring)
3. Copia el **Price ID** (empieza con `price_`)
4. Ve a Developers → API Keys → copia el **Secret key** (empieza con `sk_live_`)
5. Ve a Developers → Webhooks → Add endpoint:
   - URL: `https://shortspark.net/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`
6. Copia el **Webhook signing secret** (empieza con `whsec_`)

---

## PASO 4 — Configura las variables de entorno en Vercel

1. En Vercel → tu proyecto → Settings → Environment Variables
2. Agrega estas variables:

```
ANTHROPIC_API_KEY        = sk-ant-TU_KEY
STRIPE_SECRET_KEY        = sk_live_TU_KEY
STRIPE_WEBHOOK_SECRET    = whsec_TU_SECRET
STRIPE_PRICE_ID          = price_TU_PRICE_ID
NEXT_PUBLIC_APP_URL      = https://shortspark.net
```

3. Haz Redeploy para que las variables tomen efecto

---

## PASO 5 — Conecta el dominio

1. En Vercel → tu proyecto → Settings → Domains
2. Escribe: `shortspark.net` → Add
3. Vercel te da los DNS records
4. Ve a Namecheap → tu dominio → Advanced DNS
5. Agrega los registros que Vercel indica
6. Espera 10–30 minutos y listo ✅

---

## ¡Listo! Tu app está en vivo

Usuarios entran a shortspark.net → 3 análisis gratis → paywall de $9/mes → pagan con Stripe → tú recibes el dinero.

---

## Estructura del proyecto

```
shortspark/
├── pages/
│   ├── index.jsx          ← App principal (frontend)
│   └── api/
│       ├── analyze.js     ← Proxy seguro a Claude AI
│       ├── create-checkout.js  ← Crea sesión de pago Stripe
│       └── webhook.js     ← Confirma pagos de Stripe
├── .env.example           ← Template de variables de entorno
├── package.json
└── README.md
```

---

## Dudas frecuentes

**¿Cuándo me llega el dinero?**
Stripe deposita a tu cuenta bancaria cada 7 días automáticamente.

**¿Cuánto cobra Stripe?**
2.9% + $0.30 por transacción. En $9 te quedan ~$8.44.

**¿Puedo cambiar el precio?**
Sí, en cualquier momento desde el dashboard de Stripe.
