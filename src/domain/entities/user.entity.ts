export class User {
  constructor(
    public readonly username: string,
    public readonly email: string,
    public password?: string,
    public id?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}
