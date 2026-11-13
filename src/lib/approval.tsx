import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "./Badge";
import { ButtonBase } from "./controls";
import { Icon } from "./Icon";
import { useI18n, type MessageKey } from "./i18n";
import { reveal } from "./reveal";

export type ApprovalState = "pending" | "allowed" | "denied";
export type ApprovalScope = "once" | "always";
export type ApprovalDecision = Exclude<ApprovalState, "pending">;

export type ApprovalCardProps = {
  title: ReactNode;
  description?: ReactNode;
  command: string;
  state?: ApprovalState;
  scope?: ApprovalScope;
  meta?: string;
  onDecide?: (decision: ApprovalDecision, scope: ApprovalScope) => void;
};

const TONE: Record<ApprovalState, BadgeTone> = { pending: "warning", allowed: "good", denied: "critical" };

const label = (state: ApprovalState, scope?: ApprovalScope): MessageKey => {
  if (state === "pending") return "approval.pending";
  if (state === "denied") return "approval.denied";
  if (scope === "always") return "approval.allowedAlways";
  return "approval.allowed";
};

export function ApprovalCard({ title, description, command, state = "pending", scope, meta, onDecide }: ApprovalCardProps) {
  const { text: t } = useI18n();
  const deciding = state === "pending" && onDecide;
  return (
    <article className={`approval is-${state}`}>
      <header className="approval-head">
        <Icon name="shield" size="sm" />
        <strong>{title}</strong>
        <Badge tone={TONE[state]}>{t(label(state, scope))}</Badge>
      </header>
      {description && <p className="approval-description">{description}</p>}
      <pre className="approval-command">
        <code>
          {reveal(command).map((part, index) =>
            part.hidden ? (
              <span key={index} className="approval-hidden">
                {part.text}
              </span>
            ) : (
              part.text
            ),
          )}
        </code>
      </pre>
      {deciding && (
        <footer className="approval-foot">
          <ButtonBase onClick={() => onDecide("denied", "once")}>{t("approval.deny")}</ButtonBase>
          <ButtonBase onClick={() => onDecide("allowed", "always")}>{t("approval.allowAlways")}</ButtonBase>
          <ButtonBase variant="primary" onClick={() => onDecide("allowed", "once")}>{t("approval.allowOnce")}</ButtonBase>
        </footer>
      )}
      {!deciding && meta && <footer className="approval-meta">{meta}</footer>}
    </article>
  );
}
