FROM nvidia/opencl:devel-ubuntu18.04

RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    ocl-icd-opencl-dev \
    git \
    pkg-config \
    libssl-dev

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

WORKDIR /home

COPY . .

RUN cargo build --release
