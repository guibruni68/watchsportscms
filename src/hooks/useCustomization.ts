import { useState, useEffect } from 'react'

interface CustomizationSettings {
  primaryColor: string
  secondaryColor: string
  clubName: string
  clubDescription: string
  logoUrl: string
}

const DEFAULT_SETTINGS: CustomizationSettings = {
  primaryColor: '#2c5eb8',
  secondaryColor: '#059669',
  clubName: 'Clube Fictício FC',
  clubDescription: 'O maior clube da região com mais de 25 anos de história',
  logoUrl: ''
}

export function useCustomization() {
  const [settings, setSettings] = useState<CustomizationSettings>(DEFAULT_SETTINGS)

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    const saved = localStorage.getItem('customization-settings')
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved)
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings })
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      }
    }
  }, [])

  // Aplicar as cores no CSS quando as configurações mudarem
  useEffect(() => {
    const root = document.documentElement
    
    // Converter hex para HSL
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h = 0
      let s = 0
      const l = (max + min) / 2

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break
          case g: h = (b - r) / d + 2; break
          case b: h = (r - g) / d + 4; break
        }
        h /= 6
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
    }

    // Aplicar cor primária
    if (settings.primaryColor) {
      const primaryHsl = hexToHsl(settings.primaryColor)
      root.style.setProperty('--primary', primaryHsl)
      root.style.setProperty('--sidebar-primary', primaryHsl)
      root.style.setProperty('--ring', primaryHsl)
      root.style.setProperty('--sidebar-ring', primaryHsl)
      
      // Calcular variações da cor primária
      const [h, s, l] = primaryHsl.split(' ').map(v => parseInt(v))
      const hoverHsl = `${h} ${s}% ${Math.max(l - 10, 10)}%`
      const glowHsl = `${h} ${s}% ${Math.min(l + 20, 90)}%`
      
      root.style.setProperty('--primary-hover', hoverHsl)
      root.style.setProperty('--primary-glow', glowHsl)
      
      // Atualizar gradientes
      root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${primaryHsl}), hsl(${glowHsl}))`)
      root.style.setProperty('--gradient-hero', `linear-gradient(135deg, hsl(${primaryHsl}) 0%, hsl(${glowHsl}) 100%)`)
      
      // Atualizar sombras
      root.style.setProperty('--shadow-glow', `0 0 20px hsl(${primaryHsl} / 0.6)`)
    }

    // Aplicar cor secundária
    if (settings.secondaryColor) {
      const secondaryHsl = hexToHsl(settings.secondaryColor)
      root.style.setProperty('--secondary', secondaryHsl)
      
      // Calcular variação hover
      const [h, s, l] = secondaryHsl.split(' ').map(v => parseInt(v))
      const hoverHsl = `${h} ${s}% ${Math.max(l - 10, 10)}%`
      
      root.style.setProperty('--secondary-hover', hoverHsl)
      root.style.setProperty('--gradient-secondary', `linear-gradient(135deg, hsl(${secondaryHsl}), hsl(${hoverHsl}))`)
    }

  }, [settings.primaryColor, settings.secondaryColor])

  const updateSettings = (newSettings: Partial<CustomizationSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
  }

  const saveSettings = () => {
    localStorage.setItem('customization-settings', JSON.stringify(settings))
    return Promise.resolve()
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem('customization-settings')
  }

  return {
    settings,
    updateSettings,
    saveSettings,
    resetSettings
  }
}