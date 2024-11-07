'use client';;
import styles from './page.module.css';
import LoginSigninForm from '../components/login-signinform';

export default function LoginPage() {
    return <div className={styles.page}>
        <main className={styles.main}>
            <LoginSigninForm type='signin'></LoginSigninForm>
        </main>
    </div>
}