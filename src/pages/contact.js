import { useState } from "react";
import Layout from "../components/general/Layout";
import Title from "../components/general/Title";
import Seo from "../components/general/Seo";
import FadeInSection from "../hooks/FadeInSection";
import { fetchCookieStaticProps } from '../lib/staticPropsHelpers';

const Contact = ({ cookies }) => { 
    const [isMailValid, setMailValid] = useState(true);
    const [isNameValid, setNameValid] = useState(true);
    const [isMessageValid, setMessageValid] = useState(true);
    const [message, setMessage] = useState('');

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

    // comment in the form action path for mail transfer
    function submitForm(nameValidity, messageValidity, emailValidity) {
      if (nameValidity && messageValidity && emailValidity) {
        let form = document.getElementById("mailForm");
        form.method = "post";
        form.action = `${process.env.NEXT_PUBLIC_FS_API_URL}`;
        form.submit();
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
              <form id="mailForm" onSubmit={checkData}>
                <div className="form-group">
                  <input
                    id="name"
                    type="text"
                    placeholder="name"
                    name="name"
                    className="form-control"
                    required
                  />
                  <input
                    id="email"
                    type="email"
                    placeholder="email"
                    name="email"
                    className="form-control"
                    required
                  />
                  <textarea
                    id="message"
                    name="message"
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
                <button type="submit" className="submit-btn btn">
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