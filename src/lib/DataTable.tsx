import type { ReactNode } from "react";
import { Key } from "./charts/parts";
import { Delta, type DeltaProps } from "./controls";
import { color } from "./format";
import { useEnter } from "./MotionScope";
import type { Color } from "./types";

export type Cell = string | { text?: string; content?: ReactNode; color?: Color; swatch?: "line" | "rect"; delta?: DeltaProps; render?: () => ReactNode };

export type DataTableProps = { columns: { label: string; numeric?: boolean; wrap?: boolean; width?: string }[]; rows: Cell[][]; fit?: boolean };

export function DataTable({ columns, rows, fit = false }: DataTableProps) {
  const wrap = columns.some((column) => column.wrap);
  const { enter, row: order } = useEnter();
  return (
    <div className={`data-table-wrap${fit ? " is-fit" : ""}`}>
      <table className={`data-table${wrap ? " has-wrap" : ""}${columns.some((column) => column.width) ? " has-widths" : ""}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.label} className={column.numeric ? "is-numeric" : ""} style={column.width ? { width: column.width } : undefined}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} data-motion={enter} style={order(r)}>
              {row.map((cell, c) => (
                <td key={c} className={[columns[c]?.numeric ? "is-numeric" : "", columns[c]?.wrap ? "is-wrap" : ""].join(" ").trim()}>
                  {typeof cell === "object" ? <CellContent cell={cell} /> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CellContent({ cell }: { cell: Exclude<Cell, string> }) {
  return (
    <>
      {cell.color !== undefined && <Key swatch={cell.swatch ?? "line"} color={color(cell.color)} />}
      {cell.delta && <Delta {...cell.delta} />}
      {cell.render ? <span className="data-table-figure">{cell.render()}</span> : cell.content !== undefined ? cell.content : cell.text !== undefined && <span>{cell.text}</span>}
    </>
  );
}
