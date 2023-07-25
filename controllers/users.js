import User from '../models/Users.js';
import bcrypt from 'bcryptjs';
/**
 * @desc Register user
 * @route POST /api/v1/users/register
 * @access Private/Admin
 */

export const registerUser = async (req, res) => {
    const { fullname, email, password } = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.json({
            msg: 'User already registered'
        })
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

}