import { NextResponse } from "next/server";

async function fetchWithTimeout(resource: string, options: RequestInit & { timeoutMs?: number } = {}) {
  const { timeoutMs = 5000, ...init } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(resource, { ...init, signal: controller.signal, cache: "no-store" });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function GET() {
  // Attempt ipapi first for org, then ipify fallback for IP only
  try {
    const res = await fetchWithTimeout("https://ipapi.co/json/", { timeoutMs: 5000 });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ ip: data?.ip ?? null, org: data?.org ?? null }, { headers: { "Cache-Control": "no-store" } });
    }
  } catch {}

  try {
    const res2 = await fetchWithTimeout("https://ipinfo.io/json", { timeoutMs: 5000 });
    if (res2.ok) {
      const d2 = await res2.json();
      return NextResponse.json({ ip: d2?.ip ?? null, org: d2?.org ?? null }, { headers: { "Cache-Control": "no-store" } });
    }
  } catch {}

  try {
    const res3 = await fetchWithTimeout("https://api.ipify.org?format=json", { timeoutMs: 5000 });
    if (res3.ok) {
      const d3 = await res3.json();
      return NextResponse.json({ ip: d3?.ip ?? null, org: null }, { headers: { "Cache-Control": "no-store" } });
    }
  } catch {}

  return NextResponse.json({ ip: null, org: null }, { status: 200, headers: { "Cache-Control": "no-store" } });
}


