import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../store/RootState';
import { ApplicationContextConsumerProps, AsyncTaskContext, withApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';
import { UserData, getUsers } from '../store/api';
import { createSetUsersAction } from '../store/user/UserActions';

type UsersProps = {};

type UsersStoreProps = {
  users: UserData[] | null;
};

type UsersStoreActions = {
  setUsers: (users: UserData[]) => void;
};

type UsersAllProps = UsersProps & UsersStoreProps & UsersStoreActions & ApplicationContextConsumerProps;

class Users extends React.Component<UsersAllProps> {
  private asyncTaskContext: AsyncTaskContext;

  constructor(props: UsersAllProps) {
    super(props);

    this.loadUsers = this.loadUsers.bind(this);

    this.asyncTaskContext = this.props.applicationContext as AsyncTaskContext;

    if (Environment.isServer) {
      this.asyncTaskContext.addTask(this.loadUsers());
    }
  }

  private loadUsers(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let users: UserData[] = await getUsers(this.asyncTaskContext);
        this.props.setUsers(users);
        resolve();
      } catch (error) {
        this.props.setUsers([]);
        console.log('Failed to load users. Offline?');
        reject();
      }
    });
  }

  public async componentDidMount(): Promise<void> {
    if (!this.props.users) {
      this.loadUsers();
    }
  }

  public render(): React.ReactNode {
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

const mapStateToProps = (state: RootState): UsersStoreProps => {
  return {
      users: state.users.users
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): UsersStoreActions => {
  return {
      setUsers: (users: UserData[]) => dispatch(createSetUsersAction(users))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplicationContext<UsersAllProps>(Users));
