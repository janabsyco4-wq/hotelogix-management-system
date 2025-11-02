import React from 'react';
import './Legal.css';

const Terms = () => {
  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="container">
          <h1>Terms & Conditions</h1>
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="legal-content">
        <div className="container">
          <div className="legal-document">
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Hotelogix website and services, you accept and agree to be bound by 
                these Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2>2. Booking and Reservations</h2>
              <h3>2.1 Booking Process</h3>
              <p>
                All bookings are subject to availability and confirmation. A booking is confirmed only when you 
                receive a confirmation email from us.
              </p>
              <h3>2.2 Payment</h3>
              <p>
                Full payment is required at the time of booking unless otherwise specified. We accept major 
                credit cards and process payments securely through Stripe.
              </p>
              <h3>2.3 Pricing</h3>
              <p>
                All prices are displayed in USD and include applicable taxes unless stated otherwise. We reserve 
                the right to change prices at any time, but changes will not affect confirmed bookings.
              </p>
            </section>

            <section>
              <h2>3. Cancellation and Refund Policy</h2>
              <h3>3.1 Standard Cancellation</h3>
              <p>
                Free cancellation is available up to 24 hours before the scheduled check-in time. Cancellations 
                made within 24 hours of check-in may incur a charge equivalent to one night's stay.
              </p>
              <h3>3.2 No-Show Policy</h3>
              <p>
                Failure to check-in without prior cancellation will result in a charge for the full booking amount.
              </p>
              <h3>3.3 Refund Processing</h3>
              <p>
                Approved refunds will be processed within 5-10 business days to the original payment method.
              </p>
              <h3>3.4 Special Rates</h3>
              <p>
                Non-refundable rates and special promotional offers may have different cancellation policies 
                as specified at the time of booking.
              </p>
            </section>

            <section>
              <h2>4. Check-in and Check-out</h2>
              <h3>4.1 Check-in Time</h3>
              <p>
                Standard check-in time is 3:00 PM. Early check-in is subject to availability and may incur 
                additional charges.
              </p>
              <h3>4.2 Check-out Time</h3>
              <p>
                Standard check-out time is 11:00 AM. Late check-out is subject to availability and may incur 
                additional charges.
              </p>
              <h3>4.3 Identification</h3>
              <p>
                Valid government-issued photo identification and the credit card used for booking must be 
                presented at check-in.
              </p>
            </section>

            <section>
              <h2>5. Guest Conduct</h2>
              <p>Guests are expected to:</p>
              <ul>
                <li>Respect other guests and hotel property</li>
                <li>Comply with hotel policies and local laws</li>
                <li>Not engage in illegal activities on the premises</li>
                <li>Not cause damage to hotel property</li>
                <li>Not disturb other guests</li>
              </ul>
              <p>
                We reserve the right to terminate a guest's stay without refund if they violate these terms 
                or engage in inappropriate behavior.
              </p>
            </section>

            <section>
              <h2>6. Liability and Damages</h2>
              <h3>6.1 Property Damage</h3>
              <p>
                Guests are responsible for any damage caused to hotel property during their stay. Charges for 
                damages will be applied to the credit card on file.
              </p>
              <h3>6.2 Personal Belongings</h3>
              <p>
                The hotel is not responsible for loss or damage to guests' personal belongings. We recommend 
                using in-room safes for valuables.
              </p>
              <h3>6.3 Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, Hotelogix shall not be liable for any indirect, 
                incidental, special, or consequential damages arising from your use of our services.
              </p>
            </section>

            <section>
              <h2>7. AI Room Finder</h2>
              <p>
                Our AI Room Finder provides personalized recommendations based on your preferences and historical 
                data. While we strive for accuracy, recommendations are suggestions only and do not guarantee 
                satisfaction. Final booking decisions are at your discretion.
              </p>
            </section>

            <section>
              <h2>8. Privacy and Data Protection</h2>
              <p>
                Your use of our services is also governed by our Privacy Policy. By using our services, you 
                consent to the collection and use of your information as described in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2>9. Modifications to Services</h2>
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect of our services at any time 
                without prior notice. We are not liable for any modification, suspension, or discontinuation.
              </p>
            </section>

            <section>
              <h2>10. Force Majeure</h2>
              <p>
                We shall not be liable for any failure to perform our obligations due to circumstances beyond 
                our reasonable control, including but not limited to natural disasters, war, terrorism, riots, 
                or government actions.
              </p>
            </section>

            <section>
              <h2>11. Governing Law</h2>
              <p>
                These Terms and Conditions are governed by and construed in accordance with the laws of the 
                United States and the State of Missouri, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2>12. Dispute Resolution</h2>
              <p>
                Any disputes arising from these terms shall be resolved through good faith negotiations. If 
                negotiations fail, disputes shall be resolved through binding arbitration in accordance with 
                the rules of the American Arbitration Association.
              </p>
            </section>

            <section>
              <h2>13. Changes to Terms</h2>
              <p>
                We reserve the right to update these Terms and Conditions at any time. Changes will be effective 
                immediately upon posting. Your continued use of our services constitutes acceptance of the 
                updated terms.
              </p>
            </section>

            <section>
              <h2>14. Contact Information</h2>
              <p>For questions about these Terms and Conditions, please contact us:</p>
              <div className="contact-info">
                <p><strong>Email:</strong> <a href="mailto:shehroozking3@gmail.com">shehroozking3@gmail.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+923104594964">+92 310 4594964</a></p>
                <p><strong>WhatsApp:</strong> <a href="https://wa.me/923104594964" target="_blank" rel="noopener noreferrer">+92 310 4594964</a></p>
              </div>
            </section>

            <section>
              <h2>15. Severability</h2>
              <p>
                If any provision of these Terms and Conditions is found to be invalid or unenforceable, the 
                remaining provisions shall continue in full force and effect.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
