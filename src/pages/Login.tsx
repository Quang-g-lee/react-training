import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import type { AppDispatch } from '../store'
import './Login.css'

function Login() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const location = useLocation()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        dispatch(login())
        const from = (location.state as { from?: string } | null)?.from
        const destination = from?.startsWith('/') && !from.startsWith('//')
            ? from
            : '/welcome'
        navigate(destination, { replace: true })
    }

    return (
        <main className="login-page">
            <section className="login-card">
                <h1>Sign in to your account</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Your email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="login-options">
                        <label className="remember-option">
                            <input type="checkbox" name="remember" />
                            <span>Remember me</span>
                        </label>

                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>

                    <button className="sign-in-button" type="submit">
                        Sign in
                    </button>
                </form>

                <p className="register-text">
                    Don't have an account yet?{' '}
                    <Link to="/register">Sign up</Link>
                </p>
            </section>
        </main>
    )
}

export default Login
