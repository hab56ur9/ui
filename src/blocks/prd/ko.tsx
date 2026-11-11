import { Badge, Browser, Button, Callout, Card, ChangeLog, Cons, DataTable, Doc, DocSection, Figure, Meter, Option, Options, Page, Phone, Pros, Ref, RequirementTable, Row, Steps, TextList, Widget, WidgetGrid } from "ui";

const OFFERS = [
  { title: "커피 브랜드 앱 설치", reward: "300P", tone: "main" as const, badge: "설치형" },
  { title: "보험 상담 신청", reward: "1,500P", tone: "main" as const, badge: "참여형" },
  { title: "새 시즌 영상 30초 보기", reward: "50P", tone: "neutral" as const, badge: "시청형" },
];

function OfferList() {
  return (
    <div className="stack">
      <Callout tone="info" title="오늘 받을 수 있는 포인트">
        3개 광고 · 최대 1,850P
      </Callout>
      {OFFERS.map((offer) => (
        <Card key={offer.title} title={offer.title} aside={<Badge tone={offer.tone}>{offer.badge}</Badge>} description={`참여하면 ${offer.reward}`}>
          <Button variant="primary">{`${offer.reward} 받기`}</Button>
        </Card>
      ))}
    </div>
  );
}

function OfferDetail() {
  return (
    <div className="stack">
      <Card title="커피 브랜드 앱 설치" description="앱을 설치하고 처음 실행하면 300P를 드려요.">
        <TextList ordered items={["스토어에서 앱을 설치합니다.", "설치한 앱을 한 번 엽니다.", "확인되면 바로 적립됩니다."]} />
      </Card>
      <Callout tone="warning" title="이미 설치한 앱이면 적립되지 않아요">
        다시 설치해도 적립되지 않습니다.
      </Callout>
      <Button variant="primary">설치하러 가기</Button>
    </div>
  );
}

function Rewarded() {
  return (
    <div className="stack">
      <Callout tone="good" title="300P가 적립됐어요">
        커피 브랜드 앱 설치 · 방금 전
      </Callout>
      <Card title="내 포인트" description="이번 달 적립 2,150P">
        <Meter label="이번 달 적립 한도" value={2150} max={5000} format={(v) => `${v.toLocaleString()}P`} />
      </Card>
      <Button>다른 광고 보기</Button>
    </div>
  );
}

