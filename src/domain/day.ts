export enum Day {
  LUNDI = "LUNDI",
  MARDI = "MARDI",
  MERCREDI = "MERCREDI",
  JEUDI = "JEUDI",
  VENDREDI = "VENDREDI",
  SAMEDI = "SAMEDI",
  DIMANCHE = "DIMANCHE"
}

export const DAY_ID_MAP: Record<Day, number> = {
  [Day.LUNDI]: -1,
  [Day.MARDI]: -2,
  [Day.MERCREDI]: -3,
  [Day.JEUDI]: -4,
  [Day.VENDREDI]: -5,
  [Day.SAMEDI]: -6,
  [Day.DIMANCHE]: -7,
};