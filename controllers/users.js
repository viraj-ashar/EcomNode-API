import User from '../models/Users.js';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import { getTokenFromHeader } from '../utils/getTokenFromHeader.js';
import { verifyToken } from '../utils/verifyToken.js';

/**
 * @desc Register user
 * @route POST /api/v1/users/register
 * @access Private/Admin
 */
export const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
        throw new Error('User already registered');
    }
    else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            fullname, email, password: hashedPassword
        })
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: user
        })
    }
});

/**
 * @desc Login user
 * @route POST /api/v1/users/login
 * @access Public
 */
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const userFound = await User.findOne({
        email
    });

    if (userFound) {
        if (await bcrypt.compare(password, userFound.password)) {
            res.json({
                status: 'success',
                msg: 'Login success!!',
                userFound,
                token: generateToken(userFound._id),
            })
        } else {
            throw new Error('Incorrect Password')
        }
    } else {
        throw new Error('User Not Found')
    }
});

/**
 * @desc Get user profile
 * @route POST /api/v1/users/profile
 * @access Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
    const token = getTokenFromHeader(req);
    const verify = verifyToken(token);
    res.json({
        msg: 'Welcome to profile page'
    })
})