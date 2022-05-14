import { ISuggestion } from "../../api/entities/SuggestionEntity";
import { Col, ListGroup, Row } from "react-bootstrap";
import Image from "next/image";
import { capitalize } from "../../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";
import useSWR from "swr";
import { getUserOnUrl } from "../../api/calls/userCalls";
import { emptyUser } from "../../api/entities/UserEntity";

/**
 * Properties used by [SuggestionLI].
 */
export interface suggestionLIProps {
    suggestion: ISuggestion;
}

export default function SuggestionListItem({ suggestion }: suggestionLIProps) {
    const { t } = useTranslation("common");
    let { data: coach, error: coachError } = useSWR(suggestion._links.coach.href, getUserOnUrl);

    if (coachError) {
        console.log(coachError);
        return null;
    }

    coach = coach || emptyUser;

    const strategyIndication = {
        YES: "/resources/check_green.svg",
        NO: "/resources/x.svg",
        MAYBE: "/resources/question.svg",
    };

    return (
        <ListGroup.Item as={"li"}>
            <Row>
                <Col sm={1}>
                    <Image
                        alt={capitalize(t("edit"))}
                        src={strategyIndication[suggestion.strategy]}
                        width="20"
                        height="20"
                    />
                </Col>
                <Col>
                    <div>
                        {coach.callName}: {suggestion.reason}
                    </div>
                </Col>
            </Row>
        </ListGroup.Item>
    );
}