export function PrdKo() {
  return (
    <Doc
      title="포인트 미션 광고"
      summary="앱 안의 광고 목록에서 사용자가 광고에 참여하면 포인트를 주고, 광고주는 참여한 만큼만 비용을 냅니다."
      meta={{ status: "review", authors: ["광고 상품 팀"], reviewers: ["플랫폼 팀", "디자인 시스템 담당"], date: "2026-11-11", version: "0.2" }}
    >
      <DocSection title="목표와 지표">
        <p>참여한 사용자에게 보상을 주는 대신, 광고주에게는 실제 참여 건에만 과금합니다.</p>
        <DataTable
          fit
          columns={[{ label: "지표" }, { label: "정의" }, { label: "목표", numeric: true }]}
          rows={[
            ["참여율", "광고 상세 진입 대비 적립 완료", "18%"],
            ["적립 지연", "참여 완료부터 포인트 반영까지", "10초 이내"],
            ["중복 적립", "같은 사용자·같은 광고의 두 번째 적립", "0건"],
          ]}
        />
      </DocSection>
      <DocSection title="사용자 흐름">
        <Steps
          items={[
            { title: "목록", body: "오늘 받을 수 있는 광고와 포인트를 봅니다." },
            { title: "상세", body: "참여 방법과 적립 조건을 확인합니다." },
            { title: "참여", body: "광고주 앱이나 페이지에서 행동을 마칩니다." },
            { title: "적립", body: "확인되면 포인트가 들어오고 알림이 뜹니다." },
          ]}
        />
      </DocSection>
      <DocSection title="화면">
        <Figure caption="사용자 화면: 목록(S1), 상세(S2), 적립 완료(S3)">
          <Row>
            <Phone scale={0.5}>
              <OfferList />
            </Phone>
            <Phone scale={0.5}>
              <OfferDetail />
            </Phone>
            <Phone scale={0.5}>
              <Rewarded />
            </Phone>
          </Row>
        </Figure>
      </DocSection>
      <DocSection title="동작 명세">
        <p>
          각 항목은 「조건 → 결과」로 씁니다. 목록(S1)의 버튼은 <Ref to="R1" />, 상세(S2)의 안내는 <Ref to="R3" />, 적립 완료(S3)는 <Ref to="R4" />를 따릅니다.
        </p>
        <RequirementTable
          items={[
            { text: "S1에서 광고를 누르면 → S2로 이동하고 상세 진입을 기록합니다.", priority: "must", status: "done" },
            { text: "참여 가능한 광고가 없으면 → S1에 빈 화면 문구와 다음 갱신 시각을 보여 줍니다.", priority: "must", status: "done" },
            { text: "이미 참여한 광고면 → S2 버튼을 끄고 적립 불가 안내를 보여 줍니다.", priority: "must", status: "open" },
            { text: "광고주 확인이 오면 → 10초 안에 포인트를 넣고 S3과 알림을 보여 줍니다.", priority: "must", status: "open" },
            { text: "같은 사용자·같은 광고로 확인이 두 번 오면 → 두 번째는 적립하지 않고 기록만 남깁니다.", priority: "must", status: "open", note: "중복 방지" },
            { text: "이번 달 적립 한도에 닿으면 → S1 상단에 한도 안내를 보여 주고 참여 버튼을 끕니다.", priority: "should", status: "open" },
          ]}
        />
      </DocSection>
      <DocSection title="상태">
        <DataTable
          fit
          columns={[{ label: "상태" }, { label: "화면" }, { label: "조건" }, { label: "보이는 것" }]}
          rows={[
            ["불러오는 중", "S1", "목록 요청 후 응답 전", "카드 자리표시자 3개"],
            ["빈 목록", "S1", "참여 가능한 광고 0개", "빈 화면 문구, 다음 갱신 시각"],
            ["오류", "S1·S2", "요청 실패", "다시 시도 버튼"],
            ["적립 대기", "S3", "참여 완료, 확인 전", "확인 중 안내, 최대 10초"],
          ]}
        />
      </DocSection>
      <DocSection title="이벤트">
        <DataTable
          fit
          columns={[{ label: "이벤트" }, { label: "시점" }, { label: "속성" }]}
          rows={[
            ["offer_list_view", "S1이 보일 때", "광고 수"],
            ["offer_detail_view", "S2 진입", "광고 ID, 보상"],
            ["offer_participate", "참여 버튼 누름", "광고 ID"],
            ["reward_granted", "포인트 적립", "광고 ID, 포인트, 지연(초)"],
          ]}
        />
      </DocSection>
      <DocSection title="운영 화면">
        <Figure caption="광고주 예산 화면(O1): 예산 소진과 일별 참여">
          <Browser address="ads.example.com/campaigns" width={1200} height="auto">
            <Page title="캠페인 예산">
              <WidgetGrid>
                <Widget id="pacing" title="예산 소진" w={5} h={4}>
                  <div className="stack">
                    <Meter label="커피 브랜드 앱 설치 · 월 예산" value={6600000} max={21300000} target={7100000} format={(v) => `₩${(v / 10000).toLocaleString()}만`} status="warning" note="계획보다 느리게 소진되고 있습니다." />
                    <Meter label="보험 상담 신청 · 월 예산" value={15800000} max={20000000} target={14200000} format={(v) => `₩${(v / 10000).toLocaleString()}만`} status="good" />
                  </div>
                </Widget>
                <Widget id="results" title="광고별 결과" w={7} h={4}>
                  <DataTable
                    fit
                    columns={[{ label: "광고" }, { label: "참여", numeric: true }, { label: "적립", numeric: true }, { label: "참여율", numeric: true }]}
                    rows={[
                      ["커피 브랜드 앱 설치", "4,210", "3,982", "17.8%"],
                      ["보험 상담 신청", "1,054", "1,031", "21.2%"],
                      ["새 시즌 영상 30초 보기", "12,480", "12,402", "64.0%"],
                    ]}
                  />
                </Widget>
              </WidgetGrid>
            </Page>
          </Browser>
        </Figure>
      </DocSection>
      <DocSection title="열린 질문">
        <Options>
          <Option name="확인 후 적립" recommended>
            <Pros>
              <li>중복·부정 적립을 막습니다.</li>
            </Pros>
            <Cons>
              <li>사용자가 최대 10초 기다립니다.</li>
            </Cons>
          </Option>
          <Option name="즉시 적립 후 회수">
            <Pros>
              <li>보상이 바로 보입니다.</li>
            </Pros>
            <Cons>
              <li>회수할 때 사용자 불만이 생깁니다.</li>
            </Cons>
          </Option>
        </Options>
      </DocSection>
      <DocSection title="변경 이력">
        <ChangeLog
          items={[
            { version: "0.2", date: "2026-11-11", author: "광고 상품 팀", note: "중복 방지와 적립 한도를 추가했습니다." },
            { version: "0.1", date: "2026-11-04", author: "광고 상품 팀", note: "초안" },
          ]}
        />
      </DocSection>
    </Doc>
  );
}
