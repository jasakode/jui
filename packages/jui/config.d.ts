
import { Service } from "./src/plugins/service";
import { Integrations } from "./src/integrations";
import { Compiler } from "./src/plugins/compiler";
/**
 * Jui config
 */
export interface Config {
    root?: string;
    out?: string;
    // server init
    service?: Service[];
    compiler?: Compiler[];
    integrations?: Integrations[];
};

/**
 * See the full Jui Configuration API Documentation
 * https://jasakode.com/npm/jui/docs/config
 */
export function defineConfig(config: Config): Config;
