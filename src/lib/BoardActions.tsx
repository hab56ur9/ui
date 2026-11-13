import { useEffect, useRef, useState } from "react";
import type { BoardLayout, WidgetSpec } from "./Board";
import { ButtonBase } from "./controls";
import { useI18n } from "./i18n";
import { usePresence } from "./motion";
import { Sheet } from "./overlay/Dialog";
import { useConfirm, useToast } from "./overlay/Provider";

export type BoardActionsProps = { board: BoardLayout };

export function BoardActions({ board }: BoardActionsProps) {
  const { text } = useI18n();
  const toast = useToast();
  const confirm = useConfirm();
  const reset = async () => {
    const ok = await confirm({ title: text("resetTitle"), description: text("resetBody"), confirmLabel: text("reset"), danger: true });
    if (!ok) return;
    const before = board.layout;
    board.reset();
    toast({ message: text("resetDone"), status: "good", action: { label: text("undo"), onClick: () => board.setLayout(before) } });
  };
  return (
    <>
      <AddWidget hidden={board.hidden} onShow={board.show} />
      <ButtonBase onClick={reset}>{text("resetLayout")}</ButtonBase>
    </>
  );
}

function AddWidget({ hidden, onShow }: { hidden: WidgetSpec[]; onShow: (id: string) => void }) {
  const { text } = useI18n();
  const [open, setOpen] = useState<"menu" | "sheet" | null>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [listed, list] = usePresence<HTMLUListElement>(open === "menu");
  useEffect(() => {
    if (open !== "menu") return;
    const close = (e: Event) => (e instanceof KeyboardEvent ? e.key === "Escape" : !menu.current?.contains(e.target as Node)) && setOpen(null);
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);
  const pick = (id: string) => {
    setOpen(null);
    onShow(id);
  };
  const narrow = () => matchMedia("(max-width: 760px)").matches;
  const items = hidden.map((widget) => (
    <li key={widget.id}>
      <button type="button" onClick={() => pick(widget.id)}>
        {widget.title}
      </button>
    </li>
  ));
  return (
    <div className="menu" ref={menu}>
      <ButtonBase aria-expanded={open === "menu"} aria-haspopup="true" onClick={() => setOpen(open ? null : narrow() ? "sheet" : "menu")}>
        {hidden.length ? text("addWidgetCount", { n: hidden.length }) : text("addWidget")}
      </ButtonBase>
      {listed && (
        <ul className="menu-list" ref={list}>
          {hidden.length === 0 && <li className="menu-empty">{text("noHidden")}</li>}
          {items}
        </ul>
      )}
      <Sheet open={open === "sheet"} title={text("addWidget")} description={hidden.length ? text("addWidgetHint") : undefined} onClose={() => setOpen(null)}>
        {hidden.length ? <ul className="sheet-list">{items}</ul> : text("noHidden")}
      </Sheet>
    </div>
  );
}
