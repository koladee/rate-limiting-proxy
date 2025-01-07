import { FixedWindowStrategy, SlidingWindowStrategy } from '../../src/services/RateLimitStrategies';

describe('RateLimitStrategies', () => {
  describe('FixedWindowStrategy', () => {
    const strategy = new FixedWindowStrategy();

    it('should allow requests within the limit', () => {
      const result = strategy.canProceed(5, 10);
      expect(result).toBe(true);
    });

    it('should deny requests exceeding the limit', () => {
      const result = strategy.canProceed(10, 10);
      expect(result).toBe(false);
    });

    it('should reset the window correctly', () => {
      const now = new Date();
      const result = strategy.resetWindow(now, 60000, new Date(now.getTime() - 60001));
      expect(result).toBe(true);
    });
  });

  describe('SlidingWindowStrategy', () => {
    const strategy = new SlidingWindowStrategy();

    it('should allow requests within the limit', () => {
      const result = strategy.canProceed(3, 5);
      expect(result).toBe(true);
    });

    it('should deny requests exceeding the limit', () => {
      const result = strategy.canProceed(5, 5);
      expect(result).toBe(false);
    });

    it('should reset the window correctly', () => {
      const now = new Date();
      const result = strategy.resetWindow(now, 30000, new Date(now.getTime() - 30001));
      expect(result).toBe(true);
    });
  });
});
