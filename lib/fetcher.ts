export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const fetcher = (url: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, { headers }).then((r) => r.json());
};
