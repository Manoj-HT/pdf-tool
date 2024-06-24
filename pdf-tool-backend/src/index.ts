// imports
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import { DataStore } from "./dataStore.js";
import { User } from "./models/user.js";
import { ApiResponse } from "./models/apiResponse.js";
import { PDF } from "./models/pdf.js";

// environment configs
dotenv.config();

// database
const pdfs = new DataStore("database/pdfs.json");
const users = new DataStore("database/users.json");

// global declarations
const jwtSecretKey = process.env.JWT_SECRET_KEY as jwt.Secret;
const app = express();
const port = process.env.PORT;
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized" } as ApiResponse);
  }
  const token = authorizationHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    let r = req as any;
    r.user = decoded;
    next();
  } catch (err: any) {
    console.error("Invalid token:", err.message);
    res.status(401).json({ message: "Unauthorized" } as ApiResponse);
  }
};

// middleware initialization
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// api endpoints
const apis = {
  default: "/",
  login: "/login",
  user: "/user",
  createUser: "/create-user",
  updateUser: "/update-user",
  pdfList: "/pdf-list",
  pdf: "/pdf",
  createPdf: "/create-pdf",
  updatePdf: "/update-pdf",
  pdfListByUserId: "/pdf-list-by-userId",
};

// apis
app.get(apis.default, (req, res) => {
  let size = {
    pdf: pdfs.getSize(),
    user: users.getSize(),
  };
  res.send(
    `Hello, number of users = ${size.user}, number of pdfs = ${size.pdf}`
  );
});

app.post(apis.login, (req, res) => {
  const { email, password } = req.body;
  let key = btoa(email);
  try {
    let user = users.getById(key) as User,
      data = {
        time: Date(),
        userId: user.id,
      };
    const token = jwt.sign(data, jwtSecretKey);
    if (password == user.password) {
      res.send({
        user,
        token,
        message: "succesfully retrieved",
      } as ApiResponse);
    } else {
      res.send({ message: "password doesn't match" } as ApiResponse);
    }
  } catch (err: any) {
    res.send({ message: "user doesn't exist" } as ApiResponse);
  }
});

app.post(apis.createUser, (req, res) => {
  let user = req.body as User;
  user = {
    ...user,
    id: btoa(user.email),
    pdfList: [""],
  };
  users.create(user.id, user);
  res.send({ message: "user created", user } as ApiResponse);
  users.save();
});

app.get(apis.user, authMiddleware, (req, res) => {
  let id = req.query.id as string;
  let user = users.getById(id) as User;
  res.send(user);
});

app.post(apis.pdfList, authMiddleware, (req, res) => {
  const { pdfList } = req.body as User;
  let pdfs = users.getByIdList(...pdfList) as PDF[];
  for (let pdf of pdfs) {
    delete pdf.data;
  }
  res.send({ pdfs });
});

app.put(apis.updateUser, authMiddleware, (req, res) => {
  let updateValue = req.body as User;
  let originalValue = users.getById(updateValue.id) as User;
  originalValue = {
    ...originalValue,
    ...updateValue,
  };
  users.update(originalValue.id, originalValue);
  res.send({ message: "updated", originalValue } as ApiResponse);
  users.save();
});

app.delete(apis.user, authMiddleware, (req, res) => {
  let id = req.query.id as string;
  users.delete(id);
  res.send({ message: "Deleted" } as ApiResponse);
  users.save();
});

app.get(apis.pdfListByUserId, authMiddleware, (req, res) => {
  let userId = req.query.id as string;
  let user = users.getById(userId) as User;
  let pdfList
  try{
    pdfList = pdfs.getByIdList(...user.pdfList)
  }catch (err){
    console.log(err);
    pdfList = []
  }
  finally{
    res.send(pdfList)
  }
});

app.post(apis.createPdf, authMiddleware, (req, res) => {
  let pdf = req.body as PDF;
  let createdDate = new Date();
  let id = btoa(pdf.name) + btoa(String(createdDate));
  pdf = { ...pdf, id, createdDate };
  pdfs.create(pdf.id, pdf);
  res.send({ message: "created succesfully", pdf } as ApiResponse);
});

app.get(apis.pdf, authMiddleware, (req, res) => {
  let id = req.query.id as string;
  let pdf = pdfs.getById(id);
  res.send(pdf);
});

app.put(apis.updatePdf, authMiddleware, (req, res) => {
  let updateValue = req.body as PDF;
  let originalValue = pdfs.getById(updateValue.id);
  originalValue = {
    ...originalValue,
    ...updateValue,
  };
  pdfs.update(originalValue.id, originalValue);
  pdfs.save();
});

app.delete(apis.pdf, authMiddleware, (req, res) => {
  let id = req.query.id as string;
  pdfs.delete(id);
  res.send({ message: "Deleted" } as ApiResponse);
  pdfs.save();
});

// server
app.listen(port, () => {
  console.log(`Server Running, goto http://localhost:${port}`);
});
