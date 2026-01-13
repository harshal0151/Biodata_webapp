import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});



export async function main() {
  const filePath = path.join(
      process.cwd(),
      'public',
      'templates',
      'BiodataTemplate.html'
    )
  
    let html = fs.readFileSync(filePath, 'utf-8')

  const data=await prisma.sampleTemplate.create({
    data:{
      title:'bio-data',
      templateData:html
    }
  })
  console.log(data)
}

main();