import { ResolvedContext, RootOptions } from "@/core/types";
import { loadConfig } from "./config";
import axios from "axios";
import fs from "fs";


export default async function resolveContext(options: RootOptions): Promise<ResolvedContext> {

    const { context, workspace, dir } = options;
    const config = await loadConfig();
    
    if(!config){
        throw new Error('The Shoc CLI is not configured. You can run "shoc config init" to configure it.');
    }

    const effectiveContext = context ?? config.defaultContext;
    const ctx = config.contexts.filter(item => item.name === effectiveContext)[0];

    if(!ctx){
        throw new Error(`The context '${effectiveContext}' could not be resolved. Please check the configuration.`);
    }

    const provider = config.providers.filter(item => item.name === ctx.provider)[0];

    if(!provider){
        throw new Error(`The provider '${ctx.provider}' from the context '${ctx.name}' could not be resolved. Please check the configuration.`);
    }

    if(!URL.canParse(provider.url)){
        throw new Error(`The provider ${provider.name} has invalid URL (${provider.url})`);
    }

    if(!URL.canParse(provider.api)){
        throw new Error(`The provider ${provider.name} has invalid API URL (${provider.api})`);
    }

    if(!URL.canParse(provider.identity)){
        throw new Error(`The provider ${provider.name} has invalid Identity URL (${provider.identity})`);
    }

    let resolvedDir = dir ?? process.cwd()

    if(resolvedDir.endsWith('/')){
        resolvedDir = resolvedDir.substring(0, resolvedDir.length - 1)
    }

    if(!fs.existsSync(resolvedDir)){
        throw new Error(`The directory ${resolvedDir} does not exist`)
    }

    if(!fs.lstatSync(resolvedDir).isDirectory()){
        throw new Error(`The path ${resolvedDir} is not a directory`)
    }

    return {
        name: ctx.name,
        providerName: provider.name,
        providerUrl: new URL(provider.url),
        apiUrl: new URL(provider.api),
        identityUrl: new URL(provider.identity),
        workspace: workspace ?? ctx.workspace,
        dir: resolvedDir
    };
}
