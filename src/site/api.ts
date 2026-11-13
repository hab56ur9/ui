import type { Section } from "./pages";

const POINTS = "Point[]";
const COLOR = 'number | "emphasis" | "de-emphasis"';
const COLOR_NOTE = "숫자는 시리즈 슬롯(1~8), `\"emphasis\"`·`\"de-emphasis\"`는 핵심 시리즈와 비교 대상입니다.";
const DIALOG_PROPS = [
  ["open", "boolean", "", "열림 상태입니다. 부모가 들고 있습니다."],
  ["onClose", "(value: V | null) => void", "", "버튼을 누르면 그 `value`, Esc·바깥 클릭·닫기 버튼·끌어내리기면 `null`로 호출됩니다."],
  ["title", "string", "", "창 제목입니다."],
  ["description", "string", "", "제목 아래 한두 문장 설명입니다."],
  ["children", "ReactNode", "", "본문입니다. 문자열이면 문단으로 감쌉니다."],
  ["actions", "{ label, value?, variant?, autoFocus? }[]", "[]", "하단 버튼입니다. `value`를 생략하면 `label`이 결과값입니다. `variant`는 `secondary` · `primary` · `danger`입니다."],
  ["dismissible", "boolean", "true", "Esc, 바깥 클릭, 닫기 버튼, 시트 끌어내리기로 닫을 수 있는지 정합니다."],
];

