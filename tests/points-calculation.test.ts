// Tests for Points Calculation System
// Using Jest globals (describe, it, expect are available globally by default in Jest environment)
import {
  calculateRewardPoints,
  calculateLoyaltyPoints,
  calculatePointsUpdate,
} from '../lib/pointsCalculation';

// Mock environment variables if needed, or rely on .env loading if Vitest handles it.
// Since we saw failures that suggest env vars are loaded (or defaults used), we proceed.
// Defaults: Threshold=3000, Amount=5. Loyalty Threshold=5, Amount=100.

describe('Points Calculation System', () => {
  describe('calculateRewardPoints', () => {
    it('should calculate 0 points for amount below 3000', () => {
      expect(calculateRewardPoints(2500)).toBe(0);
    });

    it('should calculate points for amount above 3000 (1x threshold)', () => {
      // 3500 / 3000 = 1.something -> 1 multiplier.
      // Loop 0: max(5-0, 1) = 5.
      expect(calculateRewardPoints(3500)).toBe(5);
    });

    it('should calculate points for amount exactly 3000', () => {
      // 3000 / 3000 = 1.
      // Loop 0: 5.
      expect(calculateRewardPoints(3000)).toBe(5);
    });

    it('should calculate points for multiple thresholds', () => {
      // 6000 / 3000 = 2.
      // Loop 0: 5.
      // Loop 1: max(5-1, 1) = 4.
      // Total = 9.
      expect(calculateRewardPoints(6000)).toBe(9);
    });

    it('should calculate points for many thresholds (diminishing returns)', () => {
      // 20000 / 3000 = 6.66 -> 6.
      // 0: 5
      // 1: 4
      // 2: 3
      // 3: 2
      // 4: 1
      // 5: 1
      // Total = 16.
      expect(calculateRewardPoints(20000)).toBe(16);
    });
  });

  describe('calculateLoyaltyPoints', () => {
    it('should return total accumulated points based on orders', () => {
      // 5 orders / 5 = 1 * 100 = 100
      expect(calculateLoyaltyPoints(5)).toBe(100);
      // 10 orders / 5 = 2 * 100 = 200
      expect(calculateLoyaltyPoints(10)).toBe(200);
      // 15 orders / 5 = 3 * 100 = 300
      expect(calculateLoyaltyPoints(15)).toBe(300);
    });

    it('should return same points for orders between thresholds', () => {
      // 4 / 5 = 0.
      expect(calculateLoyaltyPoints(4)).toBe(0);
      // 6 / 5 = 1 * 100 = 100.
      expect(calculateLoyaltyPoints(6)).toBe(100);
    });
  });

  describe('calculatePointsUpdate', () => {
    it('should calculate update correctly', () => {
      // Order Total: 4000 -> 5 reward points (1x 3000).
      // Current Completed Orders: 4. New Completed Orders: 5.
      // Current Loyalty Points: 0. New Loyalty Points: 100 (for 5 orders).
      // Earned Loyalty: 100 - 0 = 100.

      // Function signature: calculatePointsUpdate(orderTotal, currentCompletedOrders, currentRewardPoints, currentLoyaltyPoints)
      // Note: The function adds newRewardPoints to currentRewardPoints.
      // It returns totalLoyaltyPoints (which is newly calculated total).

      const result = calculatePointsUpdate(4000, 4, 10, 0);

      expect(result.rewardPoints).toBe(15); // 10 existing + 5 new
      expect(result.loyaltyPoints).toBe(100); // Total for 5 orders
      expect(result.message).toContain("Earned 5 reward points for order over $3000!");
      expect(result.message).toContain("Earned 100 loyalty points for completing 5 orders!");
    });

    it('should handle no new loyalty points', () => {
      // Order Total: 4000 -> 5 reward points.
      // Current Completed: 5. New Completed: 6.
      // Current Loyalty: 100. New Loyalty Total: 100 (6 orders is still 1 milestone).
      // Earned Loyalty: 0.

      const result = calculatePointsUpdate(4000, 5, 50, 100);

      expect(result.rewardPoints).toBe(55); // 50 + 5
      expect(result.loyaltyPoints).toBe(100); // Still 100
      expect(result.message).toHaveLength(1); // Only reward points message
      expect(result.message[0]).toContain("Earned 5 reward points");
    });
  });
});
