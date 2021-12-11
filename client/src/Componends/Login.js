import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import
{
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import axios from "axios";
import { useField, useFormik } from "formik";
import { ToastContainer, toast } from 'react-toastify';
import "../CSS/Signup.css";

const Local = `http://localhost:4000/`

const Login = () =>
{
    const [user, setUser] = useState()
    const fetchtoken = localStorage.getItem("token");
    const UserData = localStorage.getItem("UserData");
    const history = useHistory();
    const validate = values =>
    {
        const errors = {}

        if (!values.email)
        {
            errors.email = "Required"
        } else if (values.email.length < 0)
        {
            errors.email = "Email Can't be empty"
        }
        if (!values.password)
        {
            errors.password = "Required"
        } else if (values.password.length < 0)
        {
            errors.password = "Email Can't be empty"
        }
        return errors
    }


    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validate,
        onSubmit: async values =>
        {

            try
            {
                // console.log("37 ", values)
                // alert(JSON.stringify(values, null, 2))
                const { email, password } = values;
                const datas = await axios.post(`${Local}req/login`, { email, password })
                    .then(async (res) =>
                    {
                        await toast(res.data.message)
                        localStorage.setItem("token", JSON.stringify(res.data.token))
                        localStorage.setItem("UserData", JSON.stringify(res.data.isPresent))
                        await setUser(res.data)
                    })
                    .catch((err) => toast(err.response.data.message));


                // console.log("63 ", datas)
                // console.log("64 ", user)
            } catch (error)
            {
                toast(error.response.data.message);
            }


        }
    })

    useEffect(() =>
    {
        try
        {
            if ((UserData !== "undefined") && (UserData !== "") && (UserData !== null))
            {
                history.push("/");
            } else
            {
                history.push("/login");
            }
        } catch (error)
        {
            console.log(error)
        }
    }, [UserData, fetchtoken])

    return (
        <div className="FormBox">
            <form className="Form" onSubmit={formik.handleSubmit}>
                <h2 style={{ alignContent: "center", justifyContent: "center", textAlign: "center" }}>Login</h2>
                <div className="FormContainer">

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
                    <span className="new">New? </span><Link className="link" to="/signup">Create account</Link>

                    <button className="Button" type="submit">Submit</button>
                </div>
                <ToastContainer />
            </form>
        </div>
    )
}

export default Login
