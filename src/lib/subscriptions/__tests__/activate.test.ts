import assert from "node:assert/strict";
import test from "node:test";
import { activateSubscriptionFromIntent } from "../activate";
import { prisma } from "@/lib/prisma";

// Helper to build a fake checkout intent
function buildIntent(memberships: { orgId: string }[]) {
  return {
    id: "intent1",
    status: "paid",
    plan: "basic",
    amount: 1000,
    paymentMethod: "card",
    user: { memberships },
  };
}

test(
  "idempotent behavior when called multiple times",
  { concurrency: false },
  async () => {
    const intent = buildIntent([{ orgId: "org1" }]);

    (prisma.checkoutIntent as any) = { findUnique: async () => intent };

    let findFirstCalls = 0;
    let createCalls = 0;
    (prisma.orgSubscription as any) = {
      findFirst: async () =>
        findFirstCalls++ === 0 ? null : { id: "sub1" },
      create: async () => {
        createCalls += 1;
        return { id: "sub1" };
      },
    };

    let auditCalls = 0;
    (prisma.auditLog as any) = {
      create: async () => {
        auditCalls += 1;
      },
    };

    const first = await activateSubscriptionFromIntent("intent1");
    const second = await activateSubscriptionFromIntent("intent1");

    assert.equal(first, "sub1");
    assert.equal(second, "sub1");
    assert.equal(createCalls, 1);
    assert.equal(auditCalls, 1);
  }
);

test(
  "auto-assignment when a user has exactly one organization",
  { concurrency: false },
  async () => {
    const intent = buildIntent([{ orgId: "org1" }]);

    (prisma.checkoutIntent as any) = { findUnique: async () => intent };

    let captured: any;
    (prisma.orgSubscription as any) = {
      findFirst: async () => null,
      create: async (args: any) => {
        captured = args.data;
        return { id: "sub1" };
      },
    };
    (prisma.auditLog as any) = { create: async () => {} };

    await activateSubscriptionFromIntent("intent1");

    assert.equal(captured.orgId, "org1");
    assert.equal(captured.status, "active");
  }
);

test(
  "pending assignment when a user has multiple organizations",
  { concurrency: false },
  async () => {
    const intent = buildIntent([{ orgId: "org1" }, { orgId: "org2" }]);

    (prisma.checkoutIntent as any) = { findUnique: async () => intent };

    let captured: any;
    (prisma.orgSubscription as any) = {
      findFirst: async () => null,
      create: async (args: any) => {
        captured = args.data;
        return { id: "sub1" };
      },
    };
    (prisma.auditLog as any) = { create: async () => {} };

    await activateSubscriptionFromIntent("intent1");

    assert.equal(captured.orgId, null);
    assert.equal(captured.status, "pending_assignment");
  }
);
