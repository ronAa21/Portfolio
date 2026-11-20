import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { sfx } from "../sound/audio";
import PixelNav from "../components/PixelNav";
import PixelSky from "../components/PixelSky";
import "./PixelHome.css";
import "./Contact.css";

const EMAIL = "aaronpagente19@gmail.com";

const SOCIALS = [
  { name: "GITHUB", handle: "/ronAa21", link: "https://github.com/ronAa21" },
  {
    name: "LINKEDIN",
    handle: "/aaron-philip-pagente",
    link: "https://www.linkedin.com/in/aaron-philip-pagente-a606283a5/",
  },
];

function Contact() {
  const form = useRef();
  const timer = useRef();
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function markCopied() {
    sfx.coin();
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  }

  // execCommand path: works when the async clipboard API is blocked
  function legacyCopy() {
    const area = document.createElement("textarea");
    area.value = EMAIL;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;top:-100px;opacity:0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function copyEmail() {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(EMAIL).then(markCopied, () => {
        if (legacyCopy()) markCopied();
      });
    } else if (legacyCopy()) {
      markCopied();
    }
  }

  function sendEmail(event) {
    event.preventDefault();
    sfx.start();
    setSending(true);

    emailjs.sendForm("service_17dz64i", "template_iq7uu1j", form.current, "uriJ2YF-eL2YRHeVa").then(
      () => {
        sfx.coin();
        setStatus("success");
        setSending(false);
        form.current.reset();
      },
      () => {
        sfx.back();
        setStatus("error");
        setSending(false);
      }
    );
  }

  function retry() {
    sfx.select();
    setStatus(null);
  }

  return (
    <div className="ph ct">
      <PixelSky variant="mail" />
      <PixelNav />

      <main className="ct-wrap">
        <header className="ct-head">
          <div className="ph-lbl">★ MAILBOX</div>
          <h1 className="ct-title">
            GET IN <span>TOUCH</span>
          </h1>
          <p className="ct-sub">
            Need a full-stack web app, a redesign, or some creative video editing? Send a message and
            I’ll reply within 24 hours.
          </p>
        </header>

        <div className="ct-body">
          <section className="ct-side" aria-label="Contact details">
            <div className="ct-card">
              <div className="ct-card-h">▸ DIRECT LINE</div>
              <button type="button" className="ct-mail" onClick={copyEmail}>
                <span className="ct-mail-ico" aria-hidden="true">
                  @
                </span>
                <span className="ct-mail-txt">
                  <b>{EMAIL}</b>
                  <i>{copied ? "✔ COPIED TO CLIPBOARD" : "CLICK TO COPY"}</i>
                </span>
              </button>
            </div>

            <div className="ct-card">
              <div className="ct-card-h">▸ SOCIAL LINKS</div>
              {SOCIALS.map((item) => (
                <a
                  key={item.name}
                  className="ct-soc"
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{item.name}</span>
                  <em>
                    {item.handle} <b aria-hidden="true">↗</b>
                  </em>
                </a>
              ))}
            </div>

            <div className="ct-status">
              <i aria-hidden="true" />
              <span>OPEN TO WORK — REPLIES IN 24H</span>
            </div>
          </section>

          <section className="ct-panel" aria-label="Send a message">
            <div className="ct-panel-h">
              <span>▸ NEW TRANSMISSION</span>
              <span className="ct-panel-tag">TO: AARON</span>
            </div>

            <div className="ct-panel-body">
              {/* the form stays mounted so a failed send never loses what was typed */}
              <form
                ref={form}
                className={`ct-form${sending || status ? " ct-form-off" : ""}`}
                onSubmit={sendEmail}
              >
                <div className="ct-row">
                  <div className="ct-field">
                    <label htmlFor="ct-name">NAME</label>
                    <input
                      id="ct-name"
                      type="text"
                      name="user_name"
                      placeholder="John Doe"
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="ct-field">
                    <label htmlFor="ct-email">EMAIL</label>
                    <input
                      id="ct-email"
                      type="email"
                      name="user_email"
                      placeholder="john@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="ct-field">
                  <label htmlFor="ct-message">MESSAGE</label>
                  <textarea
                    id="ct-message"
                    name="message"
                    rows="5"
                    placeholder="Send me an email..."
                    required
                  />
                </div>

                <button type="submit" className="ph-btn ct-send">
                  SEND MESSAGE <span aria-hidden="true">▶</span>
                </button>
              </form>

              {sending ? (
                <div className="ct-screen">
                  <div className="ct-load" aria-hidden="true">
                    {Array.from({ length: 12 }, (_, i) => (
                      <i key={i} style={{ animationDelay: `${i * 0.07}s` }} />
                    ))}
                  </div>
                  <h3>SENDING MESSAGE...</h3>
                  <p>Just a moment.</p>
                </div>
              ) : status === "success" ? (
                <div className="ct-screen">
                  <span className="ct-big ok" aria-hidden="true">
                    ✔
                  </span>
                  <h3>MESSAGE SENT!</h3>
                  <p>Thanks for reaching out. I’ll get back to you within 24 hours.</p>
                  <button type="button" className="ph-btn ph-btn-s" onClick={retry}>
                    SEND ANOTHER
                  </button>
                </div>
              ) : status === "error" ? (
                <div className="ct-screen">
                  <span className="ct-big bad" aria-hidden="true">
                    ✖
                  </span>
                  <h3>TRANSMISSION FAILED</h3>
                  <p>Something went wrong sending your message. Your text is still here — try again.</p>
                  <button type="button" className="ph-btn ph-btn-s" onClick={retry}>
                    TRY AGAIN
                  </button>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Contact;
