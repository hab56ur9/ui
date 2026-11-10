export type Section =
  | { type: "text"; title?: string; body: string[] }
  | { type: "list"; title?: string; items: string[]; ordered?: boolean }
  | { type: "cards"; title?: string; items: { title?: string; body?: string; items?: string[] }[] }
  | { type: "usage"; title?: string; when: string[]; avoid: string[] }
  | { type: "anatomy"; title?: string; items: string[][] }
  | { type: "demo"; title?: string; example: string; variants?: { label: string; example: string }[]; caption?: string; center?: boolean; medium?: string }
  | { type: "gallery"; title?: string; items: { title: string; example: string; caption?: string; medium?: string }[] }
  | { type: "block"; title?: string; id: string }
  | { type: "guidelines"; title?: string; items: string[][] }
  | { type: "tokens"; title?: string; paths: string[]; notes?: Record<string, string> }
  | { type: "code"; title?: string; code: string; lang?: "tsx" | "html" | "plain" }
  | { type: "a11y"; title?: string; items: string[] }
  | { type: "api"; title?: string; description?: string; rows: string[][] }
  | { type: "review"; title?: string }
  | { type: "sdui"; title?: string; device?: "mobile" | "desktop" }
  | { type: "templates"; title?: string; category: string };

export type Page = { id: string; group: string; sub?: string; title: string; lede: string; wide?: boolean; sections: Section[] };

