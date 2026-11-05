type Node = Record<string, unknown>;

type Props = {
  data: Node | Node[];
  id?: string;
};

// JSON.stringify leaves "<" as is, so an admin-entered "</script>" would end the
// tag early and the rest would run as HTML. "\u003c" reads back as the same
// character to any JSON parser. U+2028/U+2029 are escaped as well because
// older JavaScript parsers treat them as line breaks inside strings.
function scriptSafeJson(data: Props["data"]): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ data, id }: Props) {
  const json = scriptSafeJson(data);
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
