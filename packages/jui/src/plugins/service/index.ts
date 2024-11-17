
type ServiceName = "unix" | "http";

export interface Config {

};

export class Service {
    declare private _name: ServiceName;
    constructor (name: ServiceName) {
        this._name = name;
    };
};


export function http(config?: Config) {
    
};

export function unix(config?: Config) {
    
};