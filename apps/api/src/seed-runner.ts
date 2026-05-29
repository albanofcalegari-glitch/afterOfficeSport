import './env.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.friendlyMatch.count()
  if (count > 0) {
    console.log(`Seed skipped: ${count} matches already exist`)
    return
  }

  await prisma.friendlyMatch.createMany({
    data: [
      {
        sport: 'futbol',
        mode: 'mixto',
        category: 'Fútbol 5',
        organizerName: 'Sistemas FC',
        organizerContact: 'sistemas@empresa.com',
        organizerType: 'equipo',
        matchType: 'team_vs_team',
        date: 'Jueves',
        time: '19:30',
        location: 'Cancha a confirmar',
        message: 'Buscamos rival para partido tranquilo.',
        status: 'buscando_rival',
      },
      {
        sport: 'padel',
        mode: 'masculino',
        category: 'Pádel intermedio',
        organizerName: 'Dupla de Ventas',
        organizerContact: 'ventas@empresa.com',
        organizerType: 'dupla',
        matchType: 'closed_match',
        date: 'Martes',
        time: '20:00',
        message: 'Tenemos cancha el martes. Falta dupla rival.',
        status: 'buscando_rival',
      },
      {
        sport: 'futbol',
        mode: 'masculino',
        category: 'Fútbol 8',
        organizerName: 'Equipo de Operaciones',
        organizerContact: 'operaciones@empresa.com',
        organizerType: 'equipo',
        matchType: 'team_vs_team',
        date: 'Sábado',
        time: '10:00',
        message: 'Partido amistoso previo al torneo interno.',
        status: 'buscando_rival',
      },
    ],
  })
  console.log('Seed data created: 3 friendly matches')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
