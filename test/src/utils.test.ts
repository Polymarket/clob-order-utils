import { generateOrderSalt } from "../../src/utils";

describe("generateOrderSalt", () => {
  it("gets new salt each time", () => {
    expect(generateOrderSalt()).not.toBe(generateOrderSalt());
  });
});
