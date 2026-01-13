import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  // 1️⃣ Read HTML template from public folder
  const filePath = path.join(
    process.cwd(),
    'public',
    'templates',
    'BiodataTemplate.html'
  )

  // let html = fs.readFileSync(filePath, 'utf-8')
  const sampleTemplate=await prisma.sampleTemplate.findFirst({
    where:{
      title:'bio-data'
    }
  })
  let html=(sampleTemplate?.templateData) as string;

  // 2️⃣ Inject dynamic data (optional)
//   html = html
//     .replace('{{customer}}', 'John Doe')
//     .replace('{{date}}', new Date().toLocaleDateString())
//     .replace('{{total}}', '$199.00')

const ASSETS_PATH = `file://${path.join(
  process.cwd(),
  'public',
  'templates',
  'assets'
)}/`

html = html
  .replace(
    './assets/ganpati.png',
    `${ASSETS_PATH}/ganpati.png`
  )
  .replace(
    './assets/shree_ganesh.png',
    `${ASSETS_PATH}/shree_ganesh.png`
  )

  // 3️⃣ Launch Puppeteer
  const browser = await puppeteer.launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
  ],
})


  try {
    const page = await browser.newPage()

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    })

    // 4️⃣ Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    })

    // 5️⃣ Return PDF as download
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="invoice.pdf"',
      },
    })
  } catch (error) {
    console.error(error)
    return new NextResponse('Failed to generate PDF', { status: 500 })
  } finally {
    await browser.close()
  }
}
