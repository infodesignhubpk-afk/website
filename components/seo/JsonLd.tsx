type Node = Record<string, unknown>;

type Props = {
  data: Node | Node[];
  id?: string;
};

export function JsonLd({ data, id }: Props) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
