import { Router } from "express";
import passport from 'passport';
import bcrypt from 'bcrypt';
import users from "../models/users.js";
import { Strategy } from "passport-local";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { createTransport } from 'nodemailer';


const usersApiRouter = new Router();
const LocalStrategy = Strategy;
const ADRESS_MAIL = 'info@ethereal.email'


usersApiRouter.use(cookieParser());
usersApiRouter.use(session({
    secret: '1234567890!@#$%^&*()',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 20000 //20 seg
    }
}))

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'theresa.kerluke28@ethereal.email',
        pass: 'ea1XrdztarUSbjp25h'
    }
});

passport.use(new LocalStrategy(
    async (username, password, done)=>{
        const [existeUsuario] = await users.find({user: username})
        if (!existeUsuario) {
            console.log('Usuario no encontrado')
            return done(null, false);
        }
        else{
            const result = bcrypt.compareSync(password, existeUsuario.pass);
            if(!result){
                console.log('Contrase;a invalida')
                return done(null, false);
            }
            return done(null, existeUsuario);
        }
    }
))

passport.serializeUser((usuario, done)=>{
    done(null, usuario.user);
});

passport.deserializeUser(async (nombre, done)=>{
    const usuario = await users.find({user: nombre})
    done(null, usuario);
});

usersApiRouter.use(passport.initialize());
usersApiRouter.use(passport.session());

usersApiRouter.post('/login', passport.authenticate('local'), 
function (req, res) {
    try {
        res.json({
            confirm: "logueo realizado"
        });
    } catch (error) {
        res.json({
            error: "error en logueo"
        });
    }
    })

usersApiRouter.post('/register', async (req, res)=>{
    try {
        const { mail, nombre, password, direccion, edad, numTelefono, image } = req.body;
        const [newUser] = await users.find({user: nombre})

        if (newUser) {
            res.json({
                err: "El usuario ya se encuentra registrado !"
            })
        } else {
            if (mail && nombre && password && direccion && edad && numTelefono && image)
            {
                bcrypt.hash(password, 5, async function(err, hash) {
                    const newUserToAddModel = new users({
                        email: mail,
                        user: nombre,
                        pass: hash,
                        adress: direccion,
                        age: edad,
                        telephone: numTelefono,
                        avatar: image
                    });
                    const mailOptions = {
                        from: `${mail}`,
                        to: ADRESS_MAIL,
                        subject: 'Nuevo registro',
                        html: `
                            <h1>Nuevo registro</h1>
                            <ul>
                                <li>
                                    ${mail}
                                </li>
                                <li>
                                    ${nombre}                                
                                </li>
                                <li>
                                    ${direccion}                                
                                </li>
                                <li>
                                    ${edad}                                
                                </li>
                                <li>
                                    ${numTelefono}                                
                                </li>
                            </ul>
                        `
                    }
                    await newUserToAddModel.save()
                    await transporter.sendMail(mailOptions)
                    res.json({
                        confirm: `El usuario ${nombre} fue creado !`
                    })
                });
            }
            else {
                res.json({
                    err: "Uno de los datos requeridos no fue ingresado !"
                })
            }
        }
    } catch (error) {
        res.json({
            err: "Error al registrar"
        })
    }
});

usersApiRouter.post('/logout', function(req, res){
    try {
        req.logout();
        res.json({
            confirm: "Deslogueo con exito !"
        });
    } catch (error) {
        res.json({
            err: "Problemas en el deslogueo, intentelo de nuevo mas tarde."
        });
    }
});

export default usersApiRouter;