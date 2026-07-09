import React from "react";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { FileText, Mail, Phone, ShieldAlert, CheckCircle2, Clock } from "lucide-react";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function getCandidatesList() {
  try {
    return await prisma.candidate.findMany({
      include: {
        job: { select: { title: true } },
        evaluation: { select: { matchScore: true, summary: true } },
      },
      orderBy: { id: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch candidates:", error);
    return [];
  }
}

export default async function CandidatesPage() {
  const candidates = await getCandidatesList();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Candidates Pipeline</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Review, sort, and track automated screening scores for incoming job applications.
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-[#030303] border border-zinc-900 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-950/50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <th className="p-4 pl-6">Candidate Info</th>
                <th className="p-4">Applied Position</th>
                <th className="p-4">Pipeline Status</th>
                <th className="p-4 text-center">AI Match Score</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50 text-sm">
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    No application profiles found in the database layer.
                  </td>
                </tr>
              ) : (
                candidates.map((candidate) => {
                  const score = candidate.evaluation?.matchScore ?? 0;
                  
                  // Score color assignment
                  const scoreColor = 
                    score >= 85 ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" :
                    score >= 70 ? "text-indigo-400 bg-indigo-500/5 border-indigo-500/10" : 
                    "text-zinc-400 bg-zinc-500/5 border-zinc-500/10";

                  return (
                    <tr key={candidate.id} className="hover:bg-zinc-950/40 transition-colors group">
                      {/* Bio & Contact Column */}
                      <td className="p-4 pl-6">
                        <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                          {candidate.name}
                        </div>
                        <div className="flex flex-col gap-1 mt-1.5 text-xs text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3" /> {candidate.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3" /> {candidate.phone || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Job Role Column */}
                      <td className="p-4 vertical-align-middle">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-900 text-zinc-300 border border-zinc-800">
                          {candidate.job?.title || "Unassigned"}
                        </span>
                      </td>

                      {/* Application Status Tag */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border uppercase tracking-wider ${
                          candidate.status === "SHORTLISTED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          candidate.status === "REJECTED" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                          "bg-zinc-900 text-zinc-400 border-zinc-800"
                        }`}>
                          {candidate.status === "SHORTLISTED" && <CheckCircle2 className="h-3 w-3" />}
                          {candidate.status === "REJECTED" && <ShieldAlert className="h-3 w-3" />}
                          {candidate.status === "NEW" && <Clock className="h-3 w-3" />}
                          {candidate.status}
                        </span>
                      </td>

                      {/* Centered Match Score Badge */}
                      <td className="p-4 text-center">
                        <span className={`inline-block w-12 text-center py-1 rounded-lg text-xs font-bold border ${scoreColor}`}>
                          {score}%
                        </span>
                      </td>

                      {/* Document Viewer Access */}
                      <td className="p-4 pr-6 text-right">
                        <a
                          href={candidate.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-950 px-3 py-1.5 rounded-xl transition-all"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          View Document
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}