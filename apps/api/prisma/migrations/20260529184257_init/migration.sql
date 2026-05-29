-- CreateEnum
CREATE TYPE "Sport" AS ENUM ('futbol', 'padel');

-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('masculino', 'femenino', 'mixto');

-- CreateEnum
CREATE TYPE "OrganizerType" AS ENUM ('persona', 'dupla', 'equipo');

-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('team_vs_team', 'closed_match', 'open_court');

-- CreateEnum
CREATE TYPE "FriendlyMatchStatus" AS ENUM ('buscando_rival', 'rival_interesado', 'juntando_jugadores', 'cupo_minimo_completo', 'cancha_completa', 'cancelado');

-- CreateTable
CREATE TABLE "registered_teams" (
    "id" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "sport" "Sport" NOT NULL,
    "mode" "Mode" NOT NULL,
    "category" TEXT NOT NULL,
    "area" TEXT,
    "membersCount" INTEGER NOT NULL,
    "representativeName" TEXT NOT NULL,
    "representativeContact" TEXT NOT NULL,
    "representativeArea" TEXT,
    "availability" JSONB NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registered_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendly_matches" (
    "id" TEXT NOT NULL,
    "sport" "Sport" NOT NULL,
    "mode" "Mode" NOT NULL,
    "category" TEXT NOT NULL,
    "organizerName" TEXT NOT NULL,
    "organizerContact" TEXT NOT NULL,
    "organizerType" "OrganizerType" NOT NULL DEFAULT 'persona',
    "matchType" "MatchType" NOT NULL DEFAULT 'team_vs_team',
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT,
    "message" TEXT,
    "status" "FriendlyMatchStatus" NOT NULL DEFAULT 'buscando_rival',
    "minPlayers" INTEGER,
    "maxPlayers" INTEGER,
    "organizerPlays" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friendly_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "open_court_participants" (
    "id" TEXT NOT NULL,
    "friendlyMatchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "open_court_participants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "open_court_participants" ADD CONSTRAINT "open_court_participants_friendlyMatchId_fkey" FOREIGN KEY ("friendlyMatchId") REFERENCES "friendly_matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
