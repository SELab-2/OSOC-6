import { useRouter } from "next/router";
import apiPaths from "../../properties/apiPaths";
import CommunicationInfo from "../../components/communication/communicationInfo";

/**
 * Page displaying the details of a given communication item.
 */
export default function CommunicationInfoPage() {
    const router = useRouter();
    const query = router.query as { id: string };
    const communicationId = query.id;

    return <CommunicationInfo url={apiPaths.communications + "/" + communicationId} />;
}
