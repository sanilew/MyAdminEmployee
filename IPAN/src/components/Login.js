import React, { useRef, useState, useContext } from "react";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';

function Login() {

    // Ref to access the form
    const formRef = useRef(null);

    // State to manage form errors
    const [errors, setErrors] = useState();

    // Flag to track if there are errors
    let isError = false;

    // Hook for navigation
    const navigate = useNavigate();

    // Ref for Toast component to show error messages
    const toast = useRef(null);

    // Accessing the UserContext
    const user_context = useContext(UserContext);

    // Function to handle form submission
    async function handleOnSubmit(e) {
        e.preventDefault();

        // Extracting values from the form
        const emailValue = formRef.current.email.value;
        const passwordValue = formRef.current.password.value;

        // Validation for email
        if(!emailValue.trim() || !isValidEmail(emailValue)){
            isError = true;
            setErrors(prevErrors => ({
                ...prevErrors,
                email: "Please enter a valid email address."
            }));
        }
        else{
            isError = false;
            setErrors(prevErrors => ({
                ...prevErrors,
                email: null
            }));
        }

        // Validation for password
        if(!passwordValue.trim()){
            isError = true;
            setErrors(prevErrors => ({
                ...prevErrors,
                password: "Please enter your password."
            }));
        }
        else{
            isError = false;
            setErrors(prevErrors => ({
                ...prevErrors,
                password: null
            }));
        }

        // If there are no errors, attempt to log in
        if(!isError){
            const data = {
                email: emailValue,
                password: passwordValue
            }

            const response = await user_context.userLogin(data);

            // Check the response for success or failure
            if(response["success"] === true){
                navigate("/")
            }
            else{
                // Display error message using Toast
                toast.current.show({ severity: 'error', summary: 'Error', detail: response["error"], life: 3000 });
            }
        }

        // Function to validate email format
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }

    return (
        <>
            {/* Toast component for displaying error messages */}
            <Toast ref={toast} />
            <div className="container">
                <div className="row m-5" style={{background: "linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(221,173,70,1) 100%)", borderRadius: "30px"}}>
                    <div className="m-5">
                        <h1 className="text-center">Login Here !!!</h1>
                        <form className="offset-md-3 col-md-6" ref={formRef} onSubmit={handleOnSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-lable">Email Address</label>
                                <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" />
                                {errors?.email && <div className="text-danger">{errors.email}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-lable">Password</label>
                                <input type="password" className="form-control" id="password" name="password" aria-describedby="passwordHelp" />
                                {errors?.password && <div className="text-danger">{errors.password}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;