import { MouseEventHandler } from "react";
import axios from "axios";

export const dataInjectionHandler: MouseEventHandler<HTMLButtonElement> = async _ => {
    const result = await axios.get("http://localhost/api");
    console.log(result);
}