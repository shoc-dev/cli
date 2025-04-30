import { Config } from "@/core/types";
import { loadConfig, saveConfig } from "@/services/config";
import { logger } from "@/services/logger";
import { createCommand } from "commander";
import prompts from "prompts"
import { asyncHandler } from "../common";

const configInitCommand = createCommand('init')

const GLOBAL_ROOT = 'https://shoc.dev';

configInitCommand
    .description('Initialize the configuration')
    .action(asyncHandler(async (options) => {

        const existing = await loadConfig();

        if (existing) {
            logger.warn("The configuration is already initialized.")
            return;
        }

        const endpoints = await (await fetch(`${GLOBAL_ROOT}/well-known/endpoints`)).json();

        const config: Config = {
            providers: [{ name: 'global', url: GLOBAL_ROOT, api: endpoints.api, identity: endpoints.idp }],
            contexts: [],
            defaultContext: 'default',
        };

        let workspaceName = options.workspace;

        if (!workspaceName) {
            workspaceName = (await prompts({

                type: 'text',
                name: 'name',
                message: 'Please enter your workspace name'
            })).name;
        }

        config.contexts.push({
            name: 'default',
            provider: 'global',
            workspace: workspaceName,
        });

        await saveConfig(config);
        logger.info('Configuration was successfully initialized.');
    }));

export default configInitCommand;