export const pages: Page[] = [
  {
    "id": "intro",
    "group": "시작하기",
    "title": "소개",
    "lede": "이 디자인 시스템은 여러 앱, 기술 문서, 슬라이드가 같은 모양을 갖도록 만든 개인용 토큰과 React 컴포넌트입니다. 토큰 파일 하나를 고치면 이 토큰을 쓰는 모든 라이브 페이지가 함께 바뀝니다.",
    "sections": [
      {
        "type": "cards",
        "title": "원칙",
        "items": [
          {
            "title": "데이터가 주인공",
            "body": "화면의 틀은 회색조로 물러나고, 색은 데이터와 상태에만 씁니다."
          },
          {
            "title": "한 곳에서 정의",
            "body": "색·크기·간격은 토큰에만 있고, 페이지는 `var(--…)`로 가져다 씁니다."
          },
          {
            "title": "용도에 맞는 크기",
            "body": "같은 이름의 토큰이 앱·문서·슬라이드에서 각자 알맞은 크기가 됩니다."
          },
          {
            "title": "기본이 접근성",
            "body": "대비 기준, 키보드 조작, 표 보기를 처음부터 갖춥니다."
          },
          {
            "title": "되돌릴 수 있게",
            "body": "되돌릴 수 없는 동작은 확인을 받고, 되돌릴 수 있는 동작은 실행 취소를 줍니다."
          }
        ]
      },
      {
        "type": "text",
        "title": "구성",
        "body": [
          "기반(Foundations)은 색, 타이포그래피, 간격, 모양, 모션처럼 모든 화면이 공유하는 규칙입니다.",
          "컴포넌트(Components)는 버튼부터 차트, 위젯 보드, 모달, 토스트까지 실제로 조립해 쓰는 React 컴포넌트입니다.",
          "토큰 검사 페이지는 모든 토큰 값과 대비 실패를 자동으로 점검합니다."
        ]
      }
    ]
  },
  {
    "id": "getting-started",
    "group": "시작하기",
    "title": "사용 방법",
    "lede": "React 앱은 `ui` 패키지의 컴포넌트를 쓰고, React 없는 HTML 문서와 슬라이드는 토큰 CSS와 스타일 CSS만 링크합니다. 두 방식 모두 토큰을 다시 빌드하면 갱신됩니다.",
    "sections": [
      {
        "type": "list",
        "title": "React 앱",
        "ordered": true,
        "items": [
          "GitHub 저장소에서 `ui`와 `react`, `react-dom`을 설치합니다.",
          "앱 진입점에서 `ui/tokens.css`를 불러오고, 최상위를 `UIProvider`로 감쌉니다.",
          "`<html>`에 용도를 정합니다. 대시보드는 `app`, 기술 문서는 `doc`, 발표는 `slide`입니다.",
          "색·크기·간격은 `var(--…)` 토큰만 씁니다. 린트가 색 값을 직접 쓴 곳을 잡아냅니다."
        ]
      },
      {
        "type": "code",
        "code": "npm install github:hab56ur9/ui react react-dom"
      },
      {
        "type": "code",
        "code": "import { createRoot } from \"react-dom/client\";\nimport \"ui/tokens.css\";\nimport { UIProvider } from \"ui\";\nimport { App } from \"./App\";\n\ncreateRoot(document.getElementById(\"root\")!).render(\n  <UIProvider>\n    <App />\n  </UIProvider>,\n);"
      },
      {
        "type": "text",
        "title": "HTML 문서와 슬라이드",
        "body": [
          "React 없이 쓰는 페이지는 두 CSS 파일만 링크하고, 버튼·세그먼트·표 같은 클래스를 그대로 씁니다. 차트와 오버레이처럼 동작이 필요한 부분은 React로 만듭니다."
        ]
      },
      {
        "type": "code",
        "code": "<html lang=\"ko\" data-medium=\"doc\">\n<link rel=\"stylesheet\" href=\"{homepage}dist/tokens.css\">\n<link rel=\"stylesheet\" href=\"{homepage}dist/ui.css\">"
      },
      {
        "type": "text",
        "title": "번들러 없는 HTML",
        "body": [
          "`dist/ui.js` 한 줄이면 됩니다. React가 들어 있고, 두 CSS 파일도 스스로 불러옵니다. 모든 컴포넌트와 함께 `render(대상, 내용)`, `h`(요소 만들기), `useState` 같은 훅을 내보냅니다.",
          "사이트의 `dist/ui.js`는 항상 최신 릴리즈입니다. 버전을 고정하려면 사이트의 `v/<태그>/ui.js`를 씁니다. 최근 100개 릴리즈가 남습니다."
        ]
      },
      {
        "type": "code",
        "code": "<div id=\"app\"></div>\n<script type=\"module\">\n  import { render, h, Button, Calendar } from \"{homepage}dist/ui.js\";\n\n  render(\"#app\", [h(Button, { variant: \"primary\" }, \"저장\"), h(Calendar)]);\n</script>"
      },
      {
        "type": "text",
        "title": "Claude로 만들 때",
        "body": [
          "`design-system` 스킬이 이 규칙을 알고 있습니다. \"디자인 시스템으로 대시보드 만들어\"처럼 요청하면 됩니다.",
          "PPT나 Artifact처럼 CSS를 불러올 수 없는 결과물은 `dist/tokens.json`의 값을 그 시점에 복사해 넣고 토큰 버전을 기록합니다."
        ]
      },
      {
        "type": "code",
        "title": "점검",
        "code": "npm run check\nnode scripts/lint.mjs path/to/page.html"
      }
    ]
  },
  {
    "id": "structure",
    "group": "시작하기",
    "title": "토큰 구조",
    "lede": "토큰은 원시값, 테마, 용도의 세 계층입니다. 페이지는 테마와 용도 계층의 이름만 씁니다.",
    "sections": [
      {
        "type": "anatomy",
        "title": "세 계층",
        "items": [
          [
            "원시 (primitive)",
            "팔레트와 스케일 원본입니다. `color.blue.450`, `space.4`처럼 값 자체를 이름으로 씁니다."
          ],
          [
            "테마 (theme)",
            "용도를 이름으로 씁니다. `color.bg.surface`는 라이트에서 밝은 회색, 다크에서 어두운 회색을 가리킵니다."
          ],
          [
            "용도 (medium)",
            "`font.size.body`처럼 앱·문서·슬라이드마다 다른 크기를 가집니다."
          ]
        ]
      },
      {
        "type": "text",
        "title": "이름 규칙",
        "body": [
          "이름은 속성 다음에 역할을 붙입니다. 예를 들어 `color.fg.secondary`는 글자색 중 보조 역할입니다.",
          "원시 색의 단계 번호는 OKLab 명도를 따르므로, 색상이 달라도 같은 번호는 비슷한 밝기입니다."
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "`var(--color-bg-surface)`처럼 테마 토큰을 씁니다.",
            "`var(--color-neutral-25)`처럼 원시 색을 페이지에서 직접 씁니다. 다크 모드에서 바뀌지 않습니다."
          ],
          [
            "새 값이 필요하면 원시 단계를 추가하고, 테마 토큰이 그것을 가리키게 합니다.",
            "페이지 CSS에 hex 값을 직접 적습니다."
          ]
        ]
      },
      {
        "type": "code",
        "title": "파일",
        "code": "tokens/primitive/color.json\ntokens/primitive/base.json\ntokens/theme/light.json\ntokens/theme/dark.json\ntokens/medium/app.json\ntokens/medium/doc.json\ntokens/medium/slide.json"
      }
    ]
  },
  {
    "id": "color",
    "group": "기반",
    "title": "색",
    "lede": "색은 바탕, 글자, 테두리, 강조, 위험의 역할로 나뉩니다. 라이트 테마는 넓은 면이 눈부시지 않도록 흰색 대신 따뜻한 오프화이트를 씁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "역할별 색",
        "example": "color-roles"
      },
      {
        "type": "text",
        "title": "프리셋",
        "body": [
          "프리셋은 메인 컬러와 서브 컬러 한 쌍입니다. 컴포넌트는 `main`·`sub` 역할 토큰만 쓰므로, 프리셋 CSS 하나를 더하고 `data-preset`만 바꾸면 버튼, 링크, 포커스, 현재 위치, 강조 차트가 함께 바뀝니다. 오른쪽 위의 컬러 전환으로 바로 비교해 보세요."
        ]
      },
      {
        "type": "list",
        "items": [
          "`lime` 연두 + 무채색: 기본값입니다. 프리셋을 지정하지 않으면 이 색입니다.",
          "`sky` 하늘 + 무채색",
          "`mono` 무채색: 메인 컬러도 무채색인 차분한 조합입니다.",
          "새 프리셋은 `tokens/preset/lime.json`을 복사해 색만 바꾸면 빌드가 `dist/presets/<이름>.css`를 만듭니다. 대비 검사를 통과하는 단계를 고르세요."
        ]
      },
      {
        "type": "code",
        "lang": "html",
        "code": "<link rel=\"stylesheet\" href=\"{homepage}dist/tokens.css\">\n<link rel=\"stylesheet\" href=\"{homepage}dist/presets/sky.css\">\n<html data-preset=\"sky\">"
      },
      {
        "type": "anatomy",
        "title": "역할",
        "items": [
          [
            "bg",
            "바탕입니다. page < surface < raised 순으로 위에 올라온 면입니다. subtle은 hover와 컨트롤 바탕입니다."
          ],
          [
            "fg",
            "글자입니다. default는 본문, secondary는 보조 설명, muted는 축과 캡션입니다."
          ],
          [
            "border",
            "테두리입니다. 카드와 표는 default, 강조가 필요한 구분선은 strong입니다."
          ],
          [
            "main",
            "프리셋의 메인 컬러입니다(기본은 연두). 주요 버튼은 `fill` 위에 `on` 글자를 쓰고, 링크·포커스·현재 위치·강조 데이터는 읽히도록 진한 `default`를 씁니다."
          ],
          [
            "sub",
            "프리셋의 서브 컬러입니다(기본은 무채색). 보조 버튼은 `fill`을, 태그와 칩은 `subtle`을 씁니다."
          ],
          [
            "danger",
            "삭제처럼 되돌릴 수 없는 동작의 버튼에만 씁니다."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "본문은 `fg.default`, 설명은 `fg.secondary`로 위계를 만듭니다.",
            "강조하려고 글자에 시리즈 색이나 상태 색을 입힙니다."
          ],
          [
            "카드 위의 카드처럼 겹칠 때만 `bg.raised`를 씁니다.",
            "모든 영역을 흰색에 가깝게 칠해 면 구분이 사라지게 합니다."
          ],
          [
            "성공·정상 상태는 `status.good` 녹색에 `success` 아이콘을 붙여 브랜드 연초록과 구분합니다.",
            "브랜드 연초록으로 성공 상태를 표시합니다."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "color.bg.*",
          "color.fg.*",
          "color.border.*",
          "color.main.*",
          "color.danger.*"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "본문 글자는 모든 바탕에서 4.5:1 이상입니다.",
          "muted 글자와 강조색은 3:1 이상이며, 축·캡션처럼 보조 정보에만 씁니다.",
          "토큰 검사 페이지의 대비 매트릭스가 두 테마를 모두 확인합니다."
        ]
      }
    ]
  },
  {
    "id": "dataviz-color",
    "group": "기반",
    "title": "데이터 시각화 색",
    "lede": "차트 색은 하는 일에 따라 고릅니다. 구분은 시리즈 색, 크기는 연속형 색, 상태는 상태 색입니다.",
    "sections": [
      {
        "type": "demo",
        "title": "팔레트",
        "caption": "시리즈 8색, 연속형 7단계, 브랜드 연속형 7단계, 상태 4색",
        "example": "dataviz-palette"
      },
      {
        "type": "anatomy",
        "title": "색의 일",
        "items": [
          [
            "시리즈",
            "서로 다른 대상을 구분합니다. 1번부터 정해진 순서로 쓰고, 필터로 대상이 줄어도 색이 바뀌지 않습니다."
          ],
          [
            "연속형",
            "값의 크기를 한 색상의 명도로 보여 줍니다. 다크 모드에서는 순서가 뒤집혀 작은 값이 바탕에 가깝습니다."
          ],
          [
            "상태",
            "좋음·주의·심각·위험을 뜻합니다. 항상 아이콘과 라벨을 함께 씁니다."
          ],
          [
            "증감",
            "`delta.good`과 `delta.bad`는 오르내림이 좋은지 나쁜지에 따라 고르는 글자색입니다."
          ],
          [
            "강조",
            "핵심 시리즈 하나는 브랜드 연두 `chart.emphasis`, 비교 대상은 회색 `chart.de-emphasis`로 그립니다. 브랜드 히트맵은 `sequential-main` 7단계를 씁니다."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "시리즈가 많으면 4개까지만 색을 쓰고 나머지는 '기타'로 묶거나 작은 차트로 나눕니다.",
            "9번째 색을 새로 만들어 씁니다."
          ],
          [
            "하나만 강조할 때는 그 시리즈만 색을 쓰고 나머지는 `chart.de-emphasis`로 둡니다.",
            "상태 색을 일반 시리즈 색처럼 씁니다."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "color.series.*",
          "color.sequential.*",
          "color.sequential-main.*",
          "color.status.*",
          "color.delta.*",
          "color.chart.*"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "시리즈 팔레트는 색각 이상 시뮬레이션에서 인접 색 차이 ΔE 8 이상을 통과했습니다.",
          "라이트 표면에서 3:1에 못 미치는 시리즈 색이 있으므로, 차트는 직접 라벨이나 표 보기를 함께 둡니다."
        ]
      }
    ]
  },
  {
    "id": "typography",
    "group": "기반",
    "title": "타이포그래피",
    "lede": "글자 크기는 일곱 단계이고, 같은 이름이 용도마다 다른 크기를 가집니다. 숫자 열은 고정폭 숫자를 씁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "용도별 크기",
        "caption": "같은 토큰 이름이 앱·문서·슬라이드에서 다른 크기가 됩니다",
        "example": "typography-sizes"
      },
      {
        "type": "demo",
        "title": "부분 언어",
        "caption": "페이지 언어와 관계없이 `lang` 속성을 단 요소는 그 언어의 글꼴과 자간을 씁니다",
        "example": "typography-lang"
      },
      {
        "type": "anatomy",
        "title": "언어 구조",
        "items": [
          [
            "`font.stack.*`",
            "문자 체계별 글꼴 묶음입니다. 지금은 `hangul`과 `latin` 두 가지입니다."
          ],
          [
            "`tokens/lang/*.json`",
            "언어마다 하나의 파일입니다. 어떤 묶음을 `font.family.sans`로 쓸지, 자간을 얼마로 할지 정합니다."
          ],
          [
            "`:lang()` 선택자",
            "빌드가 언어 파일마다 `:lang(ko)`, `:lang(en)` 블록을 만듭니다. 페이지는 `<html lang>`이나 요소의 `lang`만 정하면 됩니다."
          ],
          [
            "언어 추가",
            "일본어라면 `font.stack.kana`를 추가하고 `tokens/lang/ja.json`을 만들면 빌드가 자동으로 인식합니다."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "한국어 문단은 `word-break: keep-all`로 어절 단위 줄바꿈을 지킵니다. 컴포넌트 스타일이 `:lang(ko)`에 적용합니다.",
            "한국어 문장을 글자 단위로 끊어 줄바꿈합니다."
          ],
          [
            "표와 축의 숫자는 `tabular-nums`로 자리를 맞춥니다.",
            "큰 숫자 카드에 고정폭 숫자를 써서 숫자 사이가 벌어지게 합니다."
          ],
          [
            "제목·숫자는 semibold, 본문은 regular 두 가지 굵기로 위계를 만듭니다.",
            "굵기를 네 가지 이상 섞습니다."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "font.size.*",
          "line-height.*",
          "font.stack.*",
          "font.family.*",
          "letter-spacing.*",
          "font.weight.*"
        ]
      }
    ]
  },
  {
    "id": "spacing",
    "group": "기반",
    "title": "간격과 레이아웃",
    "lede": "간격은 4px 격자를 따릅니다. 카드 안쪽 여백과 카드 사이 간격처럼 자주 쓰는 값은 용도별 레이아웃 토큰으로 정합니다.",
    "sections": [
      {
        "type": "demo",
        "title": "간격 스케일",
        "example": "spacing-scale"
      },
      {
        "type": "anatomy",
        "title": "레이아웃 토큰",
        "items": [
          [
            "layout.inset",
            "카드와 패널의 안쪽 여백입니다."
          ],
          [
            "layout.gap",
            "카드와 위젯 사이 간격입니다."
          ],
          [
            "layout.section",
            "섹션 사이 큰 간격입니다."
          ],
          [
            "layout.stack",
            "제목과 본문처럼 붙어 있는 요소 사이 간격입니다."
          ],
          [
            "widget.row",
            "위젯 보드 한 행의 높이입니다."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "layout.*",
          "widget.*",
          "grid.columns",
          "chart-size.*"
        ]
      }
    ]
  },
  {
    "id": "shape",
    "group": "기반",
    "title": "모양과 그림자",
    "lede": "모서리 반경은 크기에 따라 네 가지이고, 그림자는 면이 얼마나 떠 있는지를 세 단계로 보여 줍니다.",
    "sections": [
      {
        "type": "demo",
        "title": "반경과 그림자",
        "example": "shape-radius"
      },
      {
        "type": "anatomy",
        "title": "높이",
        "items": [
          [
            "card",
            "바닥에 놓인 카드와 위젯입니다."
          ],
          [
            "lifted",
            "드래그 중인 위젯, 툴팁, 메뉴처럼 잠시 떠 있는 면입니다."
          ],
          [
            "overlay",
            "모달, 바텀 시트, 토스트처럼 화면 위를 덮는 면입니다."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "radius.*",
          "elevation.*"
        ]
      }
    ]
  },
  {
    "id": "motion",
    "group": "기반",
    "title": "모션",
    "lede": "움직임은 상태 변화를 설명할 때만 씁니다. 들어올 때는 감속, 나갈 때는 가속 곡선을 쓰고, 나가는 동작이 더 짧습니다.",
    "sections": [
      {
        "type": "demo",
        "title": "시간과 곡선",
        "caption": "재생을 눌러 세 조합을 비교합니다",
        "example": "motion-curves"
      },
      {
        "type": "guidelines",
        "items": [
          [
            "위젯이 자리를 바꿀 때처럼 위치 변화를 따라가게 할 때 씁니다.",
            "장식용으로 계속 움직이는 효과를 넣습니다."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "motion.*"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "사용자가 동작 줄이기를 켜면 컴포넌트의 모든 애니메이션이 꺼집니다."
        ]
      }
    ]
  },
  {
    "id": "icons",
    "group": "기반",
    "title": "아이콘",
    "lede": "아이콘은 24 격자 위에 둥근 끝의 선으로 그린 자체 세트입니다. 색은 주변 글자색을 따르고, 크기와 선 굵기는 토큰으로 정합니다.",
    "sections": [
      {
        "type": "demo",
        "title": "전체 아이콘",
        "caption": "누르면 이름이 복사됩니다",
        "example": "icons-all"
      },
      {
        "type": "demo",
        "title": "크기와 색",
        "caption": "크기는 `sm` · `md` · `lg`, 색은 감싼 요소의 글자색입니다",
        "center": true,
        "example": "icons-size"
      },
      {
        "type": "demo",
        "title": "버튼 안의 아이콘",
        "center": true,
        "example": "icons-button"
      },
      {
        "type": "anatomy",
        "title": "그리는 규칙",
        "items": [
          [
            "격자",
            "24 × 24 안에 그리고, 바깥 2px은 비워 둡니다."
          ],
          [
            "선",
            "둥근 끝·둥근 모서리의 선으로만 그립니다. 굵기는 화면에서 `icon.stroke` 토큰이 정합니다."
          ],
          [
            "색",
            "`currentColor`만 씁니다. 상태 아이콘도 색은 감싼 요소가 정합니다."
          ],
          [
            "추가",
            "`assets/icons/<이름>.svg`를 넣고 빌드하면 목록, 스프라이트, 데이터에 자동으로 들어갑니다."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "뜻이 있는 단독 아이콘에는 `label`을 줘서 스크린리더가 읽게 합니다.",
            "글자 옆에 붙은 장식 아이콘에 같은 뜻의 `label`을 또 붙입니다."
          ],
          [
            "상태는 아이콘 모양(`success` 완료, `warning` 주의)과 글자를 함께 씁니다.",
            "색만 바꾼 같은 아이콘으로 상태를 구분합니다."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "icon.*"
        ]
      },
      {
        "type": "code",
        "code": "<svg class=\"icon icon-sm\"><use href=\"{homepage}dist/icons.svg#chart-line\"/></svg>",
        "title": "HTML에서"
      }
    ]
  },
  {
    "id": "button",
    "group": "입력",
    "title": "버튼",
    "lede": "버튼은 동작을 실행합니다. 한 화면에서 가장 중요한 동작 하나만 주요 버튼으로 만듭니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "center": true,
        "example": "button-basic"
      },
      {
        "type": "anatomy",
        "title": "종류",
        "items": [
          [
            "보조 `.button`",
            "대부분의 동작입니다."
          ],
          [
            "주요 `.is-primary`",
            "화면의 핵심 동작 하나입니다. 저장, 확인처럼 진행을 이어 갑니다."
          ],
          [
            "위험 `.is-danger`",
            "삭제처럼 되돌릴 수 없는 동작입니다. 확인 창 안에서 씁니다."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "버튼 이름은 \"저장\", \"초기화\"처럼 결과를 말하는 동사로 씁니다.",
            "\"확인\", \"예\"처럼 무엇이 일어나는지 알 수 없는 이름을 씁니다."
          ],
          [
            "주요 버튼은 화면에 하나만 둡니다.",
            "여러 버튼을 모두 주요 버튼으로 만듭니다."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "color.main.fill",
          "color.main.on",
          "color.danger.*",
          "radius.control"
        ]
      },
      {
        "type": "code",
        "code": "<button class=\"button\">취소</button>\n<button class=\"button is-primary\">저장</button>\n<button class=\"button is-danger\">삭제</button>",
        "title": "HTML에서"
      }
    ]
  },
  {
    "id": "segmented",
    "group": "입력",
    "title": "세그먼트 컨트롤",
    "lede": "세그먼트 컨트롤은 두세 개에서 다섯 개 사이의 선택지 중 하나를 고르게 합니다. 기간, 테마, 보기 방식처럼 화면 전체에 영향을 주는 값에 씁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "center": true,
        "example": "segmented-basic"
      },
      {
        "type": "usage",
        "when": [
          "선택지가 2~5개이고 모두 한눈에 보여야 할 때",
          "선택하면 바로 결과가 바뀔 때"
        ],
        "avoid": [
          "선택지가 6개 이상이면 드롭다운 메뉴",
          "켜고 끄는 하나의 설정이면 스위치"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "그룹에 `role=\"group\"`과 `aria-label`을 붙입니다.",
          "선택된 버튼은 `aria-pressed=\"true\"`로 표시합니다."
        ]
      },
      {
        "type": "code",
        "code": "<div class=\"segmented\" role=\"group\" aria-label=\"기간\">\n  <button aria-pressed=\"false\">7일</button>\n  <button aria-pressed=\"true\">30일</button>\n</div>",
        "title": "HTML에서"
      }
    ]
  },
  {
    "id": "textfield",
    "group": "입력",
    "title": "입력창",
    "lede": "입력창은 한 줄 글을 받습니다. 이름표는 항상 붙이고, 검색처럼 아이콘과 자리 표시 글로 뜻이 분명할 때만 이름표를 화면에서 숨깁니다(스크린리더에는 남습니다). 도움말은 입력창 아래에 둡니다.",
    "sections": [
      {
        "type": "demo",
        "title": "검색, 이름표와 도움말, 꺼짐",
        "example": "textfield-basic"
      },
      {
        "type": "a11y",
        "items": [
          "이름표는 `label`로 입력창과 이어지고, 도움말은 `aria-describedby`로 읽힙니다."
        ]
      }
    ]
  },
  {
    "id": "calendar",
    "group": "입력",
    "title": "캘린더",
    "lede": "캘린더는 한 달을 격자로 보여 주고 날짜 하나를 고르게 합니다. 오늘은 테두리로, 고른 날은 메인 컬러로, 기록이 있는 날은 점으로 표시합니다. 고른 날은 `onChange`로 알리고 저장하지 않습니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "example": "calendar-basic"
      },
      {
        "type": "a11y",
        "items": [
          "격자는 `role=\"grid\"`이고 화살표로 하루·한 주씩, PageUp·PageDown으로 한 달씩, Home·End로 주의 처음과 끝으로 움직입니다.",
          "날짜 버튼은 전체 날짜를 이름으로 읽히고, 오늘은 `aria-current=\"date\"`, 고른 날은 `aria-selected`로 알립니다."
        ]
      }
    ]
  },
  {
    "id": "themepicker",
    "group": "입력",
    "title": "테마 선택",
    "lede": "테마 선택은 Theme 버튼 하나로 컬러 프리셋과 모드(시스템·라이트·다크)를 바꿉니다. 버튼을 누르면 프리셋마다 메인·서브 컬러가 팔레트로 뜹니다. 고른 값은 문서 루트의 `data-preset`, `data-theme`에 바로 적용되고 `onChange`로 알립니다. AI로 만든 페이지에 `floating`으로 넣어 두면, 한 페이지를 모든 프리셋에서 검토할 수 있습니다.",
    "sections": [
      {
        "type": "demo",
        "title": "플로팅",
        "example": "themepicker-floating"
      },
      {
        "type": "demo",
        "title": "버튼과 패널",
        "example": "themepicker-basic"
      },
      {
        "type": "a11y",
        "items": [
          "패널은 `role=\"dialog\"`, 프리셋 목록은 `radiogroup`이고 Escape나 바깥 클릭으로 닫힙니다.",
          "한 페이지에 여러 개를 두어도 문서 루트의 값을 함께 따르므로 서로 어긋나지 않습니다."
        ]
      }
    ]
  },
  {
    "id": "tabs",
    "group": "탐색",
    "title": "탭",
    "lede": "탭은 한 화면 안에서 같은 대상의 여러 보기를 오갑니다. 탭을 누르면 아래 내용만 바뀌고 주소나 화면은 그대로입니다. 모양은 밑줄(`line`)과 알약(`pill`) 두 가지이고, 탭이 많으면 가로로 밀어서 봅니다. 화면을 이동하는 메뉴는 탭 바, 같은 데이터를 다르게 거르는 두세 가지 선택은 세그먼트 컨트롤을 씁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "밑줄 탭과 내용",
        "example": "tabs-basic"
      },
      {
        "type": "demo",
        "title": "알약 탭",
        "example": "tabs-pill"
      },
      {
        "type": "demo",
        "title": "탭이 많을 때",
        "example": "tabs-scroll"
      },
      {
        "type": "guidelines",
        "items": [
          [
            "탭 이름은 한두 단어로 짧게 씁니다.",
            "다른 화면으로 이동하는 메뉴로 쓰지 않습니다."
          ],
          [
            "가장 자주 보는 탭을 맨 앞에 둡니다.",
            "탭 안에 탭을 또 넣지 않습니다."
          ],
          [
            "넓은 화면에서는 `line`, 카드 안이나 좁은 곳에서는 `pill`을 씁니다.",
            "순서대로 거쳐야 하는 단계를 탭으로 나누지 않습니다."
          ]
        ]
      },
      {
        "type": "a11y",
        "items": [
          "WAI-ARIA 탭 패턴을 따릅니다: `tablist`, `tab`, `tabpanel`, `aria-selected`.",
          "Tab 키는 현재 탭으로만 들어오고, ←·→·Home·End로 탭을 옮기면 바로 선택됩니다. 꺼진 탭은 건너뜁니다.",
          "`label`로 탭 묶음의 이름을 붙입니다."
        ]
      }
    ]
  },
  {
    "id": "tabbar",
    "group": "탐색",
    "title": "탭 바",
    "lede": "탭 바는 휴대폰 앱 아래쪽에 고정되는 메뉴입니다. 3~5개의 주요 화면을 아이콘과 이름으로 오갑니다. `AppShell`에 `mobileNav=\"tabs\"`를 주면 좁은 화면에서 서랍 대신 탭 바를 그립니다. 모양은 하단 고정(`bar`)과 플로팅(`floating`) 두 가지이고, 이름은 항상·현재 탭만·숨김 중에 고릅니다. `AppShell`은 `tabBar`로 같은 설정을 받습니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "example": "tabbar-basic"
      },
      {
        "type": "demo",
        "title": "플로팅과 이름 표시",
        "example": "tabbar-floating"
      },
      {
        "type": "a11y",
        "items": [
          "현재 탭은 `aria-current=\"page\"`로 알립니다.",
          "아이콘만 두지 않고 항상 이름을 함께 씁니다.",
          "이름을 숨기면 각 버튼이 이름을 `aria-label`로 갖습니다."
        ]
      }
    ]
  },
  {
    "id": "toc",
    "group": "탐색",
    "title": "목차",
    "lede": "목차는 긴 페이지의 장 제목을 모아 보여 주고, 누르면 그 장으로 부드럽게 이동합니다. 페이지를 내리면 지금 읽는 장이 강조됩니다. 앱 틀의 오른쪽 칸(`aside`)에 넣어 씁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "example": "toc-basic"
      }
    ]
  },
  {
    "id": "pager",
    "group": "탐색",
    "title": "이전·다음",
    "lede": "이전·다음은 순서가 있는 페이지 사이를 오가는 링크 두 개입니다. 문서 끝에 두고, 첫 페이지와 마지막 페이지에서는 한쪽만 씁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "example": "pager-basic"
      }
    ]
  },
  {
    "id": "modal",
    "group": "피드백",
    "title": "모달",
    "lede": "모달은 지금 하던 일을 잠시 멈추고 꼭 필요한 입력이나 결정을 받습니다. 열려 있는 동안 뒤쪽 화면은 조작할 수 없습니다.",
    "sections": [
      {
        "type": "demo",
        "title": "크기",
        "example": "modal-sizes",
        "variants": [
          {
            "label": "데스크톱",
            "example": "modal-sizes"
          },
          {
            "label": "모바일",
            "example": "modal-mobile"
          }
        ]
      },
      {
        "type": "anatomy",
        "items": [
          [
            "제목",
            "무엇을 하는 창인지 한 줄로 씁니다."
          ],
          [
            "설명",
            "선택의 결과를 한두 문장으로 씁니다."
          ],
          [
            "본문",
            "입력이나 내용입니다. 길어지면 이 영역만 스크롤됩니다."
          ],
          [
            "동작",
            "오른쪽 끝이 주요 동작입니다. 취소는 왼쪽입니다."
          ]
        ]
      },
      {
        "type": "usage",
        "when": [
          "다음으로 넘어가기 전에 꼭 입력이나 결정이 필요할 때"
        ],
        "avoid": [
          "단순 알림이면 토스트",
          "모바일에서 선택지 목록이면 바텀 시트",
          "되돌릴 수 있는 동작이면 확인 없이 실행하고 실행 취소 제공"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "브라우저 기본 `<dialog>`를 써서 포커스가 창 안에 머뭅니다.",
          "Esc와 바깥 클릭으로 닫힙니다.",
          "닫히면 열기 전의 요소로 포커스가 돌아갑니다."
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "size.modal.*",
          "color.bg.scrim",
          "elevation.overlay",
          "motion.easing.enter",
          "motion.easing.exit"
        ]
      }
    ]
  },
  {
    "id": "confirm",
    "group": "피드백",
    "title": "확인 창",
    "lede": "확인 창은 되돌릴 수 없는 동작 직전에 한 번 더 묻는 작은 모달입니다.",
    "sections": [
      {
        "type": "demo",
        "title": "위험한 동작",
        "example": "confirm-danger",
        "variants": [
          {
            "label": "데스크톱",
            "example": "confirm-danger"
          },
          {
            "label": "모바일",
            "example": "confirm-mobile"
          }
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "제목은 \"위젯을 삭제할까요?\"처럼 질문으로, 버튼은 \"삭제\"처럼 결과로 씁니다.",
            "\"정말 진행하시겠습니까?\"처럼 무엇을 하는지 알 수 없게 씁니다."
          ],
          [
            "처음 포커스는 취소 버튼에 둡니다.",
            "Enter 한 번에 위험한 동작이 실행되게 합니다."
          ]
        ]
      }
    ]
  },
  {
    "id": "sheet",
    "group": "피드백",
    "title": "바텀 시트",
    "lede": "바텀 시트는 화면 아래에서 올라오는 패널입니다. 좁은 화면에서 메뉴, 선택지, 짧은 결정을 엄지가 닿는 곳에 보여 줍니다.",
    "sections": [
      {
        "type": "demo",
        "title": "목록 시트와 액션 시트",
        "example": "sheet-desktop",
        "variants": [
          {
            "label": "데스크톱",
            "example": "sheet-desktop"
          },
          {
            "label": "모바일",
            "example": "sheet-list"
          }
        ]
      },
      {
        "type": "usage",
        "when": [
          "모바일에서 메뉴나 선택지를 보여 줄 때",
          "넓은 화면의 드롭다운을 좁은 화면에서 대신할 때"
        ],
        "avoid": [
          "넓은 화면에서는 메뉴나 모달",
          "긴 입력 양식은 별도 화면"
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "size.sheet",
          "radius.sheet",
          "motion.duration.slow"
        ]
      }
    ]
  },
  {
    "id": "toast",
    "group": "피드백",
    "title": "토스트",
    "lede": "토스트는 방금 일어난 일을 잠깐 알려 주고 사라집니다. 되돌릴 수 있는 동작이라면 실행 취소를 함께 줍니다. 데스크톱에서는 오른쪽 아래에, 모바일에서는 화면 아래 전체 폭으로 뜹니다. 아래쪽 탭 바가 있으면 그 위로, 아이폰 홈 표시줄 영역도 피해서 뜹니다.",
    "sections": [
      {
        "type": "demo",
        "title": "상태와 실행 취소",
        "example": "toast-status",
        "variants": [
          {
            "label": "데스크톱",
            "example": "toast-status"
          },
          {
            "label": "모바일",
            "example": "toast-place-mobile"
          }
        ]
      },
      {
        "type": "anatomy",
        "items": [
          [
            "아이콘",
            "상태를 모양으로도 구분합니다. `info` 알림, `success` 완료, `warning` 주의, `error` 오류 아이콘입니다."
          ],
          [
            "메시지",
            "무엇이 일어났는지 한 문장으로 씁니다. 주의와 오류는 라벨이 앞에 붙습니다."
          ],
          [
            "동작",
            "실행 취소나 다시 시도처럼 하나만 둡니다."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "되돌릴 수 있는 동작은 확인 창 없이 실행하고 토스트로 실행 취소를 줍니다.",
            "모든 동작 전에 확인 창을 띄웁니다."
          ],
          [
            "토스트는 최대 3개까지 쌓이고 오래된 것부터 사라집니다.",
            "꼭 읽어야 하는 내용을 토스트로만 알립니다."
          ]
        ]
      },
      {
        "type": "a11y",
        "items": [
          "알림·완료·주의는 `role=\"status\"`, 오류는 `role=\"alert\"`로 읽힙니다.",
          "마우스를 올리거나 포커스하면 사라지는 시간이 멈춥니다.",
          "모달이 열려 있어도 그 위에 보입니다."
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "size.toast",
          "color.status.*",
          "elevation.overlay"
        ]
      }
    ]
  },
  {
    "id": "stat",
    "group": "데이터",
    "title": "숫자 카드",
    "lede": "숫자 카드는 지금 가장 중요한 값 하나와 그 변화를 보여 줍니다. 막대 하나짜리 차트 대신 씁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "example": "stat-basic"
      },
      {
        "type": "gallery",
        "title": "더 많은 예시",
        "items": [
          {
            "title": "숫자 카드",
            "example": "stat-card"
          }
        ]
      },
      {
        "type": "anatomy",
        "items": [
          [
            "값",
            "큰 숫자입니다. 1,000 이상은 \"4.8만\"처럼 줄여 씁니다."
          ],
          [
            "변화",
            "위·아래 화살표 아이콘과 비교 기간을 함께 씁니다. 색은 오른 게 좋은지에 따라 고릅니다. 표 안에서는 `delta` 칸이 같은 모양을 씁니다."
          ],
          [
            "추이",
            "작은 스파크라인입니다. 선은 회색, 마지막 값만 강조색입니다."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "응답 시간처럼 낮을수록 좋은 값은 `goodWhenUp: false`를 줘서 내린 변화를 녹색으로 씁니다.",
            "오르면 무조건 녹색, 내리면 무조건 빨강으로 씁니다."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "font.size.stat",
          "color.delta.*"
        ]
      }
    ]
  },
  {
    "id": "board",
    "group": "데이터",
    "title": "위젯 보드",
    "lede": "위젯 보드는 12열 격자 위에 위젯을 배치하는 대시보드 틀입니다. 사용자가 위젯을 끌어 옮기고, 크기를 바꾸고, 숨길 수 있으며 배치는 저장됩니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "caption": "제목줄을 끌어 옮기고, 오른쪽 아래 모서리로 크기를 바꿔 보세요",
        "example": "board-basic"
      },
      {
        "type": "demo",
        "title": "배치 이벤트",
        "caption": "위젯을 여러 번 옮겨 보세요. 변경 이벤트는 옮길 때마다, 커밋 이벤트는 움직임이 멈추고 1.5초 뒤 한 번만 납니다. 서버 저장과 알림은 예시 코드가 커밋 이벤트를 받아서 합니다",
        "example": "board-events"
      },
      {
        "type": "anatomy",
        "items": [
          [
            "제목줄",
            "잡고 끌면 위젯이 옮겨집니다. 4px 이상 움직여야 드래그가 시작돼 클릭과 구분됩니다."
          ],
          [
            "액션",
            "표 보기와 숨기기 버튼입니다. 마우스를 올리면 나타납니다."
          ],
          [
            "본문",
            "`render()`가 돌려준 요소입니다. 차트는 위젯 크기에 맞춰 스스로 다시 그립니다."
          ],
          [
            "크기 손잡이",
            "오른쪽 아래 모서리입니다. 끄는 동안 `8 × 4` 같은 크기가 표시됩니다."
          ],
          [
            "보드 액션",
            "보드 위 도구 막대입니다. 숨긴 위젯을 다시 놓고, 배치를 처음으로 돌립니다. `toolbar`로 필터를 함께 둡니다."
          ]
        ]
      },
      {
        "type": "a11y",
        "items": [
          "제목줄의 손잡이 버튼에 포커스한 뒤 방향키로 순서를 바꿉니다.",
          "크기 손잡이에 포커스한 뒤 방향키로 크기를 바꿉니다.",
          "이동과 크기 변경은 스크린리더에 안내됩니다."
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "grid.columns",
          "widget.*",
          "elevation.lifted",
          "layer.ghost"
        ]
      }
    ]
  },
  {
    "id": "line-chart",
    "group": "데이터",
    "sub": "차트",
    "title": "선 차트",
    "lede": "선 차트는 시간에 따른 변화를 보여 줍니다. 여러 시리즈, 예측 구간, 기준선, 출시 같은 사건 표시를 지원합니다.",
    "sections": [
      {
        "type": "demo",
        "title": "여러 시리즈와 사건 주석",
        "caption": "마우스를 올리면 그 날짜의 모든 값이 보입니다",
        "example": "line-annotations"
      },
      {
        "type": "demo",
        "title": "임계선과 초과 지점",
        "example": "line-threshold"
      },
      {
        "type": "gallery",
        "title": "더 많은 예시",
        "items": [
          {
            "title": "여러 시리즈",
            "example": "line-series"
          },
          {
            "title": "면적 하나",
            "example": "line-area"
          },
          {
            "title": "강조 비교",
            "caption": "핵심 하나는 브랜드 강조색, 비교 대상은 회색 점선",
            "example": "line-emphasis"
          },
          {
            "title": "예측 구간",
            "example": "line-forecast"
          },
          {
            "title": "지수 비교",
            "caption": "단위가 다른 두 값은 시작일을 100으로 맞춰 한 축에",
            "example": "line-index"
          }
        ]
      },
      {
        "type": "anatomy",
        "items": [
          [
            "범례",
            "시리즈가 둘 이상이면 위에 표시합니다."
          ],
          [
            "선",
            "2px 굵기입니다. 예측은 점선입니다."
          ],
          [
            "끝점 라벨",
            "마지막 값을 선 끝에 적습니다. 라벨이 겹치면 생략하고 범례에 맡깁니다."
          ],
          [
            "크로스헤어",
            "세로선이 가장 가까운 날짜에 붙고, 툴팁이 모든 시리즈 값을 보여 줍니다."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "단위가 다른 두 값은 시작일을 100으로 맞춰 한 축에 그립니다.",
            "y축을 두 개 쓰는 이중 축 차트를 만듭니다."
          ],
          [
            "격자선은 얇은 실선으로 물러나게 둡니다.",
            "격자선을 점선으로 그려 임계선과 헷갈리게 합니다."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "chart.stroke.*",
          "chart.marker.*",
          "chart.area.opacity",
          "color.chart.*"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "차트에 포커스하면 방향키로 날짜를 옮기며 값을 읽을 수 있습니다.",
          "위젯의 `표` 버튼이 같은 데이터를 표로 보여 줍니다."
        ]
      }
    ]
  },
  {
    "id": "bar-chart",
    "group": "데이터",
    "sub": "차트",
    "title": "막대 차트",
    "lede": "막대 차트는 기간별 양을 비교합니다. 막대는 바닥에서 시작하고 위쪽 모서리만 둥급니다.",
    "sections": [
      {
        "type": "demo",
        "title": "이번 기간 강조",
        "caption": "마지막 막대만 브랜드 강조색, 나머지는 회색",
        "example": "bar-emphasis"
      },
      {
        "type": "gallery",
        "title": "더 많은 예시",
        "items": [
          {
            "title": "기본",
            "example": "bar-basic"
          },
          {
            "title": "이번 기간 강조",
            "example": "bar-weekly"
          }
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "막대가 많으면 일간을 주간으로 묶어 개수를 줄입니다.",
            "막대 폭을 칸 전체로 채워 덩어리처럼 보이게 합니다."
          ],
          [
            "막대 하나만 있다면 숫자 카드로 바꿉니다.",
            "값마다 다른 색을 칠합니다."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "chart.bar.*",
          "chart.gap"
        ]
      }
    ]
  },
  {
    "id": "heatmap",
    "group": "데이터",
    "sub": "차트",
    "title": "히트맵",
    "lede": "히트맵은 두 축이 만나는 칸의 크기를 색 진하기로 보여 줍니다. 요일과 시간대처럼 반복되는 패턴을 찾을 때 씁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "요일 × 시간대",
        "example": "heatmap-week"
      },
      {
        "type": "gallery",
        "title": "더 많은 예시",
        "items": [
          {
            "title": "달력 · 브랜드 연속형",
            "caption": "쉰 날은 회색, 달린 거리는 연두 7단계",
            "example": "heatmap-calendar"
          }
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "한 색상의 명도 7단계와 범례를 함께 씁니다.",
            "무지개처럼 여러 색상을 섞어 크기를 표현합니다."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "color.sequential.*",
          "chart.gap"
        ]
      }
    ]
  },
  {
    "id": "sparkline",
    "group": "데이터",
    "sub": "차트",
    "title": "스파크라인",
    "lede": "스파크라인은 축 없이 추세만 보여 주는 작은 선입니다. 숫자 카드와 표 안에서 씁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "슬롯별 색",
        "center": true,
        "example": "sparkline-slots"
      },
      {
        "type": "usage",
        "when": [
          "값 옆에 방향만 보여 주면 될 때",
          "표의 행마다 추세를 비교할 때"
        ],
        "avoid": [
          "정확한 값을 읽어야 하면 선 차트"
        ]
      }
    ]
  },
  {
    "id": "table",
    "group": "데이터",
    "title": "표",
    "lede": "표는 정확한 값을 비교합니다. 모든 차트는 같은 데이터를 표로도 보여 줄 수 있어야 합니다.",
    "sections": [
      {
        "type": "demo",
        "title": "추이가 있는 표",
        "example": "table-trend"
      },
      {
        "type": "gallery",
        "title": "더 많은 예시",
        "items": [
          {
            "title": "추이가 있는 표",
            "example": "table-small"
          }
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "숫자 열은 오른쪽 정렬과 고정폭 숫자를 씁니다.",
            "숫자를 가운데 정렬해 자릿수를 비교하기 어렵게 만듭니다."
          ]
        ]
      }
    ]
  },
  {
    "id": "badge",
    "group": "콘텐츠",
    "title": "배지",
    "lede": "배지는 상태, 개수, 분류를 짧은 말로 붙여 보여 줍니다. 색(`tone`)은 기본·강조·정상·주의·오류이고, 모양(`variant`)은 옅은 바탕·테두리·채움입니다. 정상·주의·오류의 옅은 배지는 색 점이 함께 붙어서 색만으로 뜻을 전하지 않습니다. 탭, 탭 바, 문서 상태, 이력서 태그, 선택지 비교가 모두 이 배지를 씁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "색과 모양",
        "example": "badge-basic"
      },
      {
        "type": "a11y",
        "items": [
          "배지 글자가 뜻을 전하고, 색은 거들기만 합니다.",
          "개수 배지는 옆의 이름과 함께 읽힙니다. 숫자만 따로 두지 않습니다."
        ]
      }
    ]
  },
  {
    "id": "card",
    "group": "콘텐츠",
    "title": "카드",
    "lede": "카드는 제목, 설명, 내용을 하나의 테두리 안에 묶습니다. 고른 카드는 `selected`로 테두리를 강조하고, 제목 옆 `aside`에 배지나 버튼을 둡니다. 대시보드의 칸은 `Widget`, 그 밖의 묶음은 카드를 씁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본과 선택",
        "example": "card-basic"
      }
    ]
  },
  {
    "id": "callout",
    "group": "콘텐츠",
    "title": "콜아웃",
    "lede": "콜아웃은 본문 흐름에서 꼭 읽어야 할 한 덩어리를 떼어 보여 줍니다. 색은 알림·팁·주의 세 가지이고 아이콘이 함께 붙습니다. 마크다운의 `> [!NOTE]`, 기술 문서, 슬라이드가 같은 콜아웃을 씁니다. 권장·지양(`do`, `dont`)도 같은 콜아웃으로, ✓·✕ 아이콘과 「권장」·「지양」 제목이 자동으로 붙습니다.",
    "sections": [
      {
        "type": "demo",
        "title": "세 가지 색",
        "example": "callout-basic"
      }
    ]
  },
  {
    "id": "takeaway",
    "group": "콘텐츠",
    "title": "결론 한 줄",
    "lede": "결론 한 줄은 제목 바로 아래에서 이 덩어리의 결론을 한 문장으로 말합니다. 왼쪽 강조선과 큰 글자로 본문과 구분합니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "example": "takeaway-basic"
      }
    ]
  },
  {
    "id": "bullets",
    "group": "콘텐츠",
    "title": "글머리 목록",
    "lede": "글머리 목록은 두 단계까지의 요점을 나열합니다. 하위 항목은 작고 옅게 들여 씁니다. 다섯 줄 안팎을 권합니다.",
    "sections": [
      {
        "type": "demo",
        "title": "두 단계 목록",
        "example": "bullets-basic"
      }
    ]
  },
  {
    "id": "steps",
    "group": "콘텐츠",
    "title": "단계",
    "lede": "단계는 순서가 있는 과정을 번호와 화살표로 잇습니다. 넓은 화면에서는 가로로, 좁은 화면에서는 세로로 쌓입니다. 3~5단계를 권합니다.",
    "sections": [
      {
        "type": "demo",
        "title": "세 단계",
        "example": "steps-basic"
      }
    ]
  },
  {
    "id": "figure",
    "group": "콘텐츠",
    "title": "그림과 표 캡션",
    "lede": "그림은 차트나 표에 캡션을 붙입니다. 그림은 캡션이 아래, 표는 위에 붙습니다. 기술 문서 틀 안에서는 \"그림 N.\", \"표 N.\" 번호가 자동으로 붙습니다.",
    "sections": [
      {
        "type": "demo",
        "title": "그림과 표",
        "example": "figure-basic"
      }
    ]
  },
  {
    "id": "code",
    "group": "콘텐츠",
    "title": "코드 블록",
    "lede": "코드 블록은 코드를 문법 색과 복사 버튼과 함께 보여 줍니다. 언어를 생략하면 내용으로 짐작합니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "example": "code-basic"
      }
    ]
  },
  {
    "id": "requirement-table",
    "group": "콘텐츠",
    "title": "요구사항 표",
    "lede": "요구사항 표는 요구사항마다 번호(R1, R2…), 우선순위, 상태를 붙입니다. 같은 화면의 다른 글이 번호로 요구사항을 가리킬 수 있습니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "example": "requirements-basic"
      }
    ]
  },
  {
    "id": "options",
    "group": "콘텐츠",
    "title": "선택지 비교",
    "lede": "선택지 비교는 후보마다 요약, 장점, 단점을 카드로 나란히 놓고, 고른 안을 강조합니다.",
    "sections": [
      {
        "type": "demo",
        "title": "두 안 비교",
        "example": "options-basic"
      }
    ]
  },
  {
    "id": "changelog",
    "group": "콘텐츠",
    "title": "변경 이력",
    "lede": "변경 이력은 버전, 날짜, 작성자, 변경 내용을 표로 남깁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "example": "changelog-basic"
      }
    ]
  },
  {
    "id": "image",
    "group": "콘텐츠",
    "title": "이미지",
    "lede": "이미지는 비율을 지키며 사진을 채웁니다. `src`가 없으면 시리즈 색 그라데이션 자리 표시를 그리므로 예시와 로딩 상태에도 씁니다. 세로 사진은 3:4, 가로 사진은 16:9 또는 4:3을 씁니다. 이미지 카드는 이미지와 제목, 설명을 한 덩어리로 묶고, 캐러셀은 옆으로 넘겨 봅니다. 한 장씩(`full`), 카드 여러 장(`card`), 작은 카드 여러 장(`mini`) 세 크기가 있습니다.",
    "sections": [
      {
        "type": "demo",
        "title": "이미지와 이미지 카드",
        "example": "image-basic"
      },
      {
        "type": "demo",
        "title": "캐러셀",
        "example": "carousel-basic"
      },
      {
        "type": "demo",
        "title": "카드 캐러셀",
        "example": "carousel-card"
      },
      {
        "type": "demo",
        "title": "미니 카드 캐러셀",
        "example": "carousel-mini"
      },
      {
        "type": "a11y",
        "items": [
          "이미지에는 항상 `alt`를 줍니다. 자리 표시도 `alt`를 이름으로 읽힙니다.",
          "캐러셀은 슬라이드마다 `n / 전체`로 읽히고, 이전·다음 버튼과 스와이프 모두로 넘깁니다."
        ]
      }
    ]
  },
  {
    "id": "social",
    "group": "콘텐츠",
    "title": "소셜",
    "lede": "소셜 컴포넌트는 사진 공유 앱의 화면을 이룹니다. 아바타, 스토리, 게시물, 프로필 머리말, 사진 격자, 목록이 있습니다. 좋아요 같은 누름은 이벤트로 알리고 저장은 앱이 맡습니다.",
    "sections": [
      {
        "type": "demo",
        "title": "피드",
        "example": "social-feed"
      },
      {
        "type": "demo",
        "title": "프로필과 알림",
        "example": "social-profile"
      },
      {
        "type": "a11y",
        "items": [
          "좋아요 버튼은 `aria-pressed`로 상태를 알리고, 사진을 두 번 눌러도 좋아요가 됩니다.",
          "아이콘 버튼은 모두 이름을 가집니다."
        ]
      }
    ]
  },
  {
    "id": "jsonui",
    "group": "렌더러",
    "title": "JSON UI",
    "lede": "JSON UI는 JSON 템플릿을 받아 그 아래에 컴포넌트를 그리는 해석 엔진입니다. 화면을 JSON으로 적으면, 앱은 `<JsonUI>` 하나만 두고 데이터·숫자 형식·동작 처리기를 넘깁니다. 그 아래 컴포넌트는 자기가 JSON으로 그려졌는지 모르고 평소와 똑같이 동작합니다. SDUI는 서버 응답을 이 형식으로 바꾸는 어댑터만 두면 됩니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "example": "jsonui-basic"
      },
      {
        "type": "demo",
        "title": "템플릿과 데이터",
        "example": "jsonui-template"
      },
      {
        "type": "text",
        "title": "노드 형식",
        "body": [
          "노드는 export된 컴포넌트 이름(`type`), props, children으로 이루어집니다. 배열을 주면 세로로 쌓습니다. props 안의 값은 아래 다섯 표식으로 앱의 데이터·형식·동작과 이어집니다."
        ]
      },
      {
        "type": "code",
        "code": "{\n  \"type\": \"Widget\",\n  \"props\": { \"title\": \"Visitors\", \"w\": 6, \"h\": 3 },\n  \"children\": {\n    \"type\": \"Stat\",\n    \"props\": { \"value\": { \"$data\": \"visits\", \"$format\": \"count\" } }\n  }\n}",
        "lang": "plain"
      },
      {
        "type": "api",
        "title": "표식",
        "rows": [
          [
            "$data",
            "{ \"$data\": key }",
            "",
            "`data`에서 값을 꺼냅니다. `$format`이나 `$labels`를 함께 쓸 수 있습니다."
          ],
          [
            "$format",
            "{ \"$format\": name }",
            "",
            "`formats`의 이름 붙은 함수입니다. 값과 함께 쓰면 형식을 입힌 글자가 됩니다."
          ],
          [
            "$each · $as",
            "{ \"$each\": list, \"$as\": template }",
            "",
            "목록을 돌며 템플릿을 찍습니다. 템플릿 안에서는 `$field`로 항목 값을 꺼냅니다."
          ],
          [
            "$field",
            "{ \"$field\": key }",
            "",
            "`$each` 안에서 지금 항목의 값입니다."
          ],
          [
            "$action",
            "{ \"$action\": { name, params? } }",
            "",
            "콜백 자리에 놓으면 `onAction`을 부르는 함수가 됩니다. 값 하나를 넘기는 콜백은 `params.value`로 전달합니다."
          ]
        ]
      },
      {
        "type": "text",
        "title": "렌더링 시점",
        "body": [
          "기본은 호출 시점입니다. 앱이 JSON을 받아 브라우저에서 해석합니다. 첫 화면이 중요한 웹 페이지는 게시할 때 같은 엔진으로 서버에서 HTML을 미리 그려 두고, 브라우저가 이어받을 수 있습니다. JSON이 원본이고, 두 시점의 결과는 같습니다."
        ]
      },
      {
        "type": "a11y",
        "items": [
          "JSON UI는 접근성 속성을 더하거나 빼지 않습니다. 그려지는 컴포넌트의 접근성이 그대로 적용됩니다."
        ]
      }
    ]
  },
  {
    "id": "markdown",
    "group": "렌더러",
    "title": "마크다운",
    "lede": "마크다운은 노션처럼 보면서 바로 고치는 문서 컴포넌트입니다. 일반 마크다운(CommonMark와 GitHub 확장)을 블록으로 해석해 우리 컴포넌트로 그리고, `- `, `1. `, `[] `, `# `, `> `, 백틱 세 개, `---`를 치는 순간 블록이 바뀝니다. `/`로 블록과 UI 컴포넌트를 넣고, 손잡이를 끌어 블록을 옮깁니다. 고칠 필요가 없는 곳(AI 답변, 공유 화면, SDUI 안내문, 인쇄)은 `readOnly`로 같은 모양을 보여 줍니다. 결과는 표준 마크다운으로 `onChange`에 나가고, 저장은 앱이 맡습니다.",
    "sections": [
      {
        "type": "demo",
        "title": "편집",
        "example": "markdown-editor"
      },
      {
        "type": "demo",
        "title": "읽기 전용",
        "example": "markdown-basic"
      },
      {
        "type": "demo",
        "title": "UI 블록",
        "example": "markdown-ui"
      },
      {
        "type": "api",
        "title": "키",
        "rows": [
          [
            "- · 1. · [] · # · > · ``` · ---",
            "",
            "",
            "문단 맨 앞에서 치면 그 블록이 바로 바뀝니다"
          ],
          [
            "/",
            "",
            "",
            "블록·UI 메뉴를 엽니다. 글자를 더 치면 걸러지고 ↑·↓·Enter로 고릅니다"
          ],
          [
            "Enter",
            "",
            "",
            "새 블록. 목록에서는 다음 항목, 빈 항목에서는 목록을 빠져나옵니다"
          ],
          [
            "Shift + Enter",
            "",
            "",
            "블록 안에서 줄바꿈합니다"
          ],
          [
            "Tab · Shift + Tab",
            "",
            "",
            "목록 항목을 들이거나 내어 씁니다"
          ],
          [
            "Backspace",
            "",
            "",
            "맨 앞에서는 블록을 문단으로 되돌리고, 문단이면 앞 블록과 합칩니다"
          ],
          [
            "↑ · ↓",
            "",
            "",
            "블록의 첫 줄·끝 줄에서 이전·다음 블록으로 갑니다"
          ],
          [
            "Alt + Shift + ↑ · ↓",
            "",
            "",
            "블록을 위아래로 옮깁니다(손잡이 끌기와 같음)"
          ],
          [
            "Esc",
            "",
            "",
            "편집을 마칩니다"
          ]
        ]
      },
      {
        "type": "api",
        "title": "지원 문법",
        "rows": [
          [
            "제목",
            "# … ###### · 제목 + ===/---",
            "",
            "`id`가 붙어 링크로 이동할 수 있습니다."
          ],
          [
            "강조",
            "**굵게** *기울임* ~~취소~~ `코드`",
            "",
            ""
          ],
          [
            "링크",
            "[글](url \"제목\") · [글][참조] · <url> · 맨 URL",
            "",
            "http(s)·mailto·tel·상대 경로만 허용하고 나머지는 막습니다."
          ],
          [
            "이미지",
            "![설명](url \"제목\")",
            "",
            "한 줄에 홀로 있으면 설명이 달린 그림이 됩니다."
          ],
          [
            "목록",
            "- 항목 · 1. 항목 · 1) 항목 · - [ ] 할 일",
            "",
            "들여쓰기로 중첩합니다."
          ],
          [
            "인용·콜아웃",
            "> 글 · >> 중첩 · > [!NOTE|TIP|WARNING] 제목",
            "",
            ""
          ],
          [
            "표",
            "| a | b | + | --- | ---: |",
            "",
            "오른쪽 정렬 열은 숫자 열이 됩니다."
          ],
          [
            "코드",
            "```ts … ``` · 4칸 들여쓰기",
            "",
            "tsx·html·json·sql은 강조, 그 밖은 일반 글자입니다."
          ],
          [
            "각주",
            "글[^1] + [^1]: 내용",
            "",
            "문서 끝에 번호순으로 모입니다."
          ],
          [
            "기타",
            "--- · 줄 끝 공백 두 칸 · &amp; · \\*",
            "",
            "구분선, 강제 줄바꿈, HTML 엔티티, 이스케이프"
          ],
          [
            "UI 블록",
            "```ui { JSON 노드 } ```",
            "",
            "`data`·`formats`·`onAction`은 마크다운 컴포넌트의 props가 넘어갑니다."
          ],
          [
            "그리지 않음",
            "<div>…</div>",
            "",
            "HTML 태그는 보안을 위해 글자로 보여 줍니다."
          ]
        ]
      },
      {
        "type": "a11y",
        "items": [
          "편집 중인 블록은 일반 입력창이라 스크린리더와 키보드로 그대로 쓸 수 있고, 끌기 대신 Alt+Shift+↑·↓로 옮길 수 있습니다.",
          "읽기 전용에서는 목록 항목이 `list`·`listitem`으로 묶이고, 제목에는 링크로 이동할 `id`가 붙습니다.",
          "이미지는 설명(alt)을 대체 텍스트로 씁니다."
        ]
      }
    ],
    "wide": true
  },
  {
    "id": "appshell",
    "group": "틀",
    "title": "앱 틀",
    "lede": "앱 틀은 왼쪽 메뉴, 위쪽 머리줄, 본문, 오른쪽 보조 칸을 잡는 화면 전체의 틀입니다. 좁은 화면에서는 메뉴가 서랍이나 아래쪽 탭 바로 바뀝니다. 앱처럼 틀 안에서 스크롤하는 방식(`frame`)과, 문서처럼 페이지 전체가 스크롤되는 방식(`page`)이 있습니다. 이 문서 사이트도 앱 틀 위에 만들어져 있습니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "example": "appshell-basic",
        "variants": [
          {
            "label": "데스크톱",
            "example": "appshell-basic"
          },
          {
            "label": "모바일",
            "example": "appshell-mobile"
          }
        ]
      }
    ]
  },
  {
    "id": "slides",
    "group": "틀",
    "title": "슬라이드 틀",
    "lede": "슬라이드 틀은 발표 자료의 큰 틀입니다. 1920×1080 화면에 그린 뒤 크기에 맞춰 줄이거나 키우므로 어떤 화면에서도 배치가 같고, 안쪽에는 slide 용도 토큰이 적용됩니다. 휴대폰과 태블릿에서는 좌우로 밀어서, 키보드에서는 방향키로, 화면에서는 아래 버튼으로 넘기고, 발표 화면·발표자 노트·인쇄를 맡습니다. 한 장 한 장의 배치는 템플릿 탭의 레이아웃을 씁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "넘겨 보기",
        "example": "deck-basic"
      },
      {
        "type": "usage",
        "when": [
          "Claude가 같은 모양의 발표 자료를 반복해서 만들 때",
          "차트와 숫자를 웹 문서와 같은 데이터로 보여 줄 때"
        ],
        "avoid": [
          "PowerPoint에서 사람이 직접 고칠 자료면 .pptx 템플릿",
          "한 장짜리 그림이면 문서 페이지"
        ]
      },
      {
        "type": "anatomy",
        "items": [
          [
            "`Deck`",
            "슬라이드를 한 장씩 보여 주고, 넘기기·발표·인쇄 버튼과 쪽 번호를 맡습니다."
          ],
          [
            "`Slide`",
            "한 장입니다. 배경 톤(`plain`, `dark`, `accent`), 출처, 발표자 노트를 받습니다."
          ],
          [
            "`SlideHeader`",
            "작은 머리말, 제목, 부제입니다. 모든 장에서 같은 자리에 옵니다."
          ],
          [
            "`SlideFooter`",
            "출처, 자료 이름, 쪽 번호입니다. `Slide`가 자동으로 붙입니다."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "제목 아래에 결론 문장(`Takeaway`)을 한 줄 둡니다.",
            "제목만 두고 결론은 말로만 전합니다."
          ],
          [
            "숫자와 차트 슬라이드에는 출처를 적습니다.",
            "출처 없는 숫자를 보여 줍니다."
          ]
        ]
      },
      {
        "type": "list",
        "title": "PDF로 저장",
        "items": [
          "인쇄 버튼을 누르면 이 자료만 인쇄 창에 올라갑니다. 대상에서 PDF로 저장을 고르면 한 장이 16:9 한 쪽이 됩니다.",
          "자료만 있는 HTML 페이지에서는 브라우저의 인쇄(⌘P)로도 같은 결과가 나옵니다.",
          "PDF 파일을 만드는 도구는 디자인 시스템에 넣지 않습니다. 인쇄용 CSS만 제공합니다."
        ]
      },
      {
        "type": "list",
        "title": "격자선과 자동 검사",
        "items": [
          "모든 장은 같은 기준선을 씁니다. 제목은 위 기준선(y64), 결론 한 줄이나 내용은 내용 기준선(y160), 표지·장 구분·한 문장·인용·마무리의 본문 첫 줄은 큰 글자 기준선(y384)에서 시작하고, 꼬리말 위와 좌우 96px 안쪽을 넘지 않습니다.",
          "G 키나 격자 버튼을 누르면 이 선들과 12열이 겹쳐 보입니다. 모양을 맞출 때만 켜고, 발표와 인쇄에서는 꺼져 있습니다.",
          "`npm run check:slides`가 모든 템플릿과 레이아웃을 한국어·영어로 그린 뒤 격자선을 켜고 선과 비교합니다. 1px이라도 어긋나거나, 제목·결론 한 줄이 두 줄이 되면 실패하고 CI도 멈춥니다."
        ]
      },
      {
        "type": "a11y",
        "items": [
          "슬라이드 묶음에 포커스한 뒤 방향키, 스페이스, PageUp·PageDown, Home·End로 넘깁니다.",
          "터치 화면에서는 좌우로 밀어 넘깁니다. 세로로 밀면 페이지가 그대로 스크롤되고, 첫 장과 마지막 장에서는 살짝 버티다 돌아옵니다.",
          "F 키로 발표 화면을 켜고 끕니다.",
          "슬라이드가 바뀌면 스크린리더가 새 내용을 읽습니다."
        ]
      }
    ]
  },
  {
    "id": "doc-frame",
    "group": "틀",
    "title": "문서 틀",
    "lede": "문서 틀은 HTML로 쓰는 기술 문서의 겉모양입니다. 머리 정보, 목차, 장 번호를 자동으로 그리고, doc 용도 토큰으로 읽기 좋은 글자 크기와 줄 간격을 씁니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "caption": "목차와 R2 참조를 눌러 보세요. 오른쪽 위 버튼은 이 문서만 A4로 인쇄합니다",
        "example": "doc-basic",
        "medium": "doc"
      },
      {
        "type": "usage",
        "when": [
          "설계 문서, RFC, 결정 기록처럼 검토받을 글을 쓸 때",
          "요구사항과 설계를 번호로 이어야 할 때"
        ],
        "avoid": [
          "한 화면 안내문이면 일반 페이지",
          "발표용이면 슬라이드"
        ]
      },
      {
        "type": "anatomy",
        "items": [
          [
            "머리",
            "상태(초안·검토 중·확정), 제목, 한 문장 요약, 작성자·검토자·날짜·버전입니다."
          ],
          [
            "목차",
            "`DocSection` 제목으로 자동으로 만들고, 번호(1, 1.1)를 붙입니다."
          ],
          [
            "장",
            "`DocSection`을 겹치면 두 단계까지 번호가 이어집니다."
          ],
          [
            "참조",
            "`Ref`는 요구사항 번호로 그 줄을 찾아가 잠시 강조합니다."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "요약은 결론을 한 문장으로 씁니다.",
            "요약에 배경을 길게 씁니다."
          ],
          [
            "설계의 각 결정이 어떤 요구사항을 만족하는지 `R1`처럼 참조합니다.",
            "요구사항과 설계를 따로 읽게 둡니다."
          ],
          [
            "열린 질문은 따로 장을 두고 질문 문장으로 씁니다.",
            "결정되지 않은 내용을 본문에 확정처럼 씁니다."
          ]
        ]
      },
      {
        "type": "list",
        "title": "PDF로 저장",
        "items": [
          "인쇄 버튼을 누르면 이 문서만 인쇄 창에 올라가고, A4 세로로 나뉩니다.",
          "제목 바로 뒤에서는 쪽이 나뉘지 않고, 그림·표·코드 블록은 쪽 가운데서 잘리지 않습니다."
        ]
      },
      {
        "type": "a11y",
        "items": [
          "목차와 참조는 링크라서 키보드로 따라갈 수 있습니다.",
          "장 제목은 h2와 h3라서 스크린리더의 제목 탐색으로 오갈 수 있습니다."
        ]
      }
    ]
  },
  {
    "id": "resume",
    "group": "틀",
    "title": "이력서 틀",
    "lede": "이력서 틀은 이름·직무·연락처 머리말 아래에 섹션과 항목을 쌓습니다. 항목은 직함, 회사, 기간, 성과, 기술 배지를 받습니다. 인쇄하면 A4 세로로 나뉩니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "example": "resume-frame"
      }
    ]
  },
  {
    "id": "portfolio",
    "group": "틀",
    "title": "포트폴리오 틀",
    "lede": "포트폴리오 틀은 소개 머리말 아래에 프로젝트를 이미지, 요약, 핵심 숫자, 기술 배지와 함께 놓습니다. 인쇄하면 A4 세로로 나뉩니다.",
    "sections": [
      {
        "type": "demo",
        "title": "기본",
        "example": "portfolio-frame"
      }
    ]
  },
  {
    "id": "blocks",
    "group": "블록",
    "title": "데스크톱 대시보드",
    "wide": true,
    "lede": "컴포넌트만으로 조립한 완성 화면입니다. 미리보기에서 위젯을 직접 끌어 보고, 화면 너비를 바꿔 보고, 코드 탭에서 파일 전체를 복사해 새 대시보드의 출발점으로 씁니다.",
    "sections": [
      {
        "type": "block",
        "id": "dashboard-01",
        "title": "dashboard-01"
      }
    ]
  },
  {
    "id": "blocks-mobile",
    "group": "블록",
    "title": "모바일 대시보드",
    "wide": true,
    "lede": "컴포넌트를 코드(TSX)로 직접 조합한 휴대폰 화면입니다. SDUI 탭의 \"모바일 대시보드\"는 같은 화면을 JSON 템플릿으로 그린 것이고, 결과 HTML은 같습니다.",
    "sections": [
      {
        "type": "block",
        "id": "dashboard-mobile"
      }
    ]
  },
  {
    "id": "sdui-dashboard",
    "group": "SDUI",
    "title": "모바일 대시보드",
    "wide": true,
    "lede": "블록 탭의 \"모바일 대시보드\"와 같은 화면을 JSON 템플릿 하나로 그렸습니다. 앱은 `<JsonUI>`에 템플릿과 데이터만 넘기고, 컴포넌트는 코드로 그릴 때와 똑같은 props로 불립니다.",
    "sections": [
      {
        "type": "block",
        "id": "sdui-dashboard"
      }
    ]
  },
  {
    "id": "sdui-builder",
    "group": "SDUI",
    "title": "앱 빌더",
    "wide": true,
    "lede": "앱 화면을 위젯으로 조립합니다. 데스크톱은 브라우저 창과 사이드바, 모바일은 휴대폰과 아래 탭 바로 보여 주고, 메뉴는 서버가 보낸 값으로 그립니다. 보드에서 끌고 크기를 바꿔 배치를 정하고, 결과는 JSON으로 복사해 서버 응답의 출발점으로 씁니다.",
    "sections": [
      {
        "type": "sdui"
      }
    ]
  },
  {
    "id": "slide-templates",
    "group": "슬라이드",
    "title": "슬라이드 템플릿",
    "wide": true,
    "lede": "발표 자료 템플릿입니다. 카드를 고르면 아래에서 한 장씩 넘겨 보고 코드를 볼 수 있습니다. 모든 템플릿은 같은 레이아웃과 부품으로 만들어, 테마를 바꾸면 함께 바뀝니다.",
    "sections": [
      {
        "type": "templates",
        "category": "슬라이드"
      }
    ]
  },
  {
    "id": "slide-layouts",
    "group": "슬라이드",
    "title": "레이아웃",
    "wide": true,
    "lede": "레이아웃은 자주 쓰는 슬라이드 모양 열두 가지입니다. 내용만 넣으면 제목, 결론, 출처 자리가 맞춰집니다.",
    "sections": [
      {
        "type": "gallery",
        "title": "여는 장",
        "items": [
          {
            "title": "표지",
            "example": "slide-title"
          },
          {
            "title": "목차",
            "example": "slide-agenda"
          },
          {
            "title": "장 구분",
            "example": "slide-section"
          },
          {
            "title": "한 문장 메시지",
            "example": "slide-statement"
          }
        ]
      },
      {
        "type": "gallery",
        "title": "내용 장",
        "items": [
          {
            "title": "큰 숫자",
            "example": "slide-metric"
          },
          {
            "title": "차트",
            "example": "slide-chart"
          },
          {
            "title": "두 단",
            "example": "slide-split"
          }
        ]
      },
      {
        "type": "gallery",
        "title": "마무리와 근거 장",
        "items": [
          {
            "title": "비교",
            "example": "slide-compare"
          },
          {
            "title": "타임라인",
            "example": "slide-timeline"
          },
          {
            "title": "표",
            "example": "slide-table"
          },
          {
            "title": "인용",
            "example": "slide-quote"
          },
          {
            "title": "마무리",
            "example": "slide-closing"
          }
        ]
      }
    ]
  },
  {
    "id": "doc-templates",
    "group": "기술 문서",
    "title": "기술 문서 템플릿",
    "wide": true,
    "lede": "설계 문서와 RFC 템플릿입니다. 카드를 고르면 아래에서 전체 문서와 코드를 볼 수 있습니다. 인쇄하면 A4로 나뉩니다.",
    "sections": [
      {
        "type": "templates",
        "category": "기술 문서"
      }
    ]
  },
  {
    "id": "resume-templates",
    "group": "이력서",
    "title": "이력서 템플릿",
    "wide": true,
    "lede": "이력서 템플릿입니다. `Resume`, `ResumeSection`, `ResumeEntry` 세 부품으로 만들고, 인쇄하면 A4 세로로 나뉩니다. 테마를 바꾸면 강조색이 함께 바뀝니다.",
    "sections": [
      {
        "type": "templates",
        "category": "이력서"
      }
    ]
  },
  {
    "id": "portfolio-templates",
    "group": "포트폴리오",
    "title": "포트폴리오 템플릿",
    "wide": true,
    "lede": "포트폴리오 템플릿입니다. `Portfolio`, `PortfolioSection`, `Project` 세 부품으로 만들고, 프로젝트마다 이미지·요약·핵심 숫자·기술 태그를 둡니다. 인쇄하면 A4 세로로 나뉘고, 테마를 바꾸면 강조색이 함께 바뀝니다.",
    "sections": [
      {
        "type": "templates",
        "category": "포트폴리오"
      }
    ]
  },
  {
    "id": "theme",
    "group": "테마",
    "title": "토큰 검사",
    "wide": true,
    "lede": "모든 토큰의 값과 참조를 보여 주고, 대비 실패와 쓰이지 않는 색을 자동으로 찾습니다. 토큰을 고치고 `npm run build`를 한 뒤 새로고침하면 다시 계산됩니다.",
    "sections": [
      {
        "type": "review",
        "title": ""
      }
    ]
  }
];
