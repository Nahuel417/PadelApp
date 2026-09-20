# PadelApp: guía para agentes y colaboradores

Este documento separa el **alcance objetivo decidido para el MVP** del **estado del código observado**. Las decisiones de producto y arquitectura de la primera sección son autoritativas, pero no deben presentarse como funcionalidades ya implementadas.

## Reglas de trabajo obligatorias

- Toda comunicación y documentación del proyecto debe estar en español.
- El código, las tablas, las variables, las rutas y otros nombres técnicos pueden mantenerse en inglés.
- No modificar código, configuración o datos sin autorización expresa del usuario.
- Preservar los cambios locales y evitar operaciones Git destructivas.
- No actualizar dependencias mayores de forma masiva.
- El usuario hará commits, `push` y PR, salvo pedido expreso.
- No inventar tablas, RLS, RPC, migraciones, políticas, permisos, datos, pagos, despliegues ni contratos backend que no estén versionados o verificados.

## Alcance y decisiones objetivo del MVP

### Producto y lanzamiento

- PadelApp es una plataforma **multi-tenant para múltiples clubes independientes desde el MVP**.
- El lanzamiento será mediante un piloto controlado con pocos clubes. Antes de ampliar, deben validarse reservas reales, pagos reales y aislamiento mediante RLS.
- El alta de clubes requiere aprobación manual del `superadmin`.
- No hay una pantalla comercial de auditoría. Sí deben existir registros técnicos mínimos de las acciones críticas.

### Identidad, clubes y roles

- La cuenta de jugador es global: registro inmediato después de verificar email o teléfono, perfil básico e historial global.
- Cada club sólo puede ver su propia relación y sus propias reservas con ese jugador.
- Roles y permisos predefinidos:
  - `superadmin`: acceso global total.
  - `admin`/dueño: configuración y operación completa de su club.
  - `recepcionista`: agenda, clientes, cobros presenciales, confirmaciones y cancelaciones, sin configuración sensible.
  - `jugador`: perfil y reservas propias.

### Supabase y aislamiento

- Se usará un proyecto Supabase compartido por entorno.
- Las entidades operativas tendrán `club_id`.
- El aislamiento entre clubes será estricto mediante RLS.
- La identidad global estará separada de los datos operativos por tenant.
- El acceso global del `superadmin` debe implementarse mediante un camino privilegiado explícito.
- Se comenzará con un esquema nuevo, limpio y versionado; no hay datos reales que migrar.
- Estas decisiones objetivo no prueban que el esquema, RLS, RPC o migraciones ya existan en este repositorio.

### Entornos y frontend

- Deben existir entornos separados `development`, `staging` y `production`, cada uno con su propio Supabase, credenciales y configuración de Mercado Pago aislados.
- Se conserva React + Vite.
- La web será responsive y mobile-first para jugadores.
- El panel administrativo puede priorizar desktop.
- No migrar a Next.js ahora.
- SEO y catálogo público quedan fuera del MVP.

### Operación configurable por club

Cada club podrá configurar:

- Operación y catálogo de canchas: cantidad, nombre, superficie, modalidad, estado, características, fotos y reglas.
- Horarios y duraciones por cancha, día, franja y regla operativa.
- Precios, señas, confirmación, cancelación, reprogramación y promociones.
- Confirmación automática, manual o posterior a la acreditación de la seña.
- Duraciones por club, cancha, día y horario, evitando huecos inutilizables.

### Reservas y clientes

