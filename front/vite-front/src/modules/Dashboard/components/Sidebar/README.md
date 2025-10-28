# Sidebar Component

Componente modular del Sidebar del Dashboard siguiendo principios SOLID y buenas prácticas.

## Estructura del Módulo

```
Sidebar/
├── components/          # Componentes atómicos reutilizables
│   ├── SidebarLogo.tsx
│   ├── SidebarItem.tsx
│   ├── SidebarNav.tsx
│   ├── ExitButton.tsx
│   ├── SidebarToggle.tsx
│   └── index.ts
├── hooks/              # Custom hooks para lógica de negocio
│   └── useMenuItems.ts
├── utils/              # Funciones auxiliares
│   └── navigation.ts
├── constants.ts        # Constantes y configuración
├── types.ts           # Definiciones de tipos TypeScript
├── Sidebar.tsx        # Componente principal (orquestador)
├── Sidebar.css        # Estilos del componente
└── README.md          # Documentación

```

## Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada componente tiene una única responsabilidad:
  - `SidebarLogo`: Renderiza el logo
  - `SidebarItem`: Renderiza un item de menú
  - `SidebarNav`: Gestiona la lista de navegación
  - `ExitButton`: Botón de salida
  - `SidebarToggle`: Botón de colapsar/expandir

### Open/Closed Principle (OCP)
- Los componentes están abiertos a extensión pero cerrados a modificación
- Nuevos roles de usuario se pueden agregar en `constants.ts` sin modificar componentes

### Liskov Substitution Principle (LSP)
- Todos los componentes implementan interfaces bien definidas
- Los componentes pueden ser reemplazados por implementaciones alternativas

### Interface Segregation Principle (ISP)
- Cada componente recibe solo las props que necesita
- Interfaces específicas en `types.ts` para cada componente

### Dependency Inversion Principle (DIP)
- Los componentes dependen de abstracciones (interfaces) no de implementaciones concretas
- La lógica de negocio está separada en hooks y utils

## Uso

```tsx
import Sidebar from './modules/Dashboard/components/Sidebar/Sidebar';

<Sidebar
    isCollapsed={isCollapsed}
    setIsCollapsed={setIsCollapsed}
    activeItem={activeItem}
    onItemClick={handleItemClick}
    userRole="admin"
/>
```

## Extensibilidad

### Agregar un nuevo rol de usuario:
1. Definir el tipo en `types.ts`
2. Agregar los items del menú en `constants.ts`
3. Actualizar el hook `useMenuItems.ts`

### Agregar un nuevo componente:
1. Crear el componente en `components/`
2. Definir su interfaz en `types.ts`
3. Exportarlo en `components/index.ts`
4. Usarlo en `Sidebar.tsx`

## Buenas Prácticas Implementadas

- ✅ Separación de responsabilidades
- ✅ Componentes pequeños y reutilizables
- ✅ Tipado estricto con TypeScript
- ✅ Custom hooks para lógica de negocio
- ✅ Constantes centralizadas
- ✅ Funciones puras en utils
- ✅ Uso de `useCallback` para optimización
- ✅ Accesibilidad (ARIA labels)
- ✅ Nombres descriptivos en inglés
- ✅ Documentación clara
