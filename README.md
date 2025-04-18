# A little proxy (for openai API)

It replaces the Authorization header. That simple.  
I made this because I am developing a browser extension using llm including ChatGPT, and I don't know how safe it is to store the secret in the browser.  

## build it

```bash
deno task build
```

## run it

Store your api key in the file named `api_key_openai` and run the executable. Don't worry, the secret file is git-ignored 😉.

```bash
cat ./api_key_openai | ./bin/llm_proxy --target https://api.openai.com --sk_stdin --port 18080
```

## then test it.

```bash
curl http://localhost:18080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-this-header-will-be-replaced-anyway" \
  -d '{
    "model": "gpt-4o-mini",
    "store": true,
    "messages": [
      {"role": "user", "content": "write a haiku about ai"}
    ]
  }'
```
