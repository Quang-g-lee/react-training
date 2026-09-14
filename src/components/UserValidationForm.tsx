// import { message } from 'antd'
import { DatePicker } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { Controller, useForm } from 'react-hook-form'
import './UserValidationForm.css'

type FormValues = {
    username: string
    password: string
    confirmPassword: string
    email: string
    phoneNumber: string
    website: string
    dateOfBirth: Dayjs | null
    firstName: string
    lastName: string
    linkedIn: string
    facebook: string
    activeDate: [Dayjs, Dayjs] | null
}

type UserValidationFormProps = { mode: 'onBlur' | 'onSubmit' }

function UserValidationForm({ mode }: UserValidationFormProps) {
    const {
        register, handleSubmit, watch, control, formState: { errors, isValid }
    } = useForm<FormValues>({ mode })

    const handleValidSubmit = (data: FormValues) => { console.log(data) }

    return (
        <form className="validation-form" onSubmit={handleSubmit(handleValidSubmit)}>

            <div className='form-field'>
                <label htmlFor="username">Username</label>
                <input type="text" id="username"
                    {...register('username', {
                        required: 'Username is required',
                        pattern: {
                            value: /^[a-z]{8,}$/,
                            message:
                                "Tối thiểu 8 ký tự, không được bao gồm chữ viết hoa, số và ký tự đặc biệt."
                        }
                    })} />
                {errors.username && (<p className="error-message">{errors.username.message}</p>)}
            </div>

            <div className="form-field">
                <label htmlFor="password">Password</label>

                <input
                    id="password"
                    type="password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password phải có ít nhất 8 ký tự',
                        },
                        pattern: {
                            value:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/,
                            message:
                                'Password phải có chữ thường, chữ hoa, số và ký tự đặc biệt',
                        },
                    })}
                />

                {errors.password && (
                    <p className="error-message">{errors.password.message}</p>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="confirmPassword">
                    Confirm Password
                </label>

                <input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword', {
                        required: 'Confirm password is required',
                        minLength: {
                            value: 8,
                            message: 'Confirm password phải có ít nhất 8 ký tự',
                        },
                        validate: (value) =>
                            value === watch('password') ||
                            'Confirm password không khớp với password',
                    })}
                />

                {errors.confirmPassword && (
                    <p className="error-message">{errors.confirmPassword.message}</p>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="email">Email address</label>

                <input
                    id="email"
                    type="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Email không đúng định dạng',
                        },
                    })}
                />

                {errors.email && (
                    <p className="error-message">{errors.email.message}</p>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="phoneNumber">Phone Number</label>

                <input
                    id="phoneNumber"
                    type="tel"
                    {...register('phoneNumber', {
                        required: 'Phone number is required',
                        minLength: {
                            value: 10,
                            message: 'Số điện thoại phải có ít nhất 10 số',
                        },
                        maxLength: {
                            value: 12,
                            message: 'Số điện thoại có nhiều nhất 12 số',
                        },
                        pattern: {
                            value: /^0[0-9]*$/,
                            message: 'Số điện thoại phải bắt đầu bằng 0 và chỉ chứa chữ số',
                        },
                    })}
                />

                {errors.phoneNumber && (
                    <p className="error-message">{errors.phoneNumber.message}</p>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="website">Website</label>

                <input
                    id="website"
                    type="text"
                    {...register('website', {
                        required: 'Website is required',
                        pattern: {
                            value: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
                            message: 'Địa chỉ website không hợp lệ',
                        },
                    })}
                />

                {errors.website && (
                    <p className="error-message">{errors.website.message}</p>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="dateOfBirth">Date of Birth</label>

                <Controller
                    name="dateOfBirth"
                    control={control}
                    rules={{
                        required: 'Date of birth không được bỏ trống',
                    }}
                    render={({ field }) => (
                        <DatePicker
                            id="dateOfBirth"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            format="DD/MM/YYYY"
                            disabledDate={(currentDate) =>
                                currentDate.isBefore(dayjs('1980-01-01'), 'day') ||
                                currentDate.isAfter(dayjs('2020-12-31'), 'day')
                            }
                        />
                    )}
                />

                {errors.dateOfBirth && (
                    <p className="error-message">{errors.dateOfBirth.message}</p>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="firstName">First Name</label>

                <input
                    id="firstName"
                    type="text"
                    {...register('firstName', {
                        required: 'First name is required',
                    })}
                />

                {errors.firstName && (
                    <p className="error-message">{errors.firstName.message}</p>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="lastName">Last Name</label>

                <input
                    id="lastName"
                    type="text"
                    {...register('lastName', {
                        required: 'Last name is required',
                    })}
                />

                {errors.lastName && (
                    <p className="error-message">{errors.lastName.message}</p>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="linkedIn">LinkedIn</label>

                <input
                    id="linkedIn"
                    type="text"
                    {...register('linkedIn', {
                        pattern: {
                            value: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
                            message: 'Cần nhập chính xác link LinkedIn',
                        },
                    })}
                />

                {errors.linkedIn && (
                    <p className="error-message">{errors.linkedIn.message}</p>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="facebook">Facebook</label>

                <input
                    id="facebook"
                    type="text"
                    {...register('facebook', {
                        pattern: {
                            value: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
                            message: 'Cần nhập chính xác link Facebook',
                        },
                    })}
                />

                {errors.facebook && (
                    <p className="error-message">{errors.facebook.message}</p>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="activeDateStart">
                    Active Range
                </label>

                <Controller
                    name="activeDate"
                    control={control}
                    rules={{
                        required: 'Active date không được bỏ trống',
                    }}
                    render={({ field }) => (
                        <DatePicker.RangePicker
                            id={{
                                start: 'activeDateStart',
                                end: 'activeDateEnd',
                            }}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            format="DD/MM/YYYY"
                            disabledDate={(currentDate) =>
                                currentDate.isBefore(
                                    dayjs().startOf('day'),
                                    'day',
                                )
                            }
                        />
                    )}
                />

                {errors.activeDate && (
                    <p className="error-message">{errors.activeDate.message}</p>
                )}
            </div>


            <button type="submit" disabled={mode === 'onBlur' && !isValid}>Submit</button>
        </form>
    )
}

export default UserValidationForm
