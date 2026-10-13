#!/usr/bin/env node

/**
 * Exporta la línea base SEO desde Google Analytics 4 mediante OAuth 2.0.
 *
 * No requiere gcloud ni una clave de cuenta de servicio. Usa exclusivamente
 * módulos incluidos en Node.js 18+ y conserva el token OAuth fuera del repo.
 */

import { createServer } from "node:http";
import { createHash, randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeProcess = globalThis.process || {
  argv: [],
  env: {},
  exitCode: 0,
  platform: "win32",
  stdout: { write: (message) => console.log(String(message).trimEnd()) },
};

const DEFAULT_CREDENTIALS_DIR = "C:/JS/credentials";
const DEFAULT_CONFIG_PATH = path.join(DEFAULT_CREDENTIALS_DIR, "credentials.yml");
const DEFAULT_TOKEN_PATH = "C:/Users/juposada/AppData/Local/Temp/bikerz-ga4-oauth-token.json";
const DEFAULT_OUTPUT_DIR = "C:/JS/shopify/outputs/ga4-seo";
const OAUTH_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const API_ROOT = "https://analyticsdata.googleapis.com/v1beta";

const REPORTS = [
  {
    key: "resumen-mensual",
    dimensions: ["yearMonth"],
    metrics: ["sessions", "addToCarts", "ecommercePurchases", "purchaseRevenue"],
    orderBys: [{ dimension: { dimensionName: "yearMonth" } }],
  },
  {
    key: "landing-pages",
    dimensions: ["landingPagePlusQueryString"],
    metrics: ["sessions", "addToCarts", "ecommercePurchases", "purchaseRevenue"],
    orderBys: [{ metric: { metricName: "purchaseRevenue" }, desc: true }],
  },
  {
    key: "dispositivos",
    dimensions: ["deviceCategory"],
    metrics: ["sessions", "addToCarts", "ecommercePurchases", "purchaseRevenue"],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  },
  {
    key: "productos",
    dimensions: ["itemName", "itemId"],
    metrics: ["itemsPurchased", "itemRevenue", "itemsAddedToCart"],
    orderBys: [{ metric: { metricName: "itemRevenue" }, desc: true }],
  },
];

function env(name, fallback) {
  const value = runtimeProcess.env[name]?.trim();
  return value || fallback;
}

function parseSimpleYaml(text) {
  const result = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z0-9_.-]+)\s*:\s*(.*?)\s*$/);
    if (!match) continue;
    result[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
  return result;
}

async function findDesktopClient(credentialsDir) {
  const entries = await fs.readdir(credentialsDir, { withFileTypes: true });
  const candidates = entries.filter(
    (entry) => entry.isFile() && /^client_secret_.*\.json$/i.test(entry.name),
  );

  if (!candidates.length) {
    throw new Error(`No se encontró el JSON OAuth de escritorio en ${credentialsDir}`);
  }

  const withDates = await Promise.all(
    candidates.map(async (entry) => {
      const filePath = path.join(credentialsDir, entry.name);
      return { filePath, mtimeMs: (await fs.stat(filePath)).mtimeMs };
    }),
  );
  withDates.sort((a, b) => b.mtimeMs - a.mtimeMs);

  const raw = JSON.parse(await fs.readFile(withDates[0].filePath, "utf8"));
  const client = raw.installed;
  if (!client?.client_id || !client?.client_secret || !client?.token_uri) {
    throw new Error("El JSON encontrado no corresponde a un cliente OAuth de tipo Desktop app.");
  }
  return client;
}

function base64Url(buffer) {
  return buffer.toString("base64url");
}

function openBrowser(url) {
  try {
    let child;
    if (runtimeProcess.platform === "win32") {
      child = spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" });
    } else if (runtimeProcess.platform === "darwin") {
      child = spawn("open", [url], { detached: true, stdio: "ignore" });
    } else {
      child = spawn("xdg-open", [url], { detached: true, stdio: "ignore" });
    }
    child.unref();
  } catch {
    // La URL también se imprime para poder abrirla manualmente.
  }
}

async function exchangeToken(client, form) {
  const response = await fetch(client.token_uri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(form),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`Google rechazó la autenticación OAuth (${response.status}): ${payload.error_description || payload.error || "error desconocido"}`);
  }
  return payload;
}

async function saveToken(tokenPath, token) {
  await fs.writeFile(tokenPath, `${JSON.stringify(token, null, 2)}\n`, { mode: 0o600 });
  try {
    await fs.chmod(tokenPath, 0o600);
  } catch {
    // Windows puede ignorar los permisos POSIX; el archivo sigue fuera del repo.
  }
}

