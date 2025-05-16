# Розширюємо базовий ICP образ
FROM ghcr.io/dfinity/icp-dev-env-slim:17

# Встановлюємо Solana CLI
RUN curl -sSfL https://release.solana.com/stable/install | sh

ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Встановлюємо Anchor CLI
RUN cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Переконаємося, що Rust є (в образі Dfinity Rust вже має бути)
RUN rustc --version && cargo --version

# Вивід версій для дебагу
RUN solana --version && anchor --version && dfx --version
