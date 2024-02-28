# ddb

A command line debugger for Deno.

This is a prototype of a Chrome DevTools Compatible command line debugger for Deno. It's **currently non-functional**, due to present [issues or limitations](#issues--limitations) with the Deno runtime, however a basic debugger connection can be established.

The goal is to be able to debug using only the command line, similar to `gdb`, `pdb`, etc.

## Usage

First, run a Deno file you'd like to debug with the `--inspect-brk` flag. You can use the example script to do this:

```sh
./scripts/example.sh
```

Next, copy the full `ws://127.0.0.1:9229/ws/[MY-UNIQUE-UUID]` URL from the output and run the `ddb` script with the URL as an argument:

```sh
./scripts/ddb.sh ws://127.0.0.1:9229/ws/[MY-UNIQUE-UUID]
```

You should be connected now! Type `help()` to see the available commands, and `cont()` to resume execution.

Commands like `print` and `step` are not yet working due to below limitations

## Issues / Limitations

## 1. `chrome-remote-interface` execution context 

The `chrome-remote-interface` library does not seem to work well with Deno yet.

The error provided when using a command like `print("1+1")` is:

```
Uncaught Error: Cannot find default execution context
  at [...] chrome-remote-interface/0.33.0/lib/chrome.js
```

## ~~2. Lack of support for `debugger` statement~~

~~The `debugger` statement is not yet supported in Deno, so the `--inspect-brk` flag is required to start the debugger, and you can't easily set breakpoints purely in code.~~

Edit: Deno developer confirmed this is supported.

## 3. Child subprocess limitations

Running `deno run --inspect-brk [...]` via a child process created by `new Deno.Command()` does not work.

This throws an error: `BadResource: Bad resource ID`.

The effect is that it makes for a clunky way to start the debugger, as it requires the user to manually run `deno run --inspect-brk my-file.ts` and `deno repl -A --eval-file=ddb.ts` to start up the debugger, rather than a one-line `ddg my-file.ts`

## License / Contributing

MIT License

Contributions are welcome! Please open an issue or PR if you'd like to help out.
