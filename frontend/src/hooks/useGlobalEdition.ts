import { useContext } from "react";
import GlobalContext from "../context/globalContext";

const useEdition = () => {
    const { editionName, setEditionName } = useContext(GlobalContext);
    return [editionName, setEditionName] as const;
};

export default useEdition;
