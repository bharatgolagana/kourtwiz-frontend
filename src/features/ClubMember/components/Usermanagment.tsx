import React from 'react';
import { useUserInfo } from '../../../context/UserInfoContext';
import {Userget} from '../../../shared/apis/User/Userget';


const UserManagement: React.FC = () => {
    return (
        <div>
            <p>Welcome to the User Management page!</p>
        </div>
    );
};

export default UserManagement;