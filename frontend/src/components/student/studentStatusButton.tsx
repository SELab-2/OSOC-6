import { Button } from "react-bootstrap";
import { Status } from "../../api/entities/StudentEntity";
import { useRouter } from "next/router";

export function StudentStatusButton(props: { status: Status; style: any }) {
    const router = useRouter();
    async function clickHandler() {
        await router.replace({
            query: { ...router.query, status: props.status },
        });
        console.log(props.status);
    }
    return (
        <>
            <Button
                variant="btn-outline"
                data-testid="suggest-button"
                style={{ ...props.style, width: 100 }}
                onClick={clickHandler}
            >
                {props.status}
            </Button>
        </>
    );
}
