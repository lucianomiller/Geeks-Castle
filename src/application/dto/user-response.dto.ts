export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
