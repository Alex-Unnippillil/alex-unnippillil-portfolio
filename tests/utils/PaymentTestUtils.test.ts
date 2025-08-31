import PaymentTestUtils, { FakeReceipt } from '../../src/utils/PaymentTestUtils';

describe('PaymentTestUtils', () => {
  describe('isTestKey', () => {
    it('detects test key', () => {
      expect(PaymentTestUtils.isTestKey('sk_test_123')).toBe(true);
      expect(PaymentTestUtils.isTestKey('pk_test_456')).toBe(true);
      expect(PaymentTestUtils.isTestKey('sk_live_123')).toBe(false);
    });
  });

  describe('assertTestKey', () => {
    it('throws on live key', () => {
      expect(() => PaymentTestUtils.assertTestKey('sk_live_123')).toThrow();
    });
  });

  describe('generateFakeReceipt', () => {
    it('creates non-billable receipt', () => {
      const receipt: FakeReceipt = PaymentTestUtils.generateFakeReceipt(100, 'usd', 'Test');
      expect(receipt.test).toBe(true);
      expect(receipt.amount).toBe(100);
      expect(receipt.currency).toBe('usd');
    });
  });

  describe('guardProduction', () => {
    it('blocks test key in production', () => {
      expect(() => PaymentTestUtils.guardProduction('sk_test_123', 'production')).toThrow();
    });
  });

  describe('demoCharge', () => {
    it('simulates charge without billing', () => {
      const result = PaymentTestUtils.demoCharge(250);
      expect(result.billed).toBe(false);
      expect(result.amount).toBe(250);
    });
  });
});
