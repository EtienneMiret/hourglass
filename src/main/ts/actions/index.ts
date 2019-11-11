import { FetchSingleUserAction } from './user';
import { FetchUserAction } from './users';
import { EditUserAction } from './user-edition';

export type Action = FetchSingleUserAction
    | EditUserAction
    | FetchUserAction;
