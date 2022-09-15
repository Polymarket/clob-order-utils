import { generateOrderSalt } from "../../src/utils";
import { expect } from "chai";

describe("generateOrderSalt", () => {
  it("gets new salt each time", () => {
    expect(generateOrderSalt()).not.equal(generateOrderSalt());
  });
});
