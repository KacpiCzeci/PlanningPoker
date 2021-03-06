import React, { createContext, useState, useContext, Dispatch, SetStateAction } from "react";

export interface GlobalStateInterface {
    gameName?: string;
    userName?: string;
    result?: string;
    resultAverange?: string;
    gameEnded?: boolean;
    cardPicked?: number;
    selectedIssue?:string;
    room: string;
    master:boolean;
}

const initState: GlobalStateInterface = {
    room: "global",
    gameName: "Game Name",
    userName: sessionStorage.getItem('userName') as unknown as string || undefined,
    result: undefined,
    resultAverange: undefined,
    gameEnded: sessionStorage.getItem('gameEnded') as unknown as boolean || undefined,
    cardPicked: sessionStorage.getItem('cardPicked') as unknown as number || undefined,
    selectedIssue: "Issue name",
    master: sessionStorage.getItem('master') as unknown as boolean || false
}

const GlobalStateContext = createContext({
  state: {} as Partial<GlobalStateInterface>,
  setState: {} as Dispatch<SetStateAction<Partial<GlobalStateInterface>>>,
});

const GlobalStateProvider = ({
  children,
  value = initState,
}: {
  children: React.ReactNode;
  value?: Partial<GlobalStateInterface>;
}) => {
  const [state, setState] = useState(value);
  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateContext");
  }
  return context;
};

export { GlobalStateProvider, useGlobalState };