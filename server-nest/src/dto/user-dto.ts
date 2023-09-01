export class UserDto {
  constructor(
    public id: string,
    public email: string,
    public isActivated: boolean) {
  }
}