- Los estados de reserva serán `pending`, `confirmed`, `cancelled` y `completed`.
- El estado financiero será independiente del estado de reserva.
- Una cancelación conservará el actor y el motivo.
- Las cancelaciones y reprogramaciones seguirán la política de cada club, cuyo snapshot se guardará en la reserva.
- `admin`/dueño y `recepcionista` podrán reservar para un jugador global o para un cliente ocasional con nombre y contacto mínimo.
- Las reservas creadas por personal registrarán quién las creó.
- Una reserva para cliente ocasional no crea una cuenta automáticamente.
- La indisponibilidad se resolverá inicialmente con bloqueos manuales simples y datos mínimos de auditoría; no habrá recurrencia ni motivos estructurados en el MVP.
- Las tarifas usarán reglas básicas de cancha, duración, día y franja.
- Las promociones tendrán vigencia y código opcional.
- La reserva guardará un snapshot del precio y de las reglas aplicadas.

### Pagos y facturación

- El flujo será híbrido: seña online y saldo en el club mediante un medio aceptado localmente.
- Cada club conectará **su propia cuenta de Mercado Pago** mediante OAuth y recibirá directamente los fondos.
- PadelApp no cobrará comisión inicialmente ni custodiará o liquidará fondos.
- La seña será configurable por club como monto fijo o porcentaje, con posibles excepciones.
- La reserva persistirá total, seña, saldo, moneda y regla aplicada.
- OAuth, tokens, webhooks, creación y verificación de pagos y devoluciones sólo podrán ejecutarse server-side, mediante backend o Edge Functions; nunca en el cliente Vite.
- Las devoluciones automáticas elegibles se realizarán mediante Mercado Pago del club.
- El sistema debe contemplar estado financiero, webhooks, fallos pendientes e idempotencia.
- PadelApp emitirá únicamente una constancia no fiscal. El comprobante de pago será el de Mercado Pago.
- La facturación fiscal queda a cargo de cada club y fuera del MVP.

### Notificaciones y reportes

- Las notificaciones del MVP serán sólo por email.
- Cada club tendrá reportes operativos y financieros de reservas, ocupación, cancelaciones, señas, devoluciones, saldos, ingresos estimados y clientes frecuentes.
- Los reportes tendrán filtros y exportación CSV.
- Debe diferenciarse el cobro online verificado del saldo presencial informado.

### Entrenadores fuera del MVP

- Los entrenadores están **fuera del MVP**.
- El código existente de entrenadores debe preservarse, mantenerse desacoplado y no exponerse inicialmente.
- No eliminar servicios, componentes ni modelos de entrenadores. No agregar nuevas dependencias del MVP hacia ese módulo sin autorización explícita.

## Estado del código actual observado

Esta sección describe archivos presentes en el repositorio. La presencia de código no implica que el alcance objetivo esté implementado ni que funcione end-to-end.

### Stack real y versiones declaradas

La aplicación está en `front/vite-front`. Las versiones siguientes son las declaradas en `front/vite-front/package.json` (rangos `^`), no una afirmación sobre las versiones efectivamente instaladas:

| Área | Evidencia actual |
|---|---|
| UI y lenguaje | React `^18.2.0`, React DOM `^18.2.0`, TypeScript `^5.8.3` |
| Build | Vite `^5.3.1`, `@vitejs/plugin-react` `^4.3.1` |
| Backend cliente | `@supabase/supabase-js` `^2.51.0` para Auth y consultas desde servicios |
| Routing | `react-router-dom` `^6.25.1` y `BrowserRouter` |
| Estado | Zustand `^5.0.6` y Redux Toolkit `^2.2.6` con `react-redux` `^9.1.2` |
| Formularios y UI | Formik `^2.4.6`, Framer Motion `^12.23.12`, SweetAlert `^2.1.2` |
| Gráficos e iconos | ApexCharts `^5.3.5`, `react-apexcharts` `^1.8.0`, Bootstrap Icons `^1.13.1` |
| Estilos | CSS colocado junto a componentes; Sass `^1.89.2`; Tailwind CSS `^4.1.16` y PostCSS están declarados, pero la UI observada usa CSS |
| Calidad | ESLint `^8.57.0` con plugins de React y React Hooks |

La aplicación monta Redux en `src/index.tsx`, mientras que varias funcionalidades usan stores de Zustand. No introducir un tercer mecanismo de estado.

