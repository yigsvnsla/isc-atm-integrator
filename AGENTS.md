# AGENTS.md

Compact guide for OpenCode sessions working in this repo. Only repo-specific, non-obvious facts.

## Toolchain

- Package manager: **bun** (`bun.lock` present). Use `bun install`, `bun run <script>` despite README mentioning npm.
- SWC builder for dev/start (`nest-cli.json` `builder: swc`; start scripts pass `--builder swc`).
- `nest build` → `dist/` (SWC). `start:prod` runs `node dist/main` — no watch.
- No CI, no pre-commit hooks, no codegen.

## Commands

```bash
bun install
bun run start          # run app
bun run start:dev      # watch + type-check (SWC)
bun run build         # nest build -> dist/
bun run lint          # eslint --fix (auto-fixes on)
bun run format        # prettier --write src test
bun run test          # jest unit (src/**/*.spec.ts)
bun run test:e2e      # jest e2e (test/**/*.e2e-spec.ts, own config)
bun run test:cov      # coverage
```

Single test: `bun run test -- <path-or-pattern>`. Expected order if unified verification needed: `lint -> test`.

## Running the app

- Global API prefix: `/api` (env `API_PREFIX`).
- Default port: `4000` (env `PORT`).
- Scalar API reference mounted at `${API_PREFIX}/reference`; Swagger spec built via `@nestjs/swagger` in `src/main.ts`.
- `.env*` gitignored. Env read directly from `process.env` (no `ConfigModule` / `@nestjs/config`). Set env inline or via shell.
- Reading config from `main.ts` is the only place routing/prefix/cors is wired — controllers/modules don't know about the prefix.

## Architecture

