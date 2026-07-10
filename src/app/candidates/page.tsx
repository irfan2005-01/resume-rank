import React from "react";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { User, Briefcase, FileText, CheckCircle, Clock, XCircle, ExternalLink } from "lucide-react";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function getCandidates() {
  try {
    return await prisma.candidate.findMany({
      include: {
        job: { select: { title: true } },
        evaluation: { select: { matchScore: true } }
      },
      orderBy: { id: "desc" }
    });
  } catch (error) {
    console.error("Failed to fetch candidates:", error);
    return [];
  }
}

export default async function CandidatesPage() {
  const candidates = await getCandidates();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Candidates Pipeline</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Review, screen, and track incoming technical talent metrics in real time.
        </p>
      </div>

      {/* HORIZONTALLY SLIDABLE TABLE WRAPPER FOR MOBILE PROTECTION */}
      <div className="w-full overflow-x-auto pb-4 rounded-2xl border border-zinc-900 bg-[#030303] scrollbar-thin scrollbar-thumb-zinc-800">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <th className="p-4 pl-6">Candidate</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Match Score</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Resume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-sm text-zinc-300">
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  No applicants tracked yet. Go to the Upload portal to parse your first resume.
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-zinc-950/50 transition-colors group">
                  {/* Name & Email */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 group-hover:border-zinc-700 transition-colors">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{candidate.name}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{candidate.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Applied Track */}
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Briefcase className="h-4 w-4 text-zinc-600" />
                      <span>{candidate.job?.title || "General Engineering Track"}</span>
                    </div>
                  </td>

                  {/* AI Match Score Badge */}
                  <td className="p-4">
                    {candidate.evaluation ? (
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-zinc-900 h-2 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className={`h-full rounded-full ${
                              (candidate.evaluation.matchScore ?? 0) >= 85 ? 'bg-emerald-500' : 
                              (candidate.evaluation.matchScore ?? 0) >= 70 ? 'bg-indigo-500' : 'bg-zinc-600'
                            }`}
                            style={{ width: `${candidate.evaluation.matchScore}%` }}
                          />
                        </div>
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md border ${
                          (candidate.evaluation.matchScore ?? 0) >= 85 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                          (candidate.evaluation.matchScore ?? 0) >= 70 ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 
                          'bg-zinc-500/10 border-zinc-800 text-zinc-400'
                        }`}>
                          {candidate.evaluation.matchScore}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-600">Pending AI Eval</span>
                    )}
                  </td>

                  {/* Pipeline Status Tag */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                      candidate.status === "SHORTLISTED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      candidate.status === "REJECTED" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                      "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {candidate.status === "SHORTLISTED" && <CheckCircle className="h-3 w-3" />}
                      {candidate.status === "NEW" && <Clock className="h-3 w-3" />}
                      {candidate.status === "REJECTED" && <XCircle className="h-3 w-3" />}
                      {candidate.status}
                    </span>
                  </td>

                  {/* Document Raw Action Link */}
                  <td className="p-4 pr-6 text-right">
                    {candidate.resumeUrl ? (
                      <a 
                        href={candidate.resumeUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 border border-zinc-800 rounded-xl transition-all"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">View PDF</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-600">No File</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}