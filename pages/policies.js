// pages/policies.js
import Head from 'next/head';
import Link from 'next/link';

const PoliciesPage = () => {
  return (
    <div>
      <Head>
        <title>Site Policies</title>
      </Head>

      <header>
        <h1>Site Policies</h1>
      </header>

      <section>
        <h2>Privacy Policy</h2>
        <p>Here you can provide details on how user information is collected, used, and protected.</p>
      </section>

      <section>
        <h2>Terms of Service</h2>
        <p>Define the terms and conditions that users agree to when using your site or services.</p>
      </section>

      <section>
        <h2>Cookie Policy</h2>
        <p>Explain how you use cookies and provide options for users to manage their cookie preferences.</p>
      </section>

      <footer>
        <p>&copy; {new Date().getFullYear()} Jonas Zeferino. All rights reserved.</p>
      </footer>

      <nav>
        <Link href="/">
          Back to Home Page
        </Link>
      </nav>
    </div>
  );
};

export default PoliciesPage;
