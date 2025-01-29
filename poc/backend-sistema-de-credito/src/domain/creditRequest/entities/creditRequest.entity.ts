export class CreditRequest {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly status: string,
    public readonly createdAt: Date,
  ) {}
}
