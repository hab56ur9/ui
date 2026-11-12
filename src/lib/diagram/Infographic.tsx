import { Children, Fragment, isValidElement, type CSSProperties, type ReactNode } from "react";
import { Icon, type IconName } from "../Icon";

export type InfographicProps = { title: string; id?: string; lede?: string; children: ReactNode };
export type InfographicPanelProps = { title: string; icon?: IconName; message?: string; children: ReactNode };

function InfographicPanel(props: InfographicPanelProps) {
  return null;
}

function panelsOf(children: ReactNode): InfographicPanelProps[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];
    if (child.type === Fragment) return panelsOf((child.props as { children?: ReactNode }).children);
    if (child.type === InfographicPanel) return [child.props as InfographicPanelProps];
    return [];
  });
}

const tone = (index: number) => ({ "--panel-tone": `var(--color-series-${(index % 8) + 1})` }) as CSSProperties;

function InfographicRoot({ title, id, lede, children }: InfographicProps) {
  return (
    <figure className="infographic" data-name={id} aria-label={title}>
      <header className="infographic-head">
        <h2 className="infographic-title">{title}</h2>
        {lede && <p className="infographic-lede">{lede}</p>}
      </header>
      {panelsOf(children).map((panel, i) => (
        <section key={i} className="infographic-panel" style={tone(i)} aria-label={panel.title}>
          <div className="infographic-panel-head">
            {panel.icon && <Icon name={panel.icon} size="lg" />}
            <h3 className="infographic-panel-title">{panel.title}</h3>
            {panel.message && <p className="infographic-panel-message">{panel.message}</p>}
          </div>
          <div className="infographic-panel-body">{panel.children}</div>
        </section>
      ))}
    </figure>
  );
}

export const Infographic = Object.assign(InfographicRoot, { Panel: InfographicPanel });
