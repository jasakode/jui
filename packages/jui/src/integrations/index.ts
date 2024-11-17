
type IntegrationsName = "tailwind" | "alpinejs";

export function alpinejs(): Integrations {
    return "alpinejs"
};

export function tailwind(): Integrations {
    return "tailwind"
};


export type Integrations = "tailwind" | "alpinejs";