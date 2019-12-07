FROM alpine:3.10.3 as build-env

RUN apk update && apk add curl

RUN curl -L -o /usr/local/bin/opa https://github.com/open-policy-agent/opa/releases/download/v0.15.1/opa_linux_amd64 && \
    chmod +x /usr/local/bin/opa

# FROM gcr.io/distroless/base

# COPY --from=build-env /usr/local/bin/opa /
# Any non-zero number will do, and unfortunately a named user will not, as k8s
# pod securityContext runAsNonRoot can't resolve the user ID:
# https://github.com/kubernetes/kubernetes/issues/40958. Make root (uid 0) when
# not specified.
ARG USER=0


RUN pwd && ls
RUN echo $PATH
RUN ls -la /usr/local/bin

USER ${USER}

RUN opa --help

ENTRYPOINT [ "opa" ]