import { createContext, useContext } from "react";

export const AnswerChangeContext = createContext<any>(() => {});

export function useAnswerChange() {
  return useContext(AnswerChangeContext);
}