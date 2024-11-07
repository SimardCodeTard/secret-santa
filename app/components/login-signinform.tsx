'use client';

import axios from "axios";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { APIResponseStatuses } from "../lib/enums";
import { isDefined } from "../lib/utils";
import styles from './login-signinform.module.css';
import Image from 'next/image';

export default function LoginSigninForm(props: { type: 'login' | 'signin' }) {

    const [formUsername, setUsernameEmail] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPassword, setFormPassword] = useState('');

    const [error, setError] = useState('');

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (props.type === 'signin') {
            register();
        } else {
            login();
        }
    }

    const login = async () => {
        if (!isDefined(formEmail) || !isDefined(formPassword)) {
            return;
        }
        console.log('login', formEmail, formPassword);

        axios.post('/api/v1/users/login', {
            email: formEmail,
            password: formPassword
        }).then(res => {
            console.log(res);
        }).catch(err => {
            if(err.status === APIResponseStatuses.FORBIDDEN) {
                setError('Mot de passe ou email incorrect');
            } else if (err.status === APIResponseStatuses.BAD_REQUEST) {
                setError('Le mot de passe et l\'email sont requis');
            } else {
                setError('Erreur serveur inconnue');
            }
            console.error(err);
        });
    }

    const register = async () => {
        if (!isDefined(formUsername) || !isDefined(formEmail) || !isDefined(formPassword)) {
            return;
        }
        axios.post('/api/v1/users/new', {
            username: formUsername,
            email: formEmail,
            password: formPassword
        }).then(res => {
            console.log(res);
            console.log(res.data);
        }).catch(err => {
            if(err.status === APIResponseStatuses.FORBIDDEN) {
                setError('Mot de passe ou email incorrect');
            } else if (err.status === APIResponseStatuses.BAD_REQUEST) {
                setError('Le mot de passe et l\'email sont requis');
            } else if (err.status === APIResponseStatuses.CONFLICT) {
                setError('Utilisateur déjà existant');
            } else {
                setError('Erreur serveur inconnue');
            }
            console.error(err);
        });
    }

    const onUsernameFieldChange = (e: FormEvent<HTMLInputElement>) => {
        setUsernameEmail(e.currentTarget.value);
    }

    const onEmailFieldChange = (e: FormEvent<HTMLInputElement>) => {
        setFormEmail(e.currentTarget.value);
    }

    const onPasswordFieldChange = (e: FormEvent<HTMLInputElement>) => {
        setFormPassword(e.currentTarget.value);
    }

    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <h2>{props.type === 'signin' ? 'Créer un Compte' : 'Connexion'}</h2>

            <div className={styles.form_content}>
                <div className={styles.form_content_inputs}>
                    {props.type === 'signin' 
                        ? <input 
                            type="text"
                            placeholder="Nom d'utilisateur" 
                            value={formUsername} 
                            onChange={onUsernameFieldChange}
                        /> 
                        : <></>
                    }
                    <input 
                        type="text"
                        name="email"
                        placeholder="Mail"
                        value={formEmail}
                        onChange={onEmailFieldChange}
                    />
                    <input 
                        type="password"
                        name="password"
                        placeholder="Mot de Passe"
                        value={formPassword}
                        onChange={onPasswordFieldChange}
                    />                   
                    <p className={styles.error}>{error}</p>
                </div>

                <Image src={'/illustrations/' + (props.type === 'signin' ? 'signup.svg' : 'login.svg')} height={200} width={200} alt=''></Image>
            </div>

            <div className={styles.form_actions}>
                <Link className={styles.form_link} href={props.type === 'signin' ? '/login' : '/register'}>
                    {props.type === 'signin' ? 'Vous avez déjà un compte ?' : 'Première connexion ?'}
                </Link>

                <button className={styles.form_submit} type="submit">
                    {props.type === 'signin' ? 'Créer un compte' : 'Connexion'}
                </button>
            </div>
        </form>
    );
}