import { useContext } from "react";
import GlobalContext from "../context/globalContext";

/**
 * Hook returning the global edition and a setter for it.
 */
const useEdition = () => {
    const { editionUrl, setEditionUrl } = useContext(GlobalContext);
    return [editionUrl, setEditionUrl] as const;
};

export default useEdition;
