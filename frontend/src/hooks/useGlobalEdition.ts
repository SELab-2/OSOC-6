import { useContext } from "react";
import GlobalContext from "../context/globalContext";

/**
 * Hook returning the global edition and a setter for it.
 */
const useEdition = () => {
    const { edition, setEdition } = useContext(GlobalContext);
    return [edition, setEdition] as const;
};

export default useEdition;
