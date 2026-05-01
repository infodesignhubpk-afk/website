import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceInquiryForm } from "@/components/forms/ServiceInquiryForm";

type Props = {
  serviceName: string;
  ctaText: string;
};

export function ServiceCTA({ serviceName, ctaText }: Props) {
  return (
    <Section id="enquire" surface="white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Enquire"
              title={ctaText}
              description={`Send us a brief and a project manager will reply within one working day with a fixed-scope ${serviceName.toLowerCase()} quote.`}
            />
            <ul className="mt-8 space-y-3 text-sm text-ink">
              <li className="flex gap-3">
                <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                Reply within one working day
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                Fixed quote on a defined scope — no surprises
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                Senior designer on every project
              </li>
            </ul>
          </div>
          <div className="lg:col-span-7">
            <ServiceInquiryForm defaultService={serviceName} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
