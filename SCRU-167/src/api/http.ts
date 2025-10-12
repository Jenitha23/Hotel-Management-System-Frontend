type ErrorPayload = { message?: string; error?: string };

function isErrorPayload(x: unknown): x is ErrorPayload {
    return typeof x === "object" && x !== null && ("message" in x || "error" in x);
}

export async function http<T>(
    path: string,
    opts: RequestInit & { json?: unknown } = {}
): Promise<T> {
    const base = import.meta.env.VITE_API_BASE || "";

    // normalize headers
    const merged = new Headers(opts.headers ?? {});
    if (!merged.has("Content-Type")) merged.set("Content-Type", "application/json");

    const init: RequestInit = {
        ...opts,
        headers: merged,
        body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body,
    };

    const res = await fetch(base + path, init);

    if (!res.ok) {
        let message = `${res.status} ${res.statusText}`;
        try {
            const data: unknown = await res.json();
            if (isErrorPayload(data) && typeof data.message === "string" && data.message.trim() !== "") {
                message = data.message;
            }
        } catch {
            /* ignore JSON parse error */
        }
        throw new Error(message);
    }


    const ct = res.headers.get("content-type") || "";
    const accept = new Headers(init.headers).get("accept") || "";

    if (ct.includes("application/pdf") || accept.includes("application/pdf")) {
        return (await res.blob()) as unknown as T;
    }
    if (ct.includes("application/json")) {
        return (await res.json()) as T;
    }
    return (await res.text()) as unknown as T;
}
