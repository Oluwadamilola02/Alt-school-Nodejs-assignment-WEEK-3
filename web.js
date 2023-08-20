const http = require("http");
const fs = require("fs");
const path = require("path");

const homePath = path.join(__dirname, "home-page.html");
const webPath = path.join(__dirname, "index.html");
const errorPath = path.join(__dirname, "error.html");

const port = 3001;

const handleRequest = (req, res) => {
  if (req.url === "/") {
    res.setHeader("content-type", "text/html");
    res.writeHead(200);
    res.end(fs.readFileSync(homePath));
  }

  if (req.url.endsWith(".html") && req.method === "GET") {
    try {
      const file = req.url.split("/")[1];
      const actualPath = path.join(__dirname, file);
      const web = fs.readFileSync(actualPath);

      res.setHeader("content-type", "text/html");
      res.writeHead(200);
      res.end(fs.readFileSync(webPath));
    } catch (error) {
      res.setHeader("content-type", "text/html");
      res.writeHead(404);
      res.end(fs.readFileSync(errorPath));
    }
  }
};

const server = http.createServer(handleRequest);

server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
