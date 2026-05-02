import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "how-much-does-a-logo-cost-in-peshawar",
    title: "How much does a logo cost in Peshawar in 2026?",
    excerpt:
      "An honest breakdown of logo design pricing in Peshawar — what you should expect to pay, what the price actually buys, and where to be careful.",
    date: "2026-03-12",
    author: "Design Hub Studio",
    readingMinutes: 6,
    body: [
      "<p>Logo pricing in Peshawar varies more than almost any other design service, and a lot of that variance is explained by what is actually being delivered. A PKR 3,000 logo and a PKR 80,000 logo are not the same product; they are different products with the same name.</p>",
      "<p>At the lowest end of the market, you are usually getting a template flip — a stock icon with your business name in a free font. There is nothing inherently wrong with that if your business is small, your brief is light and you understand what you are buying. But the file you receive will not be original, will not survive embroidery or signage at scale, and will not come with the supporting brand kit needed to print or sign-make consistently.</p>",
      "<p>In the mid-range — typically PKR 25,000 to PKR 60,000 — you should expect a custom-drawn mark, three concept routes, a couple of revision rounds, and a delivery pack of editable vector files in AI, EPS, SVG, PDF and PNG formats. This is where most healthy local businesses land.</p>",
      "<p>Above PKR 60,000, you are paying for a strategist's time as well as a designer's. That means a positioning workshop before any concept work, written rationale documents, a full identity system (typography, colour, photography, voice and tone) and a brand guidelines book. This is what serious brands need but what most startups can defer until product-market fit.</p>",
      "<p>The piece most buyers do not factor in is what happens after the file is delivered. A cheap logo that breaks at signage scale will cost more in the long run, because every printer and signage maker will have to redraw it. Test the mark at the smallest size you will ever use it at, and the largest, before signing off.</p>",
    ].join(""),
  },
  {
    slug: "flex-printing-in-peshawar-what-to-look-for",
    title: "Flex printing in Peshawar — what to look for before you order",
    excerpt:
      "Pick the right flex grade, the right ink, and the right finishing for your campaign. A practical buyer's guide.",
    date: "2026-02-04",
    author: "Design Hub Studio",
    readingMinutes: 5,
    body: [
      "<p>Flex banners are one of the most ordered print products in Peshawar, and one of the most uneven in quality. A campaign that is supposed to last six months can fade in three weeks if the wrong grade of flex meets the wrong ink. Before placing an order, get clear on three things: material, ink and finishing.</p>",
      "<p>Material first. 13oz flex is the standard option for short-term and indoor banners. 18oz is heavier, more durable, and the right call for outdoor pieces that need to last a season. Star flex is the highest grade — used for large-format outdoor campaigns where the banner has to survive heat and rain for many months.</p>",
      "<p>Ink matters more than most buyers realise. Eco-solvent and solvent inks are rated for outdoor use. Aqueous inks, often quietly used by cheaper printers to save cost, are not — and a banner printed with the wrong ink can fade visibly inside two weeks of full sun.</p>",
      "<p>Finishing is where most banners fail in installation. Eyelets pulled through unhemmed flex tear within the first heavy wind. Ropes tied to flimsy edges fray and snap. Insist on hemming on every edge, eyelets at the right spacing (every 18 inches or so for outdoor pieces), and pole pockets if the banner is going on a frame.</p>",
      "<p>Finally, ask the printer to send you a small printed proof on the same flex grade before committing to the full run. A 10×10 inch proof costs almost nothing and gives you a reliable preview of the colour and resolution you will receive.</p>",
    ].join(""),
  },
  {
    slug: "signage-permission-rules-peshawar",
    title: "Signage rules in Peshawar — what you need to know before installing",
    excerpt:
      "A short guide to KMC permissions, mall management approvals and the practical considerations of putting up a shop sign.",
    date: "2026-01-21",
    author: "Design Hub Studio",
    readingMinutes: 5,
    body: [
      "<p>Putting up a shop sign in Peshawar is rarely as simple as buying the sign and bolting it to the facade. Depending on where your business is, there is usually some combination of municipal approval, building owner permission and mall management sign-off involved.</p>",
      "<p>On commercial streets like University Road and Saddar, the local municipal authority generally requires that signage stays within the shopfront's footprint and does not project beyond a defined limit. Illuminated signage usually requires its own approval, partly because of electrical-load considerations and partly to keep streetscapes consistent.</p>",
      "<p>Inside shopping malls and managed plazas, the management office almost always has its own signage rulebook — often more strict than the municipal one. Signs must conform to a maximum height, sometimes a specific lighting type, and must not interfere with adjacent tenants' visibility.</p>",
      "<p>A common mistake is to fabricate the sign first and seek approval afterwards. If the design fails to meet the rule, the sign is unusable, and rework on a fabricated 3D letter set is rarely cheap. The right order is: site survey, design, approval-ready drawings, written approval, fabrication, installation.</p>",
      "<p>If your signage company tells you the paperwork is your problem alone, that is a sign to look elsewhere. A good local signage partner will at least support you through the approval process — they have done it many times and know what each authority looks for.</p>",
    ].join(""),
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
