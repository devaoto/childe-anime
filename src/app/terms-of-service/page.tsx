import React from 'react';
import Link from 'next/link';
import Footer from '@/components/footer';

const ChildeAnimeTermsOfService = () => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <div>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">
          ChildeAnime Terms of Service
        </h1>

        <p>Last Updated: {currentDate}</p>

        <p>
          Welcome to ChildeAnime! These Terms of Service govern your use of our
          personal anime streaming site. By accessing or using ChildeAnime, you
          agree to comply with and be bound by these terms. Please read them
          carefully.
        </p>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            1. Acceptance of Terms:
          </h2>
          <p>
            By using ChildeAnime, you agree to these Terms of Service and any
            future updates or modifications. If you do not agree with these
            terms, please refrain from using the site.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">2. Age Requirement:</h2>
          <p>
            ChildeAnime is intended for users aged 13 and above. Users under 13
            are not permitted to use the site. By using ChildeAnime, you confirm
            that you are at least 13 years old.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">3. Content Usage:</h2>
          <p>
            ChildeAnime provides streaming services for anime content. Users are
            granted a limited, non-exclusive, and non-transferable license to
            access and view the content on the site for personal, non-commercial
            use.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">4. User Conduct:</h2>
          <p>While using ChildeAnime, you agree not to:</p>
          <ul className="list-disc ml-6">
            <li>Violate any applicable laws or regulations.</li>
            <li>
              Infringe on the rights of others, including intellectual property
              rights.
            </li>
            <li>
              Attempt to gain unauthorized access to ChildeAnime or its servers.
            </li>
            <li>
              Engage in any activity that disrupts or interferes with the
              site&apos;s functionality.
            </li>
          </ul>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">5. Privacy:</h2>
          <p>
            Your privacy is important to us. Please review our{' '}
            <Link href="/privacy" className="text-blue-500">
              Privacy Policy
            </Link>{' '}
            to understand how we collect, use, and protect your information.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            6. Changes to the Service:
          </h2>
          <p>
            ChildeAnime reserves the right to modify, suspend, or discontinue
            any aspect of the service at any time, with or without notice. We
            are not liable to you or any third party for any such modifications,
            suspension, or discontinuation.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            7. Disclaimer of Warranties:
          </h2>
          <p>
            ChildeAnime is provided &quot;as is&quot; and &quot;as
            available.&quot; We make no warranties or representations about the
            accuracy or completeness of the content on the site. Your use of
            ChildeAnime is at your own risk.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            8. Limitation of Liability:
          </h2>
          <p>
            ChildeAnime, its creators, and affiliates are not liable for any
            direct, indirect, incidental, special, or consequential damages
            arising out of or in any way connected with the use of the site.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">9. Termination:</h2>
          <p>
            ChildeAnime reserves the right to terminate your access to the site
            at any time for any reason. These Terms of Service remain in effect
            even after your account is terminated.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">10. Governing Law:</h2>
          <p>
            These Terms of Service are governed by and construed in accordance
            with the laws of Bangladesh. Any disputes arising from these terms
            will be resolved in the courts of Bangladesh.
          </p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">11. Contact Us:</h2>
          <p>
            If you have any questions or concerns about these Terms of Service,
            please contact us at{' '}
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
          Thank you for choosing ChildeAnime. We hope you enjoy your anime
          streaming experience!
        </p>
        <p className="mt-4">Muhammad Hudda - Co-founder of ChildeAnime</p>
      </div>
      <Footer />
    </div>
  );
};

export default ChildeAnimeTermsOfService;
