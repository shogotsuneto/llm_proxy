FROM denoland/deno:2.2.11

WORKDIR /app

COPY . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
# RUN deno cache main.ts
RUN deno task build

# ENTRYPOINT ["/tini", "--", "deno", "run", "--allow-net", "main.ts"]
ENTRYPOINT ["/tini", "--", "/app/bin/llm_proxy"]
# ENTRYPOINT ["/app/bin/llm_proxy"]
# CMD ["run", "--allow-net", "main.ts"]

# TODO: multistage build
# deno binary seems not very compatible with alpine runtime
#
# RUN deno task build
#
#
# FROM alpine:3.21.3
#
# COPY --from=build /src/bin/llm_proxy /app/llm_proxy
# ENTRYPOINT ["/app/llm_proxy"]
