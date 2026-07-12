import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import type { LoginCredentials, ValidationErrors } from '../types';


export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState<LoginCredentials>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        setGeneralError(null);

        try {
            await login(form);
            navigate("/feed");
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                setGeneralError('Unable to sign in. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="_social_login_wrapper _layout_main_wrapper">
            <div className="_shape_one">
                <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape.svg" alt="" className="_dark_shape" />
            </div>
            <div className="_shape_two">
                <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" />
            </div>
            <div className="_shape_three">
                <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" />
            </div>
            <div className="_social_login_wrap">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                            <div className="_social_login_left">
                                <div className="_social_login_left_image">
                                    <img src="/assets/images/login.png" alt="Image" className="_left_img" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                            <div className="_social_login_content">
                                <div className="_social_login_left_logo _mar_b28">
                                    <img src="/assets/images/appifybook-logo.svg" alt="Image" className="_left_logo" />
                                </div>
                                <p className="_social_login_content_para _mar_b8">Welcome back</p>
                                <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>

                                {generalError && <div className="bs-alert">{generalError}</div>}

                                <form className="_social_login_form" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <div className="_social_login_form_input _mar_b14">
                                                <label className="_social_login_label _mar_b8">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    className="form-control _social_login_input"
                                                    required
                                                />
                                                {errors.email && <span className="bs-field-error">{errors.email[0]}</span>}
                                            </div>
                                        </div>
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <div className="_social_login_form_input _mar_b14">
                                                <label className="_social_login_label _mar_b8">Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={form.password}
                                                    onChange={handleChange}
                                                    className="form-control _social_login_input"
                                                    required
                                                />
                                                {errors.password && <span className="bs-field-error">{errors.password[0]}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                                            <div className="_social_login_form_btn _mar_t40 _mar_b60">
                                                <button
                                                    type="submit"
                                                    className="_social_login_form_btn_link _btn1"
                                                    disabled={submitting}
                                                >
                                                    {submitting ? <span className="bs-spinner" /> : 'Login now'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className="row">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                        <div className="_social_login_bottom_txt">
                                            <p className="_social_login_bottom_txt_para">
                                                Dont have an account? <Link to="/register">Create New Account</Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}




