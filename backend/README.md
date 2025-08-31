### Project Structure

```
backend/
├─ Dockerfile
├─ package.json
├─ tsconfig.json
├─ src/
│  ├─ app.module.ts
│  ├─ core/
│  │  ├─ error/
│  │  └─ util/
│  │
│  ├─ domain/
│  │  └─ user/
│  │     ├─ entities/
│  │     │  └─ user.entity.ts
│  │     ├─ value-objects/
│  │     │  └─ email.vo.ts
│  │     └─ repositories/
│  │        └─ user.repository.ts
│  │
│  ├─ application/
│  │  └─ user/
│  │     ├─ ports/                       # ← added
│  │     │  ├─ user-service.port.ts      # interface (IUserService)
│  │     │  └─ index.ts                  # re-exports (optional)
│  │     ├─ dto/
│  │     │  ├─ create-user.dto.ts
│  │     │  └─ update-user.dto.ts
│  │     ├─ services/
│  │     │  └─ user.service.ts           # implements IUserService
│  │     └─ tokens.ts                    # DI tokens (USER_SERVICE, etc.)
│  │
│  ├─ infra/
│  │  ├─ persistence/
│  │  │  └─ prisma/
│  │  │     ├─ prisma.module.ts
│  │  │     ├─ prisma.service.ts
│  │  │     └─ repositories/
│  │  │        └─ user.prisma.repository.ts
│  │  └─ crypto/
│  │     └─ bcrypt.hasher.ts
│  │
│  └─ http/
│     ├─ health/
│     │  ├─ health.controller.ts
│     │  └─ health.module.ts
│     └─ user/
│        ├─ user.controller.ts        # imports IUserService from ports/
│        └─ user.module.ts            # binds tokens → implementations
│
└─ test/
   ├─ unit/
   └─ integration/

```