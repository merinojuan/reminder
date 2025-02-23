import type { User } from 'firebase/auth';
import { atom } from 'nanostores';

export type IUser = Pick<User, 'uid' | 'displayName' | 'email' | 'photoURL'>;

export const isOpen = atom(false);
export const user = atom<IUser | null>(null);
export const selectedTags = atom<string[]>([]);
