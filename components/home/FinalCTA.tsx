import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/utils";
import { getSite } from "@/lib/admin/site";

type Props = {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export async function FinalCTA({
  title = "Ready to brief us on your next project?",
  description = "From a single banner to a multi-month branding engagement — start with a 10-minute call. No pressure, no proposals you didn't ask for.",
  primaryHref = "/get-quote",
  primaryLabel = "Get a Free Quote",
  secondaryHref,
  secondaryLabel = "WhatsApp Us",
}: Props) {
  const site = await getSite();
  const whatsapp = secondaryHref ?? whatsappLink(site.whatsappNumber, `Hi ${site.name}, I'd like to discuss a project.`);
  return (
    <section aria-label="Get in touch" className="bg-brand">
      <Container className="py-16 md:py-24">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
            <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-ink-soft">
              {description}
            </p>
          </div>
          <div className="md:col-span-4 flex flex-wrap gap-3 md:justify-end">
            <Button href={primaryHref} size="lg">
              {primaryLabel}
            </Button>
            <Button href={whatsapp} variant="secondary" size="lg">
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
