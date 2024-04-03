import { ReactNode, createContext, useContext, useDeferredValue } from "react";

const AnswerMapContext = createContext<any>(new Object());
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
  answerMap: any;
  changeAnswer: any;
}) {
  const deferredAnswerMap = useDeferredValue(answerMap);
  const deferredChangeAnswer = useDeferredValue(changeAnswer);

  return (
    <AnswerMapContext.Provider value={deferredAnswerMap}>
      <AnswerChangeContext.Provider value={deferredChangeAnswer}>
        {children}
      </AnswerChangeContext.Provider>
    </AnswerMapContext.Provider>
  );
}
