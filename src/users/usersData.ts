import { v4 } from 'uuid';
import { IUser } from './user.iterface.ts';

export let users: IUser[] = [
  {
    id: v4(),
    username: 'Tom',
    age: 20,
    hobbies: ['ski', 'football'],
  },
  {
    id: v4(),
    username: 'Dan',
    age: 30,
    hobbies: ['dancing'],
  },
];
