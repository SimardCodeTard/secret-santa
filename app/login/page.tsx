import LoginSigninForm from '../components/login-signinform';
import styles from './page.module.css';
import Image from 'next/image';

export default function LoginPage() {

    return <div className={styles.page}>
        <main className={styles.main}>
            <LoginSigninForm type='login'></LoginSigninForm>
        </main>
    </div>
}