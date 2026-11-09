const SAMPLES = [
  { lang: "ko", title: "러닝 기록", body: "올해 달린 거리는 1,490km입니다. 작년보다 7% 앞서 있습니다." },
  { lang: "en", title: "Running log", body: "You ran 1,490 km this year, 7% ahead of last year." },
];

export default function Example() {
  return (
    <>
      {SAMPLES.map(({ lang, title, body }) => (
        <div className="docs-lang-sample" lang={lang} key={lang}>
          <div className="docs-lang-title">{title}</div>
          <p>{body}</p>
          <code>{`font.family.sans · :lang(${lang})`}</code>
        </div>
      ))}
    </>
  );
}
