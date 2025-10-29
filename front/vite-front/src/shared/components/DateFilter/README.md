# DateFilter Component

Componente reutilizable para filtrado por fecha, diseñado con un enfoque minimalista y moderno.

## Características

- ✅ **Minimalista**: Diseño limpio sin elementos innecesarios
- ✅ **Moderno**: Usa input nativo de HTML5 con icono de calendario
- ✅ **Reutilizable**: Arquitectura modular para toda la aplicación
- ✅ **Accesible**: Labels, placeholders y navegación por teclado
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Coherente**: Sigue la paleta de colores de la aplicación

## Uso

```tsx
import { DateFilter } from '@/shared/components/DateFilter';

function MyComponent() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
        <DateFilter
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            placeholder="Seleccionar fecha"
            label="Fecha de reserva"
        />
    );
}
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `selectedDate` | `Date \| undefined` | - | Fecha actualmente seleccionada |
| `onDateChange` | `(date: Date \| null) => void` | **requerido** | Callback cuando cambia la fecha |
| `placeholder` | `string` | "Seleccionar fecha" | Placeholder del input |
| `label` | `string` | - | Etiqueta opcional arriba del input |
| `className` | `string` | "" | Clases CSS adicionales |
| `disabled` | `boolean` | `false` | Deshabilita el componente |
| `minDate` | `Date` | - | Fecha mínima seleccionable |
| `maxDate` | `Date` | - | Fecha máxima seleccionable |

## Estilos

### Tema Visual
- **Borde**: `#e5e7eb` (gris claro)
- **Borde focus**: `#238744` (verde principal)
- **Texto**: `#092747` (azul oscuro)
- **Icono**: `#6b7280` (gris medio)
- **Fondo**: Blanco

### Estados
- **Hover**: Borde verde sutil
- **Focus**: Borde verde + shadow verde claro
- **Disabled**: Fondo gris claro, cursor not-allowed

### Responsive
- **Mobile**: Padding ajustado, fuente más grande para evitar zoom en iOS

## Arquitectura

```
shared/
├── components/
│   ├── DateFilter/
│   │   ├── DateFilter.tsx      # Componente principal
│   │   ├── DateFilter.css      # Estilos minimalistas
│   │   ├── index.ts           # Exportaciones
│   │   └── README.md          # Documentación
│   └── index.ts              # Exportaciones globales
└── index.ts                 # Exportaciones shared
```

## Navegación

- **Flechas del teclado**: Navegar entre días/meses/años
- **Enter/Espacio**: Confirmar selección
- **Escape**: Cerrar calendario
- **Tab**: Navegar entre elementos

## Compatibilidad

- ✅ Chrome 20+
- ✅ Firefox 57+
- ✅ Safari 14.1+
- ✅ Edge 12+

## Ejemplos de Integración

### Con filtros combinados
```tsx
<div className="filters-container">
    <ReserveFilters selectedStatus={status} onStatusChange={setStatus} />
    <DateFilter
        selectedDate={date}
        onDateChange={setDate}
        placeholder="Filtrar por fecha"
    />
</div>
```

### Con validaciones
```tsx
<DateFilter
    selectedDate={selectedDate}
    onDateChange={setSelectedDate}
    minDate={new Date()} // No fechas pasadas
    maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // Máximo 30 días
    label="Fecha de reserva"
/>
```
