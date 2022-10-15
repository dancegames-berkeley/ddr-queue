const tokens: Record<string, string> = {};

export function getToken(uuid: string): string | undefined {
    return tokens[uuid];
}

export function setToken(uuid: string, token: string) {
    tokens[uuid] = token;
}