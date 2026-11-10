export type Point = { t: number; v: number };

export type Color = number | string;

export type Format = {
  axis?: (value: number) => string;
  value?: (value: number) => string;
  date?: (time: number) => string;
};

export type Swatch = "line" | "dashed" | "rect" | "band";
