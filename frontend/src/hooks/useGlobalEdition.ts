import { useContext } from "react";
import GlobalContext from "../context/globalContext";

const useEdition = () => {
    const { edition, setEdition } = useContext(GlobalContext);
    return [edition, setEdition] as const;
};

export default useEdition;
