const { Client } = require("pg");
const DEFAULT_BACKOFF = 1.4;

const exec = opts => {
  const backoff = opts.backoff <= 1 ? DEFAULT_BACKOFF : opts.backoff;
  const verbose = opts.quiet ? 0 : opts.verbose ? 2 : 1;
  let pause = opts.time;
  let attempts = opts.retries;

  const info = msg => (verbose > 1 ? console.info(msg) : null);
  const log = msg => (verbose > 0 ? console.log(msg) : null);
  const error = msg => (verbose > 0 ? console.error(msg) : null);

  const schedule = () => {
    attempts--;
    pause = Math.floor(pause * backoff);
    if (attempts <= 0) {
      error("Could not connect to postgres");
      process.exit(1);
    }
    info(
      `Retrying Connection in ${pause}ms (attempt ${opts.retries - attempts})`
    );
    return setTimeout(() => pgwait(), pause);
  };

  const pgwait = () => {
    const client = new Client({ connectionString: opts.uri });
    client.connect(err => {
      if (err) {
        info("Connection Error:");
        info(err);
        return schedule();
      }

      log("Postgres Connection OK");
      process.exit(0);
    });
  };

  log("Connecting to Postgres");
  if (!opts.uri) throw new Error("No connection string");
  info(opts.uri);
  pgwait();
};

export default exec;
