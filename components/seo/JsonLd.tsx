type JsonLdData = Record<string, unknown>;

function scriptsFor(items: JsonLdData | JsonLdData[]) {
  const list = Array.isArray(items) ? items : [items];
  return list.map((data, index) => (
    <script
      key={index}
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  ));
}

export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return <>{scriptsFor(data)}</>;
}
