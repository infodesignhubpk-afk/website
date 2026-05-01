import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";

type Social = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  whatsappChannel?: string;
};

type Props = {
  social: Social;
  className?: string;
  iconClassName?: string;
};

export function SocialLinks({ social, className, iconClassName }: Props) {
  const items = [
    { href: social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: social.youtube, label: "YouTube", Icon: YouTubeIcon },
    { href: social.tiktok, label: "TikTok", Icon: TikTokIcon },
    { href: social.whatsappChannel, label: "WhatsApp Channel", Icon: WhatsAppIcon },
  ].filter((i): i is { href: string; label: string; Icon: typeof FacebookIcon } => Boolean(i.href));

  if (items.length === 0) return null;

  return (
    <ul className={className ?? "flex flex-wrap gap-3"}>
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-brand hover:text-brand"
          >
            <Icon size={18} className={iconClassName} />
          </a>
        </li>
      ))}
    </ul>
  );
}
