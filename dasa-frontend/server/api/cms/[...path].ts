export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path");
  const config = useRuntimeConfig();
  const strapiUrl = config.public.strapiUrl || "http://localhost:1337";

  // Get query params from client request
  const query = getQuery(event);
  const queryString = new URLSearchParams(query as Record<string, string>).toString();

  try {
    const url = `${strapiUrl}/api/${path}${queryString ? "?" + queryString : ""}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `CMS request failed: ${response.statusText}`,
      });
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[CMS Proxy] Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch from CMS",
    });
  }
});