### Estructura del repositorio

- `front/vite-front/`: único proyecto frontend; el repositorio raíz no tiene `package.json` de aplicación.
- `front/vite-front/src/views/`: vistas asociadas a rutas, incluyendo `Dashboard.tsx`.
- `front/vite-front/src/components/`: componentes de la experiencia pública y del usuario, agrupados por funcionalidad.
- `front/vite-front/src/modules/Dashboard/`: dashboards administrativo y de entrenadores, con componentes, hooks, tipos, utilidades y CSS colocados.
- `front/vite-front/src/services/`: acceso a Supabase y lógica de datos de autenticación, usuarios, reservas, canchas, entrenadores y disponibilidad.
- `front/vite-front/src/store/`: stores de Zustand (`userStore`, reservas y dashboard).
- `front/vite-front/src/redux/`: store y reducer de Redux Toolkit.
- `front/vite-front/src/routes/`: `PrivateRoute` y `PublicRoute`.
- `front/vite-front/src/interfaces/`: declaraciones TypeScript compartidas.
- `front/vite-front/src/helpers/` y `front/vite-front/src/utils/`: validaciones, datos de formularios, horarios, enums y funciones auxiliares.
- `front/vite-front/src/shared/`: componentes reutilizables, como `Spinner`, modales y analítica.
- `front/vite-front/public/`: recursos estáticos fuente.
- `front/vite-front/dist/`: salida generada existente; no editarla manualmente ni tratarla como código fuente.
- `front/vite-front/package-lock.json` y `front/vite-front/bun.lockb`: lockfiles presentes. También existe `front/package-lock.json`; no asumir que todos representan el mismo flujo de instalación.
- No se encontró una carpeta de migraciones ni un esquema Supabase versionado.

### Navegación y arquitectura observable

`src/index.tsx` usa `BrowserRouter` y monta Redux antes de `App`. `src/App.tsx` define rutas públicas (`/`, `/about`, `/contacto`, `/registro`), login público (`/login`) y rutas protegidas (`/historial`, `/alquilar-cancha`, `/mi-perfil`, `/dashboard`). La sesión local se contrasta con `supabase.auth.getSession()`.

`PrivateRoute` redirige a `/login` si no hay usuario activo. `Dashboard.tsx` selecciona `CoachDashboard` para el rol `COACH` y `MainDashboard` para los demás roles administrativos; el rol de usuario común recibe una redirección. El módulo coach presente en estas rutas describe código existente, no alcance aprobado del MVP.

### Convenciones existentes

- Usar componentes funcionales y hooks de React.
- Usar PascalCase para componentes y camelCase para funciones y variables.
- Mantener componentes específicos y sus estilos cerca unos de otros.
- Reutilizar componentes de `src/shared/` antes de crear equivalentes.
- Mantener las consultas de Supabase en `src/services/`; las vistas y componentes deben consumir servicios o stores.
- Preservar el routing por roles y la estructura de menú del dashboard, salvo cambios de producto autorizados.
- Usar CSS para cambios visuales y Bootstrap Icons para iconografía, respetando los estilos colocados.
- Mantener los nombres técnicos y los valores de estados existentes salvo autorización y evidencia.
- Las variables del cliente usan el prefijo `VITE_`; nunca hard-codear ni reemplazar credenciales.

### Variables de entorno observadas

El código y `src/vite-env.d.ts` declaran únicamente estos nombres:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

No leer, copiar ni divulgar sus valores. El archivo `.env` existe localmente, pero este documento no depende de sus contenidos. La decisión de aislar credenciales y configuración de Mercado Pago por entorno es objetivo de arquitectura; no se inventan nombres de variables que no estén declarados.

### Comandos existentes y directorio correcto

Los comandos del frontend, cuando estén autorizados, se ejecutan desde `front/vite-front`, no desde la raíz:

