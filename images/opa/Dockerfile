FROM alpine:3.10.3 as build-env

RUN apk update && apk add curl bash


RUN curl -L -o /usr/local/bin/opa https://github.com/open-policy-agent/opa/releases/download/v0.15.1/opa_linux_amd64 && \
    chmod +x /usr/local/bin/opa

RUN mkdir /lib64 && ln -s /lib/libc.musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2
# FROM gcr.io/distroless/base

# COPY --from=build-env /usr/local/bin/opa /

ENTRYPOINT [ "opa" ]