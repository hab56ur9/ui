import { Deck, Slide, SlideHeader, Steps } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Deck controls={false}>
      <Slide>
        <SlideHeader title={t({ ko: "다음 할 일", en: "Next steps" })} />
        <Steps
          items={t({
            ko: [
              { title: "원인 찾기", body: "SLO를 넘은 날의 배포와 트래픽을 맞춰 봅니다." },
              { title: "캐시 개선", body: "가장 느린 API 세 개에 캐시를 붙입니다." },
              { title: "알림 조정", body: "p95가 230ms를 넘으면 미리 알립니다." },
            ],
            en: [
              { title: "Find the cause", body: "Match the over-SLO days against deploys and traffic." },
              { title: "Improve caching", body: "Add caching to the three slowest APIs." },
              { title: "Tune alerts", body: "Alert early when p95 passes 230ms." },
            ],
          })}
        />
      </Slide>
    </Deck>
  );
}
