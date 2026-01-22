export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public password: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public passwordGenerated: boolean,
  ) {}
}