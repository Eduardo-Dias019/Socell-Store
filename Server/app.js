//IMPORTS
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

//PUBLIC ROUTE
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Testando API" });
});

//PRIVATE ROUTE
app.get("/user/:id", checkToken, async (req, res) => {

    const id = req.params.id

    //CHECK IF USERS EXISTS
    const user = await User.findById(id, "-password")

    if(!user) {
        return res.status(404).json({msg: "Usuário não encontrado"})
    }

    res.status(200).json({user})

})

function checkToken(req, res, next) {

    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) {
        return res.status(401).json({msg: "Acesso negado!"})
    }

    try{

        const secret = process.env.SECRET
        
        jwt.verify(token, secret)

        next()

    }catch(err){
        res.status(400).json({msg: "token inválido"})
    }

}

//CONFIG JSON RESPONSE
app.use(express.json());

//MODELS
const User = require("./models/User");

// REGISTER USER
app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  //VALIDATION
  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }

  if (!email) {
    return res.status(422).json({ msg: "O e-mail é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }

  if (confirmpassword != password) {
    return res.status(422).json({ msg: "As senhas devem ser iguais!" });
  }

  //CHECK IF USER EXISTS
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "E-mail já cadastrado" });
  }

  //CREATE PASSWORD
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  //CREATE USER
  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();

    res.status(201).json({ msg: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Erro no servidor, tente novamente mais tarde" });
  }
});

//LOGIN USER
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  //VALIDATION
  if (!email) {
    return res.status(422).json({ msg: "O e-mail é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }

  //CHECK IF USER EXISTS
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não cadastrado" });
  }

  //CHECK IF PASSWORD MATCH
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({msg: "Autenticação ralizada com sucesso!", token})
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Erro no servidor, tente novamente mais tarde" });
  }
});

// CREDENTIALS
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.mbbjwyb.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3001);
    console.log("conexão feita com sucesso");
  })
  .catch((err) => console.log(err));
