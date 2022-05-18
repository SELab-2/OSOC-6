import {postForgotPasswordEmail} from "../api/calls/userCalls";

export interface ForgotValue {
    email: string;
}

export type ForgotProps = {
    submitHandler: (values: ForgotValue) => void;
};

export async function forgotPasswordSubmitHandler(
    values: ForgotValue,
) {
    await postForgotPasswordEmail(values.email);
}
