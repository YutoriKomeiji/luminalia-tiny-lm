# Luminalia Tiny LM — Browser Lab

A tiny, dependency-free neural language model you can train and run entirely in a browser. No API key or server required.

**This is a Tiny LM, not a large language model or Transformer.** It uses a three-character context, a trainable character embedding, a tanh hidden layer and a next-character softmax, optimized with SGD. It demonstrates learning and overfitting on small corpora, not general intelligence.

## Run
Open [index.html](index.html) locally or through GitHub Pages. Enter a short training corpus, train, and generate text. All computation stays on-device.

## GitHub Pages
In repository **Settings → Pages**, select **Build and deployment → Source → GitHub Actions**. The checked-in workflow `.github/workflows/pages.yml` deploys the validated static site on pushes to `main`. A repository administrator may need to enable Pages once in settings; the connector cannot do that account-level configuration. The expected address, once Pages has successfully deployed, is https://yutorikomeiji.github.io/luminalia-tiny-lm/ . Do not treat this as a verified live URL until deployment succeeds.

## Research and governance
Tracked in [DAN-116](https://linear.app/dantarg/issue/DAN-116). The goal is reproducible AI-developed-model quality evaluation, with independent holdout tests and explicit false-positive and regression checks before claims of improvement. No claims of language understanding, safety, human-level capability or independently verified generalization.

MIT license. No telemetry, network fetches, private Luminalia Identity or user data.

## Bounded autonomous experiment (T1)

A scheduled GitHub Actions job (`.github/workflows/autonomy-probe.yml`, weekly on Monday) evaluates several training-rate candidates using a deterministic local model experiment and saves an evaluation JSON artifact for 14 days. You can also run it locally with `node experiments/autonomy_probe.cjs`. All repository mutations, model publication, and external actions are disabled for this job (`contents: read`).

**Do not equate this with an independently intelligent agent or continuous weight growth.** The candidate generator is a scripted hyperparameter grid. The small held-out sequence shares a highly regular pattern with the training data, so measured validation gains are **not evidence of robustness, novel-text generalization, safety, or vaccine efficacy**. We need harder, non-overlapping data and independent review before promotion.

The planned Luminalia-spec direction is an autonomous defensive experiment loop that observes simulated anomalies, proposes and tests defensive changes, records failures, preserves provenance and rollback, and explicitly limits its own authority. A real autonomous runtime belongs with the existing Luminalia Bridge owner (DAN-108), not GitHub Pages.
