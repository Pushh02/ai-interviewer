// import { Request, Response, Router } from "express";
// import db from "../db";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// const router = Router();

// router.post("/sign-up", async (req: Request, res: Response) => {
//   const { username, email, password } = req.body;

//   try {
//     if (email && password) {
//       const checkExistingProfile = await db.profile.findFirst({
//         where: {
//           email,
//         },
//       });
//       if (checkExistingProfile) {
//         const token = jwt.sign({ profile: checkExistingProfile }, process.env.JWT_SECRET || "nope");
//         res.cookie("Authorization", token, {
//           httpOnly: true,
//           secure: true,
//           sameSite: "strict",
//         });
//         res.status(400).json({
//           useId: checkExistingProfile.id,
//           message: "user alresdy exists",
//           email,
//         });
//       }
//       const hashedPassword = await bcrypt.hash(password, 12);
//       const profile = await db.profile.create({
//         data: {
//           username,
//           email,
//           password: hashedPassword,
//         },
//       });
//       const token = jwt.sign({ profile: profile }, process.env.JWT_SECRET || "nope");
//       res.cookie("Authorization", token, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "strict",
//       });

//       res.status(201).json({
//         useId: profile.id,
//         message: "user created successfully",
//         email,
//       });
//     } else {
//       res.status(409).send("fields are empty");
//     }
//   } catch (err) {
//     res.send(err);
//   }
// });

// router.post("/sign-in", async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     if (email && password) {
//       const checkExistingProfile = await db.profile.findFirst({
//         where: {
//           email,
//         },
//       });
//       if (checkExistingProfile) {
//         if (bcrypt.compareSync(password, checkExistingProfile.password)) {
//           const token = jwt.sign(
//             { profile: checkExistingProfile },
//             process.env.JWT_SECRET || "nope"
//           );
//           res.cookie("Authorization", token, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "strict",
//           });
//           res.status(200).json({
//             useId: checkExistingProfile.id,
//             message: "user alresdy exists",
//             email,
//           });
//         } else {
//           res.status(400).json({ message: "wrong passord" });
//         }
//       } else {
//         res.status(409).json({ message: "profile not found" });
//       }
//     }
//   } catch (err) {
//     res.send(err);
//   }
// });

// export { router as authRouter };