async function refreshAccessToken(client, tokenPath, token) {
  if (!token.refresh_token) return null;
  const refreshed = await exchangeToken(client, {
    client_id: client.client_id,
    client_secret: client.client_secret,
    grant_type: "refresh_token",
    refresh_token: token.refresh_token,
  });
  const merged = {
    ...token,
    ...refreshed,
    refresh_token: refreshed.refresh_token || token.refresh_token,
    expires_at: Date.now() + Number(refreshed.expires_in || 3600) * 1000,
  };
  await saveToken(tokenPath, merged);
  return merged;
}

let pendingAuthorizationSession = null;

async function startAuthorizationSession(client, tokenPath) {
  const state = base64Url(randomBytes(24));
  const verifier = base64Url(randomBytes(64));
  const challenge = base64Url(createHash("sha256").update(verifier).digest());

  let resolveCallback;
  let rejectCallback;
  const callback = new Promise((resolve, reject) => {
    resolveCallback = resolve;
    rejectCallback = reject;
  });

  const server = createServer((request, response) => {
    try {
      const callbackUrl = new URL(request.url, "http://127.0.0.1");
      if (callbackUrl.pathname !== "/oauth2callback") {
        response.writeHead(404).end("Not found");
        return;
      }
      if (callbackUrl.searchParams.get("state") !== state) {
        throw new Error("El estado OAuth recibido no coincide.");
      }
      const oauthError = callbackUrl.searchParams.get("error");
      if (oauthError) throw new Error(`Autorización cancelada o rechazada: ${oauthError}`);
      const code = callbackUrl.searchParams.get("code");
      if (!code) throw new Error("Google no devolvió el código de autorización.");

      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end("<h1>Autorización completada</h1><p>Puedes cerrar esta pestaña y volver a Codex.</p>");
      resolveCallback(code);
    } catch (error) {
      response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
      response.end("No fue posible completar la autorización.");
      rejectCallback(error);
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  const redirectUri = `http://127.0.0.1:${address.port}/oauth2callback`;
  const authUri = client.auth_uri || "https://accounts.google.com/o/oauth2/v2/auth";
  const authUrl = new URL(authUri);
  authUrl.search = new URLSearchParams({
    client_id: client.client_id,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: OAUTH_SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  }).toString();

  return {
    authorizationUrl: authUrl.toString(),
    finish: async () => {
      try {
        const code = await callback;
        const granted = await exchangeToken(client, {
          client_id: client.client_id,
          client_secret: client.client_secret,
          code,
          code_verifier: verifier,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        });
        const token = {
          ...granted,
          expires_at: Date.now() + Number(granted.expires_in || 3600) * 1000,
        };
        await saveToken(tokenPath, token);
        return token;
      } finally {
        server.close();
      }
    },
  };
}

async function authorizeInteractively(client, tokenPath, onAuthorizationUrl) {
  const session = await startAuthorizationSession(client, tokenPath);
  console.log("\nAbriendo Google para autorizar acceso de solo lectura.");
  console.log("Si el navegador no se abre, copia esta URL:\n");
  console.log(session.authorizationUrl, "\n");
  if (onAuthorizationUrl) {
    await onAuthorizationUrl(session.authorizationUrl);
  } else {
    openBrowser(session.authorizationUrl);
  }
  return session.finish();
}

export async function beginAuthorization() {
  if (pendingAuthorizationSession) {
    return { authorizationRequired: true, authorizationUrl: pendingAuthorizationSession.authorizationUrl };
  }

  const credentialsDir = env("GA4_CREDENTIALS_DIR", DEFAULT_CREDENTIALS_DIR);
  const tokenPath = env("GA4_TOKEN_PATH", DEFAULT_TOKEN_PATH);
  const client = await findDesktopClient(credentialsDir);

  try {
    const existing = JSON.parse(await fs.readFile(tokenPath, "utf8"));
    if (existing.access_token || existing.refresh_token) {
      return { authorizationRequired: false, authorizationUrl: null };
    }
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.warn("El token existente no es válido; se solicitará autorización nuevamente.");
    }
  }

  pendingAuthorizationSession = await startAuthorizationSession(client, tokenPath);
  return {
    authorizationRequired: true,
    authorizationUrl: pendingAuthorizationSession.authorizationUrl,
  };
}

export async function completeAuthorization() {
  if (!pendingAuthorizationSession) return { completed: false };
  const session = pendingAuthorizationSession;
  try {
    await session.finish();
    return { completed: true };
  } finally {
    pendingAuthorizationSession = null;
  }
}

async function getToken(client, tokenPath, onAuthorizationUrl) {
  try {
    const token = JSON.parse(await fs.readFile(tokenPath, "utf8"));
    if (token.access_token && Number(token.expires_at || 0) > Date.now() + 60_000) return token;
    const refreshed = await refreshAccessToken(client, tokenPath, token);
    if (refreshed) return refreshed;
  } catch (error) {
    if (error?.code !== "ENOENT") console.warn("El token guardado no pudo reutilizarse; se solicitará autorización nuevamente.");
  }
  return authorizeInteractively(client, tokenPath, onAuthorizationUrl);
}

async function apiPost(url, accessToken, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) {
    const message = payload?.error?.message || "error desconocido";
    throw new Error(`GA4 Data API respondió ${response.status}: ${message}`);
  }
  return payload;
}

async function runReport(propertyId, accessToken, report, startDate, endDate) {
  const rows = [];
  const limit = 100_000;
  let offset = 0;
  let rowCount = 0;
  let dimensionHeaders = report.dimensions;
  let metricHeaders = report.metrics;

  do {
    const body = {
      dateRanges: [{ startDate, endDate }],
      dimensions: report.dimensions.map((name) => ({ name })),
      metrics: report.metrics.map((name) => ({ name })),
      dimensionFilter: {
        filter: {
          fieldName: "sessionDefaultChannelGroup",
          stringFilter: { matchType: "EXACT", value: "Organic Search", caseSensitive: false },
        },
      },
      orderBys: report.orderBys,
      keepEmptyRows: false,
      limit,
      offset,
    };

    const payload = await apiPost(
      `${API_ROOT}/properties/${encodeURIComponent(propertyId)}:runReport`,
      accessToken,
      body,
    );
    dimensionHeaders = payload.dimensionHeaders?.map((header) => header.name) || dimensionHeaders;
    metricHeaders = payload.metricHeaders?.map((header) => header.name) || metricHeaders;
    rowCount = Number(payload.rowCount || 0);

    for (const row of payload.rows || []) {
      rows.push([
        ...(row.dimensionValues || []).map((value) => value.value ?? ""),
        ...(row.metricValues || []).map((value) => value.value ?? ""),
      ]);
    }
    offset += payload.rows?.length || 0;
  } while (offset < rowCount && offset > 0);

  return { headers: [...dimensionHeaders, ...metricHeaders], rows, rowCount };
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function writeCsv(filePath, headers, rows) {
  const lines = [headers, ...rows].map((row) => row.map(csvCell).join(","));
  await fs.writeFile(filePath, `\uFEFF${lines.join("\r\n")}\r\n`, "utf8");
}

export async function main(options = {}) {
  const credentialsDir = env("GA4_CREDENTIALS_DIR", DEFAULT_CREDENTIALS_DIR);
  const configPath = env("GA4_CONFIG_PATH", DEFAULT_CONFIG_PATH);
  const tokenPath = env("GA4_TOKEN_PATH", DEFAULT_TOKEN_PATH);
  const outputDir = env("GA4_OUTPUT_DIR", DEFAULT_OUTPUT_DIR);
  const startDate = env("GA4_START_DATE", "2025-08-01");
  const endDate = env("GA4_END_DATE", "2026-07-31");

  const config = parseSimpleYaml(await fs.readFile(configPath, "utf8"));
  const propertyId = config.GA4_PROPERTY_ID || config.ga4_property_id || config.property_id;
  if (!/^\d+$/.test(propertyId || "")) {
    throw new Error("Falta un GA4_PROPERTY_ID numérico en credentials.yml.");
  }

  const client = await findDesktopClient(credentialsDir);
  let token = await getToken(client, tokenPath, options.onAuthorizationUrl);
  await fs.mkdir(outputDir, { recursive: true });

  const manifest = {
    generatedAt: new Date().toISOString(),
    dateRange: { startDate, endDate },
    filter: { sessionDefaultChannelGroup: "Organic Search" },
    reports: [],
  };

  for (const report of REPORTS) {
    runtimeProcess.stdout.write(`Exportando ${report.key}... `);
    let result;
    try {
      result = await runReport(propertyId, token.access_token, report, startDate, endDate);
    } catch (error) {
      if (!String(error.message).includes("respondió 401")) throw error;
      token = await refreshAccessToken(client, tokenPath, token);
      if (!token) throw error;
      result = await runReport(propertyId, token.access_token, report, startDate, endDate);
    }

    const filename = `GA4-SEO-${report.key}-${startDate}_${endDate}.csv`;
    await writeCsv(path.join(outputDir, filename), result.headers, result.rows);
    manifest.reports.push({ key: report.key, filename, rows: result.rows.length, rowCount: result.rowCount });
    console.log(`${result.rows.length} filas`);
  }

  await fs.writeFile(
    path.join(outputDir, `GA4-SEO-manifest-${startDate}_${endDate}.json`),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  console.log(`\nListo. Archivos guardados en: ${outputDir}`);
}

if (runtimeProcess.argv[1] && import.meta.url === pathToFileURL(path.resolve(runtimeProcess.argv[1])).href) {
  main().catch((error) => {
    console.error(`\nError: ${error.message}`);
    runtimeProcess.exitCode = 1;
  });
}
