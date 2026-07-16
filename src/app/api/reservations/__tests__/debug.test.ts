import { describe, it, expect, vi, beforeEach } from "vitest";
import { setAssignTable, getAssignTable } from "../utils";

describe("Debug", () => {
  it("test getAssignTable", async () => {
    console.log("getAssignTable result:", await getAssignTable());
  });
});
