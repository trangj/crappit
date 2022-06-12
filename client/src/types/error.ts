export interface Error {
    status: {
        severity: 'info' | 'warning' | 'success' | 'error',
        text: string;
    };
}
