.
├── .dockerignore
├── .env
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── .vscode/
├── API.md
├── Dockerfile
├── FRONT_API_USER_SERVICE.md
├── docker-compose.yml
├── jest.config.js
├── origin)
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-lock.yaml.3627536155
├── prisma/
│   ├── migrations/
│   │   ├── 20260114000526_init/
│   │   │   └── migration.sql
│   │   ├── 20260114015145_removing_email/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   └── seeds/
│       ├── data/
│       │   ├── admin.seed.ts
│       │   ├── categories.seed.ts
│       │   ├── clients.seed.ts
│       │   ├── contracts.seed.ts
│       │   ├── digital.seed.ts
│       │   ├── index.ts
│       │   ├── international.seed.ts
│       │   ├── local.seed.ts
│       │   ├── missions.seed.ts
│       │   ├── mixed.seed.ts
│       │   ├── onboarding.seed.ts
│       │   ├── payments.seed.ts
│       │   ├── proposals.seed.ts
│       │   ├── reviews.seed.ts
│       │   └── wallets.seed.ts
│       ├── onboarding.seed.ts
│       ├── seed.ts
│       └── utils/
│           ├── cleanup.ts
│           └── helpers.ts
├── readMe.md
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   ├── aws.ts
│   │   ├── database.ts
│   │   ├── env.ts
│   │   ├── redis.ts
│   │   ├── swagger.config.ts
│   │   ├── twilio.ts
│   │   └── swagger/
│   │       └── schemas.ts
│   ├── generated/
│   │   └── prisma/ (Client Prisma généré)
│   ├── jobs/
│   │   └── cleanup.job.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.dto.ts
│   │   │   ├── auth.middleware.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── otp.service.ts
│   │   │   └── security.service.ts
│   │   ├── categories/
│   │   │   ├── category.controller.ts
│   │   │   ├── category.dto.ts
│   │   │   ├── category.route.ts
│   │   │   └── category.service.ts
│   │   ├── contract/
│   │   │   ├── contract.controller.ts
│   │   │   ├── contract.dto.ts
│   │   │   ├── contract.route.ts
│   │   │   └── contract.service.ts
│   │   ├── dashboard/
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── dashboard.dto.ts
│   │   │   ├── dashboard.route.ts
│   │   │   └── dashboard.service.ts
│   │   ├── dispute/
│   │   │   ├── dispute.controller.ts
│   │   │   ├── dispute.dto.ts
│   │   │   ├── dispute.route.ts
│   │   │   └── dispute.service.ts
│   │   ├── freelancer-skills/
│   │   │   ├── freelancer-skill.controller.ts
│   │   │   ├── freelancer-skill.dto.ts
│   │   │   ├── freelancer-skill.route.ts
│   │   │   └── freelancer-skill.service.ts
│   │   ├── message/
│   │   │   ├── message.controller.ts
│   │   │   ├── message.dto.ts
│   │   │   ├── message.route.ts
│   │   │   └── message.service.ts
│   │   ├── mission-report/
│   │   │   ├── mission-report.controller.ts
│   │   │   ├── mission-report.dto.ts
│   │   │   ├── mission-report.route.ts
│   │   │   └── mission-report.service.ts
│   │   ├── missions/
│   │   │   ├── mission.controller.ts
│   │   │   ├── mission.dto.ts
│   │   │   ├── mission.middleware.ts
│   │   │   ├── mission.route.ts
│   │   │   └── mission.service.ts
│   │   ├── onboarding/
│   │   ├── proposal/
│   │   ├── review/
│   │   ├── skills/
│   │   ├── user/
│   │   └── wallet/
│   ├── prisma/
│   │   └── doc.md
│   └── shared/
│       ├── constants/
│       │   ├── errors.ts
│       │   └── roles.ts
│       ├── middlewares/
│       │   ├── async-handler.ts
│       │   ├── error-handler.ts
│       │   ├── logger.ts
│       │   ├── rate-limite.ts
│       │   ├── upload.ts
│       │   └── validate.ts
│       ├── types/
│       │   ├── common.types.ts
│       │   └── express.d.ts
│       └── utils/
│           ├── email.utils.ts
│           ├── errors.ts
│           ├── hash.utils.ts
│           ├── jwt.utils.ts
│           └── response.utils.ts
├── tests/
│   ├── auth.test.ts
│   ├── onboarding.test.ts
│   └── setup.ts
└── tsconfig.json
