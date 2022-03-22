import type { NextPage } from 'next';
import Head from 'next/head';
import LoginForm from "../components/loginForm";

const Login: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Open Summer of Code : Login page</title>
            </Head>
            <main className="m-4">
                <LoginForm/>
            </main>
        </div>
    )
}

export default Login

// const Home: NextPage = () => {
//     return (
//         <div className={styles.container}>
//             <Head>
//                 <title>OSOC-6</title>
//             </Head>
//
//             <main className={styles.main}>
//                 <h1 className={styles.title}>Open Summer of Code Tool</h1>
//                 <div className="card">
//                     <h4 className="card-header">Login</h4>
//                     <div className="card-body">
//                         <form>
//                             <div className="form-group">
//                                 <label>Username</label>
//                                 <input name="username" type="text" />
//                             </div>
//                             <div className="form-group">
//                                 <label>Password</label>
//                                 <input name="password" type="password" />
//                             </div>
//                             <button className="btn btn-primary">
//                                 Login
//                             </button>
//                             <button className="btn btn-link">Register</button>
//                         </form>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

//export default Home;


