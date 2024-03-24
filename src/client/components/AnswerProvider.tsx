import { ReactNode, createContext, useContext } from "react";
import { AnswerMap } from "../models/paper";

const AnswerMapContext = createContext<AnswerMap>(new Map());
const AnswerChangeContext = createContext<any>(() => {});

export function useAnswerMap() {
  return useContext(AnswerMapContext);
}

export function useAnswerChange() {
  return useContext(AnswerChangeContext);
}

export default function AnswerProvider({
  children,
  answerMap,
  changeAnswer,
}: {
  children: ReactNode;
  answerMap: AnswerMap;
  changeAnswer: any;
}) {
  return (
    <AnswerMapContext.Provider value={answerMap}>
      <AnswerChangeContext.Provider value={changeAnswer}>
        {children}
      </AnswerChangeContext.Provider>
    </AnswerMapContext.Provider>
  )
}
