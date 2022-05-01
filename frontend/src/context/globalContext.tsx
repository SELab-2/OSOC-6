import { Context, createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react";

type ProviderProps = Record<string, unknown>;

interface GlobalContextProps {
    editionName: string | undefined;

    setEditionName: Dispatch<SetStateAction<string | undefined>>;
}

const GlobalContext: Context<GlobalContextProps> = createContext({} as GlobalContextProps);

export function GlobalStateProvider({ children }: PropsWithChildren<ProviderProps>) {
    const [editionName, setEditionName] = useState<string | undefined>(undefined);

    return (
        <GlobalContext.Provider value={{ editionName, setEditionName }}>{children}</GlobalContext.Provider>
    );
}

export default GlobalContext;
