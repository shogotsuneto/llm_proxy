import { parseArgs } from "jsr:@std/cli/parse-args";

const DEFAULT_TARGET = "https://api.openai.com";
const DEFAULT_PORT = "8080"

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    alias: {
      "bind": "b",
      "port": "p",
      "target": "t",
      "secret-key": "s",
    },
    boolean: ["sk-stdin"],
    string: ["bind", "port", "target", "secret-key"],
    default: {
      "bind": "127.0.0.1",
      "port": DEFAULT_PORT,
      "target": DEFAULT_TARGET,
      "secret-key": "sk-no-secretkey"
    }
  });

  let sk: string = "";

  const decoder = new TextDecoder();
  if (args['sk-stdin']) {
    for await (const chunk of Deno.stdin.readable) {
      sk += decoder.decode(chunk);
    }
  } else {
    sk = args['secret-key']
  }

  sk = sk.trim()

  if (sk === "") {
    console.error("invalid combination of sk args")
    Deno.exit(1)
  }
  
  Deno.serve({ port: parseInt(args.port), hostname: args.bind }, (req) => {
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
