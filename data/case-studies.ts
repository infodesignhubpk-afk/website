import type { CaseStudy } from "@/types";

export const caseStudies: CaseStudy[] = [
  {
    slug: "khyber-realty-launch",
    title: "Launching Khyber Realty's Hayatabad project with a 240-day brand sprint",
    client: "Khyber Realty",
    industry: "Real Estate",
    category: "branding",
    summary:
      "From master brand to site hoardings to social ads — a single 240-day engagement that took a launch from name to opening day.",
    challenge:
      "Khyber Realty had a new Hayatabad housing project locked, but no name, no identity, no marketing collateral, and a fixed launch date 240 days away. Five vendors had been spoken to; none could own the full scope. The brief: one studio, one accountable timeline, no missed deadlines that would push the launch into the off-season.",
    approach:
      "We ran a five-week strategy and identity sprint to land the master brand and the project sub-brand, then built the rollout in waves: stationery and pitch deck for sales week one, site hoardings and sales-office signage for week eight, brochure and walk-in floor-plan board for week twelve, and a Meta ads launch campaign in the final month. Project manager held a weekly 30-minute review across the full team for the entire engagement.",
    outcome:
      "Launch event opened on schedule with every brand asset in place. The first cohort of plot bookings closed inside six weeks, and the lead-generation campaign on Meta hit a cost per qualified site-visit lead 40% below the budgeted target. Khyber Realty has since engaged Design Hub for two further projects.",
    metrics: [
      { label: "Days from kickoff to launch", value: "240" },
      { label: "Brand assets shipped", value: "60+" },
      { label: "Cost-per-lead vs budget", value: "−40%" },
      { label: "Repeat engagements since", value: "2" },
    ],
    image: "/case-studies/khyber-realty.jpg",
  },
  {
    slug: "saddar-bites-rebrand",
    title: "Rebranding Saddar Bites and lifting footfall by 30% month-on-month",
    client: "Saddar Bites",
    industry: "Food & Beverage",
    category: "branding",
    summary:
      "A menu-redesign brief turned into a full identity, packaging and social system that lifted same-store footfall.",
    challenge:
      "Saddar Bites came to us asking for a menu reprint. The audit showed something deeper — the brand had drifted across signage, packaging, social and uniforms over five years, and the menu reprint would not fix the underlying problem. We proposed a contained rebrand instead.",
    approach:
      "Six-week engagement: positioning workshop with the founder, new wordmark and identity system, menu redesign, recyclable takeaway packaging, signboard refresh, uniform branding, and a 90-day social content engine to relaunch the brand to existing followers and reach new ones.",
    outcome:
      "Same-store footfall rose roughly 30% month-on-month for the three months following relaunch, with order frequency from existing customers up notably. The takeaway packaging began surfacing in Hayatabad influencer reels organically inside the first month. Owner has since opened a second branch using the same brand system.",
    metrics: [
      { label: "Same-store footfall lift", value: "≈30%" },
      { label: "Weeks from kickoff to relaunch", value: "6" },
      { label: "Branches now operating", value: "2" },
      { label: "Avg organic Instagram reel reach", value: "70k+" },
    ],
    image: "/case-studies/saddar-bites.jpg",
  },
  {
    slug: "north-academy-admissions",
    title: "Cutting North Academy's cost-per-enquiry by 60% on Meta",
    client: "North Academy",
    industry: "Education",
    category: "social",
    summary:
      "A rebuilt admissions funnel and tightly-creative-tested Meta campaign that drove enquiry volume up and cost-per-lead down across two cycles.",
    challenge:
      "North Academy had been running a small admissions ad spend on Facebook for two cycles. Cost per enquiry was high, lead quality was inconsistent, and the team was spending hours on follow-up that went nowhere. They needed predictable enrolment volume without inflating the budget.",
    approach:
      "Audit revealed weak creative, generic targeting and a leaking landing page. We redesigned the landing page around a single conversion event, built a tight audience layer (geo + interests + lookalikes), produced new creative in batches of six per cycle, and ran a structured creative-testing protocol across the cycle. Lead form fields were tuned to filter out unqualified DMs before they reached the admissions team.",
    outcome:
      "Cycle-over-cycle, qualified enquiry volume rose meaningfully and cost per qualified enquiry dropped roughly 60%. The admissions team's daily follow-up workload halved because the front-of-funnel filtering improved. North Academy has consolidated all paid marketing onto Design Hub.",
    metrics: [
      { label: "Cost-per-qualified-enquiry", value: "−60%" },
      { label: "Creative variants tested", value: "24" },
      { label: "Qualified enquiry uplift", value: "+85%" },
      { label: "Admissions cycles run", value: "3" },
    ],
    image: "/case-studies/north-academy.jpg",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
