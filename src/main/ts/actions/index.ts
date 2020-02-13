import { FetchSingleUserAction } from './user';
import { FetchUserAction } from './users';
import { EditUserAction } from './user-edition';
import { FetchTeamAction } from './teams';
import { FetchEventAction } from './events';

export type Action = FetchSingleUserAction
    | EditUserAction
    | FetchEventAction
    | FetchTeamAction
    | FetchUserAction;
