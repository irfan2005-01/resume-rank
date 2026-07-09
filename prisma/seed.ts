import { PrismaClient, Role, CandidateStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { config } from 'dotenv';

// Load environment variables from .env
config();

// Initialize the PostgreSQL driver using the pooled connection URL
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Pass the adapter directly to PrismaClient as per the driver-adapter specification
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Connected to Supabase via database adapter. Cleaning old records...');
  
  // Clean out any old data to prevent duplication crashes
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" CASCADE;`);

  // Create primary recruiter account
  const recruiter = await prisma.user.create({
    data: {
      name: "Syed Irfan",
      email: "recruiter@resumerank.com",
      passwordHash: "$2b$12$L7pYhR0O8eW3g3g3g3g3gO", // Secure schema hash stub
      role: Role.RECRUITER,
    },
  });

  console.log('👤 Recruiter account configured...');

  // Create a Mock Job Posting
  const job = await prisma.job.create({
    data: {
      title: "Senior Full-Stack Engineer (Next.js & TS)",
      description: "Looking for a software engineer proficient in strict TypeScript, Next.js App Router, and database optimization.",
      department: "Engineering",
      location: "Remote (India)",
      recruiterId: recruiter.id,
    },
  });

  console.log('💼 Active job posting published...');

  // Inject Mock Candidates with structured evaluations
  await prisma.candidate.create({
    data: {
      name: "Almas Batool",
      email: "almas.batool@example.com",
      phone: "+91 98765 43210",
      resumeUrl: "https://supabase.co/storage/v1/object/public/resumes/almas_resume.pdf",
      status: CandidateStatus.SHORTLISTED,
      jobId: job.id,
      evaluation: {
        create: {
          matchScore: 94,
          summary: "Exceptional candidate with deep expertise in full-stack architecture, database design patterns, and strict TypeScript compilation guardrails.",
          skillsMatched: ["TypeScript", "Next.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
          gapsIdentified: ["No native mobile experience"],
          interviewQuestions: [
            "Explain your strategy for migrating database schemas seamlessly in a high-traffic production system.",
            "How do you optimize server-rendered components in Next.js to hit p75 field metrics?"
          ],
        },
      },
    },
  });

  await prisma.candidate.create({
    data: {
      name: "Qizra Zainab",
      email: "qizra.zainab@example.com",
      phone: "+91 98765 55555",
      resumeUrl: "https://supabase.co/storage/v1/object/public/resumes/qizra_resume.pdf",
      status: CandidateStatus.NEW,
      jobId: job.id,
      evaluation: {
        create: {
          matchScore: 78,
          summary: "Strong frontend capabilities with robust state-management knowledge, but displays a slight experience gap in relational database indexing and schema performance optimization.",
          skillsMatched: ["React", "Tailwind CSS", "Next.js", "Zod"],
          gapsIdentified: ["Weak backend metrics", "No advanced SQL references"],
          interviewQuestions: [
            "Can you describe how you handle data parsing boundaries between an untrusted API line and your client application runtime using Zod?"
          ],
        },
      },
    },
  });

  console.log('🤖 Loaded structured candidates and AI pipeline logs...');
  console.log('🌱 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });