# ISC ATM Integrator

Sistema de integración bancaria para cajeros automáticos (ATM) que gestiona transacciones, conciliación entre bancos, autenticación y autorización mediante una arquitectura modular basada en **NestJS** con patrón **CQRS**.

---

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                        API REST (Express)                        │
│                         Puerto 7000                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐  │
│  │  Auth    │ │  Orders  │ │Accounts  │ │Agreements│ │ Txns │  │
│  │ Module  │ │  Module  │ │ Module   │ │ Module   │ │Module│  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └──┬───┘  │
│       │            │            │            │          │       │
│  ┌────┴────────────┴────────────┴────────────┴──────────┴───┐  │
│  │                    CQRS Command/Query Bus                  │  │
│  └────────────────────────────┬───────────────────────────────┘  │
│                               │                                   │
│  ┌────────────────────────────┴───────────────────────────────┐  │
│  │                    TypeORM + PostgreSQL                      │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              Redis (Cache Layer — opcional)                  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │     nestjs-resilience (Circuit Breaker, Timeout, Retry)      │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Runtime** | Bun v1.3.x |
| **Framework** | NestJS 11 |
| **Lenguaje** | TypeScript 5.7 + SWC (compilador) |
| **Base de datos** | PostgreSQL 16 |
| **ORM** | TypeORM 1.0 |
| **Cache** | Redis (via `@keyv/redis`) |
| **Autenticación** | JWT + Passport (local, JWT, API Key) |
| **API Docs** | Swagger/OpenAPI + Scalar |
| **Seguridad** | Helmet, CSRF (double submit cookie) |
| **Resiliencia** | `nestjs-resilience` (Circuit Breaker, Bulkhead, Timeout) |
| **Testing** | Bun Test Runner + supertest |
| **CLI Client** | React + Ink (terminal UI) |

---

## Estructura del Proyecto

```
isc-atm-integrator/
├── packages/
│   ├── backend/                    # API REST (NestJS)
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── accounts/       # Gestión de cuentas bancarias
│   │   │   │   ├── agreements/     # Convenios bancarios
│   │   │   │   ├── auth/           # Autenticación y autorización
│   │   │   │   ├── conciliation/   # Conciliación bancaria
│   │   │   │   ├── notifications/  # Notificaciones y eventos
│   │   │   │   ├── orders/         # Órdenes ATM
│   │   │   │   └── transactions/   # Transacciones financieras
│   │   │   ├── infrastructure/     # Configuración global
│   │   │   │   ├── cache/          # Módulo Redis
│   │   │   │   ├── config/         # Configuración centralizada
│   │   │   │   ├── database/       # DataSource, migraciones, seeds
│   │   │   │   └── health/         # Health checks
│   │   │   └── shared/             # Core compartido
│   │   │       └── core/           # Result<T>, Response DTOs, filters
│   │   ├── test/                   # Tests E2E
│   │   ├── dist/                   # Compilado SWC
│   │   ├── nest-cli.json
│   │   ├── .swcrc
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── client/                     # CLI cliente (React + Ink)
│       └── src/
└── package.json                    # Monorepo root (workspaces)
```

---

## Features

### Accounts (Cuentas Bancarias)
- CRUD de cuentas bancarias asociadas a convenios
- Tipos: savings (ahorros), checking (corriente)
- Validación de saldo para operaciones débito

### Agreements (Convenios Bancarios)
- Gestión de convenios con entidades financieras
- 15 bancos ecuatorianos pre-seedeados (Pichincha, Pacífico, Produbanco, etc.)

### Auth (Autenticación y Autorización)
- Login con JWT + refresh tokens
- Autenticación por API Key (para integraciones machine-to-machine)
- Sistema de permisos basado en recursos (RBAC)
- Perfiles: admin, operator, viewer, api_client
- 23 permisos seedeados
- CSRF protection (double submit cookie)

### Conciliation (Conciliación Bancaria)
- Emparejamiento de transacciones entre bancos (bank_a ↔ bank_b)
- Matching por `correlationId`
- Categorización: matched, discrepancy, missing
- Resolución manual de discrepancias
- Reportes detallados con paginación

### Notifications (Notificaciones)
- Sistema de eventos para notificaciones
- Publisher/handler pattern con event bus
- Integración con email (handler preparado)

### Orders (Órdenes ATM)
- Órdenes de retiro, depósito y consulta
- Integración con resiliencia: Circuit Breaker + Throttle + Timeout
- Cache de respuestas con Redis

