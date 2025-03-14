import express from "express";
import cors from "cors";
import { prismaClient } from "db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";


const app = express();

app.use(express.json());
app.use(cors());

app.post("/signin", async (req, res) => {

    const { email, password } = req.body;
    const user = await prismaClient.user.findFirst({
        where: {
            email: email
        }
    });
    if (!user) {
        res.status(403).json({
            message: "Invalid email!"
        });
        return;

    }

    const hashedPassword = await bcrypt.compare(password, user.password || "");
    if (!hashedPassword) {
        res.status(403).json({
            message: "Incorrect password!"
        });
        return;
    }
    const token = jwt.sign({
        userId: user.id,
    }, process.env.JWT_SECRET as unknown as string);


    res.json({
        message: "You are signed in",
        token: token
    })
});


app.post("/signup", async (req, res) => {
    const User = z.object({
        email: z.string().email(),
        password: z.string().min(4)
    });

    const parsedData = User.safeParse(req.body);
    if (!parsedData.success) {
        res.status(403).json({
            message: "Invalid inputs"
        });
        return;
    }
    const user = await prismaClient.user.create({
        data: {
            email: parsedData.data.email,
            username: parsedData.data.email,
            password: await bcrypt.hash(parsedData.data.password, 5),
        }
    });

    res.json({
        message: "Account created"
    });
});


app.get("/canvas/:roomId", async (req, res) => {
    const roomId = req.params.roomId;
    const messages = await prismaClient.message.findMany({
        where: {
            chatId: parseInt(roomId)
        }
    })
    res.json(messages);
})


app.listen(3001);