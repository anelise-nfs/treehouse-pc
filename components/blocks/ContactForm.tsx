'use client';

import { useId, useRef, useState } from 'react';
import type { ContactFormBlock } from '@/types/content';
import { ActionButton } from '@/components/Button';
import { HoneypotField } from '@/components/NewsletterSignup';
import { PortableText } from '@/components/PortableText';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';
import { FORM_ENDPOINT, isValidEmail, submitForm, type FormStatus } from '@/lib/forms';

type FieldName = 'name' | 'email' | 'message';

type Errors = Partial<Record<FieldName, string>>;

const FIELD_BASE =
  'w-full min-w-0 rounded-[var(--radius-card)] border border-ink/25 bg-white px-4 ' +
  'font-sans text-[length:var(--text-ui)] text-ink placeholder:text-ink-soft ' +
  'aria-[invalid=true]:border-tomato aria-[invalid=true]:border-2';

function validate(values: Record<FieldName, string>): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = 'Please tell us your name.';
  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!isValidEmail(values.email)) errors.email = 'Please enter a valid email address.';
  if (!values.message.trim()) errors.message = 'Please write us a message.';

  return errors;
}

/**
 * The contact form: name, email, message, send.
 *
 * This one emails the business. It is not the newsletter opt-in and shares no
 * endpoint with it — someone asking a question has not subscribed to anything.
 * See lib/forms.ts, which holds both endpoints and the reason they stay apart.
 *
 * Validation runs on submit rather than on every keystroke. Validating as
 * someone types tells them their half-finished email address is wrong, which is
 * both true and useless. Once a field has been marked invalid it re-checks on
 * change, so a correction clears the error immediately.
 *
 * On a failed submit focus moves to the first bad field, and the summary above
 * the form is a live region, so the failure is announced rather than only
 * drawn.
 */
export function ContactForm({
  heading,
  intro,
  submitLabel = 'send it',
  decorations,
  anchorId,
}: ContactFormBlock) {
  const ids = {
    name: useId(),
    email: useId(),
    message: useId(),
  };
  const summaryId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const [values, setValues] = useState<Record<FieldName, string>>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [sendError, setSendError] = useState('');

  function update(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));

    // Only re-validate a field that is already showing an error.
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validate({ ...values, [field]: value })[field] }));
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validate(values);
    setErrors(found);

    const firstBad = (['name', 'email', 'message'] as const).find((field) => found[field]);
    if (firstBad) {
      setStatus('idle');
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(ids[firstBad])}`)?.focus();
      return;
    }

    // Silently accept and do nothing: a bot gets no signal that it was caught.
    if ((new FormData(event.currentTarget).get('company') as string)?.trim()) {
      setStatus('success');
      return;
    }

    setStatus('submitting');
    setSendError('');

    const result = await submitForm(FORM_ENDPOINT, {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });

    if (result.ok) {
      setStatus('success');
      setValues({ name: '', email: '', message: '' });
      return;
    }

    setStatus('error');
    setSendError(result.message ?? '');
  }

  return (
    <section id={anchorId} data-reveal className="container-page relative my-[var(--spacing-section)]">
      <DecorationLayer decorations={decorations} />

      <div className="measure mx-auto">
        {heading ? (
          <h2 className="font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
            {heading}
          </h2>
        ) : null}

        {/* [&_a] rather than a class on the link itself: PortableText emits a
            bare <a>, and the surrounding block decides how a link in its prose
            should look. Underlined because colour alone cannot mark a link. */}
        <div className="mt-[var(--spacing-gutter)] space-y-2 [&_a]:underline [&_a]:underline-offset-2">
          <PortableText
            blocks={intro}
            className="font-serif text-[length:var(--text-body)] text-ink"
          />
        </div>

        {/* Always rendered so the live region exists before it has anything to
            say. A region inserted at the same moment as its text is not
            reliably announced. */}
        <div aria-live="polite" className="empty:hidden">
          {status === 'success' ? (
            <p className="mt-[var(--spacing-block)] rounded-[var(--radius-card)] bg-seafoam px-4 py-3 font-sans text-[length:var(--text-ui)] text-ink">
              Thanks — your message is on its way. We&rsquo;ll be in touch soon.
            </p>
          ) : null}

          {status === 'error' && sendError ? (
            <p
              id={summaryId}
              className="mt-[var(--spacing-block)] rounded-[var(--radius-card)] border-2 border-tomato px-4 py-3 font-sans text-[length:var(--text-ui)] text-ink"
            >
              {sendError}
            </p>
          ) : null}
        </div>

        {status === 'success' ? null : (
          <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-[var(--spacing-block)]">
            <div className="flex flex-col gap-[var(--spacing-gutter)]">
              <Field
                id={ids.name}
                label="Your name"
                error={errors.name}
                control={(describedBy) => (
                  <input
                    id={ids.name}
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => update('name', event.target.value)}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={describedBy}
                    className={`${FIELD_BASE} min-h-[var(--tap-target)]`}
                  />
                )}
              />

              <Field
                id={ids.email}
                label="Your email"
                error={errors.email}
                control={(describedBy) => (
                  <input
                    id={ids.email}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => update('email', event.target.value)}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={describedBy}
                    className={`${FIELD_BASE} min-h-[var(--tap-target)]`}
                  />
                )}
              />

              <Field
                id={ids.message}
                label="Your message"
                error={errors.message}
                control={(describedBy) => (
                  <textarea
                    id={ids.message}
                    name="message"
                    rows={6}
                    value={values.message}
                    onChange={(event) => update('message', event.target.value)}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={describedBy}
                    className={`${FIELD_BASE} resize-y py-3 leading-[1.6]`}
                  />
                )}
              />
            </div>

            <HoneypotField />

            <ActionButton
              type="submit"
              disabled={status === 'submitting'}
              className="mt-[var(--spacing-block)]"
            >
              {status === 'submitting' ? 'Sending…' : submitLabel}
            </ActionButton>
          </form>
        )}
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  /** Receives the id to wire into aria-describedby, or undefined when valid. */
  control: (describedBy: string | undefined) => React.ReactNode;
}

/**
 * Label, control, error message. The label is always visible — a placeholder
 * is not a label: it vanishes the moment there is text in the field, which is
 * exactly when someone checking their answer needs it.
 */
function Field({ id, label, error, control }: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block font-sans text-[length:var(--text-ui)] font-semibold text-ink"
      >
        {label}
      </label>

      {control(error ? errorId : undefined)}

      {/* Ink on linen, 16.78:1. The red border marks the field; the message
          carries the reason, because colour alone cannot. */}
      {error ? (
        <p id={errorId} className="mt-1 font-sans text-[length:var(--text-caption)] text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
