import React from 'react';
import './Legal.css';

const Privacy = () => {
    return (
        <div className="legal-page">
            <div className="legal-hero">
                <div className="container">
                    <h1>Privacy Policy</h1>
                    <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            <div className="legal-content">
                <div className="container">
                    <div className="legal-document">
                        <section>
                            <h2>1. Introduction</h2>
                            <p>
                                Welcome to Hotelogix. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you about how we look after your personal data when you visit our
                                website and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section>
                            <h2>2. Information We Collect</h2>
                            <p>We may collect, use, store and transfer different kinds of personal data about you:</p>
                            <ul>
                                <li><strong>Identity Data:</strong> First name, last name, username, title</li>
                                <li><strong>Contact Data:</strong> Email address, telephone numbers, billing address</li>
                                <li><strong>Financial Data:</strong> Payment card details (processed securely through Stripe)</li>
                                <li><strong>Transaction Data:</strong> Details about payments and bookings</li>
                                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                                <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
                                <li><strong>Marketing Data:</strong> Your preferences in receiving marketing communications</li>
                            </ul>
                        </section>

                        <section>
                            <h2>3. How We Use Your Information</h2>
                            <p>We use your personal data for the following purposes:</p>
                            <ul>
                                <li>To process and manage your bookings and reservations</li>
                                <li>To provide customer service and support</li>
                                <li>To send you booking confirmations and updates</li>
                                <li>To improve our website and services</li>
                                <li>To personalize your experience using AI recommendations</li>
                                <li>To send you marketing communications (with your consent)</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2>4. Data Security</h2>
                            <p>
                                We have implemented appropriate security measures to prevent your personal data from being
                                accidentally lost, used, or accessed in an unauthorized way. We use industry-standard encryption
                                and secure payment processing through Stripe.
                            </p>
                        </section>

                        <section>
                            <h2>5. Data Sharing</h2>
                            <p>We may share your personal data with:</p>
                            <ul>
                                <li>Payment processors (Stripe) for secure payment processing</li>
                                <li>Email service providers for sending booking confirmations</li>
                                <li>Analytics providers to improve our services</li>
                                <li>Legal authorities when required by law</li>
                            </ul>
                            <p>We do not sell your personal data to third parties.</p>
                        </section>

                        <section>
                            <h2>6. Your Rights</h2>
                            <p>Under data protection laws, you have rights including:</p>
                            <ul>
                                <li><strong>Right to access:</strong> Request copies of your personal data</li>
                                <li><strong>Right to rectification:</strong> Request correction of inaccurate data</li>
                                <li><strong>Right to erasure:</strong> Request deletion of your personal data</li>
                                <li><strong>Right to restrict processing:</strong> Request limitation of data processing</li>
                                <li><strong>Right to data portability:</strong> Request transfer of your data</li>
                                <li><strong>Right to object:</strong> Object to processing of your personal data</li>
                            </ul>
                        </section>

                        <section>
                            <h2>7. Cookies</h2>
                            <p>
                                Our website uses cookies to distinguish you from other users and provide you with a good
                                experience. Cookies help us improve our website and deliver a better service. You can set
                                your browser to refuse cookies, but some features may not function properly.
                            </p>
                        </section>

                        <section>
                            <h2>8. Data Retention</h2>
                            <p>
                                We will only retain your personal data for as long as necessary to fulfill the purposes we
                                collected it for, including legal, accounting, or reporting requirements.
                            </p>
                        </section>

                        <section>
                            <h2>9. Children's Privacy</h2>
                            <p>
                                Our services are not directed to individuals under 18 years of age. We do not knowingly
                                collect personal information from children.
                            </p>
                        </section>

                        <section>
                            <h2>10. Changes to This Policy</h2>
                            <p>
                                We may update this privacy policy from time to time. We will notify you of any changes by
                                posting the new policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section>
                            <h2>11. Contact Us</h2>
                            <p>If you have any questions about this privacy policy or our privacy practices, please contact us:</p>
                            <div className="contact-info">
                                <p><strong>Email:</strong> <a href="mailto:shehroozking3@gmail.com">shehroozking3@gmail.com</a></p>
                                <p><strong>Phone:</strong> <a href="tel:+923104594964">+92 310 4594964</a></p>
                                <p><strong>WhatsApp:</strong> <a href="https://wa.me/923104594964" target="_blank" rel="noopener noreferrer">+92 310 4594964</a></p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
