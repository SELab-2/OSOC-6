import { Button } from "react-bootstrap";
import { Status } from "../../api/entities/StudentEntity";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRouterReplace } from "../../hooks/routerHooks";

/**
 * The StudentStatusButton filters the list of students by the passed student status
 * @param props a status and a colour for the button
 */
export function StudentStatusButton(props: { status: Status; colour: string }) {
    const [clicked, setClicked] = useState(false);
    const router = useRouter();
    const routerAction = useRouterReplace();

    useEffect(() => {
        setClicked(router.query?.status === props.status);
    }, [router.query?.status, props.status]);

    async function clickHandler() {
        if (clicked) {
            await routerAction({
                query: { ...router.query, status: "" },
            });
        } else {
            await routerAction({
                query: { ...router.query, status: props.status },
            });
        }
        setClicked(!clicked);
    }

    const style = clicked
        ? { backgroundColor: props.colour, width: 100 }
        : { color: props.colour, borderColor: props.colour, width: 100 };
    return (
        <>
            <Button variant="btn-outline" data-testid="suggest-button" style={style} onClick={clickHandler}>
                {props.status}
            </Button>
        </>
    );
}