### Transactions (Transacciones)
- Creación de transacciones financieras (débito/crédito)
- Transferencias entre cuentas (débito + crédito atómico)
- Actualización de estado (pending → success/cancelled)
- Transiciones de estado validadas
- Soporte para operaciones no financieras (consultas de saldo, cambio de PIN)

---

## Patrón de Diseño por Feature

Cada feature sigue una arquitectura de **capas** inspirada en DDD:

```
feature/
├── domain/              # Modelos de negocio + interfaces de repositorio
│   ├── *.ts             # Entidades de dominio (con Builder pattern)
│   └── *.repository.ts  # Interfaces de repositorio
├── application/         # Casos de uso (CQRS)
│   ├── commands/        # Comandos (mutaciones)
│   │   └── */           
│   │       ├── command.ts       # DTO de entrada
│   │       ├── handler.ts       # Lógica del caso de uso
│   │       ├── response.dto.ts  # DTO de salida
│   │       └── __tests__/       # Tests unitarios + integración
│   └── queries/         # Consultas (lecturas)
│       └── */
│           ├── query.ts
│           ├── handler.ts
│           └── response.dto.ts
├── infrastructure/      # Implementaciones técnicas
│   └── persistence/
│       ├── __tests__/in-memory/  # Repositorios en memoria para testing
│       └── typeorm/              # Repositorios TypeORM (producción)
└── presentation/        # Controladores HTTP
    └── *.controller.ts
```

---

## API Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/health` | No | Health check (DB + Redis) |
| `GET` | `/api/health/liveness` | No | Liveness probe |
| `GET` | `/api/health/readiness` | No | Readiness probe |
| `GET` | `/api/csrf-token` | No | Obtener token CSRF |
| `POST` | `/api/auth/login` | No | Iniciar sesión |
| `POST` | `/api/auth/refresh` | No | Refrescar token |
| `POST` | `/api/auth/api-keys` | JWT | Generar API Key |
| `GET` | `/api/auth/api-keys` | JWT | Listar API Keys |
| `DELETE` | `/api/auth/api-keys/:id` | JWT | Revocar API Key |
| `POST` | `/api/orders` | JWT+Key | Crear orden |
| `GET` | `/api/orders` | JWT+Key | Listar órdenes |
| `GET` | `/api/orders/:id` | JWT+Key | Obtener orden |
| `POST` | `/api/agreements` | JWT+Key | Crear convenio |
| `GET` | `/api/agreements` | JWT+Key | Listar convenios |
| `GET` | `/api/agreements/:id` | JWT+Key | Obtener convenio |
| `POST` | `/api/accounts` | JWT+Key | Crear cuenta |
| `GET` | `/api/accounts` | JWT+Key | Listar cuentas |
| `GET` | `/api/accounts/:id` | JWT+Key | Obtener cuenta |
| `POST` | `/api/transactions` | JWT+Key | Crear transacción |
| `POST` | `/api/transactions/transfer` | JWT+Key | Transferencia |
| `PATCH` | `/api/transactions/:id/state` | JWT+Key | Actualizar estado |
| `GET` | `/api/transactions` | JWT+Key | Listar transacciones |
| `GET` | `/api/transactions/:id` | JWT+Key | Obtener transacción |
| `POST` | `/api/conciliation/run` | JWT+Key | Ejecutar conciliación |
| `GET` | `/api/conciliation` | JWT+Key | Listar conciliaciones |
| `GET` | `/api/conciliation/:id` | JWT+Key | Reporte de conciliación |
| `PATCH` | `/api/conciliation/:id/resolve/:matchId` | JWT+Key | Resolver discrepancia |

> **Nota:** La versión de API se especifica vía header `x-api-version: 1`.

---

## Base de Datos

### Entidades (13 tablas)

```
agreement         → Convenios bancarios
bank_account      → Cuentas bancarias
transaction       → Transacciones financieras
orders            → Órdenes ATM
auth_user         → Usuarios del sistema
auth_refresh_token → Tokens de refresco JWT
auth_profile      → Perfiles (admin, operator, viewer, api_client)
auth_permission   → Permisos (23 seedeados)
user_profile      → Asignación usuario-perfil
profile_permission → Asignación perfil-permiso
api_key           → API Keys para integraciones
conciliations     → Conciliaciones ejecutadas
conciliation_matches → Resultados de matching
```

### Migraciones (3)

