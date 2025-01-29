export class CreateCreditRequestCommand {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
  ) {}
}
