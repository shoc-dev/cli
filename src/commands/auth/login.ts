import resolveContext from "@/services/context-resolver";
import { createCommand } from "commander";
import { asyncHandler, getRootOptions } from "@/commands/common";
import { authorize } from "../../services/authorize";
import { storeSession } from "@/services/session-service";
import { logger } from "@/services/logger";

const authLoginCommand = createCommand('login')

authLoginCommand
    .description('Authenticate the user in the provider')
    .action(asyncHandler(async (_, cmd) => {

        const context = await resolveContext(getRootOptions(cmd));

        const { accessToken, refreshToken } = await authorize({ idp: context.identityUrl })

        storeSession(context.providerUrl.toString(), { accessToken, refreshToken })
        logger.success(`You have been successfully authenticated.`);
    }));


export default authLoginCommand;
