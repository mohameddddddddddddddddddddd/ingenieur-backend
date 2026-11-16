
import { test } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const uid = Date.now();
const PASSWORD = "Password123";

async function call(method, path, { body, token } = {}) {
    const res = await fetch(BASE + path, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: body ? JSON.stringify(body) : undefined
    });
    return { status: res.status, data: await res.json().catch(() => ({})) };
}

const agent = { nom: "Agent", email: `agent${uid}@sangconnect.tn`, password: PASSWORD };
const admin = { nom: "Admin", email: `admin${uid}@sangconnect.tn`, password: PASSWORD, role: "ADMIN" };
let agentToken, adminToken, agentId;

test("1. Inscription réussie (201, sans mot de passe dans la réponse)", async () => {
    const r = await call("POST", "/api/auth/register", { body: agent });
    assert.equal(r.status, 201);
    assert.equal(r.data.password, undefined);
    assert.equal(r.data.role, "AGENT_CENTRE");
    agentId = r.data.id;
    await call("POST", "/api/auth/register", { body: admin });
});

test("2. Email déjà utilisé (409)", async () => {
    const r = await call("POST", "/api/auth/register", { body: agent });
    assert.equal(r.status, 409);
});

test("2b. Mot de passe trop faible (400)", async () => {
    const r = await call("POST", "/api/auth/register", {
        body: { nom: "Test", email: `x${uid}@t.tn`, password: "abcdefgh" }
    });
    assert.equal(r.status, 400);
});

test("3. Mot de passe incorrect (401)", async () => {
    const r = await call("POST", "/api/auth/login", {
        body: { email: agent.email, password: "Mauvais123" }
    });
    assert.equal(r.status, 401);
});

test("4. Utilisateur inexistant (401)", async () => {
    const r = await call("POST", "/api/auth/login", {
        body: { email: `inconnu${uid}@t.tn`, password: PASSWORD }
    });
    assert.equal(r.status, 401);
});

test("5. Login réussi (200 + token)", async () => {
    const a = await call("POST", "/api/auth/login", { body: { email: agent.email, password: PASSWORD } });
    assert.equal(a.status, 200);
    assert.ok(a.data.token);
    agentToken = a.data.token;
    const b = await call("POST", "/api/auth/login", { body: { email: admin.email, password: PASSWORD } });
    adminToken = b.data.token;
});

test("6. Token absent (401)", async () => {
    const r = await call("GET", "/api/dons");
    assert.equal(r.status, 401);
});

test("7. Token invalide (401)", async () => {
    const r = await call("GET", "/api/dons", { token: "abc.def.ghi" });
    assert.equal(r.status, 401);
});

test("8. Token expiré (401)", async () => {
    const expired = jwt.sign(
        { sub: "1", email: "a@a.tn", role: "ADMIN" },
        process.env.JWT_SECRET,
        { expiresIn: -10 }
    );
    const r = await call("GET", "/api/dons", { token: expired });
    assert.equal(r.status, 401);
    assert.match(r.data.message, /expiré/);
});

test("9. Rôle insuffisant (403)", async () => {
    const r = await call("DELETE", `/api/users/${agentId}`, { token: agentToken });
    assert.equal(r.status, 403);
});

test("10. Accès autorisé (200)", async () => {
    const r = await call("GET", "/api/dons", { token: agentToken });
    assert.equal(r.status, 200);
    const m = await call("GET", "/api/auth/me", { token: agentToken });
    assert.equal(m.status, 200);
    assert.equal(m.data.email, agent.email);
    const d = await call("DELETE", `/api/users/${agentId}`, { token: adminToken });
    assert.equal(d.status, 200);
});
