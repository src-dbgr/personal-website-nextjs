import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BsCheckCircle } from "react-icons/bs";
import Layout from "../components/general/Layout";
import Title from "../components/general/Title";
import Seo from "../components/general/Seo";
import { fetchCookieStaticProps } from "../lib/staticPropsHelpers";
import FadeInSection from "../hooks/FadeInSectionClient";

const Contact = ({ cookies }) => { 
    const [isMailValid, setMailValid] = useState(true);
    const [isNameValid, setNameValid] = useState(true);
    const [isMessageValid, setMessageValid] = useState(true);
    const [message, setMessage] = useState('');
    // idle | sending | sent | error | cooldown
    const [sendState, setSendState] = useState('idle');
    const openedAt = useRef(0);
    const inFlight = useRef(false);
    const confirmationRef = useRef(null);

    useEffect(() => {
      openedAt.current = Date.now();
    }, []);

    useEffect(() => {
      if (sendState === 'sent') confirmationRef.current?.focus();
    }, [sendState]);

    function checkData(event) {
      event.preventDefault();
      let nameValidity = !isBlank(event.target.elements.name.value);
      let messageValidity = !isBlank(message);
      let emailValidity = validateEmail(event.target.elements.email.value);
      setNameValid(nameValidity);
      setMessageValid(messageValidity);
      setMailValid(emailValidity);
      if (!nameValidity) {
        document.getElementById("name").focus();
        return;
      }
      if (!emailValidity) {
        document.getElementById("email").focus();
        return;
      }
      if (!messageValidity) {
        document.getElementById("message").focus();
        return;
      }
      submitForm(nameValidity, messageValidity, emailValidity, event);
    }

    // Formspark (https://documentation.formspark.io/examples/ajax.html).
    // Server side, Formspark rejects filled honeypots, foreign origins and
    // filtered spam without using the quota. The checks here only keep naive
    // bots and double submits away.
    const FORMSPARK_URL = process.env.NEXT_PUBLIC_FORMSPARK_FORM_ID
      ? `https://submit-form.com/${process.env.NEXT_PUBLIC_FORMSPARK_FORM_ID}`
      : null;
    const MIN_FILL_MS = 3000;
    const COOLDOWN_MS = 60000;

    function readLastSent() {
      try {
        return Number(sessionStorage.getItem("contact_last_sent")) || 0;
      } catch (err) {
        return 0;
      }
    }

    function writeLastSent() {
      try {
        sessionStorage.setItem("contact_last_sent", String(Date.now()));
      } catch (err) {}
    }

    async function submitForm(nameValidity, messageValidity, emailValidity, event) {
      if (!(nameValidity && messageValidity && emailValidity)) return;
      if (inFlight.current) return;
      const form = event.target;
      const looksAutomated =
        form.elements["_honeypot"].value !== "" ||
        Date.now() - openedAt.current < MIN_FILL_MS;
      if (looksAutomated) {
        setSendState('sent');
        return;
      }
      if (Date.now() - readLastSent() < COOLDOWN_MS) {
        setSendState('cooldown');
        return;
      }
      inFlight.current = true;
      setSendState('sending');
      try {
        if (!FORMSPARK_URL) throw new Error("Form endpoint not configured");
        const fields = form.elements;
        // Invisible proof-of-work; Formspark rejects submissions without it.
        const { default: Botpoison } = await import("@botpoison/browser");
        const { solution } = await new Botpoison({
          publicKey: process.env.NEXT_PUBLIC_BOTPOISON_PUBLIC_KEY,
        }).challenge();
        const response = await fetch(FORMSPARK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: fields["name"].value,
            email: fields["email"].value,
            message,
            _honeypot: fields["_honeypot"].value,
            _botpoison: solution,
            _email: { subject: "devsam.io contact: new message" },
          }),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        writeLastSent();
        form.reset();
        setMessage('');
        setSendState('sent');
      } catch (err) {
        setSendState('error');
      } finally {
        inFlight.current = false;
      }
    }

    function startNewMessage() {
      openedAt.current = Date.now();
      setSendState('idle');
    }

    function validateEmail(inputText) {
      var emailformat =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      if (inputText.match(emailformat)) {
        setMailValid(true);
        return true;
      } else {
        setMailValid(false);
        return false;
      }
    }

    function isBlank(str) {
      return !str || /^\s*$/.test(str);
    }

    function handleMessageChange(e) {
      setMessage(e.target.value);
    }

    function handleKeyDown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        setMessage(prevMessage => prevMessage + '\n');
      }
    }

    return (
      <Layout darkFooter={true} cookies={cookies}>
        <Seo
          title="Contact"
          description="Samuel IT - Get in touch by sending a message."
        />
        <section className="contact-page">
          <Title title="Contact" />
          <FadeInSection>
            <article className="contact-form shadow-box-dark">
              <h3>get in touch</h3>
              {sendState === 'sent' ? (
                <div
                  className="form-confirmation"
                  role="status"
                  tabIndex={-1}
                  ref={confirmationRef}
                >
                  <BsCheckCircle className="form-confirmation-icon" aria-hidden="true" />
                  <p className="form-confirmation-title">Thank you!</p>
                  <p>
                    Your message has been sent. I will get back to you by email
                    as soon as possible.
                  </p>
                  <button
                    type="button"
                    className="submit-btn btn"
                    onClick={startNewMessage}
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
              <form id="mailForm" onSubmit={checkData} aria-busy={sendState === 'sending'}>
                <p className="visually-hidden" aria-hidden="true">
                  <label>
                    Leave this field empty
                    <input type="text" name="_honeypot" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <div className="form-group">
                  <label htmlFor="name" className="visually-hidden">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="name"
                    name="name"
                    autoComplete="name"
                    className="form-control"
                    maxLength={200}
                    required
                  />
                  <label htmlFor="email" className="visually-hidden">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="email"
                    name="email"
                    autoComplete="email"
                    className="form-control"
                    maxLength={320}
                    required
                  />
                  <label htmlFor="message" className="visually-hidden">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    autoComplete="off"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyDown}
                    rows="5"
                    placeholder="message"
                    className="form-control"
                    maxLength={5000}
                    required
                  ></textarea>
                </div>
                {!(isNameValid && isMessageValid && isMailValid) && (
                  <div className="invalid invalid-header">
                    <p>MAIL NOT SENT</p>
                  </div>
                )}
                {!isNameValid && (
                  <div className="invalid">
                    <p>- NAME BLANK</p>
                  </div>
                )}
                {!isMessageValid && (
                  <div className="invalid">
                    <p>- MESSAGE BLANK</p>
                  </div>
                )}
                {!isMailValid && (
                  <div className="invalid">
                    <p>- INVALID EMAIL</p>
                  </div>
                )}
                {sendState === 'error' && (
                  <div className="form-notice form-notice-error" role="alert">
                    <p>
                      Your message could not be sent. Please try again in a
                      moment, or write to the email address in the{" "}
                      <Link href="/legal">legal notice</Link>.
                    </p>
                  </div>
                )}
                {sendState === 'cooldown' && (
                  <div className="form-notice" role="alert">
                    <p>
                      You just sent a message. Please wait a minute before
                      sending another one.
                    </p>
                  </div>
                )}
                <button
                  type="submit"
                  className="submit-btn btn"
                  disabled={sendState === 'sending'}
                >
                  {sendState === 'sending' ? 'SENDING…' : 'SUBMIT'}
                </button>
              </form>
              )}
              {/* <div id="send-status">
              <div id="send-issue"></div>
            </div> */}
            </article>
          </FadeInSection>
        </section>
      </Layout>
    );
  };

  export async function getStaticProps() {
    const { cookies } = await fetchCookieStaticProps(); // Cookies Daten abfragen

    return {
      props: {
        cookies,
      }
    };
  }

  export default Contact;