```text
npm run dev       # servidor de desarrollo Vite
npm run build     # compilación de producción
npm run preview   # previsualización de la salida
npm run lint      # ESLint según el script actual
npm run start     # live-server, script adicional declarado
```

Hay `package-lock.json` y `bun.lockb` en `front/vite-front`. Si se autoriza trabajo de dependencias, usar un único gestor y mantener su lockfile coherente.

## Estado funcional por certeza

### 1. Implementado y verificado por inspección estática

- Están presentes la aplicación frontend, sus rutas principales, guards de acceso y composición de proveedores.
- Existen servicios para autenticación, usuarios, reservas, canchas, entrenadores y disponibilidad de entrenadores.
- El flujo actual de reserva contempla selección de cancha y, para el asunto de entrenamiento, selección de entrenador.
- El dashboard administrativo contiene referencias a usuarios, reservas, canchas, métricas, gráficos y gestión de entrenadores.
- Existe un dashboard específico de entrenador con clases, estudiantes, perfil y disponibilidad; este código está fuera del alcance objetivo del MVP.
- `CoachesContent` abre `CoachFormModal`, el formulario muestra el botón de creación y `handleSubmit` llama a `createCoach`; su operación real depende de Supabase y no fue ejecutada.
- Existen estilos responsivos para vistas públicas, dashboard, entrenadores, tablas, tarjetas y modales.

“Verificado” aquí significa observado en los archivos actuales. No se afirma verificación de compilación ni runtime.

### 2. Parcial

- La autenticación, lectura/escritura de reservas, gestión de canchas y métricas dependen de Supabase configurado y de objetos externos no versionados en este repositorio.
- El objetivo multi-tenant con `club_id`, Supabase compartido por entorno, RLS estricto, identidad global y camino privilegiado de `superadmin` no está demostrado en el código actual.
- El responsive se implementa con numerosos `@media` y un sidebar móvil del dashboard, pero no se comprobó visualmente en todos los tamaños y recorridos.
- La coexistencia de Zustand y Redux está presente; no hay evidencia de una migración completa a un único mecanismo.
- El módulo de entrenadores está presente en el código, pero se mantiene fuera del MVP objetivo, desacoplado y no expuesto inicialmente.

### 3. Roto o provisional

- **Aprobación y rechazo de reservas sin implementación:** `ReservesContent.tsx` conecta los botones con `handleApprove` y `handleReject`, pero ambos handlers sólo hacen `console.log`, contienen un `TODO` y ejecutan `refetch`; no llaman a ningún servicio ni actualizan el estado de la reserva.
- **Referencia a `swal` sin import en `PrivateRoute.tsx`:** el archivo invoca `swal(...)` sin importarlo ni declarar una referencia local. Si se ejecuta esa rama, existe una referencia no resuelta que puede impedir la redirección.
- **Modelo `Coach` inconsistente:** `src/services/coaches.ts` define `Coach.id` como `number` y un modelo amplio; `src/interfaces/coachInterface.d.ts`, usado por `useReservationStore`, define otro `Coach` con `id` como `string` y menos propiedades. `CoachCard.tsx` lee `experience_years`, `specialties` y `description`, ausentes del `Coach` importado desde `services/coaches.ts`.
- `tsconfig.json` tiene `strict: false` y no existe un script `typecheck`.
- `npm run lint` invoca ESLint con extensiones `js,jsx`, aunque la aplicación es principalmente TypeScript/TSX; no representa cobertura completa.
- El `package.json` declara `@types/react-router-dom` de la rama 5 mientras `react-router-dom` es de la rama 6; no corregirlo sin autorización.
- Los lockfiles y `dist/` presentes no prueban una instalación limpia, compilación o ejecución contra Supabase.

### 4. Todavía no desarrollado/no demostrable

