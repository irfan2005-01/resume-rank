import React from "react";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { Briefcase, MapPin, Building2, Users, Calendar, ArrowUpRight } from "lucide-react";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function getActiveJobs() {
  try {
    // Fetch jobs along with a count of candidates applied to each role
    return await prisma.job.findMany({
      include: {
        _count: {
          select: { candidates: true }
        }
      },
      orderBy: { id: "desc" }
    });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getActiveJobs();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Active Openings</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage and monitor corporate role positions and track applicant density across core engineering tracks.
        </p>
      </div>

      {/* Jobs Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.length === 0 ? (
          <div className="col-span-full bg-[#030303] border border-zinc-900 rounded-2xl p-12 text-center text-zinc-500">
            No active job positions found in the cluster. Run seed file or upload a resume to auto-create roles.
          </div>
        ) : (
          jobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-[#030303] border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-800 transition-all duration-200 group relative"
            >
              <div className="space-y-4">
                {/* Job Title & Department Tag */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-zinc-500" /> {job.department || "Engineering"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" /> {job.location || "Remote (India)"}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-900 text-zinc-400 group-hover:text-white transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Job Description Text */}
                <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Footer Metrics Area */}
              <div className="flex items-center justify-between border-t border-zinc-900 mt-6 pt-4 text-xs text-zinc-500">
                <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span>{job._count?.candidates ?? 0} Applicants Tracked</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Active</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}