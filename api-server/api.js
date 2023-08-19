const fs = require("fs");
const path = require("path");
const http = require("http");
const { Console } = require("console");

const itemsDbPath = path.join(__dirname, "items.json");

const PORT = 8000;
const HOST_NAME = "localhost";

function requestHandler(req, res) {
  if (req.url === "/items" && req.method === "GET") {
    // load and return all items
    getItems(req, res);
  } else if (req.url === "/items" && req.method === "POST") {
    // create item
    addItems(req, res);
  } else if (req.url.startsWith("/inventory/") && req.method === "GET") {
    // Get one item
    getItem(req, res);
  } else if (req.url === "/items" && req.method === "PUT") {
    // update item
    updateItem(req, res);
  } else if (req.url === "/items" && req.method === "DELETE") {
    // delete item
    deleteItem(req, res);
  }
}

// GET ALL ITEMS
function getItems(req, res) {
  fs.readFile(itemsDbPath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(404);
      res.end("An error occured");
    }
    res.end(data);
  });
}

// CREATE ITEMS
function addItems(req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const bufferBody = Buffer.concat(body).toString();
    const bodyOfrequest = JSON.parse(bufferBody);

    fs.readFile(itemsDbPath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }

      const oldItems = JSON.parse(data);
      const allItems = [...oldItems, bodyOfrequest];

      fs.writeFile(itemsDbPath, JSON.stringify(allItems), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message:
                "Internal Server Error. Could not save book to database.",
            })
          );
        }

        res.end(JSON.stringify(bodyOfrequest));
      });
    });
  });
}

// GET ONE ITEM
function getItem(req, res) {
  const itemId = req.url.split("/")[2];
  fs.readFile(itemsDbPath, "utf-8", (err, items) => {
    if (err) {
      res.writeHead(404);
      res.end(
        JSON.stringify({ data: null, error: "occured while making request" })
      );
    }
    const ParsedInventory = JSON.parse(items);
    const index = ParsedInventory.findIndex((item) => item.id == itemId);
    if (index == -1) {
      res.writeHead(404);
      res.end("item not found");
    }
    res.writeHead(200);
    res.end(JSON.stringify(ParsedInventory[index]));
  });
}

// UPDATE ITEM
function updateItem(req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedItem = Buffer.concat(body).toString();
    const detailsToUpdate = JSON.parse(parsedItem);
    const itemsId = detailsToUpdate.id;

    fs.readFile(itemsDbPath, "utf8", (err, items) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }

      const itemObj = JSON.parse(items);

      const itemIndex = itemObj.findIndex((items) => items.id === itemsId);

      if (itemIndex === -1) {
        res.writeHead(404);
        res.end("Book with the specified id not found!");
        return;
      }

      const updatedItem = { ...itemsObj[itemIndex], ...detailsToUpdate };
      itemsObj[itemIndex] = updatedItem;

      fs.writeFile(itemsDbPath, JSON.stringify(itemsObj), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message:
                "Internal Server Error. Could not save book to database.",
            })
          );
        }

        res.writeHead(200);
        res.end("Update successfull!");
      });
    });
  });
}

// DELETE ITEM
function deleteItem(req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBook = Buffer.concat(body).toString();
    const detailsToUpdate = JSON.parse(parsedBook);
    const itemsId = detailsToUpdate.id;

    fs.readFile(itemsDbPath, "utf8", (err, items) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }

      const itemsObj = JSON.parse(items);

      const itemsIndex = itemsObj.findIndex((items) => items.id === itemsId);

      if (itemsIndex === -1) {
        res.writeHead(404);
        res.end("Book with the specified id not found!");
        return;
      }

      // DELETE FUNCTION
      itemsObj.splice(itemsIndex, 1);

      fs.writeFile(itemsDbPath, JSON.stringify(Obj), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message:
                "Internal Server Error. Could not save book to database.",
            })
          );
        }

        res.writeHead(200);
        res.end("Deletion successfull!");
      });
    });
  });
}

const server = http.createServer(requestHandler);

server.listen(PORT, HOST_NAME, () => {
  console.log(`Server is listening on ${HOST_NAME}:${PORT}`);
});
