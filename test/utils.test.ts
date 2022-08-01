var utils = require("../dist/utils")

describe("generateOrderSalt", () => {
  it("gets new salt each time", () => {
    expect(utils.generateOrderSalt()).not.toBe(utils.generateOrderSalt());
  })
})