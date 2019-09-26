export class ApiUrlBuilder {
    private baseUrl: string;
    
    public constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }
    
    public getStarWarsPeople(): string {
        return `${this.baseUrl}/api/starwars/people`;
    }

    public getServerRoute(path: string): string {
        if (!path.startsWith('/')) {
            path = `/${path}`;
        }
        return `${this.baseUrl}/api/serverroute${path}`;
    }
}