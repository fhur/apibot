const net = require("net");
const childProcess = require("child_process");

const port = process.env.PORT ? process.env.PORT - 100 : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => {
  client.connect({ port }, () => {
    client.end();
    if (!startedElectron) {
      console.log("starting electron");
      startedElectron = true;
      const childProc = childProcess.exec("yarn run electron");
      childProc.stdout.pipe(process.stdout);
      childProc.stderr.pipe(process.stderr);
    }
  });
};

tryConnection();

client.on("error", () => {
  setTimeout(tryConnection, 1000);
});
