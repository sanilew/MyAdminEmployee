import { createContext, useState, useContext } from "react";
import { Cookies } from "react-cookie";

const UserContext = createContext();
const baseUrl = "http://localhost:5000/api";

const cookies = new Cookies();

export const UserProiver = (props) => {
    const [users, setUsers] = useState([]);
    const [loading, setIsLoading] = useState([]);

    const userLogin = async (user) => {
        try {

            setIsLoading(true);
            const response = await fetch(`${baseUrl}/auth/login`, {
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: "POST",
            });

            const data = await response.json();

            if (data.success) {
                cookies.set("token", data["authToken"]);
                cookies.set("role", data["role"]);
            }

            setIsLoading(false);
            
            return data;
        } catch (error) {
            console.error("Error while try to login.");
            return false;
        }
    }

    const getUserList = async () => {
        try {

            setIsLoading(true);
            const response = await fetch(`${baseUrl}/user/fetchalluser`, {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": cookies.get("token")
                },
                method: "GET",
            });

            const data = await response.json();

            if (data.success) {
                setUsers(data["users"])
            }

            setIsLoading(false);

            return true;
        } catch (error) {
            console.error("Error while try to login.");
            return false;
        }
    }

    const addUser = async (user) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${baseUrl}/auth/register`, {
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": cookies.get("token")
                },
                method: "POST"
            });

            const data = await response.json();

            if (data.success) {
                setUsers(users.concat(data["user"]));
                setIsLoading(false);
                return true;
            }
            else {
                setIsLoading(false);
                return true;
            }

        } catch (error) {
            console.error("Error while try to login.");
            return false;
        }
    }

    const updateUser = async (user) => {
        try {

            for (const key in user) {
                if (user[key] === "") {
                    delete user[key];
                }
            }


            setIsLoading(true);
            const response = await fetch(`${baseUrl}/user/updateuser/${user._id}`, {
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": cookies.get("token")
                },
                method: "PUT"
            });

            const data = await response.json();

            if (data.success) {

                for (let index = 0; index < users.length; index++) {
                    const element = users[index];
                    if (element._id === data["user"]["_id"]) {
                        const updatedUsers = [...users];
                        updatedUsers[index] = data.user;
                        setUsers(updatedUsers);
                        break;
                    }
                }
                // setNotes(updatedNote);

                setIsLoading(false);
                return true;
            }
            else {
                setIsLoading(false);
                return false;
            }

        } catch (error) {
            console.error("Error while try to update.", error);
            return false;
        }
    }

    const deleteUser = async (id) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${baseUrl}/user/deleteuser/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": cookies.get("token")
                },
                method: "DELETE"
            });

            const data = await response.json();

            if (data.success) {
                setUsers((prevData) => prevData.filter((user) => user._id !== data["user"]["_id"]))
            }

            setIsLoading(false);

            return true;
        } catch (error) {
            console.error("Error while try to login.");
            return false;
        }
    }

    const context = {
        userLogin: userLogin,
        getUserList: getUserList,
        addUser: addUser,
        updateUser: updateUser,
        deleteUser: deleteUser,
        usersList: users,
        loading: loading
    };

    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    );
};

export const useUsersContext = () => useContext(UserContext);
export default UserContext;