/*
 * Contact form
 *  - inline validation (French messages), errors announced to screen readers
 *  - "LEINAD CONNECT" reveals the "logiciel actuel" field
 *  - boutiques / caisses steppers
 *  - sending: if <form data-endpoint="https://..."> is filled in, the request is POSTed there as JSON
 *    (works with Formspree, Getform, your own API...). With no endpoint, the visitor's mail app opens
 *    with the request pre-filled, addressed to data-mailto.
 *  - GSAP (if loaded) animates the success screen, plain CSS/JS otherwise
 */
(function () {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    const $ = (s, r = form) => r.querySelector(s);
    const success = form.parentElement.querySelector('[data-success]');
    const status = $('[data-status]');
    const submit = $('[data-submit]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canAnimate = Boolean(window.gsap) && !reduceMotion;

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const PHONE_RE = /^\+?[\d\s().-]{8,}$/;

    /* ---------- errors ---------- */
    function setError(name, message) {
        const box = form.querySelector(`[data-error="${name}"]`);
        const control = name === 'besoin' ? null : form.elements[name];
        if (control) control.setAttribute('aria-invalid', message ? 'true' : 'false');
        if (control && message) control.setAttribute('aria-describedby', box.id || (box.id = 'err-' + name));
        if (!box) return;
        box.textContent = message || '';
        box.classList.toggle('hidden', !message);
    }

    const rules = {
        besoin: () => (form.elements.besoin.value ? '' : 'Choisissez ce qui vous correspond.'),
        nom: () => (form.elements.nom.value.trim().length >= 2 ? '' : 'Dites-nous comment vous appeler.'),
        email: () => {
            const v = form.elements.email.value.trim();
            if (!v) return 'Indiquez votre email.';
            return EMAIL_RE.test(v) ? '' : "Cet email ne semble pas valide (ex. nom@entreprise.ci).";
        },
        telephone: () => {
            const v = form.elements.telephone.value.trim();
            if (!v) return form.elements.canal.value !== 'Email' ? 'Indiquez un numéro pour être rappelé.' : '';
            return PHONE_RE.test(v) ? '' : 'Numéro invalide (ex. +225 01 02 03 04 05).';
        },
    };

    function validate(names = Object.keys(rules)) {
        let firstBad = null;
        names.forEach((n) => {
            const msg = rules[n]();
            setError(n, msg);
            if (msg && !firstBad) firstBad = n;
        });
        return firstBad;
    }

    // validate a field when leaving it, then live while it is invalid
    ['nom', 'email', 'telephone'].forEach((n) => {
        const el = form.elements[n];
        el.addEventListener('blur', () => el.value && validate([n]));
        el.addEventListener('input', () => el.getAttribute('aria-invalid') === 'true' && validate([n]));
    });

    /* ---------- conditional field + steppers ---------- */
    const conditional = $('[data-show-for]');
    function syncKind() {
        const kind = form.querySelector('input[name="besoin"]:checked')?.dataset.kind;
        const show = kind === conditional.dataset.showFor;
        if (show && conditional.hidden) {
            conditional.hidden = false;
            if (canAnimate) gsap.fromTo(conditional, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' });
        } else if (!show) {
            conditional.hidden = true;
        }
    }
    form.querySelectorAll('input[name="besoin"]').forEach((r) =>
        r.addEventListener('change', () => { setError('besoin', ''); syncKind(); })
    );
    form.querySelectorAll('input[name="canal"]').forEach((r) =>
        r.addEventListener('change', () => form.elements.telephone.getAttribute('aria-invalid') === 'true' && validate(['telephone']))
    );

    form.querySelectorAll('[data-stepper]').forEach((box) => {
        const input = $('input', box);
        box.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-step]');
            if (!btn) return;
            const next = (parseInt(input.value, 10) || 0) + Number(btn.dataset.step);
            input.value = Math.min(999, Math.max(0, next));
        });
        input.addEventListener('blur', () => {
            input.value = Math.min(999, Math.max(0, parseInt(input.value, 10) || 0));
        });
    });

    /* ---------- sending ---------- */
    function setBusy(busy) {
        submit.disabled = busy;
        $('[data-submit-label]').textContent = busy ? 'Envoi en cours…' : 'Envoyer ma demande';
        $('[data-submit-icon]').classList.toggle('hidden', busy);
        $('[data-submit-spinner]').classList.toggle('hidden', !busy);
    }

    function showStatus(msg) {
        status.textContent = msg;
        status.classList.toggle('hidden', !msg);
    }

    function collect() {
        const f = form.elements;
        const v = (n) => (f[n]?.value || '').trim();
        const data = {
            besoin: v('besoin'),
            nom: v('nom'),
            entreprise: v('entreprise'),
            email: v('email'),
            telephone: v('telephone'),
            logiciel: conditional.hidden ? '' : v('logiciel'),
            boutiques: v('boutiques'),
            caisses: v('caisses'),
            canal: v('canal'),
            message: v('message'),
        };
        return data;
    }

    function mailtoUrl(d) {
        const lines = [
            ['Besoin', d.besoin], ['Nom', d.nom], ['Entreprise', d.entreprise], ['Email', d.email],
            ['Téléphone', d.telephone], ['Logiciel actuel', d.logiciel], ['Boutiques', d.boutiques],
            ['Caisses', d.caisses], ['Réponse souhaitée par', d.canal],
        ].filter(([, v]) => v).map(([k, v]) => `${k} : ${v}`);
        if (d.message) lines.push('', d.message);
        return `mailto:${form.dataset.mailto}?subject=${encodeURIComponent('Demande LEINAD : ' + d.besoin)}&body=${encodeURIComponent(lines.join('\n'))}`;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        showStatus('');
        if (form.elements.website.value) return; // honeypot: bots only

        const bad = validate();
        if (bad) {
            const target = bad === 'besoin' ? form.querySelector('input[name="besoin"]') : form.elements[bad];
            target.focus({ preventScroll: false });
            if (canAnimate) gsap.fromTo(form.querySelector(`[data-error="${bad}"]`), { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
            return;
        }

        const data = collect();
        const endpoint = form.dataset.endpoint.trim();
        let text;

        if (endpoint) {
            setBusy(true);
            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!res.ok) throw new Error(String(res.status));
                text = `Votre demande est bien arrivée. Nous vous répondons par ${data.canal.toLowerCase()} sous 2h ouvrées.`;
            } catch (err) {
                setBusy(false);
                showStatus("L'envoi a échoué. Réessayez, ou écrivez-nous directement à " + form.dataset.mailto + '.');
                return;
            }
            setBusy(false);
        } else {
            window.location.href = mailtoUrl(data);
            text = "Votre messagerie s'ouvre avec votre demande déjà rédigée : il ne reste qu'à l'envoyer. Rien ne part tant que vous n'avez pas validé.";
        }

        showSuccess(data, text);
    });

    /* ---------- success screen ---------- */
    function showSuccess(data, text) {
        $('[data-success-name]', success).textContent = data.nom.split(/\s+/)[0] + ' !';
        $('[data-success-text]', success).textContent = text;
        success.hidden = false;
        form.setAttribute('inert', '');
        if (canAnimate) {
            const check = $('[data-check]', success);
            const len = check.getTotalLength ? check.getTotalLength() : 30;
            gsap.set(check, { strokeDasharray: len, strokeDashoffset: len });
            gsap.fromTo(success, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
            gsap.fromTo($('[data-success-icon]', success), { scale: 0.4 }, { scale: 1, duration: 0.6, ease: 'back.out(2)' });
            gsap.to(check, { strokeDashoffset: 0, duration: 0.5, delay: 0.25, ease: 'power2.out' });
            gsap.fromTo(success.querySelectorAll('[data-success-part]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.35, stagger: 0.1, ease: 'power2.out' });
        }
        success.focus();
    }

    $('[data-success-reset]', success).addEventListener('click', () => {
        form.reset();
        form.removeAttribute('inert');
        success.hidden = true;
        if (canAnimate) gsap.set(success.querySelectorAll('[data-success-part], [data-success-icon], [data-check]'), { clearProps: 'all' });
        syncKind();
        Object.keys(rules).forEach((n) => setError(n, ''));
        form.querySelector('input[name="besoin"]').focus();
    });
})();
