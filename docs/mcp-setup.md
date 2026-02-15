# CRS MCP setup in Cursor

Use the **CRS MCP** inside Cursor for planning and debugging the Forward CRS integration.

## Enable the CRS MCP server

1. Open the **SF Hacks CRS track page** (from your hackathon materials).
2. Find the **"View MCP documentation"** link on that page.
3. Follow the link to get the MCP server configuration and any credentials/docs.
4. In Cursor: **Settings → MCP** (or Cursor Settings → Features → MCP).
5. Add the CRS MCP server using the configuration from the documentation (e.g. server name, command, env vars).
6. Restart Cursor if required so the MCP server is available.

## What to ask the MCP

Use the CRS MCP when you need to:

- **Token errors** – e.g. 401 after login, "invalid token", or "token expired". Ask how to obtain and refresh the access token and what the exact login request/response shape is.
- **Payload formatting** – e.g. required fields for `POST /experian/credit-profile/credit-report/standard/exp-prequal-vantage4`, field names (camelCase vs snake_case), and how to send SSN, name, DOB, and address.
- **Response fields** – where the score or risk indicator appears in the prequal response so we can map to our risk bands (A/B/C/D) and explain factors.
- **Rate limits** – sandbox limits, throttling, and backoff so the demo stays within bounds.

Once the MCP is connected, you can ask in chat for help with any of the above and use the MCP’s answers to adjust `lib/crsClient.ts`, the prequal route, and the offer generation logic.
