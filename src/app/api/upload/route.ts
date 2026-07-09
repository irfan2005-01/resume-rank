import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import pdf from "pdf-parse-fork";

// Initialize the Prisma Client with the PG driver adapter
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No document file uploaded." }, { status: 400 });
    }

    // 1. Convert file into a buffer chunk and extract raw text string
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const parsedPdf = await pdf(buffer);
    const textContent = parsedPdf.text;

    // 2. Automated Extraction Fallbacks via RegEx (Email and Phone)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/;

    const emailMatch = textContent.match(emailRegex);
    const phoneMatch = textContent.match(phoneRegex);

    const email = emailMatch ? emailMatch[0] : `applicant.${Date.now()}@digitalheroes.com`;
    const phone = phoneMatch ? phoneMatch[0] : "Not Extracted";
    
    // Clean a temporary candidate name out of the file layout prefix
    const rawName = file.name.replace(".pdf", "").replace(/[-_]/g, " ");
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    // 3. Fallback to connect to an existing job or pick the absolute first active one
    let targetJob = await prisma.job.findFirst();
    if (!targetJob) {
      targetJob = await prisma.job.create({
        data: {
          title: "Full Stack Software Engineer",
          description: "Core software engineering position utilizing Next.js, Prisma, and Supabase database models.",
          department: "Engineering",
        },
      });
    }

    // 4. Algorithm Simulation: Generate a match score (e.g., between 65% and 98%)
    const computedMatchScore = Math.floor(Math.random() * (98 - 65 + 1)) + 65;
    const pipelineStatus = computedMatchScore >= 85 ? "SHORTLISTED" : "NEW";

    // 5. DB Transaction: Commit the new Candidate and Evaluation layers concurrently
    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        phone,
        status: pipelineStatus,
        resumeUrl: "#", // In production, this drops an S3/Supabase storage url link
        jobId: targetJob.id,
        evaluation: {
          create: {
            matchScore: computedMatchScore,
            summary: "Extracted and profiled via the active Next.js parser system layer.",
          }
        }
      },
      include: {
        evaluation: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Resume parsed successfully.",
      candidate,
      score: computedMatchScore
    }, { status: 200 });

  } catch (error: any) {
    console.error("Critical API Error:", error);
    return NextResponse.json({ 
      error: "Failed to evaluate document layout. Check terminal logs." 
    }, { status: 500 });
  }
}