import { createBrowserHistory, History, createMemoryHistory } from 'history';
import { Environment } from './Environment';

// Notice that this is a singleton. 
// A single instance is created throughout the entire application.
export class ContextHistory {
    private static instance: ContextHistory;
    private history: History = Environment.isServer ? createMemoryHistory() : createBrowserHistory();

    constructor() {
        if (ContextHistory.instance) {
            return ContextHistory.instance;
        }

        ContextHistory.instance = this as ContextHistory;
    }

    public setHistory = (newHistory: History): void => {
        this.history = newHistory;
    }
    
    public getHistory = (): History => {
        return this.history;
    }
}
