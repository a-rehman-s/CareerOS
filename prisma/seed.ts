/**
 * Prisma Seed Script
 * Creates development/demo data — NOT for production use.
 */
import { PrismaClient, EmploymentType, SkillProficiency, ApplicationStatus, InterviewType, RemoteType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CareerOS development database...");

  // ── Demo User ──────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("demo1234!", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@careeros.dev" },
    update: {},
    create: {
      email: "demo@careeros.dev",
      name: "Alex Demo",
      passwordHash,
      emailVerified: new Date(),
    },
  });

  console.log(`  ✓ User: ${user.email}`);

  // ── Profile ────────────────────────────────────────────────────────────────
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      professionalTitle: "Full-Stack Engineer & AI Developer",
      professionalSummary:
        "Passionate software engineer with 3+ years of experience building scalable web applications and AI-powered systems. Strong background in Python, TypeScript, and cloud infrastructure.",
      location: "San Francisco, CA",
      website: "https://alexdemo.dev",
      publicEmail: "alex@example.com",
      isPublic: true,
    },
  });

  // ── Education ─────────────────────────────────────────────────────────────
  await prisma.education.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: user.id,
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: new Date("2019-08-01"),
        endDate: new Date("2023-05-15"),
        cgpa: 3.7,
        coursework: ["Data Structures", "Algorithms", "Machine Learning", "Database Systems", "Operating Systems"],
        isPublic: true,
        order: 0,
      },
    ],
  });

  // ── Experience ────────────────────────────────────────────────────────────
  await prisma.experience.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: user.id,
        company: "TechCorp Inc.",
        position: "Software Engineer",
        employmentType: EmploymentType.FULL_TIME,
        location: "San Francisco, CA",
        isRemote: true,
        startDate: new Date("2023-07-01"),
        isCurrent: true,
        description: "Building scalable backend services and AI integrations for the company's flagship SaaS platform.",
        achievements: [
          "Reduced API response time by 40% through query optimization and caching",
          "Led migration from monolith to microservices for 3 core modules",
          "Integrated LLM-powered features used by 50,000+ users",
        ],
        technologies: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "AWS", "OpenAI"],
        isPublic: true,
        order: 0,
      },
      {
        userId: user.id,
        company: "Startup Labs",
        position: "Software Engineering Intern",
        employmentType: EmploymentType.INTERNSHIP,
        location: "Remote",
        isRemote: true,
        startDate: new Date("2022-06-01"),
        endDate: new Date("2022-08-31"),
        description: "Developed data pipeline and visualization tools for analytics platform.",
        achievements: [
          "Built ETL pipeline processing 1M+ records daily",
          "Created React dashboard for real-time data visualization",
        ],
        technologies: ["Python", "React", "PostgreSQL", "Apache Airflow"],
        isPublic: true,
        order: 1,
      },
    ],
  });

  // ── Skills ────────────────────────────────────────────────────────────────
  const skillsData = [
    { name: "TypeScript", category: "Languages", proficiency: SkillProficiency.ADVANCED, yearsOfExperience: 3 },
    { name: "Python", category: "Languages", proficiency: SkillProficiency.ADVANCED, yearsOfExperience: 4 },
    { name: "JavaScript", category: "Languages", proficiency: SkillProficiency.ADVANCED, yearsOfExperience: 4 },
    { name: "React", category: "Frontend", proficiency: SkillProficiency.ADVANCED, yearsOfExperience: 3 },
    { name: "Next.js", category: "Frontend", proficiency: SkillProficiency.INTERMEDIATE, yearsOfExperience: 2 },
    { name: "Node.js", category: "Backend", proficiency: SkillProficiency.ADVANCED, yearsOfExperience: 3 },
    { name: "PostgreSQL", category: "Databases", proficiency: SkillProficiency.INTERMEDIATE, yearsOfExperience: 3 },
    { name: "Redis", category: "Databases", proficiency: SkillProficiency.INTERMEDIATE, yearsOfExperience: 1 },
    { name: "Machine Learning", category: "AI/ML", proficiency: SkillProficiency.INTERMEDIATE, yearsOfExperience: 2 },
    { name: "LLM Integration", category: "AI/ML", proficiency: SkillProficiency.INTERMEDIATE, yearsOfExperience: 1 },
    { name: "AWS", category: "Cloud", proficiency: SkillProficiency.INTERMEDIATE, yearsOfExperience: 2 },
    { name: "Docker", category: "DevOps", proficiency: SkillProficiency.INTERMEDIATE, yearsOfExperience: 2 },
    { name: "Git", category: "Tools", proficiency: SkillProficiency.ADVANCED, yearsOfExperience: 4 },
    { name: "REST APIs", category: "Backend", proficiency: SkillProficiency.EXPERT, yearsOfExperience: 4 },
  ];

  for (const skill of skillsData) {
    await prisma.skill.upsert({
      where: { userId_name: { userId: user.id, name: skill.name } },
      update: {},
      create: { userId: user.id, ...skill, isPublic: true },
    });
  }

  // ── Projects ─────────────────────────────────────────────────────────────
  await prisma.project.upsert({
    where: { userId_slug: { userId: user.id, slug: "careeros" } },
    update: {},
    create: {
      userId: user.id,
      name: "CareerOS",
      slug: "careeros",
      shortDescription: "AI-powered career management platform",
      fullDescription:
        "A comprehensive career operating system that uses AI agents to help users manage their professional identity, job search, applications, and interview preparation.",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "OpenAI", "pgvector"],
      featured: true,
      isPublic: true,
      order: 0,
    },
  });

  // ── Job Sources ───────────────────────────────────────────────────────────
  const manualSource = await prisma.jobSource.upsert({
    where: { id: "source-manual" },
    update: {},
    create: {
      id: "source-manual",
      name: "Manual Import",
      provider: "manual",
      isActive: true,
    },
  });

  // ── Demo Company ──────────────────────────────────────────────────────────
  const company = await prisma.company.create({
    data: {
      name: "Acme Technologies",
      normalizedName: "acme technologies",
      domain: "acme.com",
      industry: "Software",
      size: "500-1000",
      location: "New York, NY",
    },
  });

  // ── Demo Job ──────────────────────────────────────────────────────────────
  const job = await prisma.job.create({
    data: {
      userId: user.id,
      companyId: company.id,
      sourceId: manualSource.id,
      title: "Senior Full-Stack Engineer",
      description:
        "We are looking for a Senior Full-Stack Engineer to join our growing team. You will work on our core product platform, building features that serve millions of users.",
      requirements: "5+ years of experience, TypeScript, React, Node.js, PostgreSQL",
      location: "New York, NY",
      remoteType: RemoteType.HYBRID,
      employmentType: EmploymentType.FULL_TIME,
      seniority: "Senior",
      salaryMin: 150000,
      salaryMax: 200000,
      currency: "USD",
      skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"],
    },
  });

  // ── Demo Application ──────────────────────────────────────────────────────
  const application = await prisma.application.create({
    data: {
      userId: user.id,
      jobId: job.id,
      status: ApplicationStatus.INTERVIEW,
      appliedAt: new Date("2026-08-20"),
      recruiterName: "Sarah Johnson",
      recruiterEmail: "sarah.johnson@acme.com",
      notes: "Good culture fit. Strong interest in the role.",
      events: {
        create: [
          {
            type: "DISCOVERED",
            title: "Job discovered",
            occurredAt: new Date("2026-08-18"),
          },
          {
            type: "APPLIED",
            title: "Application submitted",
            occurredAt: new Date("2026-08-20"),
          },
          {
            type: "SCREENING",
            title: "Phone screening completed",
            description: "30-minute call with recruiter. Positive feedback.",
            occurredAt: new Date("2026-08-25"),
          },
          {
            type: "INTERVIEW_SCHEDULED",
            title: "Technical interview scheduled",
            occurredAt: new Date("2026-09-01"),
          },
        ],
      },
    },
  });

  // ── Demo Interview ────────────────────────────────────────────────────────
  await prisma.interview.create({
    data: {
      applicationId: application.id,
      userId: user.id,
      type: InterviewType.TECHNICAL,
      scheduledAt: new Date("2026-09-10T14:00:00Z"),
      duration: 60,
      meetingUrl: "https://meet.google.com/demo-link",
      interviewerName: "James Chen",
      interviewerRole: "Staff Engineer",
    },
  });

  console.log("  ✓ Profile, education, experience, skills, projects seeded");
  console.log("  ✓ Demo job, application, and interview created");
  console.log("\n✅ Seed complete!");
  console.log("\nDemo credentials:");
  console.log("  Email:    demo@careeros.dev");
  console.log("  Password: demo1234!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
