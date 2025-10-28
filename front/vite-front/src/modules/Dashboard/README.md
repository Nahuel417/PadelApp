# Dashboard Module

Módulo de Dashboard con arquitectura modular y CSS puro siguiendo el STYLE_GUIDE.

## Estructura de Archivos

```
Dashboard/
├── styles/
│   └── variables.css          # Variables CSS globales del STYLE_GUIDE
├── components/
│   ├── Sidebar/
│   │   ├── Sidebar.tsx        # Componente Sidebar
│   │   └── Sidebar.module.css # Estilos del Sidebar
│   ├── CoachDashboard/
│   │   ├── CoachDashboard.tsx
│   │   └── CoachDashboard.module.css
│   └── HeaderDashboard/
│       ├── HeaderDashboard.tsx
│       └── HeaderDashboard.module.css
├── DashboardLayout.tsx        # Layout principal del dashboard
├── DashboardLayout.module.css # Estilos del layout
├── MainDashboard.tsx          # Dashboard principal
├── MainDashboard.module.css   # Estilos del dashboard principal
└── css-modules.d.ts           # Declaraciones TypeScript para CSS modules

```

## Paleta de Colores

Basada en el STYLE_GUIDE.md:

### Colores Principales
-   **Azul Principal (#1d3d5f)**: Textos, títulos, elementos principales
-   **Gris de Fondo (#d3d3d3)**: Fondo del dashboard y sidebar
-   **Blanco**: Cards y contenedores

### Colores de Estado - Verde (Success)
-   **Verde Oscuro (#238744)**: Bordes de botones, estados activos
-   **Verde Claro (#e1f3ea)**: Backgrounds de botones, estados hover

### Colores de Estado - Celeste (Info)
-   **Celeste Oscuro (#60a5fa)**: Bordes de cards o botones informativos
-   **Celeste Claro (#dbeafe)**: Backgrounds de cards o botones informativos

### Colores de Estado - Rojo (Error/Danger)
-   **Rojo Oscuro (#b91c1c)**: Bordes de cards o botones de error/peligro
-   **Rojo Claro (#fdeaea)**: Backgrounds de cards o botones de error/peligro

## Convenciones de Estilo

### CSS Modules

-   Cada componente tiene su propio archivo `.module.css`
-   Las clases se importan como objeto: `import styles from './Component.module.css'`
-   Uso: `className={styles.nombreClase}`

### Variables CSS

-   Todas las variables están definidas en `styles/variables.css`
-   Uso de variables: `var(--nombre-variable)`
-   Variables principales:
    -   `--blue-primary`: #1d3d5f
    -   `--green-dark`: #238744
    -   `--green-light`: #e1f3ea
    -   `--cyan-dark`: #60a5fa
    -   `--cyan-light`: #dbeafe
    -   `--red-dark`: #b91c1c
    -   `--red-light`: #fdeaea
    -   `--background-gray`: #d3d3d3

### Nomenclatura de Clases

-   **camelCase** para nombres de clases en CSS modules
-   Nombres descriptivos y específicos
-   Ejemplo: `.pageHeader`, `.statCard`, `.menuItem`

## Componentes

### DashboardLayout

Layout principal que contiene:

-   Grid responsive con sidebar colapsable
-   Header sticky
-   Área de contenido principal
-   Footer

### Sidebar

Barra lateral de navegación:

-   Colapsable (256px ↔ 64px)
-   Items de menú con iconos
-   Estado activo con color verde
-   Responsive para móviles

### MainDashboard

Dashboard principal con:

-   Título con línea verde decorativa
-   Grid de estadísticas (3 columnas en desktop)
-   Cards de bienvenida

### CoachDashboard

Dashboard para entrenadores con:

-   Estadísticas específicas de coach
-   Grid de 2 columnas
-   Información personalizada

## Responsive Design

-   **Mobile** (< 768px): Sidebar oculto, grid de 1 columna
-   **Tablet** (768px - 1024px): Grid de 2 columnas
-   **Desktop** (> 1024px): Grid completo de 3 columnas

## Uso

```tsx
import MainDashboard from './modules/Dashboard/MainDashboard';

function App() {
    return <MainDashboard />;
}
```

## Notas

-   No se usa Tailwind CSS, solo CSS puro
-   Fuente: 'Poppins' (debe estar importada en el proyecto)
-   Transiciones suaves de 200-300ms
-   Box-shadows sutiles para profundidad
