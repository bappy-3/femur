import { describe, expect, it } from "vitest";
import { bdt, formatMoney, groupBdt, percentOf, sumMoney } from "./money";
import { toCsv } from "./csv";

describe("money", () => {
  it("stores taka as integer poisha", () => {
    expect(bdt(1500)).toEqual({ amount: 150000, currency: "BDT" });
    expect(bdt(0.1 + 0.2).amount).toBe(30);
  });

  it("uses Bangladeshi lakh grouping", () => {
    expect(groupBdt(1500)).toBe("1,500");
    expect(groupBdt(150000)).toBe("1,50,000");
    expect(groupBdt(12345678.5)).toBe("1,23,45,678.50");
    expect(formatMoney(bdt(8100))).toBe("৳8,100");
    expect(formatMoney(null)).toBe("Price on request");
  });

  it("sums and takes percentages without float drift", () => {
    expect(sumMoney([bdt(1500), bdt(1800)]).amount).toBe(330000);
    expect(percentOf(bdt(1500), 10).amount).toBe(15000);
  });
});

describe("csv export", () => {
  it("quotes cells and neutralises spreadsheet formulas", () => {
    expect(toCsv([["a,b", 'say "hi"', "=SUM(A1)"]])).toBe('"a,b","say ""hi""","\'=SUM(A1)"');
  });
});
