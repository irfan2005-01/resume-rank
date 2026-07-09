import React from "react";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { Users, Briefcase, Award, TrendingUp } from "lucide-react";

// Initialize the Prisma Client using the custom pg driver adapter
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function getDashboardMetrics() {
  try {
    // 1. Fetch data safely by pulling evaluations through the candidate model
    const [totalCandidates, totalJobs, candidatesWithScores] = await Promise.all([
      prisma.candidate.count(),
      prisma.job.count(),
      prisma.candidate.findMany({
        select: {
          evaluation: {
            select: { matchScore: true }
          }
        }
      })
    ]);

    // 2. Extract and filter out any null/undefined scores safely
    const scores = candidatesWithScores
      .map(c => c.evaluation?.matchScore)
      .filter((score): score is number => typeof score === "number");

    // 3. Compute the exact average AI match score safely
    const averageMatchScore = scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;

    // 4. Count top-tier profiles (Match score >= 85)
    const highMatchCount = scores.filter(score => score >= 85).length;

    return {
      totalCandidates,
      totalJobs,
      averageMatchScore,
      highMatchCount
    };
  } catch (error) {
    console.error("Database query failed:", error);
    return { totalCandidates: 0, totalJobs: 0, averageMatchScore: 0, highMatchCount: 0 };
  }
}

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  const cards = [
    {
      title: "Total Applicants",
      value: metrics.totalCandidates,
      description: "Profiles synced from storage",
      icon: Users,
      color: "text-blue-400",
    },
    {
      title: "Active Job Postings",
      value: metrics.totalJobs,
      description: "Open roles accepting resumes",
      icon: Briefcase,
      color: "text-indigo-400",
    },
    {
      title: "Average Match Score",
      value: `${metrics.averageMatchScore}%`,
      description: "Overall pipeline fitness rating",
      icon: Award,
      color: "text-emerald-400",
    },
    {
      title: "Shortlisted (AI)",
      value: metrics.highMatchCount,
      description: "Profiles scored above 85%",
      icon: TrendingUp,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Real-time metrics compiled straight from your Supabase data architecture cluster.
        </p>
      </div>

      {/* Metrics Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.title} 
              className="bg-[#030303] border border-zinc-900 rounded-2xl p-6 transition-all duration-200 hover:border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {card.title}
                </span>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-white">
                  {card.value}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}