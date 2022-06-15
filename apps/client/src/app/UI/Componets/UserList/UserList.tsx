import React from 'react';
import User from '../User/User';
import './UserList.scss';
import { PlayerDto } from '@planning-poker/shared/backend-api-client';
import { useGlobalState } from '../../../GlobalStateProvider';
import { useAuth } from '@planning-poker/react/api-hooks';

export interface UserListProps {
  users: PlayerDto[];
}

export function UserList(props: UserListProps) {
  const { state, setState } = useGlobalState();
  const { profile } = useAuth();

  const usersValues = [
    { name: 'User1', card: undefined },
    { name: 'User2', card: 2 },
    { name: 'User3', card: 3 },
  ];
  const userss = props.users
    .sort((a, b) => (a.player === profile?.data?.username ? -1 : 1))
    .map((value) => {
      return (
        <li key={value.player} className="UserList-item">
          <User
            key={value.player}
            value={value.score ?? undefined}
            userName={value.player}
            players={props.users}
          />
        </li>
      );
    });
  return (
    <div className="UserList-container">
      <ul className="UserList-subcontainer">{userss}</ul>
    </div>
  );
}

export default UserList;
