import { Callout, ChangeLog, CodeBlock, Doc, DocSection } from "ui";

const QUERY = `.board-frame {
  container-type: inline-size;
}

@container (max-width: 600px) {
  .board {
    grid-template-columns: minmax(0, 1fr);
  }
}`;

export function RfcKo() {
  return (
    <Doc
      title="RFC: 블록을 문서 페이지 안에 그리기"
      summary="대시보드 예시를 별도 페이지가 아니라 디자인 시스템 문서 안에서 바로 보여 줍니다."
      meta={{ status: "final", authors: ["디자인 시스템 담당"], reviewers: ["프론트엔드 팀"], date: "2026-11-09", version: "1.0" }}
    >
      <DocSection title="Q1. 블록은 어디에서 보여 줄까?">
        <p>
          <strong>문제.</strong> 블록마다 자기 HTML 페이지가 있어서, 문서를 읽다가 다른 페이지로 넘어가야 했습니다. 사용자는 이 페이지를 디자인 시스템과 다른 사이트로 받아들였습니다.
        </p>
        <p>
          <strong>해결.</strong> 저장소의 페이지를 루트 <code>index.html</code> 하나로 줄이고, 블록은 문서 앱의 블록 탭에서 컴포넌트로 직접 그립니다. 블록 폴더에는 화면, 데이터, 문구 파일만 남깁니다.
        </p>
      </DocSection>
      <DocSection title="Q2. iframe 없이 기기 너비를 어떻게 보여 줄까?">
        <p>
          <strong>문제.</strong> 페이지를 iframe으로 띄우지 않으면 화면 너비 버튼이 미디어 쿼리를 바꾸지 못합니다. 보드는 뷰포트 너비로 열 수를 정하고 있었습니다.
        </p>
        <p>
          <strong>해결.</strong> 보드와 앱 틀이 뷰포트 대신 자기 너비를 보도록 컨테이너 쿼리로 바꿉니다. 미리보기 틀의 너비만 바꾸면 휴대폰 배치가 그대로 나옵니다.
        </p>
        <CodeBlock lang="plain" title="base.css" code={QUERY} />
      </DocSection>
      <DocSection title="Q3. 문서의 테마와 블록의 테마를 어떻게 맞출까?">
        <p>
          <strong>문제.</strong> 블록에도 테마 전환이 있어서, 한 페이지에 전환 버튼이 둘 생기고 서로 다른 값을 가질 수 있었습니다.
        </p>
        <p>
          <strong>해결.</strong> 테마 전환은 문서 헤더 하나만 둡니다. 블록은 문서의 테마와 언어를 그대로 따르고, 자기 전환 버튼을 그리지 않습니다.
        </p>
      </DocSection>
      <DocSection title="결정">
        <Callout tone="good" title="채택">
          세 질문의 해결을 모두 적용했습니다. 블록 탭은 shadcn/ui blocks처럼 미리보기와 코드를 오가는 뷰어로 보여 줍니다.
        </Callout>
      </DocSection>
      <DocSection title="변경 이력">
        <ChangeLog items={[{ version: "1.0", date: "2026-11-09", author: "디자인 시스템 담당", note: "검토를 마치고 확정했습니다." }]} />
      </DocSection>
    </Doc>
  );
}
