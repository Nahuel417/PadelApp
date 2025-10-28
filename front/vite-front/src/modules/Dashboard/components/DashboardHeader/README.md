# DashboardHeader Component

Componente modular del Header del Dashboard siguiendo principios SOLID y buenas prácticas.

## Estructura del Módulo

```
DashboardHeader/
├── components/              # Componentes atómicos reutilizables
│   ├── MobileMenuButton.tsx
│   ├── HeaderTitle.tsx
│   ├── UserAvatar.tsx
│   ├── UserInfo.tsx
│   └── index.ts
├── utils/                   # Funciones auxiliares
│   └── userUtils.ts
├── constants/               # Constantes y configuración
│   └── constants.ts
├── types/                   # Definiciones de tipos TypeScript
│   └── types.ts
├── DashboardHeader.tsx      # Componente principal (orquestador)
├── DashboardHeader.css      # Estilos del componente
└── README.md               # Documentación
```

## Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada componente tiene una única responsabilidad:
  - `MobileMenuButton`: Botón para toggle del sidebar en móvil
  - `HeaderTitle`: Título del dashboard
  - `UserAvatar`: Avatar del usuario con iniciales
  - `UserInfo`: Información completa del usuario (avatar + datos)

### Open/Closed Principle (OCP)
- Los componentes están abiertos a extensión pero cerrados a modificación
- Nuevos roles se pueden agregar en `constants.ts` sin modificar componentes

### Liskov Substitution Principle (LSP)
- Todos los componentes implementan interfaces bien definidas
- Los componentes pueden ser reemplazados por implementaciones alternativas

### Interface Segregation Principle (ISP)
- Cada componente recibe solo las props que necesita
- Interfaces específicas en `types.ts` para cada componente

### Dependency Inversion Principle (DIP)
- Los componentes dependen de abstracciones (interfaces) no de implementaciones concretas
- La lógica de utilidades está separada en `utils/`

## Uso

```tsx
import DashboardHeader from './modules/Dashboard/components/DashboardHeader/DashboardHeader';

<DashboardHeader
    userName="Juan Pérez"
    userRole="admin"
    isCollapsed={isCollapsed}
    onToggleSidebar={handleToggleSidebar}
/>
```

## Funcionalidades

### Información del Usuario
- Muestra avatar con iniciales generadas automáticamente
- Muestra nombre completo del usuario
- Muestra rol traducido al español

### Responsive
- En desktop: muestra toda la información
- En tablet: oculta la información del usuario pero mantiene el avatar
- En móvil: muestra botón de menú para toggle del sidebar

### Animaciones
- Hover suave en el contenedor del usuario
- Efecto de escala en el avatar
- Transiciones suaves en todos los elementos

## Extensibilidad

### Agregar un nuevo rol:
1. Definir el tipo en `types/types.ts`
2. Agregar la traducción en `constants/constants.ts`
3. La función `getRoleLabel` lo manejará automáticamente

### Agregar un nuevo componente:
1. Crear el componente en `components/`
2. Definir su interfaz en `types/types.ts`
3. Exportarlo en `components/index.ts`
4. Usarlo en `DashboardHeader.tsx`

## Buenas Prácticas Implementadas

- ✅ Separación de responsabilidades
- ✅ Componentes pequeños y reutilizables
- ✅ Tipado estricto con TypeScript
- ✅ Funciones puras en utils
- ✅ Constantes centralizadas
- ✅ Uso de `useMemo` para optimización
- ✅ Accesibilidad (ARIA labels)
- ✅ Diseño responsive
- ✅ Animaciones sutiles
- ✅ Nombres descriptivos en inglés
- ✅ Documentación clara
