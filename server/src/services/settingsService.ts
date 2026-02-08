import { DestinationSetting, getConfig, saveConfig } from './rootsService';

export async function getDestination() {
    const cfg = await getConfig();
    return cfg.destination;
}

export async function setDestination(destination: DestinationSetting) {
    const cfg = await getConfig();
    cfg.destination = destination;
    await saveConfig(cfg);
    return cfg.destination;
}
