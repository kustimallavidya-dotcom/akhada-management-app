
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed this session
    if (localStorage.getItem('pwa_install_dismissed')) return

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Show banner after a short delay so it doesn't appear immediately
      setTimeout(() => setShowBanner(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setShowBanner(false)
    if (outcome === 'dismissed') {
      localStorage.setItem('pwa_install_dismissed', '1')
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setDismissed(true)
    localStorage.setItem('pwa_install_dismissed', '1')
  }

  return (
    <AnimatePresence>
      {showBanner && !dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 left-4 right-4 z-50"
        >
          <div
            className="rounded-2xl p-4 flex items-center gap-3 border border-cosmic-accent/30"
            style={{
              background: 'rgba(14, 23, 45, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 245, 255, 0.1)',
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-neon flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-cosmic-bg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-cosmic-text">ॲप इन्स्टॉल करा</p>
              <p className="text-xs text-cosmic-muted">होम स्क्रीनवर जोडा, ऑफलाइन वापरा</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleInstall}
                className="px-3 py-1.5 bg-gradient-neon rounded-lg text-xs font-bold text-cosmic-bg"
              >
                इन्स्टॉल
              </motion.button>
              <button onClick={handleDismiss} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                <X className="w-4 h-4 text-cosmic-muted" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
