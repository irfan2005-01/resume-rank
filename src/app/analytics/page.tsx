import React from "react";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { BarChart3, PieChart, TrendingUp, Users, Target, ShieldCheck } from "lucide-react";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function getAnalyticsData() {
  try {
    const [candidates, totalJobs] = await Promise.all([
      prisma.candidate.findMany({
        select: {
          status: true,
          evaluation: { select: { matchScore: true } }
        }
      }),
      prisma.job.count()
    ]);

    const totalApplicants = candidates.length;
    const scores = candidates
      .map(c => c.evaluation?.matchScore)
      .filter((s): s is number => typeof s === "number");

    // 1. Calculate Score Distribution Buckets
    const highMatch = scores.filter(s => s >= 85).length;
    const midMatch = scores.filter(s => s >= 70 && s < 85).length;
    const lowMatch = scores.filter(s => s < 70).length;

    // 2. Calculate Status Splits
    const shortlisted = candidates.filter(c => c.status === "SHORTLISTED").length;
    const pending = candidates.filter(c => c.status === "NEW").length;
    const rejected = candidates.filter(c => c.status === "REJECTED").length;

    // 3. System Average
    const systemAverage = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0;

    return {
      totalApplicants,
      totalJobs,
      systemAverage,
      distribution: { highMatch, midMatch, lowMatch },
      statusSplits: { shortlisted, pending, rejected }
    };
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return {
      totalApplicants: 0,
      totalJobs: 0,
      systemAverage: 0,
      distribution: { highMatch: 0, midMatch: 0, lowMatch: 0 },
      statusSplits: { shortlisted: 0, pending: 0, rejected: 0 }
    };
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  // Percentage Helpers for CSS Grid Progress Bars
  const getPercent = (value: number) => 
    data.totalApplicants > 0 ? Math.round((value / data.totalApplicants) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Pipeline Analytics</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Deep-dive insights on parsing performance, candidate scoring matrices, and conversion channels.
        </p>
      </div>

      {/* Top Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#030303] border border-zinc-900 rounded-2xl p-6">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Talent Density</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-3">{data.totalApplicants}</p>
          <p className="text-xs text-zinc-500 mt-1">Total profiles indexed via parser</p>
        </div>

        <div className="bg-[#030303] border border-zinc-900 rounded-2xl p-6">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Pipeline Fitness</span>
            <Target className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-3">{data.systemAverage}%</p>
          <p className="text-xs text-zinc-500 mt-1">System-wide AI matching mean</p>
        </div>

        <div className="bg-[#030303] border border-zinc-900 rounded-2xl p-6">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Shortlist Ratio</span>
            <ShieldCheck className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-3">
            {getPercent(data.statusSplits.shortlisted)}%
          </p>
          <p className="text-xs text-zinc-500 mt-1">Percentage of top-tier profiles</p>
        </div>
      </div>

      {/* Visual Data Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: AI Score Breakdown */}
        <div className="bg-[#030303] border border-zinc-900 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-4">
            <BarChart3 className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">AI Match Score Distribution</h2>
          </div>

          <div className="space-y-4">
            {/* High Match */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300">Top Match Tier (≥ 85%)</span>
                <span className="text-zinc-400">{data.distribution.highMatch} candidates ({getPercent(data.distribution.highMatch)}%)</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500" 
                  style={{ width: `${getPercent(data.distribution.highMatch)}%` }}
                />
              </div>
            </div>

            {/* Mid Match */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300">Moderate Fit (70% - 84%)</span>
                <span className="text-zinc-400">{data.distribution.midMatch} candidates ({getPercent(data.distribution.midMatch)}%)</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                  style={{ width: `${getPercent(data.distribution.midMatch)}%` }}
                />
              </div>
            </div>

            {/* Low Match */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300">Low Alignment (&lt; 70%)</span>
                <span className="text-zinc-400">{data.distribution.lowMatch} candidates ({getPercent(data.distribution.lowMatch)}%)</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-700 rounded-full transition-all duration-500" 
                  style={{ width: `${getPercent(data.distribution.lowMatch)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Recruitment Status Breakdown */}
        <div className="bg-[#030303] border border-zinc-900 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-4">
            <PieChart className="h-4 w-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">Application Funnel Tranches</h2>
          </div>

          <div className="space-y-4">
            {/* Shortlisted */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300">Shortlisted for Review</span>
                <span className="text-emerald-400 font-semibold">{data.statusSplits.shortlisted} active</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${getPercent(data.statusSplits.shortlisted)}%` }}
                />
              </div>
            </div>

            {/* Pending */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300">New / Unprocessed Queue</span>
                <span className="text-zinc-400 font-semibold">{data.statusSplits.pending} active</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-500 rounded-full transition-all duration-500" 
                  style={{ width: `${getPercent(data.statusSplits.pending)}%` }}
                />
              </div>
            </div>

            {/* Rejected */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300">Archived / Rejected Tranche</span>
                <span className="text-rose-400 font-semibold">{data.statusSplits.rejected} active</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                  style={{ width: `${getPercent(data.statusSplits.rejected)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}