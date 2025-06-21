import { ResourceParser } from "./resource-parsers";
import { RunManifestArray, RunManifestEnv, RunManifestResources, RunManifestSpec, RunManifestSpecMpi, RunManifestSpecMpiLauncher, RunManifestSpecMpiWorkers } from "./types";

export function mapArgs(args: string[] | null | undefined){
    return args ?? [];
}

export function mapArray(array: RunManifestArray | null | undefined): any{
    if(!array){
        return null
    }
    
    return {
        replicas: array?.replicas ?? null,
        indexer: array?.indexer ?? null,
        counter: array?.counter ?? null
    }
}

export function mapEnv(env: RunManifestEnv | null | undefined): any{
    if(!env){
        return null
    }

    return {
        use: env?.use ?? [],
        override: env?.override ?? {}
    }
}

export function mapResources(resources: RunManifestResources | null | undefined): any{
    if(!resources){
        return null
    }
    return {
        cpu: ResourceParser.parseToMillicores(asString(resources?.cpu ?? null)),
        memory: ResourceParser.parseToBytes(asString(resources?.memory ?? null)),
        nvidiaGpu: ResourceParser.parseToGpu(asString(resources?.nvidiaGpu ?? null)),
        amdGpu: ResourceParser.parseToGpu(asString(resources?.amdGpu ?? null)),
    }
}

export function mapSpecMpiLauncher(launcher: RunManifestSpecMpiLauncher | null | undefined): any {
    if(!launcher){
        return null;
    }

    return {
        dedicated: launcher?.dedicated,
        resources: mapResources(launcher?.resources)
    }
}

export function mapSpecMpiWorkers(workers: RunManifestSpecMpiWorkers | null | undefined): any {
    if(!workers){
        return null;
    }

    return {
        replicas: workers?.replicas,
        resources: mapResources(workers?.resources)
    }
}

export function mapSpecMpi(mpi: RunManifestSpecMpi | null | undefined): any {
    return {
        launcher: mapSpecMpiLauncher(mpi?.launcher),
        workers: mapSpecMpiWorkers(mpi?.workers)
    }
}

export function mapSpec(spec: RunManifestSpec | null | undefined): any{
    let result = {};

    if(spec?.mpi){
        result = {...result, mpi: mapSpecMpi(spec.mpi)}
    }

    return result
}

function asString(input: any): string | null{
    
    if(input === null || input === undefined || typeof input === 'undefined'){
        return null
    }

    if(typeof input === 'bigint' || typeof input === 'number' || typeof input === 'boolean'){
        return String(input);
    }

    if(typeof input === 'string'){
        return input;
    }

    if(typeof input === 'symbol'){
        return input.toString()
    }

    return null;
}
