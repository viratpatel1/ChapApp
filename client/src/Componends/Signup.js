import React from 'react';
import
{
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { ToastContainer, toast } from 'react-toastify';
import "../CSS/Signup.css";

// const Local = `http://localhost:4000/`;
const Local = `https://chatsappss.herokuapp.com/`;

const Signup = () =>
{

    const validate = values =>
    {
        const errors = {}
        if (!values.username)
        {
            errors.username = "Required"
        }

        if (!values.email)
        {
            errors.email = "Required"
        } else if (values.email.length < 4)
        {
            errors.email = "Must be Characters or more"
        }
        if (!values.password)
        {
            errors.password = "Required"
        } else if (values.password.length < 5)
        {
            errors.password = "Must be more then 5 characters"
        } else if (values.password === "123456789")
        {
            errors.password = "Password Mush not be 123456789 !!"
        }
        return errors
    }

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
        },
        validate,
        onSubmit: async values =>
        {
            try
            {
                // e.preventDefault();
                // alert(JSON.stringify(values, null, 2))
                const { email, password, username, profilepic } = values;
                // console.log("61 ", values)
                // console.log("62", email, password, username)
                await axios.post(`${Local}req/signup`, { username, email, password, profilepic })
                    .then((res) => toast(res.data.message))
                    .catch((err) => toast(err.response.data.message));

            } catch (error)
            {
                toast(error.response.data.message)
            }
        }
    })
    return (
        <div className="FormBox">
            <form className="Form" onSubmit={formik.handleSubmit}>
                <h2 style={{ alignContent: "center", justifyContent: "center", textAlign: "center" }}>Signup</h2>
                <div className="FormContainer">
                    <div className="InputContainer">
                        <lable className="lable" htmlFor="username" >Username</lable>
                        <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} className="input" name="username" />
                        {formik.touched.username && formik.errors.username ? <div className="errors">{formik.errors.username}</div> : null}
                    </div>

                    <div className="InputContainer">
                        <lable className="lable" htmlFor="email" >Email</lable>
                        <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} type="email" className="input" name="email" />
                        {formik.touched.email && formik.errors.email ? <div className="errors">{formik.errors.email}</div> : null}
                    </div>

                    <div className="InputContainer">
                        <lable className="lable" htmlFor="password" >Password</lable>
                        <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} type="password" className="input" name="password" />
                        {formik.touched.password && formik.errors.password ? <div className="errors">{formik.errors.password}</div> : null}
                    </div>

                    <div className="InputContainer">
                        {/* <lable className="lable" htmlFor="password" >Select Profile Image</lable> */}
                        <input type="file" />
                        {/* {formik.touched.password && formik.errors.password ? <div className="errors">{formik.errors.password}</div> : null} */}
                    </div>
                    <Link className="link" to="/login">Already have account</Link>
                    <button className="Button" type="submit">Register</button>
                </div>
                <ToastContainer />
            </form>
        </div>
    )
}

export default Signup