Feature-sliced DDD/CQRS, **hand-rolled** (not `@nestjs/cqrs` — don't pull that package).

- `src/features/<feature>/{domain,application,infrastructure}` — standard DDD layering.
- Each use-case is its own folder under `application/commands|queries/<use-case>/` containing `command.ts`|`query.ts`, `handler.ts`, `response.ts`. DTO validation is at the controller (`class-validator` + `ValidationPipe`), not in per-use-case `validator.ts`.
- `src/shared/{core,cqrs,events,infrastructure}` — framework-agnostic primitives:
  - `core/result.ts` → `Result<Type, Error>` success/failure wrapper (prefer over throwing).
  - `core/errors.ts`, `core/types.ts` — shared error/domain types.
  - `cqrs/` → `Mediator`, `Command`, `Query`, handler interfaces, interface bindings.
  - `events/` → `EventBus`, `Event` base.
  - `infrastructure/database/`, `infrastructure/http/` → datasource + global `ResultInterceptor`.
- Controllers are thin: delegate to `mediator.send(new SomeCommand/Query(...))`. See `src/features/orders/orders.controller.ts:7`.
- Repository port in `features/<feature>/domain/`, adapter in `features/<feature>/infrastructure/persistence/`; persistence entity in `infrastructure/persistence/`, domain entity in `domain/` (mapped via mapper).

## Conventions

- **Indent: 4 spaces** (`.prettierrc tabWidth: 4`) — not the 2-space tsconfig default. Match existing `src/`.
- Single quotes, trailing commas (all), LF (`endOfLine: auto`).
- ESLint flat config, type-checked (`recommendedTypeChecked`), but `@typescript-eslint/no-explicit-any: off`, floating-promises/unsafe-argument are **warn** not error. `prettier/prettier` is an **error**.
- `lint` script auto-fixes; formatting violations will fail lint.
- Decorators enabled (`emitDecoratorMetadata`, `experimentalDecorators`) — required for NestJS. Don't strip.
- new files: colocate `*.spec.ts` next to source; e2e in `test/`.

## Gotchas

- **E2E tests do not apply global prefix.** `test/app.e2e-spec.ts` builds app via `Test.createTestingModule().createNestApplication()` without `main.ts`, so no `/api` prefix and no Scalar middleware. Hit `/` directly in e2e; only `main.ts` startup adds `/api`.
- `tsconfig.json` has no `strict: true` string but enables `strictNullChecks`, `noImplicitAny`, `strictBindCallApply`, `forceConsistentCasingInFileNames` individually. Don't add `strict` without checking intent.
- `module: nodenext` + `moduleResolution: nodenext` — relative imports need extensions-aware paths; ESM-style interop configured. Prefer extensionless relative imports matching existing code.

## Database (TypeORM + sqljs, CQRS read/write split)

- Driver: **sqljs** (WASM, no native compile). NOT `sqlite3`/`better-sqlite3` (require g++). Installed: `typeorm`, `sql.js`, `@types/sql.js` (dev).
- Config: `src/shared/infrastructure/database/` — `data-source.config.ts` (read from `process.env`), `database.providers.ts` (tokens `WRITE_DATA_SOURCE` + `READ_DATA_SOURCE`), `database.module.ts` (`@Global()`).
- **Two physically separate SQLite files:** `DB_WRITE_PATH` (default `./data/write.db`, `autoSave: true`) and `DB_READ_PATH` (default `./data/read.db`, `autoSave: false`). Writes to write DB do NOT appear in read DB — CQRS with split stores needs a projection/sync mechanism (events, ETL). The scaffold only ensures both schemas exist (`synchronize: true` in non-prod on both). Single-file mode: set `DB_WRITE_PATH` = `DB_READ_PATH`.
- `synchronize: true` gated by `NODE_ENV !== 'production'`. Prod must use migrations.
- Entity glob: `features/**/infrastructure/persistence/**/*.entity{.ts,.js}` — entities live under `infrastructure/persistence/`, NOT `domain/`.

## Repository pattern (orders reference)

- **Port in `domain/`, adapter in `infrastructure/`.** `OrdersWriterRepository` / `OrdersReaderRepository` abstract classes in `domain/ports/` define the contract + `Symbol` tokens (`ORDERS_WRITER_REPOSITORY` / `ORDERS_READER_REPOSITORY`). Adapters `SqlOrdersWriterRepository` / `SqlOrdersReaderRepository` in `infrastructure/persistence/` inject the matching DataSource (`WRITE`/`READ`).
- **Entity persistence-mapped.** `OrderEntity` (TypeORM `@Entity`) in `infrastructure/persistence/`; domain `Order` in `domain/`. `OrderMapper.toDomain/toPersistence` converts. Domain stays ORM-free.
- Inject adapters in feature `@Module` via `{ provide: <TOKEN>, useClass: Sql... }`. Writer/Reader repos are separate classes (CQRS strict).

## CQRS runtime (hand-rolled)

- `shared/cqrs/Mediator` (generic): `registerCommand(type, handler)` / `registerQuery(type, handler)` + `send(command)` / `ask(query)`. Keyed by command/query constructor.
- `CqrsModule` (`@Global()`) provides + exports `Mediator`. Feature modules inject it and register handlers in `OnModuleInit` (see `orders.module.ts`).
- Handlers are `@Injectable`, implement `CommandHandler<TCommand, TResult>` / `QueryHandler<TQuery, TResult>`. Return `Result<T, AppError>` (prefer over throwing). Handlers inject writer/reader repo ports via `@Inject(TOKEN)`.
- **`ResultInterceptor`** (global, registered via `APP_INTERCEPTOR` in `AppModule`) unwraps `Result` → HTTP: success returns `value`; failure maps `AppError` subclasses → status (`NotFoundError` 404, `ValidationError` 400, `ConflictError` 409). Controllers return `Result` and the interceptor flattens it — don't return raw `Result` internals to clients.
- `Order.create()` generates `crypto.randomUUID()`. Domain invariants throw → handlers catch and wrap as `ValidationError`.
- `ValidationPipe` global (`main.ts`): `whitelist`, `forbidNonWhitelisted`, `transform`. DTOs with `class-validator` decorators in `presentation/dto/`.