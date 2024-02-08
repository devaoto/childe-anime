'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/footer';

const ChildeAnimePrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <div>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">ChildeAnime Privacy Policy</h1>

        <p>Last Updated: {currentDate}</p>

        <p>
          Welcome to ChildeAnime, a personal anime streaming site committed to
          providing a safe and enjoyable experience for users of all ages. Your
          privacy is important to us, and we want you to feel confident in using
          our platform. This Privacy Policy outlines how we collect, use, and
          protect your information.
        </p>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Do Not Collect:
          </h2>
          <p>
            ChildeAnime does not collect or store any personally identifiable
            information from its users. We do not require registration, login,
            or any personal details to access and enjoy the content on our site.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">2. Cookies:</h2>
          <p>
            We do not use any personal cookies or trackers that identify
            individual users. ChildeAnime employs only essential cookies for
            session management and functionality purposes, ensuring a seamless
            and personalized experience during your visit.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            3. Third-Party Sharing:
          </h2>
          <p>
            ChildeAnime does not share any user data, personal cookies, or
            information with third-party websites or services. Your privacy is
            our top priority, and your data is kept confidential within the
            ChildeAnime platform.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">4. Ads:</h2>
          <p>
            ChildeAnime is proud to be an ad-free platform. We do not display
            any advertisements, ensuring a distraction-free and enjoyable anime
            streaming experience for our users.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">5. Age Restriction:</h2>
          <p>
            ChildeAnime is intended for users aged 13 and above. We do not
            knowingly collect or solicit personal information from users under
            the age of 13. If you are under 13, please do not use ChildeAnime or
            provide any personal information on the site.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">6. Security Measures:</h2>
          <p>
            While ChildeAnime does not collect personal information, we employ
            industry-standard security measures to protect against unauthorized
            access, alteration, disclosure, or destruction of any potential data
            that may be collected inadvertently. We use secure, encrypted
            connections (HTTPS) to ensure the safety of your browsing
            experience.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            7. Changes to the Privacy Policy:
          </h2>
          <p>
            ChildeAnime reserves the right to update and modify this Privacy
            Policy at any time. We encourage users to periodically review this
            page to stay informed about how we are protecting your information.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">8. Contact Us:</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            your interactions with ChildeAnime, please contact us at{' '}
            <Link
              href="mailto:contact@childeanime.com"
              className="text-blue-500"
            >
              sohom829@gmail.com
            </Link>
            .
          </p>
        </section>
        <p className="mt-6">
          By using ChildeAnime, you agree to the terms outlined in this Privacy
          Policy. We appreciate your trust in us to provide a secure and
          enjoyable anime streaming experience.
        </p>
        <p className="mt-6">Thank you for choosing ChildeAnime!</p>
        <p className="mt-4">Mohtasim Alam Sohom - Founder of ChildeAnime</p>
      </div>
      <Footer />
    </div>
  );
};

export default ChildeAnimePrivacyPolicy;
