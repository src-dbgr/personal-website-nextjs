import { useState, useEffect } from "react";
import Layout from "../components/general/Layout";
import Title from "../components/general/Title";
import Seo from "../components/general/Seo";
import FadeInSection from "../hooks/FadeInSection";
import { fetchCookieStaticProps } from "../lib/staticPropsHelpers";

const Contact = ({ cookies }) => {
  const [isMailValid, setMailValid] = useState(true);
  const [isNameValid, setNameValid] = useState(true);
  const [isMessageValid, setMessageValid] = useState(true);
  const [message, setMessage] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  useEffect(() => {
    const loadRecaptcha = () => {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.id = "recaptcha-script";
      script.onload = () => setRecaptchaLoaded(true);
      document.body.appendChild(script);
    };

    loadRecaptcha();

    return () => {
      const script = document.getElementById("recaptcha-script");
      if (script) {
        document.body.removeChild(script);
      }
      const badge = document.querySelector(".grecaptcha-badge");
      if (badge) {
        badge.remove();
      }
      delete window.grecaptcha;
    };
  }, []);

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
    submitForm(event);
  }

  function submitForm(event) {
    setSubmissionStatus("pending");
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
            action: "submit",
          })
          .then((token) => {
            const formData = new FormData(event.target);
            formData.append("g-recaptcha-response", token);

            // check for dev mode - dont send in dev mode
            if (process.env.NODE_ENV === "development") {
              console.log("Entwicklungsmodus: Formular würde gesendet werden.");
              setSubmissionStatus("success");
              event.target.reset();
              setMessage("");
              return;
            }

            fetch(`${process.env.NEXT_PUBLIC_FS_API_URL}`, {
              method: "POST",
              body: formData,
              headers: {
                Accept: "application/json",
              },
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.ok) {
                  setSubmissionStatus("success");
                  event.target.reset();
                  setMessage("");
                } else {
                  setSubmissionStatus("error");
                }
              })
              .catch(() => {
                setSubmissionStatus("error");
              });
          });
      });
    } else {
      console.error("reCAPTCHA not loaded");
      setSubmissionStatus("error");
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setMessage((prevMessage) => prevMessage + "\n");
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
              {submissionStatus === "success" && (
                <div className="success-message">
                  <p>Message sent successfully!</p>
                </div>
              )}
              {submissionStatus === "error" && (
                <div className="error-message">
                  <p>Error sending message. Try again.</p>
                </div>
              )}
              <button
                type="submit"
                className="submit-btn btn"
                disabled={submissionStatus === "pending" || !recaptchaLoaded}
              >
                {submissionStatus === "pending" ? "SUBMITTING..." : "SUBMIT"}
              </button>
            </form>
          </article>
          <small className="recaptcha">
            This site is protected by reCAPTCHA. The Google{" "}
            <a href="https://policies.google.com/privacy">Privacy Policy</a> and
            <a href="https://policies.google.com/terms">
              {" "}
              Terms of Service
            </a>{" "}
            apply.
          </small>
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
    },
    revalidate: 10, // Optional: Setzt die Revalidierungszeit für die statische Seite
  };
}

export default Contact;
