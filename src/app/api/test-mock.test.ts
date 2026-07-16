import { describe, it, expect } from "vitest";
import { test } from "./test-mock";

describe("test mock", () => {
  it("test", async () => {
    const result = await test();
    console.log("Result:", result);
    expect(result).toHaveLength(2);
  });
});
