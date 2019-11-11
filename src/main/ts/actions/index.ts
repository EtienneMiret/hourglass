import { FetchSingleUserAction } from './user';
import { FetchUserAction } from './users';

export type Action = FetchSingleUserAction
    | FetchUserAction;
