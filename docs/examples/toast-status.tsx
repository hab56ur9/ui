import { Button, Toast, useToast, type ToastProps } from "ui";
import { Browser } from "../Browser";
import { Row, useT } from "../demo";
import { Wireframe } from "../Wireframe";

export default function Example() {
  const t = useT();
  const toast = useToast();
  const undo = t({ ko: "실행 취소", en: "Undo" });
  const samples: [string, ToastProps][] = [
    [t({ ko: "알림", en: "Info" }), { message: t({ ko: "새 데이터가 들어왔습니다", en: "New data arrived" }) }],
    [t({ ko: "완료", en: "Done" }), { message: t({ ko: "저장했습니다", en: "Saved" }), status: "good" }],
    [t({ ko: "주의", en: "Warning" }), { message: t({ ko: "응답이 평소보다 느립니다", en: "Responses are slower than usual" }), status: "warning" }],
    [t({ ko: "오류", en: "Error" }), { message: t({ ko: "저장하지 못했습니다", en: "Couldn't save" }), status: "critical", action: { label: t({ ko: "다시 시도", en: "Retry" }) } }],
    [
      undo,
      {
        message: t({ ko: "위젯을 숨겼습니다", en: "Widget hidden" }),
        action: { label: undo, onClick: () => toast({ message: t({ ko: "되돌렸습니다", en: "Restored" }), status: "good" }) },
      },
    ],
  ];
  return (
    <>
      <Browser address="app.example.com">
        <Wireframe>
          {samples.slice(0, 4).map(([label, props]) => (
            <Toast key={label} {...props} />
          ))}
        </Wireframe>
      </Browser>
      <Row>
        {samples.map(([label, props]) => (
          <Button key={label} onClick={() => toast(props)}>
            {label}
          </Button>
        ))}
      </Row>
    </>
  );
}