- No hay evidencia de que el alcance multi-tenant del MVP esté implementado end-to-end.
- No hay evidencia versionada del esquema nuevo, `club_id`, RLS, camino privilegiado de `superadmin`, RPC, migraciones, backend o Edge Functions.
- No hay evidencia de integración real con OAuth, tokens, webhooks, idempotencia, devoluciones o cuentas de Mercado Pago por club.
- No hay evidencia de reportes por club, exportación CSV, notificaciones por email o separación de cobro online verificado frente a saldo presencial.
- No existe infraestructura de pruebas ni script `test` en `front/vite-front/package.json`.
- No hay evidencia suficiente para declarar un flujo completo end-to-end.

## Limitaciones operativas y problemas conocidos

- No asumir que las tablas observadas en el código (`users`, `reservations`, `courts`, `coaches`, `coach_availability`) existen con esas columnas o relaciones en el entorno remoto.
- El código referencia RPC como `subtract_revenue` y `get_coach_students`; su existencia, firma, permisos y compatibilidad con el diseño multi-tenant no están verificadas.
- No inferir RLS, permisos, relaciones, datos iniciales ni políticas a partir de consultas del cliente.
- El diseño objetivo exige un esquema nuevo y versionado; el repositorio actual no lo contiene.
- La auditoría histórica reportó 22 vulnerabilidades: 1 crítica, 16 altas, 4 moderadas y 1 baja; también señaló paquetes directos. En esta revisión no se ejecutó una auditoría de dependencias. La fecha y los nombres de esos paquetes no constan aquí; tratarlo como pendiente de revalidación, no como estado permanente.
- No leer ni divulgar valores de `.env`.

## Tests y verificación

No existe script `test` ni configuración de pruebas visible en `front/vite-front`. Tampoco existe script `typecheck`. En esta actualización sólo se hizo inspección estática y lectura de metadata; no se ejecutaron `npm run build`, `npm run lint`, pruebas, instalación, formatters ni generadores. Por tanto, no se afirma que compile ni que cualquier recorrido funcione en ejecución.

## Responsive y mobile-first

La web para jugadores debe conservar un enfoque mobile-first. El panel administrativo puede priorizar desktop. El código actual contiene reglas para varios anchos (incluidos `480px`, `640px`, `768px`, `960px`, `1024px`, `1200px` y superiores), ajustes de vistas públicas, dashboard, modales y sidebar móvil. Esto no constituye verificación visual. Todo cambio visual debe comprobar desbordamientos y mantener las reglas en el CSS del componente afectado.

## Reglas operativas para futuros agentes

1. Leer este archivo y comprobar el estado local antes de editar.
2. Distinguir siempre entre alcance objetivo, código actualmente presente y comportamiento verificado.
3. Preservar todos los cambios locales; no resetear, limpiar, sobrescribir ni usar operaciones Git destructivas.
4. Cambiar sólo los archivos autorizados por el usuario. No modificar código, configuración, lockfiles, dependencias ni `dist/` sin autorización expresa.
5. Antes de alterar Supabase, verificarlo en una fuente versionada o en el entorno autorizado; no inventar esquema, `club_id`, RLS, RPC, migraciones ni contratos.
6. Mantener el aislamiento por club y la separación de identidades globales como decisiones objetivo; no simularlas con filtros de cliente.
7. Mantener OAuth, tokens, webhooks, pagos y devoluciones fuera del cliente Vite.
8. Mantener los entornos `development`, `staging` y `production` aislados cuando exista configuración versionada que los implemente.
9. Mantener entrenadores fuera del MVP, desacoplados y no expuestos inicialmente; no eliminar su código existente.
10. Mantener la documentación y comunicación en español y conservar en inglés los identificadores técnicos establecidos.
11. Antes de cambiar dependencias, revisar los lockfiles relevantes y evitar actualizaciones mayores masivas.
12. El usuario conserva la responsabilidad de commits, `push` y PR, salvo instrucción explícita.
