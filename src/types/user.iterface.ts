export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
export interface UserDto extends Omit<IUser, 'id'> {
  username: string;
  age: number;
  hobbies: string[];
}
