import { FetchSingleUserAction } from './user';
import { FetchUserAction } from './users';
import { EditUserAction } from './user-edition';
import { FetchTeamAction } from './teams';

export type Action = FetchSingleUserAction
    | EditUserAction
    | FetchTeamAction
    | FetchUserAction;
