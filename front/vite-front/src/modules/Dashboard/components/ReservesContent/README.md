# ReservesContent Component

Componente modular para la gestión de reservas del Dashboard, siguiendo principios SOLID y buenas prácticas.

## Estructura del Módulo

```
ReservesContent/
├── components/
│   ├── ReserveHeader/
│   │   ├── ReserveHeader.tsx
│   │   └── ReserveHeader.css
│   ├── ReserveStatusBadge/
│   │   ├── ReserveStatusBadge.tsx
│   │   └── ReserveStatusBadge.css
│   ├── ReserveFilters/
│   │   ├── ReserveFilters.tsx
│   │   └── ReserveFilters.css
│   ├── ReserveList/
│   │   ├── ReserveList.tsx
│   │   └── ReserveList.css
│   ├── ReserveTableHeader/
│   │   ├── ReserveTableHeader.tsx
│   │   └── ReserveTableHeader.css
│   ├── ReserveRow/
│   │   ├── ReserveRow.tsx
│   │   └── ReserveRow.css
│   └── index.ts
├── utils/
│   └── reserveUtils.ts
├── constants/
│   └── constants.ts
├── types/
│   └── types.ts
├── ReservesContent.tsx
├── ReservesContent.css
├── index.ts
└── README.md
```

## Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada componente tiene una única responsabilidad:
  - `ReserveHeader`: Encabezado con estadísticas
  - `ReserveStatusBadge`: Badge de estado
  - `ReserveFilters`: Filtros por estado
  - `ReserveList`: Lista de reservas (contenedor)
  - `ReserveTableHeader`: Encabezado de tabla
  - `ReserveRow`: Fila de tabla con acciones

### Open/Closed Principle (OCP)
- Los componentes están abiertos a extensión pero cerrados a modificación
- Nuevos estados se pueden agregar en `constants.ts`

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
import ReservesContent from './modules/Dashboard/components/ReservesContent/ReservesContent';

<ReservesContent userRole="admin" />
```

## Funcionalidades

### Gestión de Reservas
- Visualización de todas las reservas
- Filtrado por estado (Todas, Pendientes, Confirmadas, Completadas, Canceladas)
- Aprobación de reservas pendientes
- Rechazo de reservas pendientes
- Cancelación de reservas

### Estados de Reserva
- **Pendiente**: Amarillo (#dbeafe) con borde azul
- **Confirmada**: Verde claro (#e1f3ea) con borde verde
- **Completada**: Azul claro (#dbeafe) con borde azul
- **Cancelada**: Rojo claro (#fdeaea) con borde rojo

### Información Mostrada
- Fecha y horario
- Cancha y usuario
- Entrenador (si aplica)
- Precio y estado
- Acciones disponibles

## Extensibilidad

### Agregar un nuevo estado:
1. Definir el tipo en `types.ts`
2. Agregar la etiqueta en `constants.ts`
3. Agregar los colores en `constants.ts`
4. Agregar el estilo en el componente correspondiente

### Agregar un nuevo componente:
1. Crear carpeta en `components/`
2. Crear componente .tsx y .css
3. Exportar en `components/index.ts`
4. Usarlo en `ReservesContent.tsx`

## Buenas Prácticas Implementadas

- ✅ Componentes modularizados por carpeta
- ✅ CSS separado por componente
- ✅ Separación de responsabilidades
- ✅ Tipado estricto con TypeScript
- ✅ Custom hooks para lógica de negocio
- ✅ Constantes centralizadas
- ✅ Funciones puras en utils
- ✅ Uso de `useMemo` y `useCallback` para optimización
- ✅ Accesibilidad (ARIA labels)
- ✅ Diseño responsive
- ✅ Animaciones sutiles
- ✅ Nombres descriptivos en inglés
- ✅ Documentación clara
