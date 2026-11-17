export const onRequestGet = async () => {
  return new Response(
    JSON.stringify({
      ok: true,
      service: 'star-rolling-mills-cloudflare-api',
      time: new Date().toISOString(),
      platform: 'Cloudflare Pages / Workers',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    },
  )
}
