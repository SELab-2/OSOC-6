import useTranslation from "next-translate/useTranslation";
import { NextPage } from "next";
import CreateEditionForm from "../../components/edition/createEditionForm";
import NavBar from "../../components/util/navBar";
import { Container } from "react-bootstrap";

/**
 * Component allowing the creation of a new edition.
 */
const CreateEdition: NextPage = () => {
    const { t } = useTranslation("common");

    return (
        <div data-testid="edition-create">
            <NavBar />
            <Container style={{ maxWidth: "60%" }}>
                <h3 style={{ marginTop: "10rem" }} className="capitalize">
                    {t("create new edition")}
                </h3>
                <hr />
                <CreateEditionForm />
            </Container>
        </div>
    );
};

export default CreateEdition;
