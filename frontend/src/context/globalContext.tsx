import {
    Context,
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useEffect,
    useState,
} from "react";

type ProviderProps = Record<string, unknown>;

interface GlobalContextProps {
    editionUrl: string | undefined;
    setEditionUrl: (editionUrl: string) => void;
}

const GlobalContext: Context<GlobalContextProps> = createContext({} as GlobalContextProps);

export function GlobalStateProvider({ children }: PropsWithChildren<ProviderProps>) {
    const [editionUrl, setEditionUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (editionUrl) {
            localStorage.setItem("editionUrl", editionUrl);
        } else {
            setEditionUrl(localStorage.getItem("editionUrl") || undefined);
        }
    }, [editionUrl]);

    return <GlobalContext.Provider value={{ editionUrl, setEditionUrl }}>{children}</GlobalContext.Provider>;
}

export default GlobalContext;
