import { useRouter } from "next/router";
import { useEditionApplicationPathTransformer } from "./utilHooks";

/**
 * TransitionOptions used by NextRouter.
 */
export interface TransitionOptions {
    shallow?: boolean;
    locale?: string | false;
    scroll?: boolean;
}

export type RouterAction = (url: string, as?: string, options?: TransitionOptions) => Promise<boolean>;

export function useRouterPush(): RouterAction {
    const router = useRouter();
    const transformer = useEditionApplicationPathTransformer();
    return (url, as, options) => router.push(transformer(url), as, options);
}

export function useRouterReplace(): RouterAction {
    const router = useRouter();
    const transformer = useEditionApplicationPathTransformer();
    return (url, as, options) => router.replace(transformer(url), as, options);
}
