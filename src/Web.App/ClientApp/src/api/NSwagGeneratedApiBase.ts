// This code is included "as is" at the top of NSwag generated API clients
export class ApiConfiguration {
    // public getBearerToken?: () => string;
}

class NSwagGeneratedApiBase {
    constructor(private configuration: ApiConfiguration) {}

    protected transformOptions(options: RequestInit): Promise<RequestInit> {
        // if (options && options.headers && this.configuration.getBearerToken) {
        //     if (!options.headers) {
        //         options.headers = new Headers();
        //     }
        //     (options.headers as any).Authorization = `Bearer ${this.configuration.getBearerToken()}`;
        // }
        return Promise.resolve(options);
    }
}