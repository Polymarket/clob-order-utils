import { generateOrderSalt } from "../../src/utils";
import { expect } from "chai";

describe("generateOrderSalt", () => {
  it("gets a salt", () => {
    const salt = generateOrderSalt();
    expect(salt).not.null;
    expect(salt).not.undefined;
    expect(salt).not.empty;
  });

  it("gets new salt each time", () => {
    for (let i = 0; i < 100; i++) {
      expect(generateOrderSalt()).not.equal(generateOrderSalt());
    }

    const salts: string[] = [];

    for (let i = 0; i < 100; i++) {
      salts.push(generateOrderSalt());
    }
    salts.forEach((s1: string, i1) => {
      salts.forEach((s2: string, i2) => {
        if (i1 != i2) {
          expect(s1).not.equal(s2);
        }
      });
    });
  });
});
