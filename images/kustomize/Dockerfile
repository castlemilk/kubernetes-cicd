FROM alpine:3.10.3
RUN apk update && apk add curl bash make tree ncurses
RUN curl -Lo kustomize.tar.gz https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv3.4.0/kustomize_v3.4.0_linux_amd64.tar.gz && \
    tar xzf kustomize.tar.gz && \
    cp kustomize /usr/local/bin/ && \
    chmod +x /usr/local/bin/kustomize
RUN curl -Lo /usr/local/bin/kubectl https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && \
    chmod +x /usr/local/bin/kubectl
RUN apk del curl

ENTRYPOINT ["kustomize"]