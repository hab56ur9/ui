import { ChangeLog, CodeBlock, DataTable, Doc, DocSection, Figure, LineChart, Options, Ref, RequirementTable } from "ui";
import { resets } from "./trend";

const LAYOUT = `[
  { "id": "kpi-users", "w": 3, "h": 2 },
  { "id": "users", "w": 8, "h": 5 },
  { "id": "growth", "w": 6, "h": 4, "hidden": true }
]`;

const USAGE = `<Board
  initialLayout={read("ts.layout.v2")}
  onLayoutChange={(layout) => write("ts.layout.v2", layout)}
>
  <Widget id="users" title="Active users" w={8} h={5}>
    <LineChart series={series} />
  </Widget>
</Board>`;

export function DesignDocKo() {
  return (
    <Doc
      title="위젯 보드 배치 저장"
      summary="사용자가 바꾼 위젯 순서, 크기, 숨김 상태를 브라우저에 저장하고 다음 방문 때 되살립니다."
      meta={{ status: "review", authors: ["프론트엔드 팀"], reviewers: ["디자인 시스템 담당"], date: "2026-11-09", version: "0.3" }}
    >
      <DocSection title="배경">
        <p>위젯 보드에서는 위젯을 끌어 옮기고, 크기를 바꾸고, 숨길 수 있습니다. 지금은 새로고침하면 이 배치가 모두 처음으로 돌아갑니다.</p>
        <p>베타 사용자 인터뷰에서 열두 명 중 일곱 명이 매일 같은 배치를 다시 만든다고 답했습니다.</p>
      </DocSection>
      <DocSection title="목표와 비목표">
        <DocSection title="목표">
          <ul>
            <li>새로고침과 재방문 뒤에도 배치를 유지합니다.</li>
            <li>위젯 목록이 바뀌어도 보드가 깨지지 않게 합니다.</li>
          </ul>
        </DocSection>
        <DocSection title="비목표">
          <ul>
            <li>기기 사이에 배치를 동기화하지 않습니다.</li>
            <li>다른 사용자와 배치를 공유하지 않습니다.</li>
          </ul>
        </DocSection>
      </DocSection>
      <DocSection title="요구사항">
        <RequirementTable
          items={[
            { text: "새로고침 뒤에도 순서, 크기, 숨김 상태가 유지됩니다.", priority: "must", status: "done" },
            { text: "위젯 목록이 바뀌면 저장값을 버리고 기본 배치로 돌아갑니다.", priority: "must", status: "done" },
            { text: "저장소를 쓸 수 없는 환경에서도 보드는 동작합니다.", priority: "must", status: "done", note: "사생활 보호 모드, 저장 공간 초과" },
            { text: "배치 초기화는 확인을 받고, 실행 취소할 수 있습니다.", priority: "should", status: "done" },
            { text: "배치를 서버에 저장합니다.", priority: "could", status: "dropped", note: "기기 간 동기화는 비목표입니다." },
          ]}
        />
      </DocSection>
      <DocSection title="설계">
        <DocSection title="저장 형식">
          <p>
            배치는 위젯마다 <code>id</code>, 너비 <code>w</code>, 높이 <code>h</code>, 숨김 여부를 담은 배열입니다. 배열 순서가 곧 화면 순서여서 <Ref to="R1" />을 한 번의 쓰기로 만족합니다.
          </p>
          <CodeBlock title="localStorage · ts.layout.v2" lang="json" code={LAYOUT} />
          <Figure kind="table" caption="위젯 수에 따른 저장 크기">
            <DataTable
              columns={[{ label: "위젯 수" }, { label: "저장 크기", numeric: true }]}
              rows={[
                ["4", "약 180B"],
                ["8", "약 360B"],
                ["12", "약 540B"],
              ]}
            />
          </Figure>
        </DocSection>
        <DocSection title="키와 버전">
          <p>
            저장 키에 형식 버전을 붙입니다. 저장값의 위젯 집합이 지금 위젯 목록과 다르면 저장값을 버리고 기본 배치를 씁니다. 이렇게 <Ref to="R2" />를 만족합니다.
          </p>
          <CodeBlock lang="tsx" code={USAGE} />
        </DocSection>
        <DocSection title="실패 처리">
          <p>
            읽기와 쓰기를 모두 <code>try</code>로 감쌉니다. 저장에 실패하면 화면 상태만 바꾸고 알리지 않습니다. 이렇게 <Ref to="R3" />을 만족합니다.
          </p>
          <Figure caption="베타 4주 동안의 일별 배치 초기화 횟수. 저장을 켠 뒤 줄었습니다." height={200}>
            <LineChart series={[{ name: "초기화", color: 1, points: resets }]} format={{ axis: (v) => `${v}` }} />
          </Figure>
        </DocSection>
      </DocSection>
      <DocSection title="대안">
        <Options
          items={[
            { name: "localStorage", summary: "브라우저에 저장합니다.", pros: ["서버 작업이 없습니다", "바로 읽고 씁니다"], cons: ["기기마다 따로 저장됩니다"], chosen: true },
            { name: "서버 저장", summary: "사용자 설정 API에 저장합니다.", pros: ["기기 사이에 이어집니다"], cons: ["API와 인증이 필요합니다", "비목표를 넘어섭니다"] },
            { name: "주소 파라미터", summary: "배치를 URL에 넣습니다.", pros: ["링크로 공유됩니다"], cons: ["주소가 길어집니다", "새로 열면 사라집니다"] },
          ]}
        />
      </DocSection>
      <DocSection title="배포">
        <ol>
          <li>저장 키를 <code>v2</code>로 올리고 이전 키는 읽지 않습니다.</li>
          <li>문서 사이트에서 먼저 열고, 일주일 뒤 대시보드에 적용합니다.</li>
        </ol>
      </DocSection>
      <DocSection title="열린 질문">
        <ul>
          <li>여러 대시보드가 같은 위젯 id를 쓰면 키를 대시보드별로 나눠야 할까요?</li>
        </ul>
      </DocSection>
      <DocSection title="변경 이력">
        <ChangeLog
          items={[
            { version: "0.3", date: "2026-11-09", author: "프론트엔드 팀", note: "서버 저장 대안을 제외했습니다." },
            { version: "0.2", date: "2026-11-02", author: "프론트엔드 팀", note: "실패 처리를 추가했습니다." },
            { version: "0.1", date: "2026-10-28", author: "프론트엔드 팀", note: "초안" },
          ]}
        />
      </DocSection>
    </Doc>
  );
}