| Migración | Descripción |
|-----------|-------------|
| `InitialMigration` | Creación de todas las tablas iniciales |
| `UpdatePermissionNames` | Renombrado de permisos `bank_accounts:*` → `accounts:*` |
| `AddSourceBankAndConciliation` | Columna `source_bank` en transacciones + tablas de conciliación |

### Seeders

| Seed | Descripción |
|------|-------------|
| `ProfileSeeder` | 4 perfiles + 23 permisos |
| `AdminUserSeeder` | Usuario admin (`admin@atm-integrator.local` / `admin123`) |
| `AgreementSeeder` | 15 bancos ecuatorianos |
| `BankAccountSeeder` | 1-3 cuentas por banco (vía Faker) |

---

## Resiliencia

### Cache (Redis)
- `reconnectStrategy: false` — sin reconexión automática
- `CacheResultService` envuelve todo en `try/catch`
- Fallos de cache: degradación graceful (cae a DB directo)
- Cache fire-and-forget con `void`

### nestjs-resilience
| Handler | Circuit Breaker | Timeout | Bulkhead | Retry |
|---------|----------------|---------|----------|-------|
| `LoginHandler` | — | 10s | — | — |
| `CreateTransactionHandler` | 3 fallos, 10s sleep | 5s | 5 concurrentes | — |
| `TransferHandler` | 3 fallos, 10s sleep | 10s | — | — |
| `OrdersHandler` | 3 fallos, 10s sleep | 30s | — | 3 reintentos |

### Health Checks
- `GET /api/health` → DB ping + Redis ping
- `GET /api/health/liveness` → siempre ok
- `GET /api/health/readiness` → DB + Redis
- Redis down no afecta operatividad de la API

---

## Testing

### Estrategia (3 capas)

```
         ╱╲
        ╱  ╲       E2E (5%) — supertest + InMemoryRepos
       ╱──────╲
      ╱        ╲    Integración (25%) — handlers con InMemoryRepositories
     ╱────────────╲
    ╱              ╲  Unitarias (70%) — domain models, builders, DTOs
   ╱                ╲
```

### Cobertura actual

| Tipo | Tests |
|------|-------|
| **Unitarios** (`bun test`) | 91 tests, 0 fallos |
| **E2E** (`bun test ./test/conciliation.e2e-spec.ts`) | 16 tests, 0 fallos |
| **Total** | **107 tests, 0 fallos** |

### InMemoryRepositories (5)

| Interfaz | Implementación |
|----------|---------------|
| `IConciliationRepository` | `InMemoryConciliationRepository` |
| `ITransactionRepository` | `InMemoryTransactionRepository` |
| `IAuthUserRepository` | `InMemoryAuthUserRepository` |
| `IAuthRefreshTokenRepository` | `InMemoryAuthRefreshTokenRepository` |
| `IBankAccountRepository` | `InMemoryBankAccountRepository` |

---

## Configuración

### Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `APP_SERVER_PORT` | `7000` | Puerto del servidor |
| `APP_SERVER_PREFIX` | `/api` | Prefijo de rutas API |
| `DB_TYPE` | `pglite` | Tipo de BD (`postgres`, `pglite-socket`, `pglite`) |
| `DB_HOST` | `localhost` | Host PostgreSQL |
| `DB_PORT` | `5432` | Puerto PostgreSQL |
| `DB_USERNAME` | `postgres` | Usuario BD |
| `DB_PASSWORD` | `postgres` | Contraseña BD |
| `DB_NAME` | `isc_atm` | Nombre BD |
| `APP_JWT_SECRET` | `atm-integrator-jwt-secret...` | Secreto JWT |
| `APP_JWT_EXPIRES_IN` | `15m` | Expiración JWT |
| `APP_CSRF_ENABLED` | `true` | CSRF activado/desactivado |
| `APP_CACHE_REDIS_HOST` | `redis://localhost:6379` | URL Redis |
| `FEATURE_VALIDATE_BALANCE` | `true` | Validar saldo en débitos |

---

## Instalación y Ejecución

```bash
# 1. Instalar dependencias
bun install

# 2. Configurar variables de entorno
cp packages/backend/.env.example packages/backend/.env
# Editar .env con datos de conexión PostgreSQL

# 3. Crear base de datos y ejecutar migraciones
cd packages/backend
bun run migration:run

# 4. Poblar datos iniciales
bun run db:seed

# 5. Iniciar en desarrollo
bun run start:dev

# 6. Ejecutar tests
bun test                    # Tests unitarios
bun test ./test/conciliation.e2e-spec.ts  # Tests E2E
```