export const api: Record<string, Section[]> = {
  "getting-started": [
    {
      type: "api",
      title: "공통 규칙",
      description: "모든 컴포넌트는 props만 받는 React 컴포넌트입니다. 차트는 부모 요소 크기를 재서 스스로 다시 그리므로 높이가 있는 부모 안에 둡니다.",
      rows: [
        ["points", POINTS, "", "시계열 데이터입니다. `{ t, v }`의 `t`는 시각(ms), `v`는 값입니다."],
        ["color", COLOR, "", COLOR_NOTE],
        ["format", "{ axis?, value?, date? }", "", "축 눈금, 툴팁·라벨 값, 날짜 형식입니다. `value`를 생략하면 `axis`를 씁니다."],
        ["name · label · title", "string", "", "`name`은 데이터 이름(범례), `label`은 화면에 보이는 글자, `title`은 컴포넌트의 접근성 이름입니다."],
      ],
    },
    {
      type: "api",
      title: "UIProvider",
      description: "테마, 토스트와 확인 창을 띄울 자리, 언어를 제공합니다. 앱 최상위에 한 번 두고, CSS도 여기서 실립니다.",
      rows: [
        ["theme", "Theme", "필수", "`themes.<프리셋>.<스타일>` 중 하나입니다. 예: `themes.sky.expressive`. 앱은 고르기만 하고 값을 펼치거나 고칠 수 없습니다."],
        ["lang", "string", "<html lang>", "컴포넌트 고유 문구(닫기, 취소 등)와 날짜·숫자 형식의 언어입니다. 표에 없는 언어면 `en`입니다."],
        ["useToast()", "(props) => ToastHandle", "", "토스트를 띄우는 함수를 돌려줍니다."],
        ["useConfirm()", "(props) => Promise<boolean>", "", "확인 창을 띄우고 결과를 기다리는 함수를 돌려줍니다."],
        ["useI18n()", "{ lang, locale, text }", "", "지금 언어와 `Intl`에 넘길 언어 태그를 돌려줍니다."],
      ],
    },
    {
      type: "api",
      title: "도우미",
      rows: [
        ["DAY", "number", "86400000", "하루(ms)입니다."],
      ],
    },
  ],
  button: [
    {
      type: "api",
      title: "<Button>",
      description: "버튼은 아래 속성만 받습니다. 모양은 `variant`로만 고릅니다.",
      rows: [
        ["variant", '"secondary" | "primary" | "danger"', '"secondary"', "버튼 종류입니다."],
        ["icon", "IconName", "", "글자 앞에 붙는 `sm` 아이콘입니다."],
        ["label", "string", "", "글자 없는 아이콘 버튼의 접근성 이름이자 툴팁입니다."],
        ["onClick · disabled · type", '() => void · boolean · "button" | "submit"', '· false · "button"', "누를 때 할 일, 비활성, 폼 제출 여부입니다."],
      ],
    },
  ],
  chat: [
    { type: "api", title: "<ChatMessage>", rows: [
      ["author · tone · avatar", "string, number, string", "", "작성자 이름, 색 슬롯, 사진."],
      ["badge · time · via", "{ tone?, label }, string, string", "", "역할 배지, 시각, 출처."],
      ["continued · selected · pending", "boolean", "false", "이어 쓰기(아바타 접음), 선택 강조, 입력 중 점."],
      ["actions", "MessageAction[]", "[]", "마우스를 올리면 뜨는 버튼. menu가 있으면 메뉴를 엽니다."],
      ["reactions · onReact", "{ emoji, count, mine?, title? }[], (emoji) => void", "[]", "리액션 알약과 누를 때 이벤트."],
      ["replies · onOpenThread", "{ label, last?, members }, () => void", "", "스레드 답글 요약과 누를 때 이벤트."],
    ] },
    { type: "api", title: "<Composer>", rows: [
      ["placeholder · submitLabel", "string", "\"보내기\"", "빈 입력창 문구와 보내기 버튼 이름."],
      ["mentions", "{ id, label, description?, tone?, avatar?, state? }[]", "[]", "@ 뒤에 뜨는 멘션 후보. 이름, id, 한글 초성으로 찾습니다."],
      ["chips · onRemoveChip", "{ id, label, icon? }[], (id) => void", "[]", "입력창 아래 붙는 인용·첨부 칩."],
      ["insert", "{ text, nonce }", "", "nonce가 바뀔 때 text를 맨 앞에 넣고 커서를 둡니다."],
      ["onChange · onSubmit", "(text) => void", "", "글이 바뀔 때와 보낼 때."],
    ] },
    { type: "api", title: "<ChatPane> · <MessageLog> · <SystemNote> · <TypingIndicator> · <DayDivider> · <PresenceAvatar>", rows: [
      ["ChatPane composer · footer", "ReactNode", "", "아래에 붙는 입력창과 그 위 한 줄."],
      ["MessageLog", "children", "", "맨 아래에 붙어 따라 내려가는 메시지 목록."],
      ["SystemNote icon · time · onSelect", "IconName, string, () => void", "\"info\"", "시스템 한 줄. onSelect면 링크가 됩니다."],
      ["TypingIndicator members", "Face[]", "[]", "일하는 사람 얼굴. children이 없으면 비워 둡니다."],
      ["DayDivider tone · align", "\"new\", \"center\" | \"start\"", "\"center\"", "날짜나 새 메시지 구분선."],
      ["PresenceAvatar name · tone · avatar · state · size", "Face, \"xs\" | \"sm\" | \"md\" | \"lg\"", "\"md\"", "사진이나 첫 글자에 상태 점."],
    ] },
  ],
  projects: [
    {
      type: "api",
      title: "<ProjectCards>",
      rows: [
        ["items", "ProjectCardItem[]", "", "카드 목록입니다. 한 장은 `{ id, name, value, max?, badge?, owner?, meta?, aside? }`이고 `value`·`max`가 진행 막대가 됩니다."],
        ["value · onSelect", "string · (id) => void", "", "고른 카드의 `id`와 카드를 눌렀을 때 부르는 함수입니다."],
        ["onNew · newLabel", "() => void · string", "· \"새 프로젝트\"", "주면 끝에 점선 카드가 생깁니다."],
      ],
    },
    {
      type: "api",
      title: "<ProjectHeader>",
      rows: [
        ["name · goal", "string · ReactNode", "", "프로젝트 이름과 목표 한 문장입니다."],
        ["value · max", "number · number", "· 100", "완료한 양과 전체입니다."],
        ["owner · meta · badge", "Face · ReactNode · ReactNode", "", "이름 옆의 담당 아바타, 보조 정보, 오른쪽 끝 배지입니다."],
        ["actions", "ReactNode", "", "진행 막대 아래 버튼 자리입니다."],
      ],
    },
    {
      type: "api",
      title: "<Lane>",
      rows: [
        ["title", "string", "", "줄의 제목이자 `section`의 이름입니다."],
        ["value · max", "number · number", "· 100", "주면 제목 옆에 짧은 진행 막대가 생깁니다."],
        ["meta · badge", "ReactNode[] · ReactNode", "", "제목 옆에 차례로 놓이는 보조 정보와 배지입니다."],
        ["children", "ReactNode", "", "줄의 본문입니다. 보통 `lane`을 켠 `Kanban`입니다."],
      ],
    },
  ],
  kanban: [
    { type: "api", title: "<Kanban>", rows: [
      ["columns", "{ id, title, dot?, empty?, cards }[]", "", "칸과 카드. 카드는 { id, title, key?, assignee?, tags?, replies?, meta?, working? }."],
      ["value · onSelect", "string, (id) => void", "", "선택된 카드와 누를 때 이벤트."],
      ["onMove", "(id, column) => void", "", "카드를 다른 칸에 놓았을 때. 없으면 끌 수 없습니다."],
      ["onAdd · addLabel", "(column) => void, string", "\"추가\"", "칸 머리의 + 버튼."],
      ["heads · lane", "boolean", "true · false", "칸 머리를 숨기고 줄(swimlane)로 씁니다. KanbanHeads로 머리를 한 번만 그립니다."],
    ] },
  ],
  annotator: [
    { type: "api", title: "<Annotator>", rows: [
      ["anchors", "{ id, quote, resolved? }[]", "[]", "형광펜을 칠할 문장. 마크다운 기호와 공백은 무시하고 찾습니다."],
      ["active · onPick", "string, (id) => void", "", "강조할 주석과 형광펜을 누를 때 이벤트."],
      ["onQuote · quoteLabel", "(quote) => void, string", "\"댓글\"", "드래그한 문장에 뜨는 버튼과 누를 때 이벤트. 편집 중인 블록에서도 씁니다."],
      ["actions · onAction", "{ id, label, icon? }[], (id, quote) => void", "[]", "선택 버튼 옆에 붙는 추가 동작. 예: 인용으로 티켓 만들기."],
    ] },
    { type: "api", title: "<CommentCard> · <ReviewBar> · <DiffView>", rows: [
      ["CommentCard quote · name · text · replies", "string, string, ReactNode, { name, time?, text }[]", "", "인용, 작성자, 의견, 답."],
      ["CommentCard resolved · active · onResolve · onReply · onPick", "boolean, () => void", "", "해결 상태, 강조, 버튼 이벤트."],
      ["CommentCard suggestion · onApply · footer", "string, () => void, ReactNode", "", "수정 제안과 반영 버튼, 카드 아래 덧붙일 내용(평가 버튼 등)."],
      ["ReviewBar reviewers · aside", "{ name, label, badge? }[], ReactNode", "", "리뷰어별 상태 배지와 오른쪽 요약."],
      ["DiffView lines · empty", "{ kind: \"same\" | \"add\" | \"del\", text }[], string", "", "줄 단위 비교. 바뀐 줄이 없으면 empty 문구."],
    ] },
  ],
  "progress-bar": [
    {
      type: "api",
      title: "<ProgressBar>",
      rows: [
        ["label", "string", "", "무엇이 진행되는지입니다. 스크린리더가 읽고 툴팁으로도 보입니다."],
        ["value · max", "number · number", "· 100", "끝난 양과 전체입니다. 완료 조건 5개 중 3개가 그 예입니다."],
        ["length", "\"fill\" | \"short\"", "\"fill\"", "`fill`은 줄의 남은 너비를 채우고, `short`는 글 옆에 짧은 고정 막대로 둡니다."],
      ],
    },
  ],
  meter: [
    {
      type: "api",
      title: "<Meter>",
      rows: [
        ["label", "ReactNode", "", "무엇을 재는지입니다."],
        ["value · max", "number", "max 100", "사용한 양과 전체입니다."],
        ["target", "number", "", "계획한 양에 표시를 그립니다."],
        ["format", "(value: number) => string", "toLocaleString", "값과 전체의 형식입니다."],
        ["status", "\"good\" | \"warning\" | \"critical\"", "", "막대 색을 바꾸고 아이콘과 이름표를 더합니다. 중립이면 생략합니다."],
        ["note", "ReactNode", "", "막대 아래 보조 문장입니다."],
      ],
    },
  ],
  stat: [
    {
      type: "api",
      title: "<Stat>",
      rows: [
        ["label", "ReactNode", "", "값 위의 이름표입니다. 위젯 안에서는 제목줄이 이름을 대신하므로 생략합니다."],
        ["value", "ReactNode", "", "형식을 맞춘 큰 값입니다."],
        ["delta", "{ change, goodWhenUp?, neutral?, label }", "", "`change`는 비율(0.063 = 6.3%)입니다. 기본은 오르면 좋음이고, `neutral`이면 좋고 나쁨 색 없이 변화만 보여 줍니다."],
        ["note", "string", "", "값 아래 보조 문장입니다."],
        ["trend", POINTS, "", "있으면 스파크라인을 그립니다."],
        ["color", COLOR, "1", "스파크라인 마지막 점의 색입니다."],
      ],
    },
    {
      type: "api",
      title: "<Delta>",
      rows: [
        ["change", "number", "", "비율(0.063 = 6.3%)입니다. 부호에 따라 위·아래 화살표 아이콘을 붙입니다."],
        ["goodWhenUp", "boolean", "true", "`false`면 내린 변화를 좋은 색으로 칠합니다."],
      ],
    },
  ],
  segmented: [
    {
      type: "api",
      title: "<Segmented>",
      description: "`value`를 주면 부모가 상태를 들고, `defaultValue`만 주면 컴포넌트가 들고 있습니다.",
      rows: [
        ["options", "{ value, label, lang? }[]", "", "선택지입니다."],
        ["value · defaultValue", "string", "첫 선택지", "선택된 값입니다."],
        ["label", "string", "", "그룹의 접근성 이름입니다."],
        ["onChange", "(value) => void", "", "다른 값을 고를 때 호출됩니다."],
      ],
    },
  ],
  board: [
    {
      type: "api",
      title: "<Board>",
      description: "`<Widget>` 태그로 감싼 내용을 보드에 놓습니다. 보드는 배치가 어디에 저장되는지 모릅니다. 배치는 `initialLayout`으로 받고, 바뀔 때마다 `onLayoutChange`를, 변경이 `commitDelay` 동안 멈추면 마지막 배치로 `onLayoutCommit`을 한 번 알립니다. 페이지를 닫거나 다른 탭으로 가면 남은 커밋을 곧바로 알립니다. 저장 위치, 실패 처리, 재시도는 이벤트를 받는 앱이 정합니다.",
      rows: [
        ["children", "<Widget>…", "", "위젯들입니다. 태그 순서가 처음 배치 순서입니다."],
        ["initialLayout", "LayoutItem[]", "", "앱이 어딘가(브라우저, 서버)에서 불러와 넘기는 배치입니다. 나중에 도착해도 사용자가 아직 배치를 바꾸지 않았으면 적용하고, 위젯 목록이 다르면 무시합니다. 없으면 태그 순서대로 놓습니다."],
        ["onLayoutChange", "(layout) => void", "", "옮기기, 크기 조절, 숨기기, 추가, 초기화 때마다 새 배치를 알립니다."],
        ["onLayoutCommit", "(layout) => void", "", "변경이 멈춘 뒤 마지막 배치를 한 번 알립니다. 서버 저장은 여기서 합니다."],
        ["commitDelay", "number", "1500", "마지막 변경 뒤 이만큼(ms) 조용하면 커밋을 알립니다."],
        ["toolbar", "ReactNode", "", "도구 막대 왼쪽에 둘 필터 같은 조작입니다."],
        ["actions", "boolean", "true", "위젯 추가·배치 초기화 버튼을 그립니다."],
        ["busy", "boolean", "false", "새 데이터를 불러오는 동안 이전 화면을 반투명하게 둡니다."],
        ["motion", "boolean", "true", "등장 움직임입니다. false면 꺼집니다. 위젯이 차례로 나타나고, 숫자가 굴러 올라가며, 막대·선·Meter가 그려집니다."],
      ],
    },
    {
      type: "api",
      title: "<Widget>",
      description: "보드 안에서는 끌어 옮기고 크기를 바꾸는 위젯이 되고, 보드 밖에서는 제목이 있는 카드로 그려집니다.",
      rows: [
        ["id · title", "string", "", "저장되는 고유 이름과 제목줄 제목입니다."],
        ["subtitle", "ReactNode", "", "제목 옆 보조 문구입니다."],
        ["w · h", "number", "", "처음 크기입니다. 열(1~12)과 행 단위입니다."],
        ["minW · minH · maxH", "number", "2 · 2 · 10", "크기 조절 범위입니다."],
        ["children", "ReactNode", "", "본문입니다. 차트, 숫자 카드, 표를 그대로 넣습니다."],
        ["table", "() => DataTableProps", "", "있으면 `표` 버튼이 생기고, 같은 데이터를 `<DataTable>`로 보여 줍니다."],
      ],
    },
    {
      type: "api",
      title: "<AppShell>",
      description: "왼쪽 사이드바와 상단 바가 있는 앱 틀입니다. 자기 너비가 1024px보다 좁으면 사이드바를 숨기고, 상단 바의 메뉴 버튼이 같은 목록을 왼쪽에서 밀려 나오는 서랍으로 엽니다. 서랍은 바깥을 누르거나 Esc로 닫힙니다.",
      rows: [
        ["brand", "ReactNode", "", "사이드바 맨 위의 이름입니다."],
        ["nav", "{ title?, items: { id, label, icon, current?, onSelect? }[] }[]", "", "묶음별 메뉴입니다. `current`인 항목에 `aria-current`가 붙습니다."],
        ["title · actions", "ReactNode", "", "상단 바의 제목과 오른쪽 버튼입니다."],
        ["children", "ReactNode", "", "본문입니다. 본문만 스크롤되고 사이드바와 상단 바는 그대로 있습니다."],
        ["mobileNav", "\"drawer\" | \"tabs\"", "\"drawer\"", "1024px보다 좁을 때의 메뉴입니다. `tabs`면 아래 탭 바로, `drawer`면 왼쪽 서랍으로 보입니다."],
        ["tabBar", "{ variant?, labels? }", "", "`tabs`일 때 탭 바의 모양입니다. `TabBar`와 같은 값을 씁니다."],
      ],
    },
  ],
  "line-chart": [
    {
      type: "api",
      title: "<LineChart>",
      rows: [
        ["series", "{ name, points, color?, dashed?, area?, flagBreaches? }[]", "", `색을 생략하면 순서대로 슬롯 1, 2, 3입니다. ${COLOR_NOTE}`],
        ["format", "{ axis, value?, date? }", "", "축 눈금, 툴팁·끝점 값, 툴팁 날짜 형식입니다."],
        ["categories", "string[]", "", "범주 축의 이름입니다. 점의 t는 시간 대신 이 목록의 순번입니다."],
        ["band", "{ name, lower, upper, color? }", "", "예측 구간처럼 위아래 경계 사이를 칠합니다."],
        ["threshold", "{ value, label, breach, direction? }", "", "임계선입니다. `flagBreaches` 시리즈의 초과 지점을 표시하고 툴팁에 `breach`를 붙입니다. `direction: \"below\"`면 선 아래 값이 초과입니다."],
        ["baseline", "number", "", "기준선입니다. 지수 비교의 100처럼 씁니다."],
        ["annotations", "{ t, label }[]", "[]", "사건을 세로선으로 표시합니다. 라벨이 겹치면 뒤의 것을 생략합니다."],
        ["endLabels", "boolean", "true", "선 끝에 이름과 마지막 값을 적습니다. 겹치면 생략합니다."],
        ["title", "string", "", "스크린리더용 차트 이름입니다."],
      ],
    },
  ],
  "bar-chart": [
    {
      type: "api",
      title: "<BarChart>",
      rows: [
        ["points", POINTS, "", "막대 데이터입니다."],
        ["name", "string", "", "툴팁의 데이터 이름입니다."],
        ["categories", "string[]", "", "범주 축의 이름입니다. 점의 t는 시간 대신 이 목록의 순번입니다."],
        ["color", COLOR, "1", COLOR_NOTE],
        ["colorOf", "(point, index) => Color", "", "막대별 색입니다. 이번 기간만 강조할 때 씁니다."],
        ["format", "{ axis, value?, date? }", "", "축 눈금, 툴팁 값, 툴팁 날짜 형식입니다."],
        ["title", "string", "", "스크린리더용 차트 이름입니다."],
      ],
    },
  ],
  heatmap: [
    {
      type: "api",
      title: "<Heatmap>",
      rows: [
        ["rows · columns", "string[] · C[]", "", "행 라벨과 열 값입니다."],
        ["values", "(number | null)[][]", "", "`values[행][열]`입니다. `null` 칸은 그리지 않습니다."],
        ["format", "{ value, column?, cell? }", "", "값, 열 라벨, 툴팁 제목 `(row, col) => string` 형식입니다. 열 라벨이 빈 문자열이면 생략합니다."],
        ["labelEvery", "number", "자동", "열 라벨 간격입니다."],
        ["ramp", '"sequential" | "sequential-main"', '"sequential"', "색 단계 토큰 묶음입니다."],
        ["zeroIsEmpty", "boolean", "false", "0을 '없음'으로 보고 회색으로 칠합니다."],
        ["title", "string", "", "스크린리더용 차트 이름입니다."],
      ],
    },
  ],
  sparkline: [
    {
      type: "api",
      title: "<Sparkline>",
      rows: [
        ["points", POINTS, "", "추이 데이터입니다."],
        ["color", COLOR, "1", "마지막 값 점의 색입니다. 선은 항상 회색입니다."],
      ],
    },
  ],
  diagram: [
    {
      type: "api",
      title: "<Diagram>",
      rows: [
        ["title", "string", "필수", "도면의 이름입니다. 접근성 이름과 빌드한 SVG의 제목이 됩니다."],
        ["id", "string", "", "빌드한 파일 이름입니다. 없으면 제목에서 만듭니다."],
        ["direction", '"right" | "down"', '"right"', "흐름 방향입니다."],
        ["flow", '"packets" | "dots" | "pulses" | "both"', '"packets"', "움직임 프리셋입니다. 단계별 아이콘 이동, 점선 흐름, 화살표마다 점 하나가 흐름, 아이콘과 점선 함께."],
        ["motion", "boolean", "true", "등장 움직임을 켭니다. 노드가 차례로 나타나고, 노드 안 Stat 숫자가 굴러 올라가며, Meter와 선 차트가 그려집니다."],
        ["children", "Diagram.Group · Diagram.Node · Diagram.Arrow", "", "도면을 이루는 태그입니다."],
      ],
    },
    {
      type: "api",
      title: "<Diagram.Group> · <Diagram.Node>",
      rows: [
        ["id · label", "string", "필수", "노드와 그룹의 이름입니다. 화살표는 `id`로 잇습니다."],
        ["caption", "string", "", "노드 이름 아래 보조 문구입니다."],
        ["col · row", "number", "자동", "격자 칸을 직접 지정합니다(0부터). 한 화면에 꽉 차게 배치할 때 씁니다. 그룹은 한 멤버만 지정해도 같은 열을 씁니다."],
        ["lane", "string", "", "같은 이름의 노드를 가로 띠로 모읍니다. 예: client, app, data. 처음 나온 순서로 위에서 아래로 쌓입니다."],
        ["icon", "IconName", "", "노드 왼쪽 아이콘입니다. 그룹 안이면 그룹 색을 씁니다."],
        ["children", "ReactNode", "", "그룹은 노드를, 노드는 어떤 컴포넌트든 담습니다."],
      ],
    },
    {
      type: "api",
      title: "<Diagram.Arrow>",
      rows: [
        ["from · to", "string", "필수", "잇는 두 노드의 `id`입니다."],
        ["label", "string", "", "화살표 가운데 라벨입니다."],
        ["step", "number", "", "단계 번호입니다. 같은 번호는 함께 움직이고 번호는 한 번만 그립니다."],
        ["packet", "IconName", "", "이 단계에 화살표를 따라 이동할 아이콘입니다."],
        ["motion", '"packet" | "dots" | "pulse" | "dots-pulse" | "still"', "도면의 flow", "이 화살표만의 움직임입니다. `pulse`는 빛나는 점 하나가 일정한 속도로 흐르고, `dots-pulse`는 흐르는 점선 속에서 점 하나가 커진 채 같은 속도로 함께 흐릅니다."],
        ["dashed", "boolean", "false", "점선 화살표입니다."],
      ],
    },
  ],
  infographic: [
    {
      type: "api",
      title: "<Infographic>",
      rows: [
        ["title", "string", "필수", "포스터 제목입니다. 빌드한 SVG의 제목이 됩니다."],
        ["id", "string", "", "빌드한 파일 이름입니다."],
        ["lede", "string", "", "제목 아래 한 문장입니다."],
        ["motion", "boolean", "true", "등장 움직임을 켭니다. 패널이 차례로 나타나고, 패널 안 도면과 숫자가 그 순서를 따릅니다."],
        ["children", "Infographic.Panel", "", "패널 태그입니다."],
      ],
    },
    {
      type: "api",
      title: "<Infographic.Panel>",
      rows: [
        ["title", "string", "필수", "패널 제목입니다."],
        ["icon", "IconName", "", "패널 색으로 그려지는 큰 아이콘입니다."],
        ["message", "string", "", "패널의 결론을 한 문장으로 씁니다."],
        ["children", "ReactNode", "", "Diagram이나 어떤 컴포넌트든 넣습니다."],
      ],
    },
  ],
  table: [
    {
      type: "api",
      title: "<DataTable>",
      rows: [
        ["columns", "{ label, numeric? }[]", "", "`numeric` 열은 오른쪽 정렬과 고정폭 숫자를 씁니다."],
        ["rows", "Cell[][]", "", "칸은 문자열이거나 `{ text?, color?, swatch?, className?, delta?, render? }`입니다. `delta`는 `<Delta>`처럼 증감을 화살표 아이콘과 함께 그립니다. `render`는 스파크라인처럼 칸에 넣을 요소를 돌려줍니다."],
      ],
    },
  ],
  modal: [{ type: "api", title: "<Modal>", rows: [...DIALOG_PROPS, ["size", '"sm" | "md" | "lg"', '"md"', "모달 너비입니다."]] }],
  "command-palette": [
    {
      type: "api",
      title: "<CommandPalette>",
      rows: [
        ["groups", "{ title, items: CommandItem[] }[]", "", "묶음별 결과입니다. 맞는 항목이 없는 묶음은 숨깁니다."],
        ["CommandItem", "{ id, label, detail?, icon?, hint?, always? }", "", "`label`로 거르고, `always`면 늘 보입니다. `hint`는 오른쪽 단축키입니다."],
        ["onSelect · onQuery", "(id: string) => void · (query: string) => void", "", "항목을 고르면 `onSelect` 뒤에 `onClose`가 불립니다. 검색어가 바뀌면 `onQuery`가 불립니다."],
        ["placeholder · empty", "string · ReactNode", "i18n `palette.search` · `palette.empty`", "입력 안내와 결과가 없을 때 문구입니다."],
        ["footer", "ReactNode[]", "i18n 이동·열기·닫기", "바닥 줄의 키 안내입니다."],
        ["open · onClose", "boolean · () => void", "true", "창을 열고 닫습니다. 열 때마다 검색어를 비웁니다."],
        ["inline", "boolean", "false", "창으로 띄우지 않고 그 자리에 그립니다. 문서와 미리보기에 씁니다."],
      ],
    },
  ],
  viewer: [
    {
      type: "api",
      title: "<Viewer>",
      rows: [
        ["title · icon", "string · IconName", "\"\" · \"file\"", "머리 줄의 이름과 아이콘입니다. 이름은 창의 접근 가능한 이름도 됩니다."],
        ["meta", "ReactNode", "", "이름 아래 작은 글씨입니다. 종류·수정 시각처럼 짧게 씁니다."],
        ["tools · actions", "ReactNode · ReactNode", "", "이름 옆 도구와 오른쪽 동작입니다. 닫기 버튼은 동작 끝에 늘 붙습니다."],
        ["aside", "ReactNode", "", "오른쪽 칸입니다. 있으면 본문 시트와 나란히 놓입니다."],
        ["wide", "boolean", "false", "본문 시트를 880px로 줄이지 않고 칸을 꽉 채웁니다."],
        ["open · onClose", "boolean · () => void", "true", "창을 열고 닫습니다. Esc·바깥 클릭·닫기 버튼이 `onClose`를 부릅니다."],
        ["inline", "boolean", "false", "창으로 띄우지 않고 그 자리에 그립니다. 문서와 미리보기에 씁니다."],
        ["children", "ReactNode", "", "가운데 시트에 놓일 파일 내용입니다."],
      ],
    },
  ],
  confirm: [
    {
      type: "api",
      title: "useConfirm()(props) → Promise<boolean>",
      rows: [
        ["title · description · body", "", "", "모달과 같습니다."],
        ["confirmLabel", "string", "페이지 언어의 '확인'", "확정 버튼 문구입니다. 결과를 말하는 동사로 씁니다."],
        ["cancelLabel", "string", "페이지 언어의 '취소'", "취소 버튼 문구입니다. 처음 포커스가 여기에 있습니다."],
        ["danger", "boolean", "false", "확정 버튼을 위험 색으로 바꿉니다."],
      ],
    },
  ],
  sheet: [
    { type: "api", title: "<Sheet>", rows: DIALOG_PROPS },
    {
      type: "api",
      title: "<ActionList>",
      rows: [
        ["items", "{ id, label }[]", "", "선택지입니다. 한 줄에 하나씩 가로를 꽉 채웁니다."],
        ["onSelect", "(id: string) => void", "", "고른 항목의 id로 호출됩니다."],
      ],
    },
  ],
  tooltip: [
    {
      type: "api",
      title: "<Tooltip>",
      rows: [
        ["label", "string", "", "보여 줄 문구입니다. 넘긴 문자열 그대로 두 줄까지 줄바꿈하고, 넘치면 말줄임합니다."],
        ["children", "ReactElement", "", "툴팁을 붙일 요소 하나입니다. `aria-describedby`를 받아 스크린리더가 문구를 설명으로 읽습니다."],
      ],
    },
  ],
  toast: [
    {
      type: "api",
      title: "useToast()(props) → ToastHandle",
      description: "핸들의 `update(props)`가 내용을 바꾸고 `dismiss()`가 닫습니다.",
      rows: [
        ["message", "string", "", "한 문장 메시지입니다."],
        ["status", '"info" | "good" | "warning" | "critical"', '"info"', "아이콘과 라벨이 함께 바뀝니다. `critical`은 경고로 읽힙니다."],
        ["action", "{ label, onClick? }", "", "실행 취소처럼 하나의 동작입니다. 누르면 토스트가 닫힙니다."],
        ["duration", "number (ms)", "4000 · 오류 8000", "0이면 직접 닫을 때까지 남습니다."],
      ],
    },
  ],
  icons: [
    {
      type: "api",
      title: "<Icon>",
      rows: [
        ["name", "IconName", "", "`assets/icons`의 파일 이름입니다. `iconNames`가 전체 목록입니다."],
        ["size", '"sm" | "md" | "lg"', '"md"', "`icon.size.*` 토큰 크기입니다."],
        ["label", "string", "", "있으면 `role=img`와 이름을 달고, 없으면 장식으로 보고 스크린리더에서 숨깁니다."],
      ],
    },
  ],
  slides: [
    {
      type: "api",
      title: "<Deck>",
      rows: [
        ["title", "string", "", "자료 이름입니다. 모든 장의 하단과 스크린리더 이름에 씁니다."],
        ["start", "number", "0", "처음 보여 줄 장의 번호(0부터)입니다."],
        ["grid", "boolean", "false", "격자선을 켠 채로 시작합니다. 안전 영역, 12열, 제목·내용·큰 글자·꼬리말 기준선을 그립니다. G 키나 격자 버튼으로 켜고 끕니다."],
        ["controls", "boolean", "true", "넘기기, 노트, 인쇄, 발표 버튼을 보여 줍니다. 한 장짜리 미리보기에서는 끕니다."],
        ["children", "ReactNode", "", "`Slide`나 레이아웃 컴포넌트를 순서대로 넣습니다."],
      ],
    },
    {
      type: "api",
      title: "<Slide>",
      rows: [
        ["tone", '"plain" | "dark" | "accent"', '"plain"', "배경 톤입니다. `dark`는 다크 테마 토큰을, `accent`는 강조색 배경을 씁니다."],
        ["source", "ReactNode", "", "하단 왼쪽의 출처입니다."],
        ["footer", "boolean", "true", "하단(출처, 자료 이름, 쪽 번호)을 보여 줍니다."],
        ["notes", "string", "", "발표자 노트입니다. `Deck`의 노트 버튼으로 엽니다."],
      ],
    },
    { type: "api", title: "<SlideHeader>", rows: [["kicker · title · subtitle", "ReactNode", "", "작은 머리말, 제목, 부제입니다."]] },
  ],
  "slide-layouts": [
    {
      type: "api",
      title: "공통",
      description: "모든 레이아웃이 `notes`와 `source`를 받고, `Slide`를 그립니다.",
      rows: [
        ["<TitleSlide>", "kicker · title · subtitle · meta · tone", "", "표지입니다. 하단은 그리지 않습니다."],
        ["<AgendaSlide>", "title · items · current?", "", "목차입니다. `current` 번째 항목을 강조합니다."],
        ["<SectionSlide>", "number? · title · subtitle? · tone", 'tone "dark"', "장 구분입니다."],
        ["<StatementSlide>", "kicker? · statement · detail? · tone", "", "한 문장 메시지입니다."],
        ["<MetricSlide>", "title · takeaway? · metrics", "", "`metrics`는 `{ label, value, delta?, note? }[]`이고 2~4개를 권합니다. 칸마다 `<Stat>`을 크게 그립니다."],
        ["<ChartSlide>", "title · takeaway? · aside? · children", "", "`children`에 차트를 넣습니다. `aside`는 오른쪽 480px 칸입니다."],
        ["<SplitSlide>", "title · takeaway? · left · right · ratio", '"1:1"', '`ratio`는 `"1:1"`, `"2:3"`, `"3:2"` 중 하나입니다.'],
        ["<CompareSlide>", "title · takeaway? · before · after", "", "`before`·`after`는 `{ label, body }`입니다. 오른쪽(`after`)을 강조색 테두리로 표시합니다."],
        ["<TimelineSlide>", "title · takeaway? · items", "", "`items`는 `{ date, title, body?, done? }[]`입니다. 끝난 단계는 강조색 점과 선으로 그립니다."],
        ["<TableSlide>", "title · takeaway? · table", "", "`table`은 `<DataTable>`의 props입니다. 한 장에 열 줄 안팎을 권합니다."],
        ["<QuoteSlide>", "quote · by? · role? · tone", "", "인용과 말한 사람입니다."],
        ["<ClosingSlide>", "title · items? · contact? · tone", 'tone "dark"', "정리 목록과 연락처를 담는 마지막 장입니다. 하단은 그리지 않습니다."],
      ],
    },
  ],
  "doc-frame": [
    {
      type: "api",
      title: "<Doc>",
      rows: [
        ["title · summary", "ReactNode", "", "제목과 결론 한 문장입니다."],
        ["meta", "{ status, authors, reviewers?, date, version? }", "", '`status`는 `"draft"`, `"review"`, `"final"`입니다.'],
        ["toc", "boolean", "true", "장 제목으로 목차를 그립니다."],
        ["printable", "boolean", "true", "오른쪽 위 인쇄 버튼을 보여 줍니다."],
      ],
    },
    {
      type: "api",
      title: "<DocSection> · <Ref>",
      rows: [
        ["<DocSection title id?>", "string", "", "장입니다. 안에 겹치면 하위 장이 되고, 번호는 두 단계까지 붙습니다."],
        ["<Ref to>", "string", "", "같은 문서의 요구사항 번호(`R2`)로 이어지는 링크입니다."],
      ],
    },
  ],
  tabbar: [
    {
      type: "api",
      title: "<TabBar>",
      rows: [
        ["variant", "\"bar\" | \"floating\"", "\"bar\"", "하단에 붙은 막대이거나, 떠 있는 알약 모양입니다."],
        ["labels", "\"show\" | \"active\" | \"hide\"", "\"show\"", "이름을 항상, 현재 탭만, 또는 숨겨서 보여 줍니다."],
        ["items", "{ id, label, icon, badge? }[]", "", "탭 목록입니다. 3~5개를 권합니다."],
        ["value · onChange", "string · (id) => void", "", "현재 탭과, 누른 탭의 id를 받는 함수입니다."],
        ["label", "string", "\"탐색\"", "스크린리더에 읽힐 메뉴 이름입니다."],
      ],
    },
  ],
  calendar: [
    {
      type: "api",
      title: "<Calendar>",
      rows: [
        ["value · onChange", "number | null · (day) => void", "", "고른 날(그날 0시의 밀리초)과, 날짜를 누르면 받는 함수입니다."],
        ["marks", "number[]", "[]", "점을 찍을 날입니다. 시각은 무시하고 날짜만 봅니다."],
        ["month", "number", "value 또는 today", "처음 보여 줄 달입니다."],
        ["today", "number", "Date.now()", "오늘로 표시할 날입니다. 예시·테스트에서 고정할 때 씁니다."],
        ["label", "string", "달 이름", "스크린리더에 읽힐 격자 이름입니다."],
      ],
    },
  ],
  "work-lists": [
    { type: "api", title: "<ActivityList>", rows: [
      ["items", "{ id, kind, author, tone?, avatar?, title, where?, time?, text, unread? }[]", "", "알림 한 줄씩입니다. `kind`는 mention · approval · reply · failure · file이고 아바타 모서리 아이콘과 색을 정합니다."],
      ["value · onSelect", "string, (id) => void", "", "고른 항목과 누를 때 이벤트입니다."],
      ["empty", "string", "\"없음\"", "항목이 없을 때 문구입니다."],
    ] },
    { type: "api", title: "<QueueList>", rows: [
      ["items", "{ id, from, tone?, avatar?, where?, text, active?, waiting? }[]", "", "처리 순서대로 놓은 항목입니다. `active`는 지금 하는 일, `waiting`은 답을 기다리는 일입니다."],
      ["title · empty", "string, string", "\"없음\"", "머리글과 빈 상태 문구입니다."],
    ] },
    { type: "api", title: "<DocList>", rows: [
      ["items", "{ id, title, meta?, badge?, reviewers?, aside? }[]", "", "문서 한 줄씩입니다. `reviewers`는 `ReviewBar`와 같은 `Reviewer[]`이고 `badge` 색이 테두리가 됩니다."],
      ["onSelect · empty", "(id) => void, string", "\"없음\"", "누를 때 이벤트와 빈 상태 문구입니다."],
    ] },
  ],
  "archive": [
    { type: "api", title: "<ArchiveCard>", rows: [
      ["title · count", "string, string", "", "머리글 제목과 오른쪽 알약입니다. `count`에는 \"메시지 88 → 1\"처럼 압축 정도를 씁니다."],
      ["sections", "{ label, entries: { text, meta?, badge? }[] }[]", "", "절마다 이름과 항목입니다. 진행·논의·결정·남은 일처럼 앱이 이름을 정합니다."],
      ["evidence · note", "ReactNode, string", "", "본문 끝의 근거 한 줄과 바닥 오른쪽 안내입니다."],
      ["actions · onAction", "{ id, label, variant? }[], (id) => void", "[]", "바닥 버튼과 누를 때 이벤트입니다. 버튼이 없으면 바닥을 그리지 않습니다."],
      ["draft", "boolean", "false", "초안이면 테두리를 강조하고 📦 아이콘을 붙입니다."],
    ] },
    { type: "api", title: "<ArchivePicker>", rows: [
      ["title · count", "string, string", "", "머리글 제목과 오른쪽 알약입니다."],
      ["columns", "[string, string, string, string]", "", "제목 · 진행 · 논의 · 상태 열 이름입니다."],
      ["rows", "{ id, title, progress?, discussion?, status?, excluded? }[]", "", "스레드 한 줄씩입니다. `excluded`면 체크를 끄고 `status` 배지로 제외 사유를 보입니다."],
      ["limit", "number", "Infinity", "포함·제외 묶음마다 보일 줄 수입니다. 남은 줄은 \"+ n개 더\" 한 줄로 접히고 그 줄의 체크가 숨은 줄을 함께 고르고, 일부만 골랐으면 `indeterminate`로 보입니다. 펼친 뒤에는 접기로 돌아갑니다."],
      ["value · defaultValue · onChange", "string[], string[], (value) => void", "제외 아닌 줄 모두", "고른 줄의 id입니다."],
      ["actions · onAction · note", "{ id, label, variant? }[], (id, value) => void, string", "[]", "바닥 버튼, 누를 때 고른 id와 함께 오는 이벤트, 바닥 오른쪽 안내입니다."],
    ] },
    { type: "api", title: "<ArchivedLine>", rows: [
      ["title · summary · meta", "string, string, string", "", "접힌 줄의 제목, 한 줄 요약, 오른쪽 메타입니다."],
      ["onOpen · onRestore", "() => void, () => void", "", "주면 \"열기\" · \"되돌리기\" 버튼이 생깁니다."],
    ] },
  ],
  "split-pane": [
    {
      type: "api",
      title: "<SplitPane>",
      rows: [
        ["direction", "\"row\" · \"column\"", "\"row\"", "칸을 가로로 놓을지 세로로 쌓을지 정합니다."],
        ["sizes", "number[]", "· 같은 비율", "칸마다 처음 비율입니다. 합이 1일 필요는 없습니다."],
        ["min", "number", "120", "손잡이로 줄일 수 있는 칸의 최소 px입니다."],
        ["onResize", "(sizes) => void", "", "손잡이를 놓거나 키로 옮긴 뒤 새 비율로 부릅니다."],
        ["children", "ReactNode", "", "칸입니다. 자식 하나가 칸 하나입니다."],
      ],
    },
    {
      type: "api",
      title: "<ResizeHandle>",
      rows: [
        ["orientation", "\"vertical\" · \"horizontal\"", "\"vertical\"", "세로 손잡이는 가로로, 가로 손잡이는 세로로 움직입니다."],
        ["onMove · onEnd", "(dx, dy) => void · () => void", "", "끌기를 시작한 곳에서 움직인 거리와, 끌기가 끝날 때 부르는 함수입니다."],
        ["label", "string", "· \"크기 조절\"", "손잡이의 이름입니다."],
      ],
    },
  ],
  panel: [
    {
      type: "api",
      title: "<Panel>",
      rows: [
        ["title · meta", "ReactNode · ReactNode", "", "헤더 한 줄의 제목과 보조 정보입니다. 넘치면 말줄임표로 줄입니다."],
        ["actions", "ReactNode", "", "헤더 오른쪽 끝의 버튼 자리입니다. 보통 `PanelAction`을 둡니다."],
        ["variant", "\"section\" | \"pane\"", "\"section\"", "`section`은 사이드바의 묶음, `pane`은 칸 하나를 채우고 본문만 스크롤합니다."],
        ["children", "ReactNode", "", "본문입니다."],
      ],
    },
    {
      type: "api",
      title: "<PanelAction>",
      rows: [
        ["icon · label", "IconName · string", "", "아이콘과 그 이름입니다. `label`은 툴팁과 접근성 이름이 됩니다."],
        ["onClick", "() => void", "", "눌렀을 때 부릅니다."],
      ],
    },
  ],
  "image-preview": [
    {
      type: "api",
      title: "<ImagePreview>",
      rows: [
        ["src · alt", "string · string", "", "이미지와 그 설명입니다. 열 수 있으면 `alt`가 툴팁으로도 보입니다."],
        ["onOpen", "() => void", "", "미리보기를 버튼으로 만듭니다. 뷰어에서 원본을 열 때 씁니다."],
      ],
    },
  ],
  image: [
    {
      type: "api",
      title: "<Image>",
      rows: [
        ["alt", "string", "", "대체 텍스트입니다."],
        ["src", "string", "", "이미지 주소입니다. 없으면 자리 표시를 그립니다."],
        ["seed", "number", "1", "자리 표시 색을 고르는 수입니다."],
        ["ratio", "\"1:1\" | \"3:4\" | \"4:3\" | \"16:9\"", "\"1:1\"", "가로세로 비율입니다."],
        ["fit · rounded", "\"cover\" | \"contain\" · boolean", "\"cover\" · false", "채우는 방식과 모서리 둥글림입니다."],
      ],
    },
    {
      type: "api",
      title: "<ImageCard>",
      rows: [
        ["image", "ImageProps", "", "카드의 이미지입니다. 비율 기본값은 4:3입니다."],
        ["title · description · meta", "string", "", "제목, 설명, 보조 정보입니다."],
        ["badge", "string", "", "이미지 위 왼쪽 위 배지입니다."],
        ["onSelect", "() => void", "", "있으면 카드 전체가 버튼이 됩니다."],
      ],
    },
    {
      type: "api",
      title: "<MiniCard>",
      rows: [
        ["image", "ImageProps", "", "정사각형 이미지입니다."],
        ["title · meta", "string", "", "한 줄로 잘립니다."],
        ["onSelect", "() => void", "", "있으면 카드가 버튼이 됩니다."],
      ],
    },
    {
      type: "api",
      title: "<Carousel>",
      rows: [
        ["children", "ReactNode", "", "슬라이드입니다. 자식 하나가 한 장입니다."],
        ["size", "\"full\" | \"card\" | \"mini\"", "\"full\"", "슬라이드 폭입니다. `full`은 한 장, `card`는 260px 이하 카드, `mini`는 104px 작은 카드입니다. 점 표시는 `full`에만 있습니다."],
        ["peek", "boolean", "true", "다음 슬라이드를 살짝 보여 줍니다."],
        ["label", "string", "", "캐러셀 이름입니다."],
      ],
    },
  ],
  social: [
    {
      type: "api",
      title: "<Avatar>",
      rows: [
        ["name · src", "string", "", "이름과 사진입니다. 사진이 없으면 첫 글자를 씁니다."],
        ["size", "\"sm\" | \"md\" | \"lg\"", "\"md\"", ""],
        ["ring", "\"new\" | \"seen\"", "", "스토리 테두리입니다."],
      ],
    },
    {
      type: "api",
      title: "<Stories>",
      rows: [
        ["items", "{ id, name, src?, seen? }[]", "", ""],
        ["onSelect", "(id) => void", "", ""],
      ],
    },
    {
      type: "api",
      title: "<Post>",
      rows: [
        ["author · avatar · place", "string", "", ""],
        ["photo", "ImageProps", "", "비율 기본값은 3:4입니다."],
        ["likes · liked", "number · boolean", "", "좋아요 수와 처음 상태입니다."],
        ["caption · comments · time", "string · number · string", "", ""],
        ["onLike · onComment · onShare · onSave", "(liked) => void · () => void", "", "누름 이벤트입니다."],
      ],
    },
    {
      type: "api",
      title: "<ProfileHeader>",
      rows: [
        ["name · handle · avatar · bio", "string", "", ""],
        ["stats", "{ label, value }[]", "[]", "숫자는 짧게 줄여 씁니다."],
        ["children", "ReactNode", "", "아래 버튼 줄입니다. `member`에서는 정보 목록 아래에 놓는 내용입니다."],
        ["variant", "\"social\" | \"member\"", "\"social\"", "`member`는 상태 점이 있는 아바타 옆에 이름을 두고, 아래에 버튼 줄과 정보 목록을 놓습니다."],
        ["tone · state", "number · Presence", "", "`member`에서 아바타 색과 상태 점입니다. `PresenceAvatar`와 같습니다."],
        ["role · status", "string · ReactNode", "", "`member`에서 이름 아래에 놓는 역할 배지와 상태 문구입니다."],
        ["actions", "ReactNode", "", "`member`에서 이름 아래 버튼 줄입니다."],
        ["facts", "{ label, value }[]", "[]", "`member`에서 `DescriptionList`로 보이는 정보입니다. 값은 고정폭 글꼴입니다."],
      ],
    },
    {
      type: "api",
      title: "<PhotoGrid>",
      rows: [
        ["items", "(ImageProps & { id })[]", "", "3열 정사각형 격자입니다."],
        ["onSelect", "(id) => void", "", ""],
      ],
    },
    {
      type: "api",
      title: "<List>",
      rows: [
        ["items", "{ id, title, description?, avatar?, meta? }[]", "", ""],
        ["onSelect", "(id) => void", "", ""],
        ["label", "string", "", ""],
      ],
    },
  ],
  markdown: [
    {
      type: "api",
      title: "<Markdown>",
      rows: [
        ["defaultValue · children", "string", "\"\"", "처음 마크다운입니다. 읽기 전용에서는 `children`으로 넘겨도 됩니다."],
        ["readOnly", "boolean", "false", "편집 도구 없이 같은 모양으로 보여 줍니다. 서버 렌더링·인쇄에도 씁니다."],
        ["imageHosts", "string[]", "", "외부 이미지를 불러올 호스트입니다. 주면 목록 밖 호스트의 이미지는 불러오지 않고 링크로 보여 줍니다. 남이 쓴 글을 보여 줄 때 보는 사람의 IP가 새지 않게 합니다."],
        ["onChange", "(markdown: string) => void", "", "고칠 때마다 표준 마크다운 전체를 넘깁니다."],
        ["data · formats · onAction", "데이터 맵 · 형식 함수 · 동작 처리기", "", "` ```ui ` 블록이 씁니다. ` ```mermaid `의 `xychart-beta`·`pie` 블록은 차트 컴포넌트로 그리고, 그 밖의 Mermaid는 코드로 둡니다."],
      ],
    },
  ],
  tree: [
    {
      type: "api",
      title: "<Tree>",
      rows: [
        ["items · label", "TreeItem[] · string", "", "줄 목록과 트리의 이름입니다. 한 줄은 `{ id, label, icon?, avatar?, tone?, state?, unread?, aside?, mark?, description?, children? }`입니다."],
        ["value · onSelect", "string · (id) => void", "", "고른 줄의 `id`와 하위 항목이 없는 줄을 눌렀을 때 부르는 함수입니다."],
        ["expanded · defaultExpanded", "string[] · string[]", "· 모두 펼침", "펼친 줄의 `id`입니다. `expanded`를 주면 밖에서 상태를 쥡니다."],
        ["onToggle", "(id, open) => void", "", "줄을 펼치거나 접을 때 부릅니다."],
        ["mono", "boolean", "false", "고정폭 글꼴의 낮은 줄로 그립니다. 파일 목록에 씁니다."],
      ],
    },
  ],
  tabs: [
    {
      type: "api",
      title: "<Tabs>",
      rows: [
        ["items", "{ id, label, icon?, badge?, disabled?, content? }[]", "", "탭 목록입니다. `content`가 있으면 선택한 탭의 내용을 아래에 그립니다."],
        ["value · defaultValue", "string", "첫 번째 켜진 탭", "현재 탭(제어)과 처음 탭(비제어)입니다."],
        ["onChange", "(id: string) => void", "", "다른 탭을 고르면 그 id를 받습니다."],
        ["variant", "\"line\" | \"pill\"", "\"line\"", "밑줄이거나 알약 모양입니다."],
        ["fill", "boolean", "false", "탭이 폭을 나눠 채웁니다."],
        ["orientation", "\"horizontal\" | \"vertical\"", "\"horizontal\"", "가로 줄이거나 세로 목록입니다. 세로면 ↑·↓로 옮깁니다."],
        ["label", "string", "", "스크린리더에 읽힐 탭 묶음 이름입니다."],
      ],
    },
  ],
  "description-list": [
    {
      type: "api",
      title: "<DescriptionList>",
      rows: [
        ["items", "{ label, value }[]", "", "이름과 값의 쌍을 순서대로 둡니다. `value`에는 글이나 아무 노드나 넣습니다."],
        ["align", "\"start\" | \"end\"", "\"start\"", "`end`는 값을 오른쪽에 맞춥니다. 좁은 패널의 숫자에 씁니다."],
      ],
    },
  ],
  badge: [
    {
      type: "api",
      title: "<Badge>",
      rows: [
        ["tone", "\"neutral\" | \"main\" | \"good\" | \"warning\" | \"critical\"", "\"neutral\"", "뜻에 맞는 색입니다."],
        ["variant", "\"soft\" | \"outline\" | \"solid\"", "\"soft\"", "옅은 바탕, 테두리, 채움입니다."],
        ["children", "ReactNode", "", "한두 단어나 숫자입니다."],
      ],
    },
  ],
  chip: [
    {
      type: "api",
      title: "<Chip>",
      rows: [
        ["label", "string", "", "보일 글입니다. 한 줄이고, 길면 말줄임표와 툴팁으로 보입니다."],
        ["icon", "IconName", "", "앞 아이콘입니다."],
        ["onSelect", "() => void", "", "칩을 버튼으로 만듭니다. 칩이 가리키는 항목을 열 때 씁니다."],
        ["onRemove", "() => void", "", "빼기 버튼을 붙입니다. \"{label} 빼기\"로 읽힙니다."],
      ],
    },
  ],
  card: [
    {
      type: "api",
      title: "<Card>",
      rows: [
        ["title · description", "ReactNode", "", "제목과 한 줄 설명입니다."],
        ["aside", "ReactNode", "", "제목 옆에 두는 배지나 버튼입니다."],
        ["selected", "boolean", "false", "고른 카드를 강조합니다."],
        ["onClick", "() => void", "", "주면 카드 전체가 누를 수 있는 버튼이 되고, `selected`가 눌림 상태로 읽힙니다."],
        ["children", "ReactNode", "", "카드 내용입니다."],
      ],
    },
  ],
  callout: [
    {
      type: "api",
      title: "<Callout>",
      rows: [
        ["tone", "\"info\" | \"good\" | \"warning\" | \"do\" | \"dont\"", "\"info\"", "알림, 팁, 주의, 권장, 지양입니다. 권장·지양은 제목을 생략하면 「권장」·「지양」이 붙습니다."],
        ["accent", "\"left\" | \"top\"", "\"left\"", "색 선 자리입니다. `left`는 본문 속 알림, `top`은 나란히 놓는 카드(권장·지양 등)에 씁니다."],
        ["title", "string", "", "굵은 제목입니다."],
        ["children", "ReactNode", "", "본문입니다."],
      ],
    },
  ],
  "takeaway": [
    {
      type: "api",
      title: "<Takeaway>",
      rows: [
        ["children", "ReactNode", "", "결론 한 문장입니다."],
      ],
    },
  ],
  "bullets": [
    {
      type: "api",
      title: "<Bullets>",
      rows: [
        ["items", "(string | { text, items? })[]", "", "두 단계까지의 목록입니다. 다섯 줄 안팎을 권합니다."],
      ],
    },
  ],
  "steps": [
    {
      type: "api",
      title: "<Steps>",
      rows: [
        ["items", "{ title, body? }[]", "", "번호와 화살표로 잇는 과정입니다. 3~5단계를 권합니다."],
      ],
    },
  ],
  "figure": [
    {
      type: "api",
      title: "<Figure>",
      rows: [
        ["caption", "ReactNode", "", "캡션입니다."],
        ["kind", "\"figure\" | \"table\"", "\"figure\"", "`table`이면 캡션이 위로 갑니다."],
        ["height", "number", "", "차트를 넣을 때 높이입니다."],
      ],
    },
  ],
  "code": [
    {
      type: "api",
      title: "<CodeBlock>",
      rows: [
        ["code", "string", "", "보여 줄 코드입니다."],
        ["lang", "\"tsx\" | \"html\" | \"json\" | \"sql\" | \"plain\"", "짐작", "문법 색을 고릅니다."],
        ["title", "string", "", "파일 이름 같은 머리말입니다."],
      ],
    },
  ],
  "code-editor": [
    {
      type: "api",
      title: "<CodeEditor>",
      rows: [
        ["value", "string", "", "제어 모드의 코드입니다. 주면 `onChange`로 바꿔 줍니다."],
        ["defaultValue", "string", "\"\"", "비제어 모드의 처음 코드입니다."],
        ["onChange", "(value: string) => void", "", "코드가 바뀔 때 부릅니다."],
        ["lang", "CodeLang", "\"tsx\"", "문법 색을 고릅니다. 파일 이름에서는 `langOf(path)`로 얻습니다."],
        ["start", "number", "1", "첫 줄 번호입니다."],
        ["focus", "number[]", "[]", "굵게 보일 줄 번호입니다."],
        ["label", "string", "\"코드\"", "편집 영역의 접근성 이름입니다."],
        ["readOnly", "boolean", "false", "고칠 수 없게 합니다. 선택과 복사는 됩니다."],
      ],
    },
  ],
  "requirement-table": [
    {
      type: "api",
      title: "<RequirementTable>",
      rows: [
        ["items", "{ text, priority, status?, note? }[]", "", "`priority`는 `must`·`should`·`could`, `status`는 `open`·`done`·`dropped`입니다."],
        ["prefix", "string", "\"R\"", "번호 앞 글자입니다. R1, R2…가 붙습니다."],
      ],
    },
  ],
  "options": [
    {
      type: "api",
      title: "<Options>",
      rows: [
        ["children", "<Option>…", "", "선택지 카드들입니다. 개수만큼 열을 나눕니다."],
      ],
    },
    {
      type: "api",
      title: "<Option>",
      rows: [
        ["name", "ReactNode", "", "선택지 이름입니다."],
        ["chosen", "boolean", "false", "고른 안입니다. 강조 테두리와 「선택함」 배지가 붙습니다."],
        ["children", "ReactNode", "", "요약 문장, `<Pros>`·`<Cons>`, 숫자 카드, 코드처럼 안에 그릴 모든 것을 태그로 씁니다."],
      ],
    },
    {
      type: "api",
      title: "<Pros> · <Cons>",
      rows: [
        ["children", "ReactNode", "", "장점·단점 목록입니다. 자식 하나가 한 줄이 되고, 글 대신 배지 같은 컴포넌트도 됩니다."],
      ],
    },
  ],
  "changelog": [
    {
      type: "api",
      title: "<ChangeLog>",
      rows: [
        ["items", "{ version, date, author, note }[]", "", "버전마다 한 줄입니다."],
      ],
    },
  ],
  "resume": [
    {
      type: "api",
      title: "<Resume>",
      rows: [
        ["name · role", "string", "", "이름과 직무입니다."],
        ["contacts", "{ label, href? }[]", "[]", "연락처입니다. `href`가 있으면 링크가 됩니다."],
        ["summary", "ReactNode", "", "한두 문장 소개입니다."],
        ["density", "\"comfortable\" | \"compact\"", "\"comfortable\"", "`compact`는 본문 14px, 줄 간격 1.5, 좁은 간격으로 한 쪽에 글을 더 넣습니다. 포트폴리오는 이미지 칸도 좁아집니다."],
        ["printable", "boolean", "true", "인쇄 버튼을 보여 줍니다."],
      ],
    },
    {
      type: "api",
      title: "<ResumeSection> · <ResumeEntry>",
      rows: [
        ["<ResumeSection title>", "string", "", "경력·학력 같은 묶음입니다."],
        ["<ResumeEntry>", "title? · org? · period? · place? · items? · tags?", "", "한 항목입니다. `items`는 성과 목록, `tags`는 기술 배지입니다."],
      ],
    },
  ],
  "portfolio": [
    {
      type: "api",
      title: "<Portfolio>",
      rows: [
        ["name · role · intro", "string · string · ReactNode", "", "이름, 직무, 소개입니다."],
        ["contacts", "{ label, href? }[]", "[]", "연락처입니다."],
        ["density", "\"comfortable\" | \"compact\"", "\"comfortable\"", "`compact`는 본문 14px, 줄 간격 1.5, 좁은 간격으로 한 쪽에 글을 더 넣습니다. 포트폴리오는 이미지 칸도 좁아집니다."],
        ["printable", "boolean", "true", "인쇄 버튼을 보여 줍니다."],
      ],
    },
    {
      type: "api",
      title: "<PortfolioSection> · <Project>",
      rows: [
        ["<PortfolioSection title>", "string", "", "프로젝트 묶음입니다."],
        ["<Project>", "title · period? · role? · image? · summary? · metrics? · tags?", "", "`metrics`는 `{ label, value }[]`로 `Stat`이 그리고, `tags`는 기술 배지입니다."],
      ],
    },
  ],
  "textfield": [
    {
      type: "api",
      title: "<TextField>",
      rows: [
        ["label", "string", "", "이름표입니다. 꼭 넣습니다."],
        ["hideLabel", "boolean", "false", "이름표를 화면에서만 숨깁니다."],
        ["value · defaultValue · onChange", "string · string · (value) => void", "", "제어·비제어 값과, 글이 바뀔 때 받는 함수입니다."],
        ["type", "\"text\" | \"search\" | \"email\" | …", "\"text\"", "입력 종류입니다."],
        ["icon · placeholder · hint · disabled", "", "", "앞 아이콘, 자리 표시 글, 아래 도움말, 꺼짐입니다."],
      ],
    },
  ],
  "checkbox": [
    {
      type: "api",
      title: "<Checkbox>",
      rows: [
        ["label", "string", "", "고를 내용입니다. 한 줄이고, 길면 말줄임표와 툴팁으로 보입니다."],
        ["checked · defaultChecked · onChange", "boolean · boolean · (checked) => void", "", "제어·비제어 상태와, 바뀔 때 받는 함수입니다."],
        ["disabled", "boolean", "false", "고를 수 없게 끕니다."],
      ],
    },
  ],
  "select": [
    {
      type: "api",
      title: "<Select>",
      rows: [
        ["label", "string", "", "이름표입니다. 꼭 넣습니다."],
        ["hideLabel", "boolean", "false", "이름표를 화면에서만 숨깁니다."],
        ["options", "{ value, label }[]", "", "고를 항목을 순서대로 둡니다. 빈 `value`는 \"없음\"을 뜻합니다."],
        ["value · defaultValue · onChange", "string · string · (value) => void", "", "제어·비제어 선택값과, 바뀔 때 받는 함수입니다."],
        ["disabled", "boolean", "false", "고를 수 없게 끕니다."],
      ],
    },
  ],
  "multi-select": [
    {
      type: "api",
      title: "<MultiSelect>",
      rows: [
        ["label", "string", "", "목록 이름입니다. `legend`로 그립니다."],
        ["items", "{ id, label, description?, avatar?, tone?, locked? }[]", "", "고를 항목입니다. `avatar`나 `tone`이 있으면 얼굴을 그리고, `locked`는 바꿀 수 없습니다."],
        ["value · defaultValue · onChange", "string[] · string[] · (value) => void", "", "제어·비제어 선택값과, 바뀔 때 받는 함수입니다."],
        ["selectAllLabel", "string", "", "주면 고를 항목이 둘 이상일 때 전체 선택 줄을 맨 위에 둡니다."],
      ],
    },
  ],
  "drop-zone": [
    {
      type: "api",
      title: "<DropZone>",
      rows: [
        ["label", "string", "", "파일을 끌어 올리는 동안 영역 위에 보일 문장입니다. 파일이 어디로 가는지 적습니다."],
        ["onFiles", "(files: File[]) => void", "", "놓은 파일을 받습니다. 올리기는 앱이 합니다."],
        ["children", "ReactNode", "", "파일을 받을 영역입니다. 메시지 입력창이 그 예입니다."],
      ],
    },
  ],
  "toc": [
    {
      type: "api",
      title: "<Toc>",
      rows: [
        ["items", "{ id, label }[]", "", "장 목록입니다. `id`는 페이지 안 요소의 id입니다."],
        ["title", "string", "\"이 페이지에서\"", "목차 이름입니다."],
        ["current", "string", "", "강조할 장을 직접 정합니다. 없으면 스크롤 위치로 고릅니다."],
        ["offset", "number", "96", "머리줄 높이처럼, 장이 지나갔다고 볼 위쪽 거리입니다."],
        ["onSelect", "(id) => void", "", "누를 때 부릅니다. 없으면 그 장으로 스크롤합니다."],
      ],
    },
  ],
  "pager": [
    {
      type: "api",
      title: "<Pager>",
      rows: [
        ["previous · next", "{ label, href?, onSelect? }", "", "앞뒤 페이지입니다. `href`가 있으면 링크, 없으면 버튼입니다."],
        ["label", "string", "\"페이지\"", "스크린리더에 읽힐 이름입니다."],
      ],
    },
  ],
  "appshell": [
    {
      type: "api",
      title: "<AppShell>",
      rows: [
        ["brand · title · actions", "ReactNode", "", "메뉴 위 이름, 머리줄 가운데, 머리줄 오른쪽입니다."],
        ["nav", "{ title?, items: { id, label, icon?, href?, sub?, current?, onSelect? }[] }[]", "", "왼쪽 메뉴입니다. `href`가 있으면 링크, `sub`가 같은 항목은 한 묶음으로 들여 씁니다. 비우면 메뉴 없이 그립니다."],
        ["navHeader", "ReactNode", "", "메뉴 위에 놓는 검색창 같은 것입니다."],
        ["aside", "ReactNode", "", "오른쪽 보조 칸(목차 등)입니다. 1280px보다 좁으면 숨깁니다."],
        ["scroll", "\"frame\" | \"page\"", "\"frame\"", "틀 안에서 스크롤할지, 페이지 전체가 스크롤될지입니다."],
        ["mobileNav · tabBar", "\"drawer\" | \"tabs\" · TabBarStyle", "\"drawer\"", "1024px보다 좁을 때 메뉴를 서랍으로 둘지 아래쪽 탭 바로 둘지입니다."],
      ],
    },
  ],
  "desktop-shell": [
    {
      type: "api",
      title: "<DesktopShell>",
      rows: [
        ["frame", "\"viewport\" | \"window\"", "\"viewport\"", "화면 전체를 채울지, 테두리 있는 창으로 그릴지입니다. `window`는 창 단추를 그립니다."],
        ["path", "ReactNode[]", "[]", "제목 줄의 경로입니다. 마지막이 굵게 보입니다."],
        ["search", "{ placeholder?, shortcut?, onOpen? }", "", "제목 줄 검색 단추입니다. 누르면 `onOpen`을 부릅니다."],
        ["titleActions", "ReactNode", "", "제목 줄 오른쪽 도구입니다."],
        ["rail · railFooter", "{ id, label, icon, current?, dot?, onSelect? }[]", "[]", "왼쪽 아이콘 레일의 위쪽·아래쪽 항목입니다. `dot`은 Presence 상태 점입니다."],
        ["sidebar · inspector", "ReactNode", "", "왼쪽·오른쪽 칸입니다. 비우면 칸과 경계선을 그리지 않습니다."],
        ["sizes", "{ sidebar?, inspector? }", "{ sidebar: 248, inspector: 300 }", "처음 너비(px)입니다."],
        ["onResize", "(sizes: { sidebar, inspector }) => void", "", "경계선을 놓을 때 새 너비를 알립니다."],
        ["status", "ReactNode", "", "맨 아래 상태 줄입니다."],
        ["overlay · overlayScope", "ReactNode · \"content\" | \"main\" | \"modal\"", "\"content\"", "본문 위 덮개입니다. `content`는 왼쪽 끝부터 인스펙터 앞까지, `main`은 가운데 칸만, `modal`은 어두운 바탕 위 가운데에 띄웁니다."],
        ["onOverlayClose", "() => void", "", "`modal` 덮개의 바깥을 누를 때 부릅니다."],
      ],
    },
  ],
};
