export function useSortList<T extends { name: string }>(list: T[]): T[] {
  const data = list.sort((a, b) => {
    if (a.name === "Others") return 1;
    if (b.name === "Others") return -1;
    return 0;
  });

  return data.map((s, i) => ({ ...s, id: i + 1 }));
}
