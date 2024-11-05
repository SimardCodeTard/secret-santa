import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <div className={styles.page}>
      <header className={styles.header}>

      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <h1>Secret Santa</h1>
          <Image src={'/illustrations/santa.svg'} height={200} width={200} alt=""></Image>
          <button className={styles.start_button}> <Link href={'/login'}>Démarrer</Link></button>
        </div>
      </main>
      
      <footer className={styles.footer}>
      
      </footer>
    </div>
  );
}
