import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

import './style.scss';

const Contact = () => {

  const [state, handleSubmit] = useForm("mknkynke");

  if (state.succeeded) {
    return <section className="contact">
      <div className="contact-container">
        <p className="contact-container-success">Message envoyé à l'équipe !</p>
      </div>
    </section>
  };

  return (
    <section className="contact">
      <div className="contact-container">
        <form onSubmit={handleSubmit} className="contact-container-form">
          <input
            className="contact-container-form-input"
            id="email"
            type="email"
            name="email"
            placeholder="Insérez votre adresse mail"
          />
          <ValidationError
            prefix="Email" 
            field="email"
            errors={state.errors}
          />
          <textarea
            className="contact-container-form-area"
            id="message"
            name="message"
            placeholder="Une idée ? Une suggestion ? Vous avez trouvé un bug ? Un problème ? Envoyez nous un message"
          />
          <ValidationError
            prefix="Message" 
            field="message"
            errors={state.errors}
          />
          <button 
            className="contact-container-form-submit"
            type="submit"
            disabled={state.submitting}
            onClick={() => {
              setShowMailSend(true);
              setShowForm(false);
            }}
          >
            Envoyer
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;