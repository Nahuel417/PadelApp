## Paleta de Colores

Los colores están definidos como variables CSS HSL en `globals.css`:

### Colores Principales (Light Mode)

```css
:root {
    --background: 0 0% 100%; /* Blanco */
    --foreground: 210 73% 16%; /* Azul #092747 */
    --primary: 210 73% 16%; /* Azul #092747 */
    --primary-foreground: 210 40% 98%; /* Blanco */
    --secondary: 210 40% 96.1%; /* Gris muy claro */
    --accent: 210 40% 96.1%; /* Gris muy claro */
    --muted: 210 40% 96.1%; /* Gris claro */
    --muted-foreground: 215.4 16.3% 46.9%; /* Gris medio */
    --destructive: 0 84.2% 60.2%; /* Rojo */
    --border: 214.3 31.8% 91.4%; /* Gris claro para bordes */
    --input: 214.3 31.8% 91.4%; /* Gris claro para inputs */
    --ring: 210 73% 16%; /* Azul #092747 para focus */
}
```

### Colores del Sidebar

```css
--sidebar-background: 0 0% 98%; /* Gris muy claro */
--sidebar-foreground: 210 73% 16%; /* Azul #092747 */
--sidebar-primary: 210 73% 16%; /* Azul #092747 */
--sidebar-accent: 240 4.8% 95.9%; /* Gris claro */
```

## Tipografía

-   **Fuente principal**: 'Poppins'
-   **Peso**: Regular (400) por defecto, medium (500) para elementos importantes
-   **Tamaños comunes**: text-sm (14px), text-base (16px), text-lg (18px), text-xl (20px), text-2xl (24px), text-3xl (30px)

## CSS Puro Equivalente

Para replicar los estilos sin Tailwind, usa estas reglas CSS:

```css
/* Importar fuente */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

/* Variables de color */
:root {
    --background: hsl(0, 0%, 100%);
    --foreground: hsl(210, 73%, 16%); /* Azul #092747 */
    --primary: hsl(210, 73%, 16%); /* Azul #092747 */
    --primary-foreground: hsl(210, 40%, 98%);
    --secondary: hsl(210, 40%, 96.1%);
    --accent: hsl(210, 40%, 96.1%);
    --muted: hsl(210, 40%, 96.1%);
    --muted-foreground: hsl(215.4, 16.3%, 46.9%);
    --destructive: hsl(0, 84.2%, 60.2%);
    --border: hsl(214.3, 31.8%, 91.4%);
    --input: hsl(214.3, 31.8%, 91.4%);
    --ring: hsl(210, 73%, 16%); /* Azul #092747 para focus */
    --sidebar-background: hsl(0, 0%, 98%);
    --sidebar-foreground: hsl(210, 73%, 16%); /* Azul #092747 */
    --sidebar-primary: hsl(210, 73%, 16%); /* Azul #092747 */
    --sidebar-accent: hsl(240, 4.8%, 95.9%);
}

/* Reset y base */
* {
    box-sizing: border-box;
    border-color: var(--border);
}

body {
    font-family: 'Outfit', sans-serif;
    background-color: var(--background);
    color: var(--foreground);
    margin: 0;
    padding: 0;
    min-height: 100vh;
}

/* Utilidades comunes */
.min-h-screen {
    min-height: 100vh;
}
.w-full {
    width: 100%;
}
.h-full {
    height: 100%;
}
.flex {
    display: flex;
}
.grid {
    display: grid;
}
.flex-col {
    flex-direction: column;
}
.items-center {
    align-items: center;
}
.justify-center {
    justify-content: center;
}
.justify-between {
    justify-content: space-between;
}
.gap-4 {
    gap: 1rem;
}
.gap-2 {
    gap: 0.5rem;
}
.p-4 {
    padding: 1rem;
}
.p-6 {
    padding: 1.5rem;
}
.px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
}
.py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
}
.rounded-md {
    border-radius: 0.375rem;
}
.rounded-lg {
    border-radius: 0.5rem;
}
.border {
    border: 1px solid;
}
.border-b {
    border-bottom: 1px solid;
}
.border-r {
    border-right: 1px solid;
}
.bg-background {
    background-color: var(--background);
}
.bg-primary {
    background-color: var(--primary);
}
.bg-secondary {
    background-color: var(--secondary);
}
.bg-sidebar {
    background-color: var(--sidebar-background);
}
.text-primary {
    color: var(--primary);
}
.text-muted-foreground {
    color: var(--muted-foreground);
}
.text-sidebar-foreground {
    color: var(--sidebar-foreground);
}
.font-medium {
    font-weight: 500;
}
.font-semibold {
    font-weight: 600;
}
.font-bold {
    font-weight: 700;
}
.text-sm {
    font-size: 0.875rem;
}
.text-lg {
    font-size: 1.125rem;
}
.text-xl {
    font-size: 1.25rem;
}
.text-2xl {
    font-size: 1.5rem;
}
.text-3xl {
    font-size: 1.875rem;
}
.text-center {
    text-align: center;
}
.whitespace-nowrap {
    white-space: nowrap;
}
.transition-all {
    transition-property: all;
}
.duration-300 {
    transition-duration: 300ms;
}
.duration-500 {
    transition-duration: 500ms;
}
.hover\:bg-accent:hover {
    background-color: var(--accent);
}
.hover\:text-accent-foreground:hover {
    color: var(--accent-foreground);
}
.focus-visible\:ring-2:focus-visible {
    box-shadow: 0 0 0 2px var(--ring);
}

/* Botones */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    white-space: nowrap;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    height: 2.5rem;
    transition: all 150ms;
    cursor: pointer;
    border: none;
}

.btn-default {
    background-color: var(--primary);
    color: var(--primary-foreground);
}

.btn-default:hover {
    background-color: hsl(210, 73%, 16%, 0.9);
}

.btn-secondary {
    background-color: var(--secondary);
    color: var(--secondary-foreground);
}

.btn-secondary:hover {
    background-color: hsl(210, 40%, 96.1%, 0.8);
}

.btn-outline {
    border: 1px solid var(--input);
    background-color: var(--background);
    color: var(--foreground);
}

.btn-outline:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
}

/* Cards */
.card {
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 1.5rem;
}

.card-header {
    padding-bottom: 0.75rem;
}

.card-title {
    font-size: 0.875rem;
    font-weight: 500;
    margin: 0;
}

/* Responsive */
@media (min-width: 768px) {
    .md\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .md\:grid-cols-4 {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .lg\:p-6 {
        padding: 1.5rem;
    }
}
```

## Notas Adicionales

-   El diseño es minimalista con bordes redondeados suaves
-   Usa transiciones de 300ms para interacciones
-   Los colores están optimizados para modo claro, pero hay variables para modo oscuro
-   El sidebar usa colores específicos para mantener jerarquía visual
-   Los botones tienen estados hover y focus accesibles
