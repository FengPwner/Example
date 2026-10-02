// solution.js — write your solution here
// ─────────────────────────────────────────────────────────────────────────────
// Problem: Two Sum
//
// Given an array of integers `nums` and an integer `target`, return the
// indices of the two numbers that add up to `target`.
// Exactly one valid answer exists. You may not use the same element twice.
//
// Example: twoSum([2, 7, 11, 15], 9)  →  [0, 1]
//
// To replace this with your own problem:
//   1. Rename the function and update the signature
//   2. Replace the tests in tests.js
//   3. Update the problem description in index.html
// ─────────────────────────────────────────────────────────────────────────────

function twoSum(nums, target) {
  // Hash map approach: O(n) time, O(n) space.
  // For each number, check if its complement (target - num) was already seen.
  var seen = {};

  for (var i = 0; i < nums.length; i++) {
    var complement = target - nums[i];

    if (seen[complement] !== undefined) {
      return [seen[complement], i];
    }

    seen[nums[i]] = i;
  }
}
