import { parseArgs } from "jsr:@std/cli/parse-args";

const DEFAULT_TARGET = "https://api.openapi.com";
const DEFAULT_PORT = "8080"

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    alias: {
      "port": "p",
      "target": "t",
      "secret_key": "s",
    },
    boolean: ["sk_stdin"],
    string: ["port", "target", "secret_key"],
    default: {
      "port": DEFAULT_PORT,
      "target": DEFAULT_TARGET,
      "secret_key": "sk-no-secretkey"
    }
  });

  let sk: string = "";

  const decoder = new TextDecoder();
  if (args.sk_stdin) {
    for await (const chunk of Deno.stdin.readable) {
      sk += decoder.decode(chunk);
    }
  } else {
    sk = args.secret_key
  }
  
  Deno.serve({ port: parseInt(args.port), hostname: '127.0.0.1' }, (req) => {
    const {pathname, search} = new URL(req.url);
    const url = new URL('.' + pathname, args.target);
    url.search = search;

    const headers = new Headers(req.headers);
    headers.set('Host', url.host);
    headers.set('Authorization', `Bearer ${sk}`);


    return fetch(url, {
      method: req.method,
      headers,
      body: req.body,
      redirect: 'manual'
    })
  })
}
