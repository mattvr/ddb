/**
 * This file is the actual debugger code. It connects to the remote instance and sets up some basic commands.
 */
import CDP from "npm:chrome-remote-interface@0.33.0";

const target = Deno.env.get('DEBUG_WS_URL');
if (!target) {
  console.error('No target provided, please set the DEBUG_WS_URL environment variable to an active Deno process\'s debugger target. i.e. ws://[...]');
  Deno.exit(1);
}

let client: CDP.Client | null = null;
try {
  client = await CDP({
    target,
    local: true
  });

  console.log('Connected to remote instance!');

  // Use the `client` object to interact with the debug session
} catch (err) {
  console.error('Cannot connect to remote instance:', err);
  Deno.exit(1);
}

if (!client) {
  console.error('Cannot connect to remote instance');
  Deno.exit(1);
}

client.Debugger.on('paused', (params: any) => {
  console.log('Debugger paused at:', params.callFrames[0].location);
});

// INTERFACE
const $continue = () => client!.Runtime.runIfWaitingForDebugger()
const $breakpoint = (scriptId: string, lineNumber: number) => client!.Debugger.setBreakpoint({
  location: { scriptId, lineNumber }
});
const stepin = () => client!.Debugger.stepInto()
const stepout = () => client!.Debugger.stepOut()
const stepover = () => client!.Debugger.stepOver()
const exit = () => {
  client!.Debugger.resume();
  client!.close();
  client = null;
  Deno.exit(0);
}
const print = (expression: string) => client!.Runtime.evaluate({ expression }).then((result: any) => console.log(result.result.value));
const help = () => console.log(`
  Available commands:
  - c, cont, resume: Continue execution
  - b, break: Set breakpoint
  - i, sin: Step into
  - o, sout: Step out
  - s, sover: Step over
  - p: Print expression
  - q, quit: Exit debugger
`);

// ALIASES
const [c, cont, resume] = [$continue, $continue, $continue]
const $break = $breakpoint
const [i, sin] = [stepin, stepin]
const [o, sout] = [stepout, stepout]
const [s, sover] = [stepover, stepover]
const [q, quit] = [exit, exit]
const p = print
const h = help