import { Context, createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import { IEdition } from "../api/entities/EditionEntity";

type ProviderProps = Record<string, unknown>;

interface GlobalContextProps {
    edition: IEdition | undefined;
    setEdition: Dispatch<SetStateAction<IEdition | undefined>>;
}

const GlobalContext: Context<GlobalContextProps> = createContext({} as GlobalContextProps);

export function GlobalStateProvider({ children }: PropsWithChildren<ProviderProps>) {
    const [edition, setEdition] = useState<IEdition | undefined>(undefined);

    return <GlobalContext.Provider value={{ edition, setEdition }}>{children}</GlobalContext.Provider>;
}

export default GlobalContext;
