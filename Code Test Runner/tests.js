// tests.js — define your test cases here
// ─────────────────────────────────────────────────────────────────────────────
// API:
//   describe(name, fn)   — group related tests (optional)
//   it(name, fn)         — a single test case (alias: test)
//   expect(value)        — start an assertion chain
//   log(...)             — captured output shown in the results panel
//
// Matchers:
//   .toBe(val)                    strict equality (===)
//   .toEqual(val)                 deep equality
//   .toBeTruthy() / .toBeFalsy()
//   .toBeNull() / .toBeUndefined()
//   .toBeGreaterThan(n)           also: OrEqual, LessThan, LessThanOrEqual
//   .toContain(item)              array or string includes
//   .toHaveLength(n)
//   .toThrow()                    value must be a function
//   .not.toBe(val)                negate any matcher with .not
// ─────────────────────────────────────────────────────────────────────────────

describe('Two Sum', function () {

  it('basic case — answer at start', function () {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
  });

  it('answer not at index 0', function () {
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
  });

  it('duplicate values', function () {
    expect(twoSum([3, 3], 6)).toEqual([0, 1]);
  });

  it('negative numbers', function () {
    expect(twoSum([-1, -2, -3, -4, -5], -8)).toEqual([2, 4]);
  });

  it('zero sum', function () {
    expect(twoSum([0, 4, 3, 0], 0)).toEqual([0, 3]);
  });

  it('returns an array of exactly 2 indices', function () {
    var result = twoSum([1, 2, 3], 5);
    expect(result).toHaveLength(2);
  });

  it('indices are within bounds', function () {
    var nums = [5, 3, 8, 1];
    var result = twoSum(nums, 11);   // 3 + 8 = 11
    log('result:', result);
    expect(result[0]).toBeGreaterThanOrEqual(0);
    expect(result[1]).toBeLessThan(nums.length);
  });

  it('the two elements actually sum to target', function () {
    var nums = [4, 1, 9, 7, 5, 2];
    var target = 11;
    var result = twoSum(nums, target);
    log('indices:', result, '→ values:', nums[result[0]], '+', nums[result[1]]);
    expect(nums[result[0]] + nums[result[1]]).toBe(target);
  });

  it('large array — answer near the end', function () {
    var nums = [];
    for (var i = 0; i < 1000; i++) nums.push(i);
    expect(twoSum(nums, 1997)).toEqual([998, 999]);
  });

  it('result indices are distinct (no reuse)', function () {
    var result = twoSum([1, 5, 3, 4], 8);  // 4 + 4 would reuse, should be 3+5 → [1,3]
    expect(result[0]).not.toBe(result[1]);
  });

});
