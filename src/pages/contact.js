import { useState } from "react";
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
    const [sendState, setSendState] = useState('idle');

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

    // Netlify Forms: post to the static detection file, not to this page.
    // See public/__forms.html and https://opennext.js.org/netlify/forms
    async function submitForm(nameValidity, messageValidity, emailValidity, event) {
      if (!(nameValidity && messageValidity && emailValidity)) return;
      const form = event.target;
      setSendState('sending');
      try {
        const response = await fetch("/__forms.html", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(new FormData(form)).toString(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        form.reset();
        setMessage('');
        setSendState('sent');
      } catch (err) {
        setSendState('error');
      }
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
              <form id="mailForm" name="contact" onSubmit={checkData}>
                <input type="hidden" name="form-name" value="contact" />
                <p className="visually-hidden" aria-hidden="true">
                  <label>
                    Leave this field empty
                    <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" />
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
                {sendState === 'sent' && (
                  <div className="success-message" role="status">
                    <p>MESSAGE SENT</p>
                  </div>
                )}
                {sendState === 'error' && (
                  <div className="invalid invalid-header" role="alert">
                    <p>MAIL NOT SENT, PLEASE TRY AGAIN</p>
                  </div>
                )}
                <button
                  type="submit"
                  className="submit-btn btn"
                  disabled={sendState === 'sending'}
                >
                  SUBMIT
                </button>
              </form>
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