# Luminalia Tiny LM — Browser Lab

A tiny, dependency-free neural language model you can train and run entirely in a browser. No API key or server required.

**This is a Tiny LM, not a large language model or Transformer.** It uses a three-character context, a trainable character embedding, a tanh hidden layer and a next-character softmax, optimized with SGD. It demonstrates learning and overfitting on small corpora, not general intelligence.

## Run
Open [index.html](index.html) locally or through GitHub Pages. Enter a short training corpus, train, and generate text. All computation stays on-device.

## GitHub Pages
In repository **Settings → Pages**, select **Deploy from a branch → main → /(root)**, then save. The expected address, once Pages has successfully deployed, is https://yutorikomeiji.github.io/luminalia-tiny-lm/ . Do not treat this as a verified live URL until deployment succeeds.

## Research and governance
Tracked in [DAN-116](https://linear.app/dantarg/issue/DAN-116). The goal is reproducible AI-developed-model quality evaluation, with independent holdout tests and explicit false-positive and regression checks before claims of improvement. No claims of language understanding, safety, human-level capability or independently verified generalization.

MIT license. No telemetry, network fetches, private Luminalia Identity or user data.
