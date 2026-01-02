# Mejoras de Accesibilidad y Responsividad

## ✅ Cambios Implementados

### 🎨 Sistema de Temas Automático
- **Tema oscuro** (por defecto)
- **Tema claro** automático según `prefers-color-scheme: light`
- Variables CSS centralizadas en `:root`
- Sin JavaScript, solo CSS

### ♿ Accesibilidad (a11y)

#### Estados de foco mejorados
- `:focus-visible` en todos los elementos interactivos
- Outline visible de 2px con offset
- Box-shadow adicional en inputs para mejor visibilidad

#### Tamaños táctiles
- Mínimo de 44px para todos los botones
- Iconos de copiar: 44px (desktop) y 48px (móvil)
- Área de click ampliada con padding

#### Semántica y ARIA
- `aria-label="Copiar URL al portapapeles"` en iconos SVG
- `role="button"` en elementos clickeables no-button
- `tabindex="0"` para navegación por teclado
- Soporte para Enter y Espacio en iconos
- `rel="noopener noreferrer"` en links externos

#### Contraste
- Todos los colores cumplen WCAG AA
- Tema claro con contraste ajustado
- Bordes visibles en ambos temas

### 📱 Diseño Responsivo (Mobile-First)

#### Breakpoints
- `≤375px`: Pantallas muy pequeñas
- `≤640px`: Móviles
- `≤768px`: Tablets

#### Adaptaciones móvil
- Layouts en columna para URLs
- Inputs y botones a ancho completo
- Espaciado vertical optimizado
- Tipografía escalable con `clamp()`
- Iconos más grandes (48px vs 44px)

### 🎬 Animaciones Optimizadas

#### Respeto a preferencias
- `@media (prefers-reduced-motion: reduce)` implementado
- Desactiva animaciones automáticamente
- Transiciones mínimas (0.01ms)

#### Transiciones suaves
- Variables CSS para consistencia
- `--transition-fast: 0.15s`
- `--transition-normal: 0.2s`
- Solo en hover/focus

## 🎨 Variables CSS Nuevas

### Colores
```css
--color-bg-primary
--color-bg-secondary
--color-text-primary
--color-text-secondary
--color-accent
--color-success
--color-border
--color-error-*
--color-success-*
```

### Espaciado
```css
--spacing-xs: 8px
--spacing-sm: 12px
--spacing-md: 16px
--spacing-lg: 20px
--spacing-xl: 30px
--spacing-2xl: 40px
```

### Otros
```css
--touch-target-min: 44px
--transition-fast: 0.15s
--transition-normal: 0.2s
--radius-sm/md/lg
```

## 🧪 Testing Recomendado

### Accesibilidad
- [ ] Navegación completa con teclado (Tab, Enter, Espacio)
- [ ] Lector de pantalla (NVDA, JAWS, VoiceOver)
- [ ] Contraste con herramientas (WebAIM, axe DevTools)
- [ ] Zoom hasta 200% sin pérdida de funcionalidad

### Responsividad
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] Android estándar (360px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)

### Temas
- [ ] Modo oscuro (por defecto)
- [ ] Modo claro (System Preferences)
- [ ] Cambio automático del sistema

### Movimiento reducido
- [ ] Activar "Reducir movimiento" en sistema
- [ ] Verificar que animaciones se desactivan

## 📝 Notas Técnicas

- **No se modificó JavaScript**: Solo CSS y atributos HTML semánticos
- **No se cambió la lógica**: Backend y funcionalidad intacta
- **Sin frameworks**: Solo CSS vanilla y HTML semántico
- **Compatibilidad**: Navegadores modernos (últimas 2 versiones)

## 🔧 Personalización

Para cambiar la paleta de colores, solo edita las variables en `:root` y
`@media (prefers-color-scheme: light)` en `styles.css`.

Las variables de espaciado pueden ajustarse para modificar la densidad de la UI.
