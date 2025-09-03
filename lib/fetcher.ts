export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
export const fetcher = (url: string) => fetch(url).then(r => r.json());
