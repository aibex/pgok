# pgok - Ensure Postgres Is There

```
yarn install [-D] pgok
```

```
npm install [--dev] pgok
```

# Usage

The most common case is the `pgok` bin file, which you can use in your scripts directory to block until Postgres is available:

```js
{
  /* in your package.json scripts... */
  "scripts": {
    "pgok": "pgok -e DATABASE_URL --retries 20",
    "do-db-thing": "pgok && <do db command>"
  }
}
```

# CLI

```
pgok - Wait for a postgres instance

  A simple blocking CLI that can ensure you don't query() early

Usage

  $ pgok [options] URI
  $ pgok -e ENV_VAR [options]

Specify a URI

  pgok can be launched wither with a URI, or by specifying the -e flag.
  Specifying -e will cause pgok to look for the Postgres Connection String at
  the ENV value provided (process.env[ENV_NAME])

Options

  -h, --help             Print this usage guide
  -v, --verbose          Print detailed log information while running this command
  -r, --retries number   The number of tries to make before giving up with exit code `1` (defaults to
                         `10`)
  -t, --time             The initial amount of time before each retry in ms (defaults to `100`)
  -b, --backoff          The backoff factor to use when increasing time between retries. Values less
                         than 1 are set to the default. (defaults to `1.4`)
  -q, --quiet            Overrides --verbose -v. Silences all output.
  --uri string           A fully formed postgres connection string you want to ensure is accessible
  -e, --env string       An optional ENV name to reference for the connection uri from.
```
