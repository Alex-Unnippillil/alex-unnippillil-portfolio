export interface FakeReceipt {
  id: string;
  amount: number;
  currency: string;
  description: string;
  test: true;
}

export default class PaymentTestUtils {
  static isTestKey(key: string): boolean {
    return /^((sk|pk)_test_)/.test(key);
  }

  static assertTestKey(key: string): void {
    if (!PaymentTestUtils.isTestKey(key)) {
      throw new Error('Test key required. Live keys are not allowed in test mode.');
    }
  }

  static testModeBanner(): string {
    return 'TEST MODE — using test keys; operations are non-billable';
  }

  static generateFakeReceipt(amount: number, currency = 'usd', description = 'Test charge'): FakeReceipt {
    const id = `rcpt_${Math.random().toString(36).substring(2, 10)}`;
    return {
      id,
      amount,
      currency,
      description,
      test: true,
    };
  }

  static guardProduction(key: string, env: string): void {
    if (env === 'production' && PaymentTestUtils.isTestKey(key)) {
      throw new Error('Test keys must not be used in production.');
    }
  }

  static demoCharge(amount: number): { success: boolean; billed: boolean; amount: number } {
    return {
      success: true,
      billed: false,
      amount,
    };
  }
}
