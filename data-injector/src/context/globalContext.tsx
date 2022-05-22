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
    // Undefined is the default value, it means the url has not been initialised.
    // Null means the edition is know, it is null.
    // We cannot delete this, even-though we always have an edition in our url.
    // This state makes sure we can reroute to the correct edition even when it changes names.
    editionUrl: string | undefined | null;
    setEditionUrl: (editionUrl: string | undefined | null) => void;
}

const GlobalContext: Context<GlobalContextProps> = createContext({} as GlobalContextProps);

export function GlobalStateProvider({ children }: PropsWithChildren<ProviderProps>) {
    const [editionUrl, setEditionUrl] = useState<string | undefined | null>(undefined);

    useEffect(() => {
        if (editionUrl) {
            localStorage.setItem("editionUrl", editionUrl);
        } else if (editionUrl === null) {
            localStorage.removeItem("editionUrl");
        } else {
            setEditionUrl(localStorage.getItem("editionUrl") || undefined);
        }
    }, [editionUrl]);

    return <GlobalContext.Provider value={{ editionUrl, setEditionUrl }}>{children}</GlobalContext.Provider>;
}

export default GlobalContext;
