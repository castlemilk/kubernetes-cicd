FROM golang:1.13-alpine
RUN apk update && apk add curl docker
RUN curl -Lo /usr/local/bin/kubectl https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && \
    chmod +x /usr/local/bin/kubectl
RUN curl -Lo /usr/local/bin/kind https://github.com/kubernetes-sigs/kind/releases/download/v0.6.0/kind-linux-amd64 && \
    chmod +x /usr/local/bin/kind

ENTRYPOINT ["kind"]