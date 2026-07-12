import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuth } from '../../context/AuthContext';
import { validateRegister } from '../../utils/validators';
import { asset } from '../../utils/asset';
import type { RegisterPayload, ValidationErrors } from '../../types';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterPayload>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear this field's error as soon as the user starts fixing it.
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    // Run client-side validation first; bail out before hitting the API.
    const clientErrors = validateRegister(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await register(form);
      navigate('/feed', { replace: true });
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setGeneralError('Unable to register. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <img src={asset('assets/images/shape1.svg')} alt="" className="_shape_img" />
        <img src={asset('assets/images/dark_shape.svg')} alt="" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src={asset('assets/images/shape2.svg')} alt="" className="_shape_img" />
        <img src={asset('assets/images/dark_shape1.svg')} alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_shape_three">
        <img src={asset('assets/images/shape3.svg')} alt="" className="_shape_img" />
        <img src={asset('assets/images/dark_shape2.svg')} alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src={asset('assets/images/registration.png')} alt="Image" />
                </div>
                <div className="_social_registration_right_image_dark">
                  <img src={asset('assets/images/registration1.png')} alt="Image" />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <img src={asset('assets/images/appifybook-logo.svg')} alt="Image" className="_right_logo" />
                </div>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>

                {generalError && <div className="bs-alert">{generalError}</div>}

                <form className="_social_registration_form" onSubmit={handleSubmit} noValidate>
                  <div className="row">
                    <div className="col-xl-6 col-lg-12 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          value={form.first_name}
                          onChange={handleChange}
                          className="form-control _social_registration_input"
                          required
                        />
                        {errors.first_name && (
                          <span className="bs-field-error">{errors.first_name[0]}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-12 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          value={form.last_name}
                          onChange={handleChange}
                          className="form-control _social_registration_input"
                          required
                        />
                        {errors.last_name && (
                          <span className="bs-field-error">{errors.last_name[0]}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="form-control _social_registration_input"
                          required
                        />
                        {errors.email && <span className="bs-field-error">{errors.email[0]}</span>}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          className="form-control _social_registration_input"
                          required
                        />
                        {errors.password && (
                          <span className="bs-field-error">{errors.password[0]}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Repeat Password</label>
                        <input
                          type="password"
                          name="confirm_password"
                          value={form.confirm_password}
                          onChange={handleChange}
                          className="form-control _social_registration_input"
                          required
                        />
                        {errors.confirm_password && (
                          <span className="bs-field-error">{errors.confirm_password[0]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button
                          type="submit"
                          className="_social_registration_form_btn_link _btn1"
                          disabled={submitting}
                        >
                          {submitting ? <span className="bs-spinner" /> : 'Register now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account? <Link to="/login">Login</Link>
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
  )
}
