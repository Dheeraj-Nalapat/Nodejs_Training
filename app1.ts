const express = require("express");
import { Request, Response } from "express";
const server = new express();

server.get("/dheeraj", (req: Request, res: Response) => {
  console.log(req.url);
  res.status(200).send("Dheeraj");
});
interface Profile {
  name: string;
  age: number;
}
interface Data {
  profile: Profile;
}
server.get("/getdata", (req, res) => {
  let data: Data = {
    profile: {
      name: "Dheeraj",
      age: 22,
    },
  };
  console.log(data.profile.name);
  res.status(200).send(data);
});

server.listen(3000, () => {
  console.log("Server is running in port 3000");
});
