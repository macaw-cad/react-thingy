import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../store/RootState';
import { ApplicationContextConsumerProps, AsyncTaskContext, withApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';
import { UserData, getUsers } from '../store/api';
import { setUsers } from '../store/user/UserActions';

interface UsersStoreProps {
  users: UserData[] | null;
  setUsers: (users: UserData[]) => void;
}

type UsersAllProps = UsersStoreProps & ApplicationContextConsumerProps;
class Users extends React.Component<UsersAllProps> {
  asyncTaskContext: AsyncTaskContext;

  constructor(props: UsersAllProps) {
    super(props);

    this.asyncTaskContext = this.props.applicationContext as AsyncTaskContext;

    if (Environment.isServer) {
      props.applicationContext.addComponentDidRenderServerSideFunc(this.loadUsers.bind(this));
    }
  }

  async loadUsers() {
    try {
      let users: UserData[] = await getUsers(this.asyncTaskContext);
      this.props.setUsers(users);
    } catch (error) {
      this.props.setUsers([]); // failed to load
      console.log('Faled to load users. Offline?');
    }
  }

  componentDidMount() {
    this.loadUsers();
  }

  render() {
    const { users } = this.props;
    return (
      <div>
        { 
          !!users ?
            users.length === 0 ?
              <h2>Could not load users, are you offline?</h2>
            :
              <ul>
                { users.map((user: UserData) => (
                  <li key={user.id}>
                    {user.first_name} {user.last_name}
                  </li>
                )) }
              </ul>
          :
            <h2>Loading users...</h2>
        }
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
      users: state.user.users
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
      setUsers: (users: UserData[]) => dispatch(setUsers(users))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplicationContext<UsersAllProps>(Users));
