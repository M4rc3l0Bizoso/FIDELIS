'use client';

import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';

export default function LandingPage() {
  const features = [
    {
      icon: '✅',
      title: 'Sin Alucinaciones',
      description: 'Nuestro sistema valida cada afirmación contra el texto original',
    },
    {
      icon: '🔗',
      title: 'Trazabilidad Total',
      description: 'Ve exactamente de dónde sale cada punto del resumen',
    },
    {
      icon: '🎯',
      title: 'Modos Académicos',
      description: 'Estudio, Breve, Profundo, Mapas Conceptuales',
    },
    {
      icon: '❓',
      title: 'Preguntas de Examen',
      description: 'Generadas solo del contenido del texto',
    },
    {
      icon: '⚠️',
      title: 'Detección de Ambigüedades',
      description: 'Te alerta cuando el texto original es confuso',
    },
    {
      icon: '⚡',
      title: 'Premium y Simple',
      description: 'Diseñado como Apple. Puro, limpio, confiable',
    },
  ];

  const stats = [
    { number: '500+', label: 'Estudiantes activos' },
    { number: '95%', label: 'Tasa de precisión' },
    { number: '4.8★', label: 'Calificación promedio' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="border-b border-purple-500/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gradient">
            ✨ FIDELIS
          </div>
          <button
            onClick={() => signIn('google')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition"
          >
            Empezar
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient">
            El resumen que NO inventa
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Resumidor académico con fidelidad al 100%. Trazabilidad total. Modos específicos para estudiar.
            <br />
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold">
              La herramienta en la que confían 500+ estudiantes.
            </span>
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signIn('google')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg font-bold text-lg transition"
          >
            Iniciar sesión con Google →
          </motion.button>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-gradient">
                {stat.number}
              </div>
              <div className="text-gray-400 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <h2 className="text-4xl font-bold text-center mb-16">
          Por qué FIDELIS es diferente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-400/30 rounded-lg p-6 hover:border-blue-400/60 transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <h2 className="text-4xl font-bold text-center mb-16">Precios simples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-8"
          >
            <h3 className="text-2xl font-bold mb-2">Gratis</h3>
            <p className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-400">/mes</span></p>
            <ul className="space-y-3 mb-8 text-gray-300">
              <li>✓ 5 resúmenes/mes</li>
              <li>✓ Hasta 5,000 palabras</li>
              <li>✓ Modo &ldquo;Estudio&rdquo;</li>
              <li>✓ Trazabilidad completa</li>
            </ul>
            <button
              onClick={() => signIn('google')}
              className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold transition"
            >
              Empezar gratis
            </button>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 ring-2 ring-blue-400 relative"
          >
            <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
              Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-4xl font-bold mb-6">$9.99<span className="text-lg">/mes</span></p>
            <ul className="space-y-3 mb-8">
              <li>✓ Resúmenes ilimitados</li>
              <li>✓ Hasta 50,000 palabras</li>
              <li>✓ Todos los modos</li>
              <li>✓ Exportar PDF/Notion</li>
              <li>✓ Historial ilimitado</li>
            </ul>
            <button
              onClick={() => signIn('google')}
              className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Activar Pro
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Comienza a resumir con confianza
        </h2>
        <p className="text-gray-300 mb-8">
          Únete a cientos de estudiantes que ya usan FIDELIS
        </p>
        <button
          onClick={() => signIn('google')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition"
        >
          Empezar gratis →
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-8 text-center text-gray-400">
        <p>© 2024 FIDELIS. Resumidor académico de confianza.</p>
      </footer>
    </div>
  );
}
