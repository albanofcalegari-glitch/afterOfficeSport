# After Office Sports ⚽🎾

Web interna informal para que la gente del trabajo inscriba equipos en torneos de fútbol y pádel, publique partidos amistosos, y abra canchas de pádel para juntar jugadores.

## Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS v4
- **Backend**: Node.js + Express 5 + TypeScript
- **ORM**: Prisma 6
- **Base de datos**: PostgreSQL 16
- **Infraestructura**: Docker Compose

## Requisitos

- Node.js 22+
- Docker Desktop

## Quick Start

```bash
# 1. Levantar PostgreSQL
docker compose up -d

# 2. Instalar dependencias
cd apps/api && npm install
cd ../web && npm install
cd ../..

# 3. Correr migraciones
cd apps/api
npx prisma migrate dev
npm run seed
cd ../..

# 4. Levantar todo (desde la raíz)
npm run dev
```

O por separado:

```bash
# API (puerto 3001)
cd apps/api && npm run dev

# Frontend (puerto 5173, proxy a API)
cd apps/web && npm run dev
```

## Estructura

```
torneos-trabajo/
  apps/
    web/                    # Frontend React
      src/
        api/client.ts       # Cliente API tipado
        components/          # 11 componentes
        types/index.ts       # Tipos TypeScript
        data/options.ts      # Configuración de opciones
        App.tsx
    api/                    # Backend Express
      src/
        routes/             # teams, friendly-matches, participants
        services/           # Lógica de negocio
        lib/                # Prisma client, errores
      prisma/
        schema.prisma       # 3 modelos, 6 enums
        migrations/
  docker-compose.yml
  .env
```

## API Endpoints

### Equipos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/teams | Listar equipos inscriptos |
| POST | /api/teams | Inscribir equipo |
| GET | /api/teams/:id | Ver equipo |
| DELETE | /api/teams/:id | Eliminar equipo |

### Amistosos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/friendly-matches | Listar amistosos |
| POST | /api/friendly-matches | Crear amistoso |
| GET | /api/friendly-matches/:id | Ver amistoso |
| PATCH | /api/friendly-matches/:id/status | Cambiar estado |
| DELETE | /api/friendly-matches/:id | Eliminar amistoso |

### Participantes (cancha abierta)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/friendly-matches/:id/participants | Listar participantes |
| POST | /api/friendly-matches/:id/participants | Sumarse a cancha |

## Funcionalidades

### Inscripción de equipos a torneo
Un representante/capitán inscribe al equipo con: nombre, deporte, modalidad, categoría, integrantes, disponibilidad y datos de contacto.

### Partidos amistosos
Publicar solicitud de partido (fútbol o pádel). Otros pueden responder con "Me interesa" y el estado cambia a "Rival interesado".

### Cancha abierta de pádel
Publicar una cancha abierta para juntar jugadores sueltos:
- Cupo: 6 mínimo, 8 máximo
- El organizador puede sumarse como jugador
- Estados automáticos: Juntando jugadores → Cupo mínimo completo → Cancha completa
- Barra de progreso visual con participantes

## Variables de entorno

```
DATABASE_URL="postgresql://torneos:torneos123@localhost:5435/torneos_trabajo?schema=public"
PORT=3001
```

## Próximos pasos

- Autenticación con email corporativo
- Roles admin para gestionar torneos
- Fixture y tabla de posiciones
- Confirmación de rival por ambas partes
- Notificaciones por email o WhatsApp
- Exportar equipos inscriptos a Excel
- Historial de partidos
