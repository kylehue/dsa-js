export type Comparator<T> = (a: T, b: T) => number;
export const defaultComparator = <T>(a: T, b: T): number => {
   if (a === b) return 0;

   if (typeof a === "string" && typeof b === "string") {
      return a.localeCompare(b);
   }

   if (typeof a === "number" && typeof b === "number") {
      return a - b;
   }

   // if (!a || !b) return 0;

   throw new Error("Unsupported type or mixed types in default comparator");
};
