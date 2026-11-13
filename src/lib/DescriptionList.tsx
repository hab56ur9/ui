import { Fragment, type ReactNode } from "react";
import { useEnter } from "./MotionScope";

export type DescriptionItem = { label: string; value: ReactNode };

export type DescriptionListProps = {
  items: DescriptionItem[];
  align?: "start" | "end";
};

export function DescriptionList({ items, align = "start" }: DescriptionListProps) {
  const { enter } = useEnter();
  return (
    <dl className={align === "end" ? "description-list is-end" : "description-list"} data-motion={enter}>
      {items.map((item, index) => (
        <Fragment key={index}>
          <dt title={item.label}>{item.label}</dt>
          <dd>{item.value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
