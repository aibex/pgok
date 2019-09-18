import exec from "./index";

const getArgs = require("command-line-args");
const getUsage = require("command-line-usage");
const DEFAULT_BACKOFF = 1.4;

const optionDefinitions = [
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Print this usage guide",
  },
  {
    name: "verbose",
    alias: "v",
    type: Boolean,
    description: "Print detailed log information while running this command",
  },
  {
    name: "retries",
    alias: "r",
    type: Number,
    description:
      "The number of tries to make before giving up with exit code `1` (defaults to `10`)",
  },
  {
    name: "time",
    alias: "t",
    type: Boolean,
    description:
      "The initial amount of time before each retry in ms (defaults to `100`)",
  },
  {
    name: "backoff",
    alias: "b",
    type: Boolean,
    description: `The backoff factor to use when increasing time between retries. Values less than 1 are set to the default. (defaults to \`${DEFAULT_BACKOFF}\`)`,
  },
  {
    name: "quiet",
    alias: "q",
    type: Boolean,
    description: "Overrides --verbose -v. Silences all output.",
  },
  {
    name: "uri",
    type: String,
    typeLabel: "{underline string}",
    defaultOption: true,
    defaultValue: "",
    description:
      "A fully formed postgres connection string you want to ensure is accessible",
  },
  {
    name: "env",
    alias: "e",
    type: String,
    typeLabel: "{underline string}",
    description:
      "An optional ENV name to reference for the connection uri from.",
  },
];

const usageDoc = [
  {
    header: "pgok - Wait for a postgres instance",
    content: "A simple blocking CLI that can ensure you don't query() early",
  },
  {
    header: "Usage",
    content: ["$ pgok [options] URI", "$ pgok -e ENV_VAR [options]"],
  },
  {
    header: "Specify a URI",
    content: [
      "pgok can be launched wither with a URI, or by specifying the -e flag. Specifying -e will cause pgok to look for the Postgres Connection String at the ENV value provided (process.env[ENV_NAME])",
    ],
  },
  {
    header: "Options",
    optionList: optionDefinitions,
  },
];

const cli = () => {
  const usage = getUsage(usageDoc);
  let args;

  try {
    args = getArgs(optionDefinitions);
  } catch (e) {
    console.error(e.message);
    console.log(usage);
    process.exit(1);
  }

  const connectionString = args.env ? process.env[args.env] : args.uri;

  if (args.help) {
    console.log(usage);
    process.exit(0);
  }

  const backoff =
    typeof args.backoff === "undefined"
      ? DEFAULT_BACKOFF
      : parseFloat(args.backoff);

  const opts = {
    uri: connectionString,
    verbose: args.verbose,
    quiet: args.quiet,
    retries: typeof args.retries === "undefined" ? 10 : parseInt(args.retries),
    time: typeof args.time === "undefined" ? 100 : parseInt(args.time),
    backoff: backoff > 1 ? backoff : DEFAULT_BACKOFF,
  };

  exec(opts);
};

export default cli;
