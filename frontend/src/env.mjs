import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    // server: {
    //     DATABASE_URL: z.string().url(),
    //     OPEN_AI_API_KEY: z.string().min(1),
    // },
    client: {
        NEXT_PUBLIC_MKTPLC_CONTRACT: z.string(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_MKTPLC_CONTRACT: process.env.NEXT_PUBLIC_MKTPLC_CONTRACT,
    },
});
