/**
 * This file would ideally invoke the Deno CLI to run the target script with the `--inspect-brk` flag.
 * 
 * However, piping this output to results in a BadResource error, so we'll have to use the `Deno.run` API instead.
 */
const args = Deno.args;

if (args.length === 0) {
  console.error("No target script provided");
  Deno.exit(1);
} else {
  console.log("Running target script:", args[0]);
}

const cmd = new Deno.Command("deno", {
  args: ["run", "--inspect-brk", ...args],
  stdout: "piped",
  stderr: "piped",
});

const process = cmd.spawn();

const targetRegex = /ws:\/\/127\.0\.0\.1:\d+\/ws\/([a-f0-9-]+)/;
const decoder = new TextDecoder();

// Get the target from the child process
let target: string | null = null;
for await (const line of process.stderr) {
  const text = decoder.decode(line);
  if (text.startsWith("Debugger listening on")) {
    const match = text.match(targetRegex);
    if (match?.[1]) {
      target = match[0];
      break;
    }
  }
}

console.log(`%cPaste this URL into ddb:%c ${target}`, "color: green", "font-weight: bold; color: blue");

// Now let the child process continue
process.stdout.pipeTo(Deno.stdout.writable);
process.stderr.pipeTo(Deno.stderr.writable);

// Now wait for the child process to exit
const status = await process.status
console.log('Child process exited with status:', status);