import { connect } from 'react-redux';
import { GlobalState } from '../state';
import { fetchUsers } from '../actions/users';
import { UserListBlock } from '../components/UserListBlock';

function mapStateToProps (state: GlobalState) {
  const users = Object.values (state.users.list)
      .map (u => u.user);
  users.sort ((a, b) => a.name.localeCompare (b.name));
  return {
    users,
    status: state.users.status
  };
}

const mapDispatchToProps = {
  fetchUsers
};

export const UserListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
) (UserListBlock);